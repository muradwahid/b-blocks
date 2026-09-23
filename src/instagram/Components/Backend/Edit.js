import { useEffect, useState } from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { Notice } from '../../../../../bpl-tools/Components';
import { useWPAjax } from '../../../../../bpl-tools/hooks';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

import { apiSettingsPage } from '../../../utils/data';
import Instagram from '../Common/Instagram';
import Style from '../Common/Style';
import Settings from './Settings/Settings';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;
	const { blockId } = attributes;

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;

	const updateObj = updateAttributes(attributes, setAttributes);

	const nonce = window.bBlocksCursorDataConfig?.nonce;
	const { data, isLoading } = useWPAjax('bblocks_api_keys', { _wpnonce: nonce }, true);
	const [instagramKey, setInstagramKey] = useState('');

	useEffect(() => {
		setInstagramKey(data?.instagram?.key || '');
	}, [data, isLoading]);

	// Derived from clientId, so a duplicated block gets a fresh id instead of
	// sharing the original's scoped CSS. render.php builds the frontend id from it.
	const uniqueId = clientId.slice(0, 12);

	useEffect(() => {
		blockId !== uniqueId && setAttributes({ blockId: uniqueId });
	}, [uniqueId]);

	// The editor id is not ours to choose: useBlockProps applies its own after
	// spreading, dropping anything passed in.
	const id = `block-${clientId}`;

	const blockProps = useBlockProps();

	return <>
		<Settings {...{ ...props, updateObj, isPremium, instagramKey }} />

		<div {...blockProps}>

			<Style attributes={attributes} id={id} isBackend={true} />

			{!isLoading && !instagramKey && (
				<Notice status='warning' isIcon={false} className='mb10'>
					{__('Add your Instagram Access Token in ', 'b-blocks')}
					<a href={apiSettingsPage} target='_blank' rel='noopener noreferrer'>{__('Dashboard → Settings → API Integrations', 'b-blocks')}</a>
					{__(' to load your feed.', 'b-blocks')}
				</Notice>
			)}

			<div>
				<Instagram attributes={attributes} id={id} isBackend={true} />
			</div>

		</div>
	</>;
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	};
})(Edit);