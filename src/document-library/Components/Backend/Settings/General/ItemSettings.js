import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { dateI18n } from '@wordpress/date';
import { addQueryArgs } from '@wordpress/url';
import { select, useDispatch } from '@wordpress/data';
import { SelectControl, TextControl, TextareaControl, ToggleControl } from '@wordpress/components';

import { InlineMediaUpload, Label, MediaArea } from '../../../../../../../bpl-tools/Components';
import { viewActionOptions } from '../../../../utils/options';
import { fileNameOf, formatBytes } from '../../../../utils/common';

/** One library item, inside the sortable Documents list. */
const ItemSettings = ({ attributes, setAttributes, index }) => {
	const { items = [], viewButton = {} } = attributes;
	const item = items[index] || {};
	const { id = 0, url = '', title = '', description = '', size = '', date = '', author = '', image = {}, category = '', featured = false, hidden = false } = item;

	const update = (prop, val) => setAttributes({ items: items.map((it, i) => (i === index ? { ...it, [prop]: val } : it)) });

	// Every item edit changes the same `items` attribute, and the editor merges such changes into one
	// undo step. A one-click action (a file, an image, Featured) gets its own step instead.
	const { __unstableMarkLastChangeAsPersistent: markPersistent } = useDispatch('core/block-editor');
	const commit = (attrs) => {
		markPersistent?.();
		setAttributes(attrs);
		markPersistent?.();
	};

	return <>
		<TextControl label={__('Title', 'b-blocks')} value={title} onChange={(val) => update('title', val)} __next40pxDefaultSize __nextHasNoMarginBottom />

		<TextControl className='mt10' label={__('Category', 'b-blocks')} help={__('Used by the filter when Filter By is set to categories.', 'b-blocks')} value={category} onChange={(val) => update('category', val)} __next40pxDefaultSize __nextHasNoMarginBottom />

		<ToggleControl className='mt10' label={__('Hide on Page', 'b-blocks')} help={__('Keeps the document in the list here without showing it to visitors.', 'b-blocks')} checked={hidden} onChange={(val) => commit({ items: items.map((it, i) => (i === index ? { ...it, hidden: val } : it)) })} />

		<ToggleControl className='mt10' label={__('Featured', 'b-blocks')} help={__('Shown first, with a Featured label.', 'b-blocks')} checked={featured} onChange={(val) => commit({ items: items.map((it, i) => (i === index ? { ...it, featured: val } : it)) })} />

		<TextareaControl className='mt10' label={__('Description', 'b-blocks')} value={description} onChange={(val) => update('description', val)} rows={2} __nextHasNoMarginBottom />

		<InlineMediaUpload
			className='mt10'
			label={__('File URL', 'b-blocks')}
			value={url}
			types={['application', 'text', 'image', 'video', 'audio']}
			placeholder={__('Paste a link or pick a file', 'b-blocks')}
			onChange={(val) => {
				// A new address detaches the item from its Media Library file, and its size, date and author with it.
				setAttributes({ items: items.map((it, i) => (i === index ? { ...it, url: val, id: 0, mime: '', ...(it.id ? { size: '', date: '', author: '' } : {}) } : it)) });

				// A file on this site (picked with the upload button, or pasted) is linked to its Media Library file again,
				// so size, date and author come from it, as render.php does for the page.
				let file = null;
				try {
					file = new URL(val);
				} catch (e) {
					return;
				}
				if (file.origin !== window.location.origin || !/\.[a-z0-9]{2,5}$/i.test(file.pathname)) {
					return;
				}
				const name = fileNameOf(file.pathname).replace(/\.[^.]+$/, '');
				apiFetch({ path: addQueryArgs('/wp/v2/media', { search: name, per_page: 20, _embed: 'author', _fields: 'id,source_url,mime_type,date,media_details,_links,_embedded' }) }).then((list) => {
					const media = (list || []).find((m) => m.source_url === val);
					if (!media) {
						return;
					}
					// The block being edited is the selected one; its items as they are now (the field may have changed since).
					const editor = select('core/block-editor');
					const latest = editor.getBlockAttributes(editor.getSelectedBlockClientId())?.items || [];
					commit({ items: latest.map((it, i) => (i === index && it.url === val ? { ...it, id: media.id, mime: media.mime_type || '', size: formatBytes(media.media_details?.filesize), date: dateI18n(__('F j, Y'), media.date), author: media._embedded?.author?.[0]?.name || '', title: it.title || name } : it)) });
				}).catch(() => { });
			}}
		/>

		<p className='components-base-control__help'>{id ? __('Media Library file: size, date and author come from it.', 'b-blocks') : __('A file hosted elsewhere.', 'b-blocks')}</p>

		{/* This document can open its own way; the block setting applies otherwise. */}
		{false !== viewButton.show && <SelectControl className='mt10' label={__('View Opens', 'b-blocks')} value={item.viewAction || ''} options={[{ label: __('As set for the block', 'b-blocks'), value: '' }, ...viewActionOptions]} onChange={(val) => commit({ items: items.map((it, i) => (i === index ? { ...it, viewAction: val } : it)) })} __next40pxDefaultSize __nextHasNoMarginBottom />}

		<Label className='mt10'>{__('Card Image', 'b-blocks')}</Label>
		{/* Shown on the card instead of the file icon. The area's own delete button clears it ({} from MediaArea). */}
		<MediaArea
			label={image.url ? __('Replace Card Image', 'b-blocks') : __('Choose Card Image', 'b-blocks')}
			value={image}
			types={['image']}
			width='100%'
			height='140px'
			onChange={(media) => commit({ items: items.map((it, i) => (i === index ? { ...it, image: { id: media?.id || 0, url: media?.url || '' } } : it)) })}
		/>

		{!id && <>
			<TextControl className='mt10' label={__('Size', 'b-blocks')} value={size} placeholder='2.4 MB' onChange={(val) => update('size', val)} __next40pxDefaultSize __nextHasNoMarginBottom />

			<TextControl className='mt10' label={__('Date', 'b-blocks')} value={date} onChange={(val) => update('date', val)} __next40pxDefaultSize __nextHasNoMarginBottom />

			<TextControl className='mt10' label={__('Author', 'b-blocks')} value={author} onChange={(val) => update('author', val)} __next40pxDefaultSize __nextHasNoMarginBottom />
		</>}
	</>;
};
export default ItemSettings;
