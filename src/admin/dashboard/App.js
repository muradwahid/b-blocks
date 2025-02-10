import { Navigate, Route, Routes } from 'react-router-dom';
import Blocks from './Pages/Blocks';
import { Toaster } from 'react-hot-toast';
import Welcome from './Pages/Welcome';
import InDev from './Pages/InDev';
import PopularPlugin from './Pages/PopularPlugin';

const App = () => {
  return (
    <>
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/blocks" element={<Blocks />} />
        <Route path="/inDev" element={<InDev />} />
        <Route path="/popularPlugin" element={<PopularPlugin />} />

        {/* When no routes match, it will redirect to this route path. Note that it should be registered above. */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </>
  )
}

export default App;