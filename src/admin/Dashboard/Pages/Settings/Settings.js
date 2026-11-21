import { Navigate, NavLink, useParams } from 'react-router-dom';
import './style.scss';
import Integration from './Integration/Integration';
import Performance, { tabs as performanceTabs } from './Performance/Performance';
import SiteScanner from './SiteScanner/SiteScanner';
import { apiKeyData } from '../../utils/data2';

const Settings = ({ info }) => {
	const { nonce } = info;

	const { tab, section } = useParams();

	// #/settings or an unknown tab: open Performance, like before.
	if (!['integration', 'performance', 'site-scanner'].includes(tab)) {
		return <Navigate to='/settings/integration' replace />;
	}

	// #/settings/integration, or an integration that does not exist: the first one.
	if ('integration' === tab && !apiKeyData.some((i) => i.name === section)) {
		return <Navigate to={`/settings/integration/${apiKeyData[0].name}`} replace />;
	}

	// #/settings/performance, or a section that does not exist (a scanner check added through a filter can name any): Caching.
	if ('performance' === tab && !performanceTabs.some((t) => t.id === section)) {
		return <Navigate to='/settings/performance/caching' replace />;
	}

	return (
		<div className='bBlocksSettingPage'>
			<nav className='bBlocksSettingNav'>
				<NavLink to='/settings/integration'>Integration</NavLink>
				<NavLink to='/settings/performance'>Performance</NavLink>
				<NavLink to='/settings/site-scanner'>Site Scanner</NavLink>
			</nav>

			{tab === 'integration' && <Integration nonce={nonce} />}
			{tab === 'performance' && <Performance nonce={nonce} />}
			{tab === 'site-scanner' && <SiteScanner nonce={nonce} />}
		</div>
	);
};

export default Settings;
