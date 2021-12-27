import { createContext, useReducer } from 'react';

export const DateContext = createContext(null);

export const DateProvider = ( { children } ) => {

    class Store {
        static getDateFromStorage() {
            let myDate;
            if (localStorage.getItem('myDate') === null) {
                myDate =  {
                    daily       : new Date(),
                    yearSum     : new Date(),
                    davisStat   : new Date(),
                    oldStation  : new Date(2012,1,1)
                }
            } else {
                const { daily, yearSum, davisStat, oldStation } = JSON.parse(localStorage.getItem('myDate'));
                myDate =  {
                    daily       : new Date(daily),
                    yearSum     : new Date(yearSum),
                    davisStat   : new Date(davisStat),
                    oldStation  : new Date(oldStation)
                }
            }
            return myDate;
        } 
    }

    const reducerFunc = (oldDate, action) => {
        switch(action.type) {
            case 'UPDATE_DATE':
                const newDate = {
                    ...oldDate,
                    [action.payload.param] : action.payload.value 
                };
                localStorage.setItem('myDate', JSON.stringify( newDate ));
                return newDate
            default:
                return oldDate;
        }
    }
    const [ date, dispatch ] = useReducer( reducerFunc, Store.getDateFromStorage() );

    const globalDate = ( param, value ) => dispatch( {
                type: 'UPDATE_DATE',
                payload : { param, value }
            })
    
    return (
        <DateContext.Provider value = { { date, globalDate } }>
            { children }
        </DateContext.Provider>
    );
}