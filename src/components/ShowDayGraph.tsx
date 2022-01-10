import React, { useContext } from 'react';
import { DateContext }       from './DateContext';
import ShowDayGraphStyle from './../css/ShowDayGraph.module.scss'
import { ChangeDate }        from './ChangeDate';
import { commonPath } from '../api/apiPath'

export const ShowDayGraph = () => {

    const { date : { daily }, reduceDate  } = useContext(DateContext);

    const year  = daily.getFullYear();
    let month = daily.getMonth() + 1;
    let day = daily.getDate();

    const monthString = month < 10 ? `0${month}` : `${month}`;
    const dayString = day < 10 ? `0${day}` : `${day}`;

    const imgUrl = ( type: string ) => `${commonPath}/davis/archive/${year}/${type}-${year}-${monthString}-${dayString}.gif`;
    const imgBig = `${commonPath}/rekreace/aktuality_big_graph.php?width_graph=1480&year=${year}&id=${year}-${monthString}-${dayString}`;

    const setDate = ( period: string, step: 1 | -1 ) => {
        reduceDate('daily', ChangeDate('daily', daily, period, step) )
    }

    return (
        <>
            <header id="detail_graphs" className="header">
                Den . měsíc . rok :
                <button onClick={ () => setDate( 'day', -1) } >  {'<'}  </button>
                { dayString }
                <button onClick={ () => setDate( 'day', +1) } >  {'>'}  </button>  
                .
                <button onClick={ () => setDate( 'month', -1) } >  {'<'}  </button>
                { monthString }
                <button onClick={ () => setDate( 'month', +1) } >  {'>'}  </button>  
                .
                <button onClick ={ () => setDate( 'year', -1) } >  {'<'}  </button>
                { year }
                <button onClick ={ () => setDate( 'year', +1) } >  {'>'}  </button>  
            </header>
            <article className={ ShowDayGraphStyle.dayGraph }>
                <a href={ imgBig }><img alt="wind" src={ imgUrl('wind') } /></a>
                <a href={ imgBig }><img alt="temp" src={ imgUrl('temp') } /></a>
                <a href={ imgBig }><img alt="bar"  src={ imgUrl('bar')  } /></a>
            </article>
        </>
    )
}