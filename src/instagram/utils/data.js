export const prefix = 'b-blocks-instagram';

/** Instagram's public profile URL; the API never returns one. */
export const profileURL = (username) => username ? `https://www.instagram.com/${encodeURIComponent(username)}/` : 'https://www.instagram.com/';

export const hashtagURL = (tag) => `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`;