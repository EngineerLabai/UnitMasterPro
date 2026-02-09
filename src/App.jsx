import Constants from './pages/Constants';
import UnitSets from './pages/UnitSets';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import QuickConvert from './pages/QuickConvert';
import Favorites from './pages/Favorites';
import History from './pages/History';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<QuickConvert />} />
          <Route path='/sets' element={<UnitSets />} />
          <Route path='/constants' element={<Constants />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/history' element={<History />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
