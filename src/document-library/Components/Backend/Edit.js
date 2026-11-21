import { __ } from '@wordpress/i18n';
import { dateI18n } from '@wordpress/date';
import { withSelect, useDispatch, useSelect } from '@wordpress/data';
import { useBlockProps, BlockControls, MediaPlaceholder, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import DocumentLibrary from '../Frontend/DocumentLibrary';
import { formatBytes, newItem } from '../../utils/common';

const Edit = (props) => {
	const { attributes, setAttributes, clientId, device = 'desktop' } = props;
	const { items = [], itemOptions = {} } = attributes;

	const id = `block-${clientId}`;
	const isPremium = 'undefined' !== typeof bBlocksPremiumChecker ? bBlocksPremiumChecker : false;
	const updateObj = updateAttributes(attributes, setAttributes);

	// Its own undo step: item edits all change `items`, and the editor would merge them.
	const { __unstableMarkLastChangeAsPersistent: markPersistent } = useDispatch('core/block-editor');

	// The listed Media Library files as they are now (one request, the first 100): a deleted one is left out of the
	// preview, as render.php leaves it off the page, and a recent one gets the New badge from its upload date.
	const ids = items.map((item) => item?.id).filter((itemId) => 0 < itemId).slice(0, 100);
	const media = useSelect((select) => ids.length ? select('core').getEntityRecords('postType', 'attachment', { include: ids, per_page: 100, _embed: 'author', _fields: 'id,date,date_gmt,mime_type,media_details,_links,_embedded' }) : [], [ids.join(',')]);
	const missing = Array.isArray(media) ? ids.filter((itemId) => !media.some((record) => record.id === itemId)) : [];
	const newDays = Number(itemOptions.newDays) || 0;
	const shown = {
		...attributes,
		items: items.filter((item) => !missing.includes(item?.id)).map((item) => {
			const record = Array.isArray(media) ? media.find((r) => r.id === item?.id) : null;
			if (!record) {
				return { ...item, isNew: false };
			}
			// The Media Library file wins over what the item saved, as render.php does on the page (a size typed
			// before the file was replaced, a File block's missing date): size in the Media Library format, date
			// as F j, Y. Raw bytes and upload time sort the list the same way the page does.
			return {
				...item,
				mime: record.mime_type || item.mime || '',
				size: formatBytes(record.media_details?.filesize) || item.size || '',
				date: dateI18n(__('F j, Y'), record.date),
				author: record._embedded?.author?.[0]?.name ?? item.author ?? '',
				bytes: Number(record.media_details?.filesize) || 0,
				time: Math.floor(Date.parse(`${record.date_gmt}Z`) / 1000) || 0,
				isNew: 0 < newDays && Date.parse(`${record.date_gmt}Z`) >= Date.now() - newDays * 86400000
			};
		})
	};

	// Upload problems (a file type the site refuses, a file too large) show as a notice, not silently.
	const { createErrorNotice } = useDispatch('core/notices');

	const addMedia = (media) => {
		markPersistent?.();
		setAttributes({ items: [...items, ...(Array.isArray(media) ? media : [media]).map((media) => newItem({ id: media?.id || 0, url: media?.url || '', title: media?.title || media?.filename || '', description: media?.caption || '', mime: media?.mime || '', size: media?.filesizeHumanReadable || '', date: media?.dateFormatted || '', author: media?.authorName || '' }))] });
		markPersistent?.();
	};

	return <>
		<Settings {...props} updateObj={updateObj} device={device} isPremium={isPremium} addMedia={addMedia} missingCount={missing.length} />

		{0 < items.length && <BlockControls>
			<ToolbarGroup>
				<MediaUploadCheck>
					<MediaUpload multiple onSelect={addMedia} render={({ open }) => <ToolbarButton icon='plus-alt2' label={__('Add documents', 'b-blocks')} onClick={open} />} />
				</MediaUploadCheck>
			</ToolbarGroup>
		</BlockControls>}

		<div {...useBlockProps({ id })}>
			{0 === items.length ?
				<MediaPlaceholder
					icon='media-document'
					labels={{ title: __('Document Library', 'b-blocks'), instructions: __('Upload or pick the documents to list. You can also add files by URL in the block settings.', 'b-blocks') }}
					multiple
					onSelect={addMedia}
					onError={(message) => createErrorNotice(message, { id: 'b-blocks-document-library-upload', type: 'snackbar' })}
				/> :
				<div>
					<Style attributes={attributes} id={id} isBackend={true} />

					<DocumentLibrary attributes={shown} assetsUrl={window.bBlocksGlobal?.assetsUrl || ''} isBackend={true} />
				</div>}
		</div>
	</>;
};

export default withSelect((select) => ({
	device: select('core/editor')?.getDeviceType?.()?.toLowerCase() || 'desktop'
}))(Edit);