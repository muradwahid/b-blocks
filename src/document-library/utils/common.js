// Shared by the editor and the page. The page bundle (view.js) loads React only: nothing here, and nothing the
// frontend components import, may come from a @wordpress package.
import { labels } from '../../document-embed/utils/common';
import { archiveIcon, fileIcon, fileTextIcon, imageIcon, musicIcon, videoIcon } from './icons';

// The texts of both blocks (this block's popup shows the Document Embed viewer).
export { labels, fileNameOf, isLocalUrl, useDialog } from '../../document-embed/utils/common';

// Type filter: category → extensions, label, card icon and the List badge colour.
export const categories = {
	pdf: { label: labels.typePdf, exts: ['pdf'], icon: fileTextIcon },
	documents: { label: labels.typeDocuments, exts: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pages', 'rtf', 'csv', 'odt', 'ods', 'odp', 'txt'], icon: fileTextIcon },
	images: { label: labels.typeImages, exts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'], icon: imageIcon },
	videos: { label: labels.typeVideos, exts: ['mp4', 'avi', 'mov', 'mkv', 'webm'], icon: videoIcon },
	audio: { label: labels.typeAudio, exts: ['mp3', 'wav', 'ogg', 'm4a'], icon: musicIcon },
	archives: { label: labels.typeArchives, exts: ['zip', 'rar', '7z', 'gz'], icon: archiveIcon },
	others: { label: labels.typeOthers, exts: [], icon: fileIcon }
};

// Word, Excel and PowerPoint share "Documents" but get their own badge colour.
export const badgeTones = { pdf: 'pdf', doc: 'word', docx: 'word', odt: 'word', rtf: 'word', pages: 'word', txt: 'word', xls: 'sheet', xlsx: 'sheet', csv: 'sheet', ods: 'sheet', ppt: 'slide', pptx: 'slide', odp: 'slide' };

// Byte multipliers, for sorting sizes written as text ("2 MB").
export const byteUnits = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 };

// A Media Library file size as the Media Library and the page show it: no decimals ("3 MB"). No size gives ''.
export const formatBytes = (size) => {
	let bytes = Number(size) || 0;
	if (!bytes) {
		return '';
	}
	const units = Object.keys(byteUnits);
	let unit = 0;
	while (1024 <= bytes && unit < units.length - 1) {
		bytes /= 1024;
		unit++;
	}
	return `${Math.round(bytes)} ${units[unit]}`;
};

// The orders a page address (dl1-sort) may ask for. Their names are in the sidebar (utils/options.js) and the sort menu.
export const sortValues = ['default', 'name-asc', 'name-desc', 'date-desc', 'date-asc', 'size-desc', 'size-asc'];

// One document of the list, every field at its empty value; `fields` fills in what is known.
export const newItem = (fields = {}) => ({ id: 0, url: '', title: '', description: '', mime: '', size: '', date: '', author: '', image: { id: 0, url: '' }, category: '', featured: false, hidden: false, viewAction: '', ...fields });
