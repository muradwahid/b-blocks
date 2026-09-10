import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, Notice, PanelBody, TextControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

import { clearFeedCache, getAccount, saveAccount } from '../../../../utils/fetch';

/**
 * The access token is written to a site option through our own endpoint, so it
 * is never part of the post and never reaches a published page. The endpoint
 * reports only whether a token is stored, so it is not echoed back into the
 * editor either — an empty field on save leaves the stored one alone.
 *
 * A token set on the dashboard's API Integrations card covers the whole site and
 * takes precedence, in which case this panel says so rather than offering a
 * second field that would have no effect.
 */
const Account = ({ attributes, updateObj }) => {
	const { source = {} } = attributes;

	const [account, setAccount] = useState({ username: '', hasToken: false, fromDashboard: false });
	const [token, setToken] = useState('');
	const [status, setStatus] = useState('loading');

	useEffect(() => {
		let live = true;

		getAccount()
			.then((data) => live && (setAccount(data), setStatus('')))
			.catch((error) => live && setStatus(error.message));

		return () => { live = false; };
	}, []);

	const save = () => {
		setStatus('saving');

		saveAccount({ username: account.username, token })
			.then((data) => {
				setAccount(data);
				setToken('');
				setStatus('saved');
			})
			.catch((error) => setStatus(error.message));
	};

	const refresh = () => {
		setStatus('clearing');

		clearFeedCache()
			.then(() => setStatus('cleared'))
			.catch((error) => setStatus(error.message));
	};

	return <PanelBody className='bPlPanelBody' title={__('Account', 'b-blocks')} initialOpen={true}>
		<TextControl label={__('Username', 'b-blocks')} value={account.username} onChange={(val) => setAccount({ ...account, username: val })} placeholder={__('yourhandle', 'b-blocks')} />

		{account.fromDashboard
			? <Notice status='success' isDismissible={false}>{__('Using the access token from Dashboard → Settings → API Integrations.', 'b-blocks')}</Notice>
			: <TextControl label={__('Access Token', 'b-blocks')} type='password' value={token} onChange={setToken} placeholder={account.hasToken ? __('A token is saved — type a new one to replace it', 'b-blocks') : ''} help={__('A long-lived Instagram token. Stored on the site, never in the post. It can also be set once for the whole site under Dashboard → Settings → API Integrations.', 'b-blocks')} />}

		<Button variant='primary' onClick={save} disabled={'saving' === status || 'loading' === status}>
			{'saving' === status ? __('Saving…', 'b-blocks') : __('Save Account', 'b-blocks')}
		</Button>

		{'saved' === status && <small>{__('Saved. Reload the editor to load the feed.', 'b-blocks')}</small>}

		{!account.hasToken && 'loading' !== status && <Notice className='mt10' status='warning' isDismissible={false}>
			{__('Add a token to load the feed — here, or once for the whole site under Dashboard → Settings → API Integrations. Until then the editor shows sample posts.', 'b-blocks')}
		</Notice>}

		<Label className='mt20'>{__('Posts To Fetch', 'b-blocks')}</Label>

		<NumberControl value={source.limit} onChange={(val) => updateObj('source', parseInt(val, 10) || 1, 'limit')} min={1} max={100} />

		<small>{__('How many posts are pulled from Instagram and cached. The grid shows them a page at a time.', 'b-blocks')}</small>

		<Label className='mt20'>{__('Cache (minutes)', 'b-blocks')}</Label>

		<NumberControl value={source.cacheMinutes} onChange={(val) => updateObj('source', parseInt(val, 10) || 0, 'cacheMinutes')} min={0} max={10080} />

		<small>{__('Zero fetches on every page load, which Instagram rate-limits. Thirty minutes suits most feeds.', 'b-blocks')}</small>

		<Button className='mt10' variant='secondary' onClick={refresh} disabled={'clearing' === status}>
			{'clearing' === status ? __('Clearing…', 'b-blocks') : __('Clear Cached Feed', 'b-blocks')}
		</Button>

		{'cleared' === status && <small>{__('Cache cleared. Reload the editor to see the new posts.', 'b-blocks')}</small>}
	</PanelBody>;
};

export default Account;
