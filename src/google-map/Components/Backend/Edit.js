import { useEffect, useState } from 'react';
import { useBlockProps } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { produce } from 'immer';

import { Notice } from '../../../../../bpl-tools/Components';
import { useWPAjax } from '../../../../../bpl-tools/hooks';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

import { apiSettingsPage } from '../../../utils/data';
import { normalizeAttributes } from '../../utils/data';
import Style from '../Common/Style';
import GoogleMap from '../Frontend/GoogleMap';
import Settings from './Settings/Settings';
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';

const Edit = (props) => {
	// `isSelected` is supplied to every block edit component by the editor —
	// no selector needed.
	const { attributes, setAttributes, clientId, device = 'desktop', selectBlock } = props;

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;
	const updateObj = updateAttributes(attributes, setAttributes);
	const blockProps = useBlockProps({ id: `block-${clientId}` });

	// The key lives in the bBlocksApiKeys option, never in the block itself.
	const nonce = window.bBlocksCursorDataConfig?.nonce;
	const { data, isLoading } = useWPAjax('bblocks_api_keys', { _wpnonce: nonce }, true);
	const [apiKey, setApiKey] = useState('');

	useEffect(() => {
		setApiKey(data?.googleMaps?.key || '');
	}, [data, isLoading]);

	const isInteractive = 'embed' !== normalizeAttributes(attributes).source.type;

	// Markers dragged on the editor map write their new coordinates back.
	const onMarkerDrag = (index, { lat, lng }) => {
		setAttributes({
			markers: produce(attributes.markers || [], (draft) => {
				if (!draft[index]) return;
				draft[index].lat = Number(lat.toFixed(6));
				draft[index].lng = Number(lng.toFixed(6));
			})
		});
	};

	return <>
		<Settings {...{ ...props, updateObj, isPremium, apiKey }} />

		<div {...blockProps} onClick={() => selectBlock(clientId)} onDragStart={(event) => event.stopPropagation()} draggable={false}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

			{/* Iconless on purpose: with an icon this Notice renders a nested div,
			    which the editor's `#id>div>div` Advanced selector would style. */}
			{isInteractive && !isLoading && !apiKey && (
				<Notice status='warning' isIcon={false} className='mb10'>
					{__('Add your Google Maps API key in', 'b-blocks')}{' '}
					<a href={apiSettingsPage} target='_blank' rel='noopener noreferrer'>{__('bBlocks → Settings', 'b-blocks')}</a>{' '}
					{__('to show an interactive map.', 'b-blocks')}
				</Notice>
			)}

			{/* Extra nesting so the editor matches generateCSS's `#id>div>div`,
			    the same shape image-hotspot and the other blocks use. */}
			<div>
				<GoogleMap attributes={attributes} apiKey={apiKey} isBackend={true} device={device} onMarkerDrag={onMarkerDrag} />
			</div>
		</div>
	</>;
};

export default compose(
	withDispatch((dispatch, ownProps) => {
		return {
			selectBlock: () => {
				dispatch('core/block-editor').selectBlock(ownProps.clientId);
			}
		};
	}),
	withSelect((select) => {
		const { getDeviceType } = select('core/editor');

		return {
			device: getDeviceType()?.toLowerCase()
		};
	})
)(Edit);