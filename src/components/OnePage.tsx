import { OneGraph } from './../components/OneGraph'
import { Fragment, useEffect, useState } from 'react'
import { graphDataType, loadDataFunctionType } from './TypeDefinition';

export const OnePage = ( { graphsConfig, loadPocasiAsyncCustom }: { graphsConfig: graphDataType[], loadPocasiAsyncCustom: loadDataFunctionType } ) => {
    const [ graphsData, setGraphsData ] = useState(graphsConfig)

    useEffect( () => {
       ( async() => setGraphsData( await loadPocasiAsyncCustom() as graphDataType[] ) )()
    }, [])

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
                                            loadDataFunction : loadPocasiAsyncCustom as loadDataFunctionType,
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