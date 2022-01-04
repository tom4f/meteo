import { useState } from 'react';
import { ShowYearTable } from './ShowYearTable';
import { pocasiType } from './TypeDefinition';

export const YearTable = () => {

    const [ pocasi, setPocasi ] = useState<pocasiType[]>();

    return (
        <ShowYearTable pocasi={pocasi} setPocasi={setPocasi} />
    )
}