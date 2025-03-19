import { createRoot } from 'react-dom/client';

import './dashboard.scss';
import Dashboard from './Dashboard/Dashboard';

document.addEventListener('DOMContentLoaded', () => {
	const dashboardEl = document.querySelector('#bBlocksDashboard');

	if (dashboardEl) {
		createRoot(dashboardEl).render(<Dashboard />);
	}
});