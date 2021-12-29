import { ReactElement } from 'react'
import { ParsedUrlQuery } from 'querystring'

export interface urlQueryType extends ParsedUrlQuery {
    page: string
}

export type BigStyledLi = {
    isActivePath: boolean;
}

type onePathType = {
    onePath: string;
    navName: string;
    isActivePath: boolean;
}

export type NavType = {
    allPaths: onePathType[];
}





export type specificType = {
    sourceField: string;
    color: string;
    style: string;
    width: number;
    header: string;
    group: number;
    lineStyle: [];
}

export type loadDataFunctionCustomType = (startDate?: string, endDate?: string, index?: number ) => Promise<graphDataType[]>

export type loadDataFunctionType = (start: string, end: string, index: number, graphsConfig: graphDataType[] ) => Promise<graphDataType[]>

export type commonType = {
    dateField: string
    isAllDownloaded: boolean;
    loadDataFunction: loadDataFunctionCustomType;
    url: string;
    title: string;
    navName : string;  
    index: number
}

export type pureData = {
    [key: string]:  number | string;
}

export type graphConfigType = {
    common: commonType;
    specific: (specificType[])[] ;
}

export type graphDataType = {
    common: commonType;
    specific: (specificType[])[];
    data: pureData[];
}

export type oneGraphDataType = {
    common: commonType;
    specific: specificType[];
    data: pureData[];
}

export type graphsDataType = {
    graphsData: graphDataType[];
}

export type OneGraphType = {
    graphData: oneGraphDataType;
}








export type allSettledType = {
    [key in 'status' | 'value' | 'reason']: any
}

export type LayoutType = {
    children:   JSX.Element;
    allPaths:   onePathType[];
    graphsData: graphsDataType
}

export type showGraphType = (
    canvas: HTMLCanvasElement,
    canvas_pointer: HTMLCanvasElement,
    graphHeight: number
) => void




export type MetaType = {
    title?: string;
    keywords?: string;
    description?: string;
}

export interface isAllDownloaded {
    isAllDownloaded: boolean
}

export type GraphsProviderType = {
    children: ReactElement,
    graphsData: graphDataType[]
}

export type CustomNavLinkType = ( { to, header } : { to: string, header: string } ) => JSX.Element


export type dateType = {
    [key in 'daily' | 'yearSum' | 'davisStat' | 'oldStation' ]:  Date;
}



export type reducerActionType = {
    type: string;
    payload: {
        param: string;
        value: Date;
    }
}

export type globalDateType = (param: string, value: Date) => void

export type providerType = {
    date: dateType;
    globalDate: globalDateType;
}