export const prefix = 'b-blocks-instagram';

/** Instagram's public profile URL; the API never returns one. */
export const profileURL = (username) => username ? `https://www.instagram.com/${encodeURIComponent(username)}/` : 'https://www.instagram.com/';

export const hashtagURL = (tag) => `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`;

/**
 * Placeholder tiles for the editor before an account is connected, so the
 * layout controls can be judged against something. Inline SVG keeps it offline.
 */
const tile = (from, to, label) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='600' height='600' fill='url(#g)'/><text x='300' y='320' font-family='sans-serif' font-size='56' fill='#ffffffcc' text-anchor='middle'>${label}</text></svg>`)}`;

const DEMO_GRADIENTS = [
	['#f09433', '#dc2743'],
	['#833ab4', '#405de6'],
	['#dc2743', '#bc1888'],
	['#405de6', '#5851db'],
	['#bc1888', '#f09433'],
	['#5851db', '#833ab4']
];

export const demoFeed = {
	user: { id: 'demo', username: 'bplugins', mediaCount: 12, profile_picture_url: tile('#833ab4', '#f09433', 'b') },
	media: Array.from({ length: 12 }, (unused, index) => {
		const [from, to] = DEMO_GRADIENTS[index % DEMO_GRADIENTS.length];
		const type = 0 === index % 5 ? 'VIDEO' : (0 === index % 3 ? 'CAROUSEL_ALBUM' : 'IMAGE');

		return {
			id: `demo-${index}`,
			media_type: type,
			media_url: tile(from, to, `${index + 1}`),
			thumbnail_url: 'VIDEO' === type ? tile(from, to, `${index + 1}`) : '',
			permalink: 'https://www.instagram.com/',
			caption: `Sample post ${index + 1} — connect an account to show your own feed #bblocks #instagram`,
			timestamp: ''
		};
	})
};
