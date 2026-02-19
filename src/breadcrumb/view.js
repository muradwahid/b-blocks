import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import BreadCrumb from './Components/Common/BreadCrumb';

document.addEventListener('DOMContentLoaded', () => {
	const breadcrumbEls = document.querySelectorAll('.wp-block-b-blocks-breadcrumb');
	breadcrumbEls.forEach(breadcrumbEl => {
		const attributes = JSON.parse(breadcrumbEl.dataset.attributes);
		const crumbs = JSON.parse(breadcrumbEl.dataset.crumbs);
		createRoot(breadcrumbEl).render(<>
			<Style attributes={attributes} id={breadcrumbEl.id} />

			<BreadCrumb attributes={attributes} crumbs={crumbs} />
		</>);

		breadcrumbEl?.removeAttribute('data-attributes');
	});
});