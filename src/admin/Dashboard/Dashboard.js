import { HashRouter, Navigate, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Welcome from './Pages/Welcome';
import Blocks from './Pages/Blocks';
import InDev from './Pages/InDev';
import CursorEffect from './Pages/CursorEffect/CursorEffect';
// import PopularPlugin from './Pages/PopularPlugin';

const Dashboard = ({ info }) => <HashRouter>
	<Toaster position='bottom-center' />

	<Routes>
		<Route path='/welcome' element={<Welcome info={info} />} />
		<Route path='/blocks' element={<Blocks info={info} />} />
		<Route path='/cursor' element={<CursorEffect info={info} />} />
		<Route path='/inDev' element={<InDev info={info} />} />
		{/* <Route path='/popularPlugin' element={<PopularPlugin info={info} />} /> */}

		{/* When no routes match, it will redirect to this route path. Note that it should be registered above. */}
		<Route path='*' element={<Navigate to='/welcome' replace />} />
	</Routes>
</HashRouter>;
export default Dashboard;