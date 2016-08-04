import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Hello from './components/Hello';
import App from './components/App';
import Quran from './components/Quran';
import Sura from './components/Sura';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Quran}/>
    <Route path="/hello" component={Hello}/>
    <Route path="/quran" component={Quran}/>
    <Route path="/sura/:sura_id" component={Sura}/>
  </Route>
);
