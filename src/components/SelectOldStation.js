import React                from 'react';
import { ShowOldStationTable }     from './ShowOldStationTable';
import { ShowOldStationGraphCanvas } from './ShowOldStationGraphCanvas';
import { OldGraphs } from './OldGraphs';

export const SelectOldStation = () => {

    return (
        <>
            <OldGraphs />
            {/* <ShowOldStationGraphCanvas /> */}
            <ShowOldStationTable />
        </>
    )
}