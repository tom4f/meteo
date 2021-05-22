import React, { useRef, useEffect, useState } from 'react';
import Draw from './Draw';
import { commonPath } from './apiPath.js'

export const ShowDayGraphCanvasToday = () => {
    
    const [ isGraphLoading, setIsGraphLoading ] = useState( true );

    const graphHeight = 3;
    let pdoResp = [];
    let isAllDownloaded = true;
    const dateStorage = 'Date';

    const canvasRef  = useRef(null);
    const canvas_pointerRef  = useRef(null);
    const canvas1Ref  = useRef(null);
    const canvas1_pointerRef  = useRef(null);
    const canvas2Ref  = useRef(null);
    const canvas2_pointerRef  = useRef(null);
    const canvas3Ref  = useRef(null);
    const canvas3_pointerRef  = useRef(null);

        // start AJAX async
        const loadPocasiAsync = async () => {
            try { 
                //console.time('Start');

                // get meteodata array for one file
                const loadOneFile = async ( txtFile ) => {
                    const response = await fetch( txtFile )
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
                    return !arr[0].search( /..\...\.......:../ ) ? arr : []
                }



                // create filePaths array with correct days order
                let meteoFiles = [];
                const dayOfWeekNow = new Date().getUTCDay();
                for ( let day = dayOfWeekNow + 1; day < dayOfWeekNow + 6; day++ ) {
                    const correctedDay = day > 6 ? day - 7 :  day;
                    const meteoFile = `${commonPath}/davis/archive/downld02-${ correctedDay }.txt`;
                    meteoFiles = [ ...meteoFiles, meteoFile ];
                }
                meteoFiles = [ ...meteoFiles, `${commonPath}/davis/downld02.txt` ];
 


                // create meteo array for all 7 days
                let arr = [];
                const myPromises = meteoFiles.map( filePath => loadOneFile( filePath ) )
                await Promise.all( myPromises )
                    .then( responses => responses.forEach(
                        response => arr = [ ...arr, ...response ]
                    ))
                

                // in react folder: /public/davis/downld02.txt

                // create array of meteo data array
                // one or more spaces for split
                //const arrOfArr = arr.map( line => line.split(/  +/g) )
        
                const dirObj = {
                    '---' : 16,
                    'NNW' : 15,
                    'NW' : 14,
                    'WNW' : 13,
                    'W' : 12,
                    'WSW' : 11,
                    'SW' : 10,
                    'SSW' : 9,
                    'S' : 8,
                    'SSE' : 7,
                    'SE' : 6,
                    'ESE' : 5,
                    'E' : 4,
                    'ENE' : 3,
                    'NE' : 2,
                    'NNE' : 1,
                    'N' : 0
               }
        
                const arrOfObj = arr.reduce( ( accumulator, line, index ) => {
                    
                    const arrFromLine = line.trim().split(/ +/g);
                    
                    const [ myDate, Time, TempOut, TempHi, TempLow, HumOut, DewPt, WindSpeed, WindDir, WindRun, HiSpeed, HiDir, WindChill, HeatIndex, THWIndex, Bar, Rain, RainRate, HeatDD, CoolDD, TempIn, HumIn, DewIn, HeatIn, EMCIn, AirDensityIn, WindSamp, WindTx, ISSRecept, ArcInt
                          ] = arrFromLine;
                    
                    const  objFromLine = {
                        Date: myDate, Time, TempOut: +TempOut, TempHi, TempLow, HumOut, DewPt, WindSpeed, WindDir, WindRun, HiSpeed, HiDir, WindChill, HeatIndex, THWIndex, Bar, Rain, RainRate, HeatDD, CoolDD, TempIn, HumIn, DewIn, HeatIn, EMCIn, AirDensityIn, WindSamp, WindTx, ISSRecept, ArcInt
                    }
        
                    // UTC used to disable time offset effect
                    const [ day, month, year ] = myDate.split('.');
                    const [ hour, minute ] = Time.split(':');
                    const dateString = new Date(Date.UTC( `20${year}`, month - 1, day, hour, minute) ).toJSON();
                    objFromLine.Date    = dateString;
                    // Wind dir - degrees from string
                    objFromLine.WindDir = 22.5 * dirObj[ objFromLine.WindDir ];
            
                    // tricky index is from 1
                    // skip duplicated entries when merging more text files ( optional? )
                    const result = index > 0 && objFromLine.Date < accumulator[ accumulator.length - 1 ].Date
                                 ? accumulator
                                 : [ ...accumulator, objFromLine ];

                    return result
                }, [])


                pdoResp = arrOfObj

       
            }
                catch (err) {
                    console.log(err)
                    return null;
                }

            if (pdoResp.length === 0) return null;

            const canvas = canvasRef.current;
            const canvas_pointer = canvas_pointerRef.current;

            const canvas1 = canvas1Ref.current;
            const canvas1_pointer = canvas1_pointerRef.current;

            const canvas2 = canvas2Ref.current;
            const canvas2_pointer = canvas2_pointerRef.current;

            const canvas3 = canvas3Ref.current;
            const canvas3_pointer = canvas3_pointerRef.current;

            const allCanvasSize = () => {
                const canvasSize = ( can, can_pointer, size ) => {
                    const clientWidth  = document.documentElement.clientWidth;
                    const clientHeight = document.documentElement.clientHeight;
                    can.width  = clientWidth > 724 ? 724 : clientWidth;
                    //can.width  = clientWidth;
                    //can.height = clientHeight / size;
                    can.height = 300;
                    can_pointer.width  = clientWidth;
                    can_pointer.height = clientHeight / size;
                }
            
                canvasSize(canvas , canvas_pointer , graphHeight);
                canvasSize(canvas1, canvas1_pointer, graphHeight);
                canvasSize(canvas2, canvas2_pointer, graphHeight);
                canvasSize(canvas3, canvas3_pointer, graphHeight);
            }

            allCanvasSize();

            const temp     = new Draw(
                [ canvas, canvas_pointer, dateStorage, pdoResp, isAllDownloaded, null]
                , [ 'THWIndex' , 'lime'  , 'line', 1, 'THWIndex [\xB0C]', 1, [] ]
                , [ 'TempOut'  , 'white' , 'line', 1, 'TempOut [\xB0C]' , 1, [] ]
                , [ 'DewPt'  , 'blue' , 'line', 1, 'DewPt [\xB0C]' , 1, [] ]
            ); 
        
            const huminidy     = new Draw(
                [ canvas1, canvas1_pointer, dateStorage, pdoResp, isAllDownloaded, null]
                , [ 'HumOut', 'white', 'line', 1, 'HumOut [%]', 1, [] ]
                , [ 'Bar'   , 'lime' , 'line', 1, 'Bar [hPa]' , 2, [] ]
            ); 
            
            const rain     = new Draw(
                [ canvas2, canvas2_pointer, dateStorage, pdoResp, isAllDownloaded, null]
                , [ 'Rain'    , 'green', 'line', 1, 'Rain [mm]'       , 1, [] ]
                , [ 'RainRate', 'white', 'line', 1, 'RainRate [mm/h]' , 2, [] ]
            ); 
        
            const wind     = new Draw(
                [ canvas3, canvas3_pointer, dateStorage, pdoResp, isAllDownloaded, null]
                , [ 'HiSpeed'  , 'lime', 'area', 1, 'HiSpeed [m/s]'  , 1, [] ]
                , [ 'WindDir'  , 'orange' , 'dot' , 1, 'WindDir [\xB0]' , 2, [] ]
                , [ 'WindSpeed', 'blue', 'area', 1, 'WindSpeed [m/s]', 1, [] ]
                ); 


            temp.graph();
            wind.graph();
            rain.graph();
            huminidy.graph();
            


            
            temp.resizeCanvas();
            wind.resizeCanvas();
            rain.resizeCanvas();
            huminidy.resizeCanvas();

            window.addEventListener('resize', () => {
                // set canvas size
                allCanvasSize();
                // reload graphs
                temp.resizeCanvas();
                wind.resizeCanvas();
                rain.resizeCanvas();
                huminidy.resizeCanvas();
            });

            //console.timeEnd('Start');
            setIsGraphLoading( false );
        }


        const ShowLoading = ( { isGraphLoading } ) => {
            return  isGraphLoading
                ? <div id="isLoading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" overflow="visible" stroke="#FFF" strokeWidth="1">
                        <circle  pathLength="1" cx="50" cy="50" r="40" stroke="#ff0" strokeWidth="20" fill="#ff0" />
                    </svg>
                  </div>
                : null  
        }


    useEffect( () => {
       // load data + show graphs
        loadPocasiAsync();
    }, []);

    return (
            <>
                <header id="detail_graphs" className="header">
                    <a href="https://www.frymburk.com/projects/92_canvas_graph/day.html">
                        Posledních 7 dní - dynamické grafy - na celou obrazovku &nbsp;
                        <i className="fas fa-expand-arrows-alt"></i>
                    </a>
                </header>
               
                <div id="all-graphs">
                    <article id="one-graph" className="one-graph">
                        <ShowLoading isGraphLoading={ isGraphLoading } />
                        <canvas ref={canvasRef} className="canvas" />
                        <canvas ref={canvas_pointerRef} className="canvas_pointer" />
                    </article>
                    <article id="one-graph" className="one-graph">
                        <ShowLoading isGraphLoading={ isGraphLoading } />
                        <canvas ref={canvas1Ref} className="canvas" />
                        <canvas ref={canvas1_pointerRef} className="canvas_pointer" />
                    </article>
                    <article id="one-graph" className="one-graph">
                        <ShowLoading isGraphLoading={ isGraphLoading } />
                        <canvas ref={canvas2Ref} className="canvas"></canvas>
                        <canvas ref={canvas2_pointerRef} className="canvas_pointer"></canvas>
                    </article>
                    <article id="one-graph" className="one-graph">
                        <ShowLoading isGraphLoading={ isGraphLoading } />
                        <canvas ref={canvas3Ref} className="canvas"></canvas>
                        <canvas ref={canvas3_pointerRef} className="canvas_pointer"></canvas>
                    </article>
                </div>
        </>
    )
}