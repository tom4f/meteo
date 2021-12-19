import { useState } from 'react';
import { ShowYearTable } from './ShowYearTable';

export const YearTable = () => {

    const [ pocasi, setPocasi ] = useState([]);

    return (
        <ShowYearTable pocasi={pocasi} setPocasi={setPocasi} />
    )
}