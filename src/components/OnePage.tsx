import { OneGraph } from './../components/OneGraph'
import { Fragment, useEffect, useState, useCallback } from 'react'
import { graphDataType, loadDataFunctionCustomType } from './TypeDefinition';

export const OnePage = ( { graphsConfig, loadPocasiAsyncCustom }: { graphsConfig: graphDataType[], loadPocasiAsyncCustom: loadDataFunctionCustomType } ) => {
    const [ graphsData, setGraphsData ] = useState(graphsConfig)

const load = useCallback (
    async() => setGraphsData( await loadPocasiAsyncCustom(undefined, undefined, 999) as graphDataType[]),
    [loadPocasiAsyncCustom]
)

    useEffect( () => {
       ( async() => await load() )()
    }, [load])

    return (
        <>
            {
                graphsData[0].data.length > 1 && graphsData.map( (graphData, index) => {
                return (
                    <Fragment key={index}>          
                        {
                            graphData.specific.map( (oneSpecific, index1) =>
                                <OneGraph
                                    key={index1}
                                    graphData={{
                                        ...graphData,
                                        specific: oneSpecific,
                                        common: {
                                            ...graphData.common,
                                            loadDataFunction : loadPocasiAsyncCustom as loadDataFunctionCustomType,
                                            index
                                        }
                                    }}
                                />
                            )
                        }              
                    </Fragment>
                )})
            }
        </>
    )
}