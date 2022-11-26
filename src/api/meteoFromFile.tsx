import { commonPathMeteoFromFile } from './apiPath'
import { loadDataFunctionType, pureData } from '../components/TypeDefinition'

export const loadPocasiAsync: loadDataFunctionType = async (start, end, index, graphsConfig) => {

    try {

        // get meteodata array for one file
        const loadOneFile = async (txtFile: string) => {
            const response = await fetch(txtFile)
            // this response check not works if .httaccess show default html page instead text file
            if (response.status !== 200) return []
            const text = await response.text()
            // lines to array
            const arr = text.trim().split('\n')
            // remove first 3 lines
            arr.shift()
            arr.shift()
            arr.shift()
            // return empty arr if not valid text file - return (-1) = FALSE
            return !arr[0].search(/..\...\.......:../) ? arr : []
        }



        // create filePaths array with correct days order
        let meteoFiles: string[] = [];
        const dayOfWeekNow = new Date().getUTCDay();
        for (let day = dayOfWeekNow + 1; day < dayOfWeekNow + 6; day++) {
            const correctedDay = day > 6 ? day - 7 : day;
            const meteoFile = `${commonPathMeteoFromFile}/davis/archive/downld02-${correctedDay}.txt`;
            meteoFiles = [...meteoFiles, meteoFile];
        }
        meteoFiles = [...meteoFiles, `${commonPathMeteoFromFile}/davis/downld02.txt`];



        // create meteo array for all 7 days
        let mergedArr: string[] = [];
        const myPromises = meteoFiles.map(filePath => loadOneFile(filePath))
        await Promise.all(myPromises)
            .then(responses => responses.forEach(
                response => mergedArr = [...mergedArr, ...response]
            ))


        // in react folder: /public/davis/downld02.txt

        // create array of meteo data array
        // one or more spaces for split
        //const arrOfArr = arr.map( line => line.split(/  +/g) )

        const dirObj: { [key: string]: number } = {
            '---': 16,
            'NNW': 15,
            'NW': 14,
            'WNW': 13,
            'W': 12,
            'WSW': 11,
            'SW': 10,
            'SSW': 9,
            'S': 8,
            'SSE': 7,
            'SE': 6,
            'ESE': 5,
            'E': 4,
            'ENE': 3,
            'NE': 2,
            'NNE': 1,
            'N': 0
        }

        const arrOfObj = mergedArr.reduce((accumulator: Array<pureData>, line, index) => {

            const arrFromLine = line.trim().split(/ +/g);

            const names = ['OrigDate', 'Time', 'TempOut', 'TempHi', 'TempLow', 'HumOut', 'DewPt', 'WindSpeed', 'WindDir', 'WindRun', 'HiSpeed', 'HiDir', 'WindChill', 'HeatIndex', 'THWIndex', 'Bar', 'Rain', 'RainRate', 'HeatDD', 'CoolDD', 'TempIn', 'HumIn', 'DewIn', 'HeatIn', 'EMCIn', 'AirDensityIn', 'WindSamp', 'WindTx', 'ISSRecept', 'ArcInt'];

            const objFromLine: { [key: string]: string | number } = arrFromLine.reduce((accObj, value, index) => ({ ...accObj, [names[index]]: value }), {})

            const [OrigDate, Time] = arrFromLine;

            // UTC used to disable time offset effect
            const [day, month, year] = OrigDate.split('.');
            const [hour, minute] = Time.split(':');
            const dateString = new Date(Date.UTC(2000 + (+year), (+month) - 1, +day, +hour, +minute)).toJSON();
            objFromLine.Date = dateString;
            // Wind dir - degrees from string
            objFromLine.WindDir = 22.5 * dirObj[objFromLine.WindDir];

            // tricky index is from 1
            // skip duplicated entries when merging more text files ( optional? )
            const result = index > 0 && objFromLine.Date < accumulator[accumulator.length - 1].Date
                ? accumulator
                : [...accumulator, objFromLine];

            return result
        }, [])

        if (arrOfObj.length === 0) return graphsConfig;

        const graphsData = ([{ ...graphsConfig[0], data: arrOfObj }])

        return graphsData

    }
    catch (err) {
        console.log(err)
        return graphsConfig;
    }

}
