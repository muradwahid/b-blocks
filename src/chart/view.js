import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import RenderChart from './Components/Common/RenderChart';

document.addEventListener('DOMContentLoaded', () => {
	const chartEls = document.querySelectorAll('.wp-block-b-blocks-chart');
	chartEls.forEach(chartEl => {
		const attributes = JSON.parse(chartEl.dataset.attributes);

		createRoot(chartEl).render(<>
			<Style attributes={attributes} id={chartEl.id} />

			<RenderChart attributes={attributes} id={chartEl.id} />
		</>);

		chartEl?.removeAttribute('data-attributes');
	});
});