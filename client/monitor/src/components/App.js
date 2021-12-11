import {BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './Layout';

import RamMonitor from '../pages/RamMonitor';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/ram-monitor" element={<RamMonitor/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
