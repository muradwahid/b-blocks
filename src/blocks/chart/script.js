import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';
import RenderChart from './RenderChart';

document.addEventListener('DOMContentLoaded', () => {
	const allChart = document.querySelectorAll('.wp-block-b-blocks-chart');
	allChart.forEach(chart => {
		const attributes = JSON.parse(chart.dataset.attributes);

		createRoot(chart).render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<RenderChart attributes={attributes} clientId={attributes.cId} />
		</>);

		chart?.removeAttribute('data-attributes');
	});
});