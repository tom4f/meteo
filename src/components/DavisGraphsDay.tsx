import { useState } from 'react';
import { graphDataWithoutFunctionType } from './TypeDefinition';
import { OnePage } from './OnePage';
import graphsConfig from './../config/davis-day-graphs.json'
import { loadPocasiAsync } from './../api/meteoFromFile'
import DavisGraphsDayStyle from './../css/DavisGraphsDay.module.scss'

export const DavisGraphsDay = () => {

    const [ isGraphLoading, setIsGraphLoading ] = useState( true )

    const getTextDateFromNewDate = (updDate: Date) =>{
        return `${updDate.getFullYear()}-${ ('0' + (updDate.getMonth() + 1)).slice(-2) }-${ ('0' + updDate.getDate()).slice(-2) }`;
    }  
    
    const loadPocasiAsyncCustom = async (
        start = getTextDateFromNewDate( new Date( new Date().setFullYear ( new Date().getFullYear() - 1 )  ) ),
        end =   getTextDateFromNewDate( new Date() ),
        index = 999
    ) => {
    
        const graphsData = await loadPocasiAsync(start, end, index, graphsConfig) as graphDataWithoutFunctionType[]
        setIsGraphLoading( !!graphsData[0].data[0].dummy )

        return graphsData
    }

    const ShowLoading = ( { isGraphLoading }: { isGraphLoading: boolean } ) => {
        return  isGraphLoading
            ? <div className={ DavisGraphsDayStyle.isLoading } >
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" overflow="visible" stroke="#FFF" strokeWidth="1">
                    <circle  pathLength="1" cx="50" cy="50" r="40" stroke="#ff0" strokeWidth="20" fill="#ff0" />
                </svg>
              </div>
            : null  
    }

    return (
        <>
            <header className="header">
                <a href="https://www.frymburk.com/projects/92_canvas_graph/day.html">
                HISTORIE - dynamické grafy - na celou obrazovku &nbsp;
                    <i className="fas fa-expand-arrows-alt"></i>
                </a>
            </header>
            <ShowLoading isGraphLoading={ isGraphLoading } />
            <OnePage
                graphsConfig = { graphsConfig }
                loadPocasiAsyncCustom = { loadPocasiAsyncCustom }
            />
        </>
    )
}