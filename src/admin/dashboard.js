import { createRoot } from 'react-dom/client';

import './dashboard.scss';
import Dashboard from './Dashboard/Dashboard';

document.addEventListener('DOMContentLoaded', () => {
	const dashboardEl = document.querySelector('#bBlocksDashboard');

	const info = JSON.parse(dashboardEl.dataset.info);

	if (dashboardEl) {
		createRoot(dashboardEl).render(<Dashboard info={info} />);

		dashboardEl.removeAttribute('data-info');
	}
});