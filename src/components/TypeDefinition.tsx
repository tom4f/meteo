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
    lineStyle: number[];
}

export type loadDataFunctionCustomType = (startDate?: string, endDate?: string, index?: number ) => Promise<graphDataWithoutFunctionType[]>

export type loadDataFunctionType = (start: string, end: string, index: number, graphsConfig: graphDataWithoutFunctionType[] ) => Promise<graphDataWithoutFunctionType[]>

export type commonWithoutFunctionType = {
    index: number;
    dateField: string
    isAllDownloaded: boolean;
    url: string;
    title: string;
    navName : string;  
}

export type commonType = commonWithoutFunctionType & {
    loadDataFunction: loadDataFunctionCustomType;
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

export type graphDataWithoutFunctionType = {
    common: commonWithoutFunctionType;
    specific: (specificType[])[];
    data: pureData[];
}

export type onePageType = {
    graphsConfig: graphDataWithoutFunctionType[];
    loadPocasiAsyncCustom: loadDataFunctionCustomType;
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

export type LayoutType = {
    children:   JSX.Element;
    allPaths:   onePathType[];
    graphsData: graphsDataType
}

export type showGraphType = (
    canvas: HTMLCanvasElement,
    canvas_pointer: HTMLCanvasElement,
    graphHeight: number) => void



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

export type reduceDateType = (param: string, value: Date) => void

export type providerType = {
    date: dateType;
    reduceDate: reduceDateType;
}

export type davisType = {
    wind3: number;
    wind6: number;
    wind9: number;
    wind_speed_avg: number;
    wind_speed_high: number;
    dir: number;

    temp_low: number;
    temp_mean: number;
    temp_high: number;

    rain: number;
    rain_rate_max: number;

    bar_min: number;
    bar_avg: number;
    bar_max: number;

    huminidy_min: number;
    huminidy_avg: number;
    huminidy_max : number;
    date: string;
}

export type pocasiType = {
    datum: string;
    cas: string;
    hladina: number;
    pritok: number;
    odtok: number;
    voda: number;
    vzduch: number;
    pocasi: string;
}

export type setPocasiType = 
    React.Dispatch<React.SetStateAction<pocasiType[] | undefined>>


export type showYearTableType = {
    pocasi: pocasiType[] | undefined ;
    setPocasi: setPocasiType;
    editMeteo?: editMeteoType;
    user?: string;
    order?: string;
    webToken?: string;
}

export type rgbCssType = (r: number, g: number, b: number, value: number) => ({
     background: string
})

export type oldPocasiType = {
    wind3: number;
    wind6: number;
    wind9: number;
    wind12: number;
    windmax: number;
    direct: number;

    tempmin: number;
    tempavg: number;
    tempmax: number;

    rain: number;
    rain_rate_max: number;

 
    date: string;
}

export type editMeteoType = {
    editDate: string;
    editKey: string;
    editValue: string | number;
    dispEdit: boolean;
    dispDelete: boolean;
    dispAdd: boolean;
    refresh: number;
}

export type setEditMeteoType = React.Dispatch<React.SetStateAction<editMeteoType>> 

export type ModifyPocasiType = {
    editMeteo : editMeteoType;
    setEditMeteo: setEditMeteoType;
    webToken: string;
    user: string;
}

export type AddPocasiType = ModifyPocasiType & {
    pocasi: pocasiType[];
}

export type FDobjectType = {
    [key: string]:  number | string | File
}

export type addQuerySelectorType = (
        pocasi: pocasiType[],
        editMeteo : editMeteoType,
        setEditMeteo: setEditMeteoType,
        webToken: string,
    ) => void

type setUserType = React.Dispatch<React.SetStateAction<string>>
type setPasswordType = React.Dispatch<React.SetStateAction<string>>
type setWebTokenType = React.Dispatch<React.SetStateAction<string>> 

export type ShowLoginType = {
    user: string;
    setUser: setUserType;
    password: string;
    setPassword: setPasswordType;
    setWebToken: setWebTokenType;
    editMeteo : editMeteoType;
    setEditMeteo: setEditMeteoType;
}
