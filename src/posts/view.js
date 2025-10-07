import { createRoot } from 'react-dom/client';
import 'swiper/css/bundle';

import './style.scss';
import Posts from './Components/Frontend/Posts';

document.addEventListener('DOMContentLoaded', () => {
	const postsEls = document.querySelectorAll('.wp-block-b-blocks-posts');
	postsEls.forEach(postsEl => {
		const nonce = JSON.parse(postsEl.dataset.nonce);
		const attributes = JSON.parse(postsEl.dataset.attributes);
		const { totalPosts } = JSON.parse(postsEl.dataset.extra);

		const firstPostsText = postsEl.querySelector('pre#firstPosts').innerText;
		const firstPosts = firstPostsText ? JSON.parse(firstPostsText?.replace(/\n/g, ' ')?.replace(/\s+/g, ' ')?.trim()) : [];

		createRoot(postsEl).render(<Posts firstPosts={firstPosts} nonce={nonce} totalPosts={totalPosts} attributes={attributes} id={postsEl.id} />);

		postsEl?.removeAttribute('data-nonce');
		postsEl?.removeAttribute('data-attributes');
		postsEl?.removeAttribute('data-extra');
	});
});