import {useState, useEffect, useContext, useRef} from 'react';
import { DateContext } from './DateContext';
import { apiPath } from '../api/apiPath'
import TableStyle from './../css/Table.module.scss'
import { davisType } from './TypeDefinition';

export const ShowDayTable = () => {

    const { reduceDate } = useContext(DateContext);

    const reduceDateRef = useRef( reduceDate )

    const [ start  , setStart   ] = useState(0);
    const [ orderBy, setOrderBy ] = useState(
        {
            value : 'date',
            order : 'DESC'
        }
    );

    const limit = 30;

    const [ davis, setDavis ] = useState<davisType[]>();

    useEffect( () => {
        const loadDavis = (start: number, orderBy: { value: string, order: string }) => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', `${apiPath}/pdo_read_davis.php`, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const pdoResp = JSON.parse(xhr.responseText);
                    if ( pdoResp.length ) {
                        setDavis(pdoResp);
                        const [ year, month, day ] = pdoResp[0].date.split('-');
                        const clickedDate = new Date( +year, +month - 1, +day );
                        reduceDateRef.current('daily', clickedDate )
                    }
                }
            }
            xhr.onerror = () => console.log("** An error occurred during the transaction");
            xhr.send(JSON.stringify(
                { 
                    'start' : start,
                    'limit' : limit,
                    'orderBy' : orderBy.value,
                    'sort' : orderBy.order
                }
            ));
        }
        
        loadDavis(start, orderBy)
    
    }, [ start, orderBy] );


    const rgbCss = (r: number, g: number, b: number, value:number) => ({ background: `rgba(${r}, ${g}, ${b}, ${value})` });  
    const rgbCssT = (value: number) => { 
        return value > 0
            ? { background: `rgba(255, 0, 0, ${ value/35})` }
            : { background: `rgba(0, 0, 255, ${-value/25})` }
    };

    const setDay = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
        const clickedText = (e.target as HTMLTableCellElement).innerText;
        const [ year, month, day ] = clickedText.split('-');
        const clickedDate = new Date( +year, +month - 1, +day );
        reduceDate('daily', clickedDate );
        // go to graph location
        window.location.href = '#detail_graphs';
    }

    const printDavis = () => {
        const output: JSX.Element[] = [];
        if (davis !== undefined) davis.forEach( (one, index) => {
            one && output.push( 
                <tr key={index}>
                     <td className={ TableStyle.link } onClick={ (e) => setDay(e) }>{one.date}</td> 
                    {/*<td className="link" >{one.date}</td>*/}
        
                    <td style={ rgbCss(0, 255, 0, one.wind3                 /1285 ) }>{one.wind3}</td>
                    <td style={ rgbCss(0, 255, 0, one.wind6                 /500  ) }>{one.wind6}</td>
                    <td style={ rgbCss(0, 255, 0, one.wind9                 /100  ) }>{one.wind9}</td>
                    <td style={ rgbCss(0, 255, 0, one.wind_speed_avg        /10   ) }>{one.wind_speed_avg}</td>
                    <td style={ rgbCss(0, 255, 0, one.wind_speed_high       /30   ) }>{one.wind_speed_high}</td>
                    <td>{one.dir}</td>

                    <td style={ rgbCssT(one.temp_low) } >{one.temp_low}</td>
                    <td style={ rgbCssT(one.temp_mean) }>{one.temp_mean}</td>
                    <td style={ rgbCssT(one.temp_high) }>{one.temp_high}</td>

                    <td style={ rgbCss(255, 0, 255, one.rain                /30  ) }>{one.rain}</td>
                    <td style={ rgbCss(255, 0, 255, one.rain_rate_max       /50  ) }>{one.rain_rate_max}</td>

                    <td style={ rgbCss(255, 127, 0, 1 - (1050 - one.bar_min)/40 ) }>{one.bar_min}</td>
                    <td style={ rgbCss(255, 127, 0, 1 - (1050 - one.bar_avg)/40 ) }>{one.bar_avg}</td>
                    <td style={ rgbCss(255, 127, 0, 1 - (1050 - one.bar_max)/40 ) }>{one.bar_max}</td>

                    <td style={ rgbCss(0, 127, 127, (100 - one.huminidy_min)/150 ) }>{one.huminidy_min}</td>
                    <td style={ rgbCss(0, 127, 127, (100 - one.huminidy_avg)/150 ) }>{one.huminidy_avg}</td>
                    <td style={ rgbCss(0, 127, 127, (100 - one.huminidy_max)/150 ) }>{one.huminidy_max}</td>
                </tr>
            )
        });
        return output;
    }

    const sort = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const clickedName = (e.target as HTMLButtonElement ).id;
        setOrderBy({
            value : clickedName,
            order : orderBy.order === 'DESC' ? 'ASC' : 'DESC'
        })
    }

    return (
        <>  
            <header className="header" >
                Historie :  
                <button onClick={ () => davis?.length === limit ? setStart( start + limit ) : null } >{'<'}</button>
                 {start} 
                <button onClick={ () => start - limit >= 0 ? setStart( start - limit ) : null } >{'>'}</button>
                 dní
            </header>
                <section className={ TableStyle.davisTable }>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th colSpan={6}>vítr</th>
                                <th colSpan={3}>teplota vzduchu</th>
                                <th colSpan={2}>srážky</th>
                                <th colSpan={3}>tlak vzduchu</th>
                                <th colSpan={3}>vlhkost vzduchu</th>
                            </tr>
                            <tr>
                                <th><button id="date" onClick={ (e) => sort(e) } >datum</button></th>
                                <th><button id="wind3" onClick={ (e) => sort(e) } >&gt;3<sub id="wind3">m/s</sub></button></th>
                                <th><button id="wind6" onClick={ (e) => sort(e) } >&gt;6<sub id="wind6">m/s</sub></button></th>
                                <th><button id="wind9" onClick={ (e) => sort(e) } >&gt;9<sub id="wind9">m/s</sub></button></th>
                                <th><button id="wind_speed_avg" onClick={ (e) => sort(e) } >prů</button></th>
                                <th><button id="wind_speed_high" onClick={ (e) => sort(e) } >max</button></th>
                                <th><button id="dir" onClick={ (e) => sort(e) } >směr</button></th>
                                
                                <th><button id="temp_low" onClick={ (e) => sort(e) } >min</button></th>
                                <th><button id="temp_mean" onClick={ (e) => sort(e) } >prů</button></th>
                                <th><button id="temp_high" onClick={ (e) => sort(e) } >max</button></th>
                                
                                <th><button id="rain" onClick={ (e) => sort(e) } >celk</button></th>
                                <th><button id="rain_rate_max" onClick={ (e) => sort(e) } >int</button></th>

                                <th><button id="bar_min" onClick={ (e) => sort(e) } >min</button></th>
                                <th><button id="bar_avg" onClick={ (e) => sort(e) } >prů</button></th>
                                <th><button id="bar_max" onClick={ (e) => sort(e) } >max</button></th>

                                <th><button id="huminidy_min" onClick={ (e) => sort(e) } >min</button></th>
                                <th><button id="huminidy_avg" onClick={ (e) => sort(e) } >prů</button></th>
                                <th><button id="huminidy_max" onClick={ (e) => sort(e) } >max</button></th>
                            </tr>
                            <tr>
                                <th>graf</th>
                                <th>min</th>
                                <th>min</th>
                                <th>min</th>
                                <th>m/s</th>
                                <th>m/s</th>
                                <th>-</th>
                                <th>&deg;C</th>
                                <th>&deg;C</th>
                                <th>&deg;C</th>
                                
                                <th>mm</th>
                                <th>/h</th>

                                <th>hPa</th>
                                <th>hPa</th>
                                <th>hPa</th>

                                <th>%</th>
                                <th>%</th>
                                <th>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {printDavis()}
                        </tbody>
                    </table>
                </section>
        </>
    )
}