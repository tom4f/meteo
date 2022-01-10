import { createContext, useReducer } from 'react';
import { dateType, reducerActionType } from './TypeDefinition';

const defaultDate: dateType = {
    daily       : new Date(),
    yearSum     : new Date(),
    davisStat   : new Date(),
    oldStation  : new Date(2012,1,1)
}

const dummyFunc = (param: string, value: Date) => {}

export const DateContext = createContext( { date: defaultDate, reduceDate: dummyFunc });

export const DateProvider = ( { children }: { children: React.ReactNode } ) => {

    class Store {
        static getDateFromStorage() {
                      
            const localStore = localStorage.getItem('myDate')

            if (localStore !== null) {
                const { daily, yearSum, davisStat, oldStation } = JSON.parse(localStore);
                return  {
                    daily       : new Date(daily),
                    yearSum     : new Date(yearSum),
                    davisStat   : new Date(davisStat),
                    oldStation  : new Date(oldStation)
                }
            }
                        
            return defaultDate;
        } 
    }

    const reducerFunc = (oldDate: dateType, action: reducerActionType) => {
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

    const reduceDate = ( param: string, value: Date ) => dispatch( {
                type: 'UPDATE_DATE',
                payload : { param, value }
            })
    
    return (
        <DateContext.Provider value = { { date, reduceDate } }>
            { children }
        </DateContext.Provider>
    );
}