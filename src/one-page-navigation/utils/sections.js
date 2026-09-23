import { cleanSectionId } from './options';

export const toSlug = (value = '') => String(value)
	.replace(/<[^>]*>/g, ' ')
	.replace(/&nbsp;|&#160;/g, ' ')
	.replace(/&amp;/g, '&')
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-+|-+$/g, '');

export const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6, .sectionHeadingTitle, [role="heading"]';

const SECTION_SELECTOR = 'section, article, .wp-block-group, .wp-block-cover, [id^="bBlocks"], [data-block]';

const sectionOf = (heading) => {
	const box = heading.closest(SECTION_SELECTOR);

	return box && 1 === box.querySelectorAll(HEADING_SELECTOR).length ? box : heading;
};

export const buildIndex = (doc) => {
	const index = new Map();

	if (!doc) return index;

	doc.querySelectorAll(HEADING_SELECTOR).forEach((node) => {
		const slug = toSlug(node.textContent);

		if (slug && !index.has(slug)) index.set(slug, sectionOf(node));
	});

	return index;
};

export const findSection = (doc, value, index) => {
	const id = cleanSectionId(value);

	if (!doc || !id) return null;

	const byId = doc.getElementById(id);

	if (byId) return byId;

	const slug = toSlug(id);

	if (!slug) return null;

	return (index || buildIndex(doc)).get(slug) || null;
};

const headingOf = (block) => {
	const { name, attributes = {} } = block;

	if ('core/heading' === name) return attributes.content;

	if ('b-blocks/section-heading' === name) return attributes.title;

	if ('b-blocks/dual-color-heading' === name) return [attributes.firstText, attributes.secondText].filter(Boolean).join(' ');

	if ('core/post-title' === name) return attributes.content;

	return '';
};

export const collectSections = (blocks = [], out = [], seen = new Set()) => {
	blocks.forEach((block) => {
		const label = String(headingOf(block) || '').replace(/<[^>]*>/g, '').trim();
		const anchor = cleanSectionId(block?.attributes?.anchor);
		const id = anchor || toSlug(label);

		if (id && !seen.has(id)) {
			seen.add(id);
			out.push({ value: id, label: label || id });
		}

		if (block.innerBlocks?.length) collectSections(block.innerBlocks, out, seen);
	});

	return out;
};
