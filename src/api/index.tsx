import { apiPath } from './apiPath'
import { loadDataFunctionType } from '../components/TypeDefinition'

export const loadPocasiAsync: loadDataFunctionType = async (start, end, index, graphsConfig ) => {

    const urlList = graphsConfig.map( (graphConfig, index) => ({
        url: graphConfig.common.url,
        dateField: graphConfig.common.dateField,
        id: index
    }))

    const urlListFiltered = index === 999 ? urlList : [ urlList[index] ]

    const getOptions = (orderBy: string) => ({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            start,
            end,
            orderBy,
            sort: "ASC"
        })
    })

    const fetchList = urlListFiltered.map( url => fetch( `${apiPath}/${url.url}`, getOptions(url.dateField) ).then( resp => resp.json() )  )

    const graphsDataSettled = await Promise.allSettled( fetchList )

    const graphsDataFulfilled = graphsDataSettled.map( onePromise =>
        onePromise.status === 'fulfilled' ? onePromise.value : [ { "dummy": "dummy" } ]
    )



    const graphsData = graphsDataFulfilled.map( (data, index1) =>
        ( { ...graphsConfig[ urlListFiltered[index1].id ], data } )
    )

    return graphsData
}
