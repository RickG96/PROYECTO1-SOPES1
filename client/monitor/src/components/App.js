import {BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './Layout';

import RamMonitor from '../pages/RamMonitor';
import { ProcessInfo } from '../pages/ProcessInfo';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/ram-monitor" element={<RamMonitor/>} />
          <Route path="/process-info" element={<ProcessInfo/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
