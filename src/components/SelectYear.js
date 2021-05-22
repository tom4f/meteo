import React, {useState}             from 'react';
//import { ShowYearGraph } from './ShowYearGraph';
import { ShowYearTable } from './ShowYearTable';

import { ShowYearGraphCanvas } from './ShowYearGraphCanvas';

export const SelectYear = () => {

    const [ pocasi, setPocasi ] = useState([]);

    return (
        <>
            <ShowYearGraphCanvas />
            <ShowYearTable pocasi={pocasi} setPocasi={setPocasi} />
            {/* <ShowYearGraph /> */}
        </>
    )
}