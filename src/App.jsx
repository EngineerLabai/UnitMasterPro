import Constants from './pages/Constants';
import UnitSets from './pages/UnitSets';
import Currency from './pages/Currency';
import Cooking from './pages/Cooking';
import DateGap from './pages/DateGap';
import BmiCalc from './pages/BmiCalc';
import Discount from './pages/Discount';
import BillSplitter from './pages/BillSplitter';
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
          <Route path='/currency' element={<Currency />} />
          <Route path='/cooking' element={<Cooking />} />
          <Route path='/date' element={<DateGap />} />
          <Route path='/bmi' element={<BmiCalc />} />
          <Route path='/discount' element={<Discount />} />
          <Route path='/bill' element={<BillSplitter />} />
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
