import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import ArticleCard from './Components/Frontend/ArticleCard';

document.addEventListener('DOMContentLoaded', () => {
	const articleCardEls = document.querySelectorAll('.wp-block-b-blocks-article-card');

	articleCardEls.forEach(articleCardEl => {
		const attributes = JSON.parse(articleCardEl.dataset.attributes);

		createRoot(articleCardEl).render(<>
			<Style attributes={attributes} id={articleCardEl.id} />

			<ArticleCard attributes={attributes} />
		</>);

		articleCardEl?.removeAttribute('data-attributes');
	});
});
