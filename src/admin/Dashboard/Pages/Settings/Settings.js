import { useState } from 'react';
import './style.scss';
import Integration from './Integration/Integration';
import Performance from './Performance/Performance';

const Settings = ({ info }) => {
	const { nonce } = info;
	const [tab, setTab] = useState('integration');

	return (
		<div className='bBlocksSettingPage'>
			<nav className='bBlocksSettingNav'>
				<button type='button' className={tab === 'integration' ? 'active' : ''} onClick={() => setTab('integration')}>Integration</button>
				<button type='button' className={tab === 'performance' ? 'active' : ''} onClick={() => setTab('performance')}>Performance</button>
			</nav>

			{tab === 'integration' && <Integration nonce={nonce} />}
			{tab === 'performance' && <Performance nonce={nonce} />}
		</div>
	);
};

export default Settings;
