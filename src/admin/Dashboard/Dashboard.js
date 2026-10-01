import { HashRouter, Navigate, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// import Welcome from './Pages/Welcome';
// import Blocks from './Pages/Blocks';
// import InDev from './Pages/InDev';
// import CursorEffect from './Pages/CursorEffect/CursorEffect';
// import PopularPlugin from './Pages/PopularPlugin';
// import Pricing from '../../../../bpl-tools/LagacyAdmin/Pricing/Pricing';
// import Layout from './Layout/Layout';
// import { freemius, pricingInfo } from './utils/data2';
// import Settings from './Pages/Settings/Settings';

import Layout from './Layout/Layout';
import Pricing from '../../../../bpl-tools/Admin/Pricing';
import FeatureCompare from '../../../../bpl-tools/Admin/FeatureCompare';
import Activation from '../../../../bpl-tools/Admin/Activation';
import OurPlugins from '../../../../bpl-tools/Admin/OurPlugins';
import Blocks from '../../../../bpl-tools/Admin/Blocks';
// import Demos from '../../../../bpl-tools/Admin/Demos';

import Welcome from '../Components/Welcome';
import {
	pricingInfo,
	// demoInfo
} from './utils/data';
import Settings from './Pages/Settings/Settings';
import CursorEffect from './Pages/CursorEffect/CursorEffect';
import { useEffect, useState } from 'react';
import { useWPAjax, useWPOptionQuery } from '../../../../bpl-tools/hooks';
import blocks from './utils/blocks';
import ProModal from '../Components/ProModal';

const dataFetched = new CustomEvent('dataFetched');

const Dashboard = (props) => {
	const { freemius, info, hasPro, isPremium } = props
	// const { isPremium } = info;
	const [disableBlockName, setDisableBlockName] = useState([]);
	const [status, setStatus] = useState('');
	const { data: bBlocksUtils } = useWPOptionQuery('bBlocksUtils');
	const { data = null, refetch, saveData, isLoading, error } = useWPAjax('bBlocksDisabledBlocks', { _wpnonce: bBlocksUtils?.nonce }, false);

	useEffect(() => {
		refetch()
	}, [bBlocksUtils]);

	useEffect(() => {
		if (!isLoading && data) {
			setDisableBlockName(data || []);
			window.dispatchEvent(dataFetched);
		}
	}, [data, isLoading, error]);

	// Total number of published blocks shown on the Blocks page (counts children of grouped categories)
	const totalBlocksCount = blocks.reduce((acc, b) => acc + (
		Array.isArray(b.children)
			? b.children.filter(child => 'published' === child.status || !child.status).length
			: ('published' === b.status || !b.status ? 1 : 0)
	), 0);

	const handleCheckboxChange = (blockName) => {
		setStatus('loading');
		setDisableBlockName(blockName);

		try {
			saveData({ data: JSON.stringify(blockName) });
			setStatus('success');
		} catch (error) {
			setStatus('error');
		}

		const time = setTimeout(() => setStatus(''), 300);
		return () => clearTimeout(time);
	};

	return <HashRouter>
		<Toaster position='bottom-center' />

		<Routes>
			<Route path='/' element={<Layout {...props} />}>
				
				<Route index element={<Navigate to='welcome' replace />} />

				<Route path='welcome' element={<Welcome {...props} allBlocks={blocks} disabledBlocks={disableBlockName} status={status} onChange={handleCheckboxChange} />} />

				<Route path='blocks' element={<>
					<Blocks {...props} pageTitle={`All Blocks (${totalBlocksCount})`} allBlocks={blocks} disabledBlocks={disableBlockName} status={status} onChange={handleCheckboxChange} />
					{!isPremium && <ProModal />}
				</>} />
				{/* <Route path='demos' element={<Demos {...props} demoInfo={demoInfo} />} /> */}
				<Route path='cursor' element={<CursorEffect info={info} />} />

				<Route path='settings' element={<Settings info={info} />} />

				{!isPremium && <Route
					path="feature-comparison"
					element={<FeatureCompare plans={["free", "pro"]} {...props} />}
				/>}

				{!isPremium && <Route path='pricing' element={<Pricing {...props} pricingInfo={pricingInfo} freemius={freemius} options={{}} />} />}

				{
					hasPro &&
					<Route path='activation' element={<Activation {...props} />} />
				}

				<Route path='our-plugins' element={<OurPlugins {...props} />} />
				{/* <Route path='*' element={<Navigate to='welcome' replace />} /> */}
			</Route>
			{/* <Route path='/welcome' element={<Welcome info={info} />} />
			<Route path='/blocks' element={<Blocks info={info} />} />
			<Route path='/cursor' element={<CursorEffect info={info} />} />
			<Route path='/settings' element={<Settings info={info} />} />
			{!isPremium && <Route path='/pricing' element={<Layout info={info}><Pricing pricingInfo={pricingInfo} freemius={freemius}/></Layout>}/>} */}
			{/* <Route path='/welcome' element={<Overview {...props} />} /> */}
			{/* <Route path='/inDev' element={<InDev info={info} />} /> */}
			{/* <Route path='/popularPlugin' element={<PopularPlugin info={info} />} /> */}

			{/* When no routes match, it will redirect to this route path. Note that it should be registered above. */}
			{/* <Route path='*' element={<Navigate to='/welcome' replace />} /> */}
			<Route path='*' element={<Navigate to='/welcome' replace />} />
		</Routes>
	</HashRouter>
};
export default Dashboard;