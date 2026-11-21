import { createBlock, registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { isBlockEnabled } from '../utils/functions';
import { documentEmbedIcon } from '../utils/blocksIcon';
import { cloudLinks, cloudSource, fileNameOf } from './utils/common';

// A link to a file the viewer shows (Office, PDF, text), or a Google Drive, Dropbox or Box share link.
const documentLink = /^https?:\/\/\S+\.(pdf|docx?|xlsx?|pptx?|odt|ods|odp|rtf|txt|csv)([?#]\S*)?$/i;

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: documentEmbedIcon,
	edit: Edit,
	transforms: {
		from: [
			// A File block becomes a viewer for the same file.
			{
				type: 'block',
				blocks: ['core/file'],
				transform: ({ id, href = '', fileName = '' }) => createBlock(metadata.name, {
					document: { ...metadata.attributes.document.default, id: id || 0, url: href, name: String(fileName).replace(/<[^>]*>/g, ''), source: id ? 'media' : 'url' }
				})
			},
			// An Embed block holding a document or a cloud share link.
			{
				type: 'block',
				blocks: ['core/embed'],
				isMatch: ({ url = '' }) => documentLink.test(url) || Object.values(cloudLinks).some((link) => link.test(url)),
				transform: ({ url }) => createBlock(metadata.name, {
					document: { ...metadata.attributes.document.default, url, name: '', source: cloudSource(url) || 'url' }
				})
			},
			// A document link pasted on its own line. Ahead of the generic Embed block, which would only show a link.
			{
				type: 'raw',
				priority: 9,
				isMatch: (node) => 'P' === node.nodeName && (documentLink.test(node.textContent.trim()) || Object.values(cloudLinks).some((link) => link.test(node.textContent.trim()))),
				transform: (node) => {
					const url = node.textContent.trim();
					const source = cloudSource(url);
					// Share links end in "view" or an id, not a file name.
					const name = source ? '' : fileNameOf(url);

					return createBlock(metadata.name, {
						document: { ...metadata.attributes.document.default, url, name, source: source || 'url' }
					});
				}
			}
		],
		to: [
			// Back to a plain File block: a link and a download button.
			{
				type: 'block',
				blocks: ['core/file'],
				isMatch: ({ document = {} }) => '' !== (document.url || ''),
				transform: ({ document = {} }) => createBlock('core/file', {
					id: document.id || undefined,
					href: document.url,
					textLinkHref: document.url,
					fileName: document.name || document.url.split(/[?#]/)[0].split('/').pop(),
					showDownloadButton: true
				})
			}
		]
	}
});