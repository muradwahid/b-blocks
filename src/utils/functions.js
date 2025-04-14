export const isBlockEnabled = (name) => {
	const disabledBlocks = bBlocksDisabledBlocks || [];

	return !disabledBlocks.includes(name);
}

export const sanitizeHTML = input => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(input, 'text/html');

	const allowedTags = ['b', 'strong', 'i', 'em', 'span', 'a', 'br'];
	const allowedAttrs = ['style', 'href', 'target', 'rel', 'class'];

	doc.body.querySelectorAll('*').forEach((node) => {
		// Remove disallowed tags
		if (!allowedTags.includes(node.tagName.toLowerCase())) {
			node.remove();
			return;
		}

		// Loop through attributes and sanitize
		[...node.attributes].forEach(attr => {
			if (!allowedAttrs.includes(attr.name)) {
				node.removeAttribute(attr.name);
			}

			// Prevent `javascript:` in href
			if (attr.name === "href" && attr.value.trim().toLowerCase().startsWith("javascript:")) {
				node.removeAttribute("href");
			}
		});
	});

	return doc.body.innerHTML;
}

export const sanitizeURL = (inputUrl) => {
	try {
		const url = new URL(inputUrl);

		// 1. Check for safe protocols
		if (!['http:', 'https:'].includes(url.protocol)) return null;

		// // 2. Strip query and fragment for safety
		// url.search = '';
		// url.hash = '';

		return url.toString();
	} catch (err) {
		return null; // Invalid URL
	}
}  