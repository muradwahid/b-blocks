/**
 * The token lives in a site option, never in the block, so the feed is always
 * fetched through our own endpoint rather than talking to Graph from the page.
 */
const local = () => window?.bBlocksInstagram || null;

const post = async (action, body = {}) => {
	const config = local();

	if (!config?.ajaxUrl) throw new Error('Instagram endpoint is unavailable.');

	const data = new FormData();

	data.append('action', action);
	data.append('nonce', config.nonce);
	Object.entries(body).forEach(([key, value]) => data.append(key, value));

	const res = await fetch(config.ajaxUrl, { method: 'POST', body: data, credentials: 'same-origin' });
	const json = await res.json();

	// admin-ajax answers 200 even for a refusal, so success has to be read out.
	if (!json?.success) throw new Error(json?.data || 'Could not load the feed.');

	return json.data;
};

export const fetchFeed = ({ account = '', limit = 12, cacheMinutes = 30 }) => post('bBlocksInstagramFeed', { account, limit, cache: cacheMinutes });

export const clearFeedCache = () => post('bBlocksInstagramClearCache');

/** Reports whether a token is stored; the token itself is never sent back. */
export const getAccount = () => post('bBlocksInstagramGetAccount');

export const saveAccount = ({ username = '', token = '' }) => post('bBlocksInstagramSaveAccount', { username, token });
