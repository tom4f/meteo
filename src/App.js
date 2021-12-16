import React, { useState }  from 'react';
import { DateProvider }     from './components/DateContext';
import Top                  from './components/Top';
import Bottom               from './components/Bottom';
import { SelectDay }        from './components/SelectDay';
import { SelectYear }       from './components/SelectYear';
import { SelectOldStation } from './components/SelectOldStation';
import { ModifyPocasi }     from './components/ModifyPocasi';
import { ShowDayGraphCanvasToday } from './components/ShowDayGraphCanvasToday';
import { DavisGraphs } from './components/DavisGraphs';
import { ShowDayTable } from './components/ShowDayTable';
import { ShowDayStatistic } from './components/ShowDayStatistic';
import { NavBar, NavBarDavis }           from './components/NavBar';
import { Route, Routes, Navigate } from 'react-router-dom';

import './css/main.css';
import './css/meteo.css';

export const App = () => {

  // store actual menu
  const [menu, setMenu] = useState('start');

  // css per clicked button
  const btnOn  = { background: `#555555`, color: 'white' };
  const btnOff = { background: `white`  , color: 'black' };

  // render based on menu : elements per clicked button
  return (
    <div className="top_container">
      <Top/>
      <NavBar />
{/*       <nav>
          <button style={ menu === 'start'      ? btnOn : btnOff } onClick={ () => setMenu('start') } >meteostanice<br/>Davis Vantage Pro<br/>Frymburk</button>
          <button style={ menu === 'povodi'     ? btnOn : btnOff } onClick={ () => setMenu('povodi') } ><br/>denní hodnoty<br/>Lipno u hráze</button>
          <button style={ menu === 'oldStation' ? btnOn : btnOff } onClick={ () => setMenu('oldStation') } >původní<br/>meteostanice<br/>Frymburk</button>
      </nav> */}
      <div className="graphs">
        <DateProvider>
          <Routes>
          <Route path='*' element={<Navigate replace to='frymburk' />} />
          <Route path='frymburk' element = { <NavBarDavis /> } >
            <Route path='' element={<Navigate replace to='week' />} />
            <Route path='week' element = { <ShowDayGraphCanvasToday /> } />
            <Route path='year' element = { <DavisGraphs /> } />
            <Route path='table' element = { <ShowDayTable /> } />
            <Route path='statistics' element = { <ShowDayStatistic /> } />
          </Route>

            {/* {
              window.location.search === '?edit=yes'  ? <ModifyPocasi edit="yes" />
              : menu === 'start'                      ? <SelectDay />
              : menu === 'povodi'                     ? <SelectYear />
              : menu === 'oldStation'                 ? <SelectOldStation />
              : null
            } */}

          </Routes>
        </DateProvider>
      </div>
      <Bottom/>
    </div>
  );
}
