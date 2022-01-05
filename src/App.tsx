import { DateProvider }            from './components/DateContext';
import Top                         from './components/Top';
import { Bottom }                  from './components/Bottom';
import { ModifyPocasi }            from './components/ModifyPocasi';
import { DavisGraphsDay }          from './components/DavisGraphsDay';
import { DavisGraphs }             from './components/DavisGraphs';
import { ShowDayTable }            from './components/ShowDayTable';
import { ShowDayStatistic }        from './components/ShowDayStatistic';
import { LipnoGraphs }             from './components/LipnoGraphs';
import { YearTable }               from './components/YearTable';
import { OldGraphs }               from './components/OldGraphs';
import { ShowOldStationTable }     from './components/ShowOldStationTable';
import { ShowDayGraph }            from './components/ShowDayGraph';
import { ShowYearGraph }           from './components/ShowYearGraph';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppStyles                   from './css/App.module.scss'
import { editStatus }              from './api/apiPath';
import { NavBar, NavBarDavis,
  NavBarLipno, NavBarOldStation }  from './components/NavBar';

export const App = () => {
  return (
    <div className={ AppStyles.top_container } >
      <Top/>
      <div className={ AppStyles.graphs } >
        <NavBar />
        <DateProvider>
            <Routes>
                <Route path='*' element={<Navigate replace to={ editStatus ? 'lipno/edit' : 'frymburk' } />} />
                
                <Route path='frymburk' element = { <NavBarDavis /> } >
                    <Route path='' element={<Navigate replace to='week' />} />
                    <Route path='week' element = { <DavisGraphsDay /> } />
                    <Route path='year' element = { <DavisGraphs /> } />
                    <Route path='table' element = {
                      <>
                        <ShowDayTable/>
                        <ShowDayGraph />
                      </>
                    } />
                    <Route path='statistics' element = { <ShowDayStatistic /> } />
                </Route>

                <Route path='lipno' element = { <NavBarLipno /> } >
                    <Route path='' element={<Navigate replace to='graphs' />} />
                    <Route path='graphs' element = { <LipnoGraphs /> } />
                    <Route path='table' element = {
                      <>
                        <YearTable />
                        <ShowYearGraph/>
                      </> 
                    } />
                    <Route path='edit' element = { <ModifyPocasi /> } />
                </Route>

                <Route path='oldStation' element = { <NavBarOldStation /> } >
                    <Route path='' element={<Navigate replace to='graphs' />} />
                    <Route path='graphs' element = { <OldGraphs /> } />
                    <Route path='table' element = { <ShowOldStationTable /> } />
                </Route>
                
              </Routes>

        </DateProvider>
      </div>
      <Bottom/>
    </div>
  )
}
