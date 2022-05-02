import { render } from '@wordpress/element';

import './style.scss';
import Style from './Style';
import RenderChart from './RenderChart';

// Chart
document.addEventListener('DOMContentLoaded', () => {
	const allChart = document.querySelectorAll('.wp-block-b-blocks-chart');
	allChart.forEach(chart => {
		const attributes = JSON.parse(chart.dataset.attributes);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<RenderChart attributes={attributes} clientId={attributes.cId} />
		</>, chart);

		chart?.removeAttribute('data-attributes');
	});
});