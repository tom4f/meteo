import { useState, useEffect, useContext } from 'react';
import { DateContext } from './DateContext';
import { ChangeDate } from './ChangeDate';
import { commonPathMeteoFromFile } from '../api/apiPath'
import StatisticStyle from './../css/Statistic.module.scss'

export const ShowDayStatistic = () => {

    const { date: { davisStat }, reduceDate } = useContext(DateContext);

    const [davisText, setDavisText] = useState({
        month: '',
        year: ''
    });

    const year = davisStat.getFullYear();
    const month = `0${davisStat.getMonth() + 1}`.slice(-2)

    useEffect(() => {
        const setDavis: () => void = async () => {
            const path = `${commonPathMeteoFromFile}/davis/archive/${year}`
            const urlList = [
                `${path}/NOAAMO-${year}-${month}.TXT`,
                `${path}/NOAAYR-${year}.TXT`
            ]
            const fetchList = urlList.map(url => fetch(url).then(resp => resp.text()))
            const settled = await Promise.allSettled(fetchList)
            const respFulfilled = settled.map(onePromise =>
                onePromise.status === 'fulfilled' ? onePromise.value : ''
            )
            setDavisText({
                month: respFulfilled[0],
                year: respFulfilled[1]
            })
        }
        setDavis()
    }, [year, month]);

    const setDate = (period: string, step: 1 | -1) => {
        reduceDate('davisStat', ChangeDate('davisStat', davisStat, period, step))
    }

    return (
        <>
            <header className="header">
                Rok / měsíc :
                <button onClick={() => setDate('month', -1)} > {'<'} </button>
                {month}
                <button onClick={() => setDate('month', +1)} > {'>'} </button>
                /
                <button onClick={() => setDate('year', -1)} > {'<'} </button>
                {year}
                <button onClick={() => setDate('year', +1)} > {'>'} </button>
            </header>

            <article className={StatisticStyle.davisMonth}>
                <section className={StatisticStyle.myPre}>{davisText.month}</section>
            </article>

            <header className={"header " + StatisticStyle.button}>
                Rok :
                <button onClick={() => setDate('year', -1)} > {'<'} </button>
                {year}
                <button onClick={() => setDate('year', +1)} > {'>'} </button>
            </header>

            <article className={StatisticStyle.davisMonth}>
                <section className={StatisticStyle.myPre}>{davisText.year}</section>
            </article>
        </>
    )
}