import { graphDataType } from './TypeDefinition';
import { OnePage } from './OnePage';
import graphsConfigJson from './../config/old-graphs.json'
import { loadPocasiAsync } from './../api'

const graphsConfig = (graphsConfigJson as any) as graphDataType[]

const getTextDateFromNewDate = (updDate: Date) =>{
    return `${updDate.getFullYear()}-${ ('0' + (updDate.getMonth() + 1)).slice(-2) }-${ ('0' + updDate.getDate()).slice(-2) }`;
}

const loadPocasiAsyncCustom = async (
    start = getTextDateFromNewDate( new Date( '2011-08-22' ) ),
    end =   getTextDateFromNewDate( new Date( '2012-08-22' ) ),
    index = 999
) => {
    return await loadPocasiAsync(start, end, index, graphsConfig) as graphDataType[]
}

export const OldGraphs = () => {

    return (
        <OnePage
            graphsConfig = { graphsConfig }
            loadPocasiAsyncCustom = { loadPocasiAsyncCustom }
        />
    )
}