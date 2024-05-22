import { createRoot } from 'react-dom/client';
import 'swiper/css/bundle';

import './style.scss';
import Posts from './Components/Frontend/Posts';

document.addEventListener('DOMContentLoaded', () => {
	const postsEls = document.querySelectorAll('.wp-block-b-blocks-posts');
	postsEls.forEach(postsEl => {
		const nonce = JSON.parse(postsEl.dataset.nonce);
		const attributes = JSON.parse(postsEl.dataset.attributes);
		const { cId } = attributes;
		const { totalPosts } = JSON.parse(postsEl.dataset.extra);

		const firstPosts = window[`bBlocksFirstPagePosts-${cId}`] || [];

		createRoot(postsEl).render(<Posts firstPosts={firstPosts} nonce={nonce} totalPosts={totalPosts} attributes={attributes} />);

		window[`bBlocksFirstPagePosts-${cId}`] = undefined;
		const scriptTag = document.getElementById(`bBlocksFirstPagePostsScript-${cId}`);
		if (scriptTag) {
			scriptTag.remove();
		}

		postsEl?.removeAttribute('data-nonce');
		postsEl?.removeAttribute('data-attributes');
		postsEl?.removeAttribute('data-extra');
	});
});