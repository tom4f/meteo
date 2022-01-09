import { graphDataWithoutFunctionType } from './TypeDefinition';
import { OnePage } from './OnePage';
import graphsConfig from './../config/old-graphs.json'
import { loadPocasiAsync } from './../api'

const getTextDateFromNewDate = (updDate: Date) =>{
    return `${updDate.getFullYear()}-${ ('0' + (updDate.getMonth() + 1)).slice(-2) }-${ ('0' + updDate.getDate()).slice(-2) }`;
}

const loadPocasiAsyncCustom = async (
    start = getTextDateFromNewDate( new Date( '2011-08-22' ) ),
    end =   getTextDateFromNewDate( new Date( '2012-08-22' ) ),
    index = 999
) => {
    return await loadPocasiAsync(start, end, index, graphsConfig) as graphDataWithoutFunctionType[]
}

export const OldGraphs = () => {

    return (
        <>
            <header id="detail_graphs" className="header">
                <a href="https://www.frymburk.com/projects/92_canvas_graph/old_station.html">
                    HISTORIE - dynamické grafy - na celou obrazovku &nbsp;
                    <i className="fas fa-expand-arrows-alt"></i>
                </a>
            </header>
            <OnePage
                graphsConfig = { graphsConfig }
                loadPocasiAsyncCustom = { loadPocasiAsyncCustom }
            />
        </>
    )
}