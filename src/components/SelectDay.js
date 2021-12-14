import React                from 'react';
import { ShowDayGraph }     from './ShowDayGraph';
import { ShowDayTable }     from './ShowDayTable';
import { ShowDayStatistic } from './ShowDayStatistic';
import { DavisGraphs }      from './DavisGraphs';
import { ShowDayGraphCanvas } from './ShowDayGraphCanvas';
import { ShowDayGraphCanvasToday } from './ShowDayGraphCanvasToday';

export const SelectDay = () => {

    return (
        <>
            <ShowDayGraphCanvasToday />
            <DavisGraphs />
{/*             <ShowDayGraphCanvas /> */}
            <ShowDayTable />
            <ShowDayGraph />
            <ShowDayStatistic />
        </>
    )
}