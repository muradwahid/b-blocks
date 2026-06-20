/**
 * Shared data + helpers for the File Download Card editor.
 */

// MIME → short badge label allowlist (mirrors the PHP map in render.php).
const MIME_BADGE_MAP = {
	'application/pdf': 'PDF',
	'application/zip': 'ZIP',
	'application/x-zip-compressed': 'ZIP',
	'application/x-rar-compressed': 'RAR',
	'application/x-7z-compressed': '7Z',
	'application/gzip': 'GZ',
	'application/msword': 'DOC',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOC',
	'application/vnd.ms-excel': 'XLS',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLS',
	'application/vnd.ms-powerpoint': 'PPT',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPT',
	'application/json': 'JSON',
	'application/rtf': 'RTF',
	'application/epub+zip': 'EPUB',
	'text/plain': 'TXT',
	'text/csv': 'CSV',
	'text/html': 'HTML',
	'image/png': 'PNG',
	'image/jpeg': 'JPG',
	'image/gif': 'GIF',
	'image/webp': 'WEBP',
	'image/svg+xml': 'SVG',
	'audio/mpeg': 'MP3',
	'audio/wav': 'WAV',
	'audio/ogg': 'OGG',
	'video/mp4': 'MP4',
	'video/quicktime': 'MOV',
	'video/webm': 'WEBM',
};

/**
 * Derive a short, safe badge label from a MIME type and/or file URL.
 *
 * @param {string} mime The MIME type string.
 * @param {string} url  The file URL (used for an extension fallback).
 * @return {string} Uppercase badge label.
 */
export const badgeForMime = (mime, url) => {
	const m = (mime || '').toLowerCase().trim();
	if (m && MIME_BADGE_MAP[m]) {
		return MIME_BADGE_MAP[m];
	}

	const clean = (url || '').split('?')[0].split('#')[0];
	const dot = clean.lastIndexOf('.');
	if (dot > -1) {
		const ext = clean.slice(dot + 1).toUpperCase();
		if (/^[A-Z0-9]{1,5}$/.test(ext)) {
			return ext;
		}
	}

	return 'FILE';
};

export const fontWeightOptions = [
	{ label: '400', value: '400' },
	{ label: '500', value: '500' },
	{ label: '600', value: '600' },
	{ label: '700', value: '700' },
];
