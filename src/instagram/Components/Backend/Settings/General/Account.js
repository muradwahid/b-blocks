import { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, PanelBody, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { Label } from '../../../../../../../bpl-tools/Components';

// import { apiSettingsPage } from '../../../../../utils/data';
import { clearFeedCache, getAccount } from '../../../../utils/fetch';
import { Flex } from '@wordpress/components';

/**
 * The access token is configured globally in Dashboard → Settings → API Integrations.
 * It is never stored in the block attributes or exposed on a published page.
 */

const Account = ({ attributes, updateObj, instagramKey = '' }) => {
	const { source = {} } = attributes;

	// eslint-disable-next-line no-unused-vars
	const [hasToken, setHasToken] = useState(Boolean(instagramKey));
	const [status, setStatus] = useState(instagramKey ? '' : 'loading');

	useEffect(() => {
		let live = true;

		if (instagramKey) {
			setHasToken(true);
			setStatus('');
			return;
		}

		getAccount()
			.then((data) => live && (setHasToken(Boolean(data?.hasToken)), setStatus('')))
			.catch((error) => live && setStatus(error.message));

		return () => { live = false; };
	}, [instagramKey]);

	const refresh = () => {
		setStatus('clearing');

		clearFeedCache()
			.then(() => setStatus('cleared'))
			.catch((error) => setStatus(error.message));
	};

	return <PanelBody className='bPlPanelBody' title={__('Account', 'b-blocks')} initialOpen={true}>
		{/* {hasToken ? (
			<Notice status='success' isDismissible={false}>
				{__('Using the access token from', 'b-blocks')}{' '}
				<a href={apiSettingsPage} target='_blank' rel='noopener noreferrer'>
					{__('Dashboard → Settings → API Integrations', 'b-blocks')}
				</a>.
			</Notice>
		) : (
			'loading' !== status && <Notice className='mb10' status='warning' isDismissible={false}>
				{__('Add your Instagram Access Token in', 'b-blocks')}{' '}
				<a href={apiSettingsPage} target='_blank' rel='noopener noreferrer'>
					{__('Dashboard → Settings → API Integrations', 'b-blocks')}
				</a>{' '}
				{__('to load your feed.', 'b-blocks')}
			</Notice>
		)} */}

		<Flex className='mt10'>
			<Label className=''>{__('Posts To Fetch', 'b-blocks')}</Label>

			<NumberControl value={source.limit} onChange={(val) => updateObj('source', parseInt(val, 10) || 1, 'limit')} min={1} max={100} />
		</Flex>

		<small>{__('How many posts are pulled from Instagram and cached. The grid shows them a page at a time.', 'b-blocks')}</small>

		<Flex className='mt10'>
			<Label className=''>{__('Cache (minutes)', 'b-blocks')}</Label>

			<NumberControl value={source.cacheMinutes} onChange={(val) => updateObj('source', parseInt(val, 10) || 0, 'cacheMinutes')} min={0} max={10080} />
		</Flex>

		<small>{__('Zero fetches on every page load, which Instagram rate-limits. Thirty minutes suits most feeds.', 'b-blocks')}</small>

		<Button className='mt10' variant='secondary' onClick={refresh} disabled={'clearing' === status}>
			{'clearing' === status ? __('Clearing…', 'b-blocks') : __('Clear Cached Feed', 'b-blocks')}
		</Button>

		{'cleared' === status && <small>{__('Cache cleared. Reload the editor to see the new posts.', 'b-blocks')}</small>}
	</PanelBody>;
};

export default Account;