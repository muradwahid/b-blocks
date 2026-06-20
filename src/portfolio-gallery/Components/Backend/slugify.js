/**
 * JS mirror of WordPress's `sanitize_title()` for category labels.
 *
 * The PHP render.php re-slugifies category labels via `sanitize_title()`
 * AND falls back to a non-ASCII-safe regex if that returns empty. This
 * JS implementation produces matching slugs so the editor's preview
 * buttons (and item `data-bb-pg-category` attributes) line up with the
 * server output exactly.
 *
 * Steps:
 *   1. NFKD-normalize and strip combining marks (so "Café" → "cafe").
 *   2. Lowercase.
 *   3. Replace any non-alphanumeric run with a hyphen.
 *   4. Trim leading/trailing hyphens; collapse double hyphens.
 *   5. Fallback to "cat" if the result is empty (e.g. purely emoji
 *      labels), matching the PHP fallback.
 */
export const slugify = (input) => {
	let value = (input == null ? '' : String(input)).trim();
	if (!value) return '';

	try {
		value = value.normalize('NFKD').replace(/[̀-ͯ]/g, '');
	} catch (e) {
		// Older browsers without String.prototype.normalize — skip.
	}

	value = value.toLowerCase();
	value = value.replace(/[^a-z0-9]+/g, '-');
	value = value.replace(/-+/g, '-').replace(/^-+|-+$/g, '');

	return value || 'cat';
};
