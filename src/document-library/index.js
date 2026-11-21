import { createBlock, registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import embedMetadata from '../document-embed/block.json';
import Edit from './Components/Backend/Edit';
import { isBlockEnabled } from '../utils/functions';
import { documentLibraryIcon } from '../utils/blocksIcon';
import { newItem } from './utils/common';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: documentLibraryIcon,
	edit: Edit,
	transforms: {
		from: [
			// Several File blocks selected together become one library, in their order.
			{
				type: 'block',
				blocks: ['core/file'],
				isMultiBlock: true,
				transform: (files) => createBlock(metadata.name, {
					items: files.filter(({ href }) => href).map(({ id, href, fileName = '' }) => newItem({ id: id || 0, url: href, title: String(fileName).replace(/<[^>]*>/g, '') }))
				})
			},
			// Document Embed blocks (one, or several selected together) become one library.
			{
				type: 'block',
				blocks: [embedMetadata.name],
				isMultiBlock: true,
				transform: (embeds) => createBlock(metadata.name, {
					items: embeds.filter(({ document = {} }) => document.url).map(({ document }) => newItem({ id: document.id || 0, url: document.url, title: document.name || '', mime: document.mime || '', size: document.size || '' }))
				})
			}
		],
		to: [
			// Back to plain File blocks, one per document (a link and a download button each).
			{
				type: 'block',
				blocks: ['core/file'],
				isMatch: ({ items = [] }) => items.some((item) => item?.url),
				transform: ({ items = [] }) => items.filter((item) => item?.url).map((item) => createBlock('core/file', {
					id: item.id || undefined,
					href: item.url,
					textLinkHref: item.url,
					fileName: item.title || item.url.split(/[?#]/)[0].split('/').pop(),
					showDownloadButton: true
				}))
			},
			// One Document Embed (a viewer) per document.
			{
				type: 'block',
				blocks: [embedMetadata.name],
				isMatch: ({ items = [] }) => items.some((item) => item?.url),
				transform: ({ items = [] }) => items.filter((item) => item?.url).map((item) => createBlock(embedMetadata.name, {
					document: { ...embedMetadata.attributes.document.default, id: item.id || 0, url: item.url, name: item.title || '', mime: item.mime || '', size: item.size || '', source: item.id ? 'media' : 'url' }
				}))
			}
		]
	}
});