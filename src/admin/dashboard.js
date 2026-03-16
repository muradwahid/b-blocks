import { createRoot } from 'react-dom/client';

// import './dashboard.scss';
import Dashboard from './Dashboard/Dashboard';
import { dashboardInfo } from './Dashboard/utils/data';

import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const dashboardEl = document.querySelector('#bBlocksDashboard');
	if (!dashboardEl) return;

	let info;
	try {
		info = JSON.parse(dashboardEl.dataset.info);
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e);
	}
	createRoot(dashboardEl).render(<Dashboard {...dashboardInfo(info)} />);
	dashboardEl.removeAttribute('data-info');
});