import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { withSelect, useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, BlockControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, ToolbarDropdownMenu } from '@wordpress/components';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

import Settings from './Settings/Settings';
import SourcePicker from './SourcePicker';
import Style from '../Common/Style';
import DocumentEmbed from '../Frontend/DocumentEmbed';
import { engineOptions } from '../../utils/options';
import metadata from '../../block.json';

// The block.json defaults, for the free-site reset below.
const defaults = Object.fromEntries(Object.entries(metadata.attributes).map(([key, schema]) => [key, schema.default]));

const Edit = (props) => {
	const { attributes, setAttributes, clientId, isSelected, device = 'desktop' } = props;
	const { blockId = '', document = {}, viewer = {} } = attributes;

	const id = `block-${clientId}`;
	const isPremium = 'undefined' !== typeof bBlocksPremiumChecker ? bBlocksPremiumChecker : false;
	const updateObj = updateAttributes(attributes, setAttributes);

	// The ids of the Document Embed blocks before this one, so a copied block gets its own: the server finds a
	// block's download settings (and its count) by this id. Only the later copy changes; the original keeps its
	// id, its download count and its page links.
	const otherIds = useSelect((select) => {
		const { getBlocksByName, getBlockAttributes } = select('core/block-editor');
		const all = getBlocksByName?.('b-blocks/document-embed') || [];
		const at = all.indexOf(clientId);

		return (0 <= at ? all.slice(0, at) : all.filter((other) => other !== clientId)).map((other) => getBlockAttributes(other)?.blockId).join(' ');
	}, [clientId]);

	// Not an undo step: undoing it would only bring back the empty id, which is set again at once.
	const { __unstableMarkNextChangeAsNotPersistent: markNotPersistent } = useDispatch('core/block-editor');

	useEffect(() => {
		if ('' === blockId || otherIds.split(' ').includes(blockId)) {
			markNotPersistent?.();
			setAttributes({ blockId: `de-${clientId.slice(0, 13)}` });
		}
	}, [blockId, otherIds]);

	const isPdf = /\.pdf$/i.test((document.url || '').split(/[?#]/)[0]);

	// A Media Library file deleted since the block was saved: the page shows nothing (render.php), so say so here.
	const isDeleted = useSelect((select) => {
		if (!(0 < document.id)) {
			return false;
		}
		const media = select('core').getMedia(document.id);
		return !media && select('core').hasFinishedResolution('getMedia', [document.id]);
	}, [document.id]);

	// A free site publishes the Pro settings at their defaults (BBlocksDocumentEmbedHandler::settings(): PRO_KEYS,
	// PRO_DOWNLOAD_KEYS, PRO_FLIPBOOK_KEYS, custom toolbar theme). The sidebar and preview show the same, so a block
	// saved on a Pro site does not look different here than on the page. The saved values stay for a later upgrade.
	// A toolbar background saved as a plain colour (before it was a Background) shows as that colour, as on the page.
	const saved = 'string' === typeof attributes.toolbar?.bg ? { ...attributes, toolbar: { ...attributes.toolbar, bg: { type: 'solid', color: attributes.toolbar.bg } } } : attributes;
	const shown = isPremium ? saved : {
		...saved,
		...Object.fromEntries(['lightbox', 'access', 'security', 'performance', 'overlays'].map((key) => [key, defaults[key]])),
		viewer: { ...defaults.viewer, engine: viewer.engine || 'default' },
		download: { ...defaults.download, ...attributes.download, ...Object.fromEntries(['showCount', 'limitPerIp', 'access', 'roles', 'deniedMessage'].map((key) => [key, defaults.download[key]])) },
		flipbook: { ...defaults.flipbook, ...attributes.flipbook, ...Object.fromEntries(['hardCover', 'sound', 'autoPlay', 'autoPlayDuration', 'pageMode', 'speed', 'edgeColor'].map((key) => [key, defaults.flipbook[key]])) },
		toolbar: { ...saved.toolbar, theme: 'custom' === saved.toolbar?.theme ? defaults.toolbar.theme : saved.toolbar?.theme }
	};

	const onSelectMedia = (media) => setAttributes({
		document: { ...document, id: media?.id || 0, url: media?.url || '', name: media?.filename || media?.title || '', mime: media?.mime || '', size: media?.filesizeHumanReadable || '', source: 'media' }
	});

	const blockProps = useBlockProps({ id });

	return <>
		<Settings {...props} attributes={shown} updateObj={updateObj} device={device} isPremium={isPremium} onSelectMedia={onSelectMedia} />

		{'' !== document.url && <BlockControls>
			<ToolbarGroup>
				<MediaUploadCheck>
					<MediaUpload
						value={document.id || 0}
						onSelect={onSelectMedia}
						render={({ open }) => <ToolbarButton icon='media-document' label={__('Replace document', 'b-blocks')} onClick={open} />}
					/>
				</MediaUploadCheck>

				<ToolbarButton icon='admin-links' label={__('Change source', 'b-blocks')} onClick={() => setAttributes({ document: { ...document, id: 0, url: '', name: '', mime: '', size: '' } })} />

				<ToolbarDropdownMenu
					icon='visibility'
					label={__('Viewer engine', 'b-blocks')}
					controls={engineOptions.map((option) => ({
						title: option.label,
						// A file the PDF engines cannot open shows with Default, as the sidebar says.
						isActive: option.value === (isPdf ? viewer.engine || 'default' : 'default'),
						isDisabled: 'default' !== option.value && !isPdf,
						onClick: () => updateObj('viewer', option.value, 'engine')
					}))}
				/>
			</ToolbarGroup>
		</BlockControls>}

		<div {...blockProps}>
			{'' === document.url ?
				<SourcePicker document={document} setAttributes={setAttributes} onSelectMedia={onSelectMedia} isPremium={isPremium} /> :
				<>
					{isDeleted && <p className='b-blocks-document-embed-warning' role='alert'>{__('This file was deleted from the Media Library, so the block shows nothing on the page. Replace the document.', 'b-blocks')}</p>}

					<div>
						<Style attributes={shown} id={id} isBackend={true} />

						<DocumentEmbed attributes={shown} assetsUrl={window.bBlocksGlobal?.assetsUrl || ''} isBackend={true} />
					</div>

					{/* Iframes swallow clicks; until the block is selected, a click selects it. */}
					{!isSelected && <span className='b-blocks-document-embed-editor-overlay' />}
				</>}
		</div>
	</>;
};

export default withSelect((select) => ({
	device: select('core/editor')?.getDeviceType?.()?.toLowerCase() || 'desktop'
}))(Edit);