import React, { useContext } from 'react';
import { DateContext } from './DateContext';
import { ChangeDate } from './ChangeDate';

export const ShowYearGraph = () => {

    const { date: { yearSum }, reduceDate } = useContext(DateContext);

    const year = yearSum.getFullYear();

    return (
        <>
            <header className="header">
                Roční graf - vyberte rok :&nbsp;
                <button onClick={() => reduceDate('yearSum', ChangeDate('yearSum', yearSum, 'year', -1))} > &nbsp; {'<'} &nbsp; </button>&nbsp;
                {year}&nbsp;
                <button onClick={() => reduceDate('yearSum', ChangeDate('yearSum', yearSum, 'year', +1))} > &nbsp; {'>'} &nbsp; </button>
            </header>
            <article>
                <img alt="voda" src={`./../../../rekreace/graphs/graph_voda_${year}.gif`} />
                <img alt="hladina" src={`./../../../rekreace/graphs/graph_hladina_${year}.gif`} />
                <img alt="odtok" src={`./../../../rekreace/graphs/graph_odtok_${year}.gif`} />
                <img alt="pritok" src={`./../../../rekreace/graphs/graph_pritok_${year}.gif`} />
                <img alt="vzduch" src={`./../../../rekreace/graphs/graph_vzduch_${year}.gif`} />
            </article>
        </>
    )
}