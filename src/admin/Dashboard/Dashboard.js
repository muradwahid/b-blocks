import { HashRouter, Navigate, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Welcome from './Pages/Welcome';
import Blocks from './Pages/Blocks';
// import InDev from './Pages/InDev';
import CursorEffect from './Pages/CursorEffect/CursorEffect';
// import PopularPlugin from './Pages/PopularPlugin';
import Pricing from '../../../../bpl-tools/Admin/Pricing/Pricing';
import Layout from './Layout/Layout';
import { freemius, pricingInfo } from './utils/data';
import Settings from './Pages/Settings/Settings';

const Dashboard = ({ info }) => {
	const {isPremium} = info;

return <HashRouter>
	<Toaster position='bottom-center' />

	<Routes>
		<Route path='/welcome' element={<Welcome info={info} />} />
		<Route path='/blocks' element={<Blocks info={info} />} />
		<Route path='/cursor' element={<CursorEffect info={info} />} />
		<Route path='/settings' element={<Settings info={info} />} />
		{!isPremium && <Route path='/pricing' element={<Layout info={info}><Pricing pricingInfo={pricingInfo} freemius={freemius}/></Layout>}/>}
		{/* <Route path='/inDev' element={<InDev info={info} />} /> */}
		{/* <Route path='/popularPlugin' element={<PopularPlugin info={info} />} /> */}

		{/* When no routes match, it will redirect to this route path. Note that it should be registered above. */}
		<Route path='*' element={<Navigate to='/welcome' replace />} />
	</Routes>
</HashRouter>};
export default Dashboard;