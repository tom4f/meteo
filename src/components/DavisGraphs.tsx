import { graphDataType } from './TypeDefinition';
import { OnePage } from './OnePage';
import graphsConfigJson from './../config/davis-graphs.json'
import { loadPocasiAsync } from './../api'

const graphsConfig = (graphsConfigJson as any) as graphDataType[]

const getTextDateFromNewDate = (updDate: Date) =>{
    return `${updDate.getFullYear()}-${ ('0' + (updDate.getMonth() + 1)).slice(-2) }-${ ('0' + updDate.getDate()).slice(-2) }`;
}

const loadPocasiAsyncCustom = async (
    start = getTextDateFromNewDate( new Date( new Date().setFullYear ( new Date().getFullYear() - 1 )  ) ),
    end =   getTextDateFromNewDate( new Date() ),
    index = 999
) => {
    return await loadPocasiAsync(start, end, index, graphsConfig) as graphDataType[]
}

export const DavisGraphs = () => {

    return (
        <OnePage
            graphsConfig = { graphsConfig }
            loadPocasiAsyncCustom = { loadPocasiAsyncCustom }
        />
    )
}