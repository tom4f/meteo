import { apiPath } from './../components/apiPath'

export const loadPocasiAsync = async (start, end, index, graphsConfig ) => {

    const urlList = graphsConfig.map( graphConfig => ({
        url: graphConfig.common.url,
        dateField: graphConfig.common.dateField
    }))

    const getOptions = (orderBy) => ({
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

    const fetchList = urlList.map( url => fetch( `${apiPath}/${url.url}`, getOptions() ).then( resp => resp.json() )  )

    const graphsDataSettled = await Promise.allSettled( fetchList )

    const graphsDataFulfilled = graphsDataSettled.map( onePromise =>
        onePromise.status === 'fulfilled' ? onePromise.value : [ { "dummy": "dummy" } ]
    )

    const graphsData = graphsDataFulfilled.map( (data, index) =>
        ( { ...graphsConfig[index], data } )
    )

    return graphsData
}
