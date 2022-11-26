import { oneGraphDataType, pureData, specificType, isAllDownloaded, loadDataFunctionCustomType, graphDataType } from "./TypeDefinition";

export default class Draw implements isAllDownloaded {

    dataOrig: pureData[]
    dataReduced: pureData[]
    dateField: string
    isAllDownloaded: boolean
    loadPocasi: loadDataFunctionCustomType | undefined
    graphsConfig: specificType[]
    isAllDownloadedForOneGraph: boolean
    private ctx: CanvasRenderingContext2D
    private ctx_pointer: CanvasRenderingContext2D
    graphSpaceLeft: number
    graphSpaceBtn: number
    clientWidth: number
    clientHeight: number
    timer = setInterval(() => null, 10000)
    delay = 200
    reducerStep: number
    xForInfo: number
    yForInfo: number
    refresh: () => void

    color = 'white'
    header = ''
    group = 1
    type = ''
    style = 'line'
    lineStyle: number[] = []

    lineWidth = 1
    graphSelect = (graphNumber: number) => { }

    max = 0
    min = 0
    yLimit = 0
    maxSecond = 0
    minSecond = 0
    yLimitSecond = 0

    start = '01-01-2000'
    end = '31-12-3000'
    xLimit = 0

    constructor(
        private canvas: HTMLCanvasElement,
        private canvas_pointer: HTMLCanvasElement,
        private graphData: oneGraphDataType
    ) {
        this.canvas = canvas;
        this.canvas_pointer = canvas_pointer;
        this.graphData = graphData

        this.dataOrig = graphData.data;
        this.dateField = graphData.common.dateField;
        this.isAllDownloaded = graphData.common.isAllDownloaded;
        this.loadPocasi = graphData.common.loadDataFunction;
        this.graphsConfig = graphData.specific;

        // status if all available data for specific graph was already downloaded
        this.isAllDownloadedForOneGraph = false;
        // date identificator in DB object

        this.ctx = canvas.getContext('2d')!;
        this.ctx_pointer = canvas_pointer.getContext('2d')!;
        // array of data object
        //this.dataOrig    = this.pdoResp;

        // how many lines to draw
        this.dataReduced = this.dataOrig;


        this.graphSpaceLeft = 50;
        this.graphSpaceBtn = 50;

        this.clientWidth = canvas.clientWidth;
        this.clientHeight = canvas.clientHeight;

        // 1 month default step
        this.reducerStep = 1;


        canvas_pointer.addEventListener('mousemove', (event) => this.getInfo(event.offsetX, event.offsetY));
        canvas_pointer.addEventListener('click', (event) => this.button.click(event));
        canvas_pointer.addEventListener('mousedown', (event) => this.dynamicInterval(event));
        canvas_pointer.addEventListener('mouseup', () => {
            this.reducerStep = 1;
            clearInterval(this.timer);
        });
        // for touch devicess (tablet)
        canvas_pointer.addEventListener('touchstart', (event) => this.dynamicInterval(event), { passive: false });
        canvas_pointer.addEventListener('touchend', () => {
            this.reducerStep = 1;
            clearInterval(this.timer);
        });

        // initial info position
        this.xForInfo = this.clientWidth - this.graphSpaceLeft;
        this.yForInfo = this.clientHeight - this.graphSpaceBtn;

        // also for refresh:
        this.refresh = () => {

            this.start = this.dataReduced[0][this.dateField] as string;
            this.end = this.dataReduced[this.dataReduced.length - 1][this.dateField] as string;
            this.xLimit = this.lastDayNumber() - this.firstDayNumber();

            const graphArray = (selectGroup: number) => {
                const myArray: number[] = [];

                this.dataReduced.forEach(pureData => {

                    for (let graphNumber = 0; graphNumber < this.graphsConfig.length; graphNumber++) {
                        const source = this.graphsConfig[graphNumber].sourceField;

                        if (this.graphsConfig[graphNumber].group === selectGroup) {
                            if (isNaN(pureData[source] as number)) {
                                return null
                            } else {
                                myArray.push(pureData[source] as number)
                            }
                        }
                    }

                });

                return myArray
            }

            // for multiple graph - different Y
            this.max = Math.max(...graphArray(1));
            this.min = Math.min(...graphArray(1));
            this.yLimit = this.max - this.min;

            this.maxSecond = Math.max(...graphArray(2));
            this.minSecond = Math.min(...graphArray(2));
            this.yLimitSecond = this.maxSecond - this.minSecond;

        }

        this.refresh();
    }


    private dynamicInterval = (event: MouseEvent | TouchEvent) => {

        const resetInterval = () => {
            if (this.reducerStep < 730) {
                this.reducerStep *= 2
            } else {
                return null
            }
            this.button.click(event);
        }
        this.timer = setInterval(() => resetInterval(), this.delay);
    }

    // like const???
    get MILISECONDS_FOR_ONE_DAY() { return 1000 * 60 * 60 * 24 };
    //get MILISECONDS_FOR_ONE_DAY() { return 1000 * 60 };

    // button method
    get button() {

        const btnWidth = 35;
        const btnHeight = 35;
        // X position of button
        const btnX = {
            startPrev: 0,
            startNext: btnWidth + 2,
            endPrev: this.clientWidth - 2 * btnWidth - 2,
            endNext: this.clientWidth - btnWidth
        };
        // create button
        const dispBtn = (posX: number, char: string, opacity: number) => {
            // show background
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
            this.ctx.clearRect(posX, 0, btnWidth, btnHeight);
            this.ctx.fillRect(posX, 0, btnWidth, btnHeight);
            // show text
            this.ctx.font = '30px Arial';
            this.ctx.fillStyle = 'white';
            this.ctx.textBaseline = 'middle';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(char, posX + btnWidth / 2, btnHeight / 2);
        }
        // show all buttons
        const show = () => {
            dispBtn(btnX.startPrev, '<', 0.5);
            dispBtn(btnX.startNext, '>', 0.5);
            dispBtn(btnX.endPrev, '<', 0.5);
            dispBtn(btnX.endNext, '>', 0.5);
        }


        const isXinButton = (x: number) => {
            return {
                startPrev: x >= btnX.startPrev && x <= btnX.startPrev + btnWidth,
                startNext: x >= btnX.startNext && x <= btnX.startNext + btnWidth,
                endPrev: x >= btnX.endPrev && x <= btnX.endPrev + btnWidth,
                endNext: x >= btnX.endNext && x <= btnX.endNext + btnWidth
            }
        }

        // click on button detection
        const click = (event: MouseEvent | TouchEvent) => {

            const evenRetyped = event as any

            const x = evenRetyped.offsetX || evenRetyped.layerX;
            const y = evenRetyped.offsetY || evenRetyped.layerY;
            if (y >= 0 && y <= btnHeight) {
                const { startPrev, startNext, endPrev, endNext } = isXinButton(x);
                // decrease month
                if (startPrev) { this.updateGraph('start', - this.reducerStep); dispBtn(btnX.startPrev, '<', 0.9); }
                if (startNext) { this.updateGraph('start', + this.reducerStep); dispBtn(btnX.startNext, '>', 0.9); }
                // add month
                if (endPrev) { this.updateGraph('end', - this.reducerStep); dispBtn(btnX.endPrev, '<', 0.9); }
                if (endNext) { this.updateGraph('end', + this.reducerStep); dispBtn(btnX.endNext, '>', 0.9); }
            }
        }
        // handle mousemove event over button
        const hover = (x: number, y: number) => {
            // if mouseover is inside button
            if (y >= 0 && y <= btnHeight) {

                const { startPrev, startNext, endPrev, endNext } = isXinButton(x);

                startPrev || startNext || endPrev || endNext ? this.canvas_pointer.classList.add('pointerOnGrab')
                    : this.canvas_pointer.classList.remove('pointerOnGrab');
                startPrev ? dispBtn(btnX.startPrev, '<', 0.9) : dispBtn(btnX.startPrev, '<', 0.5);
                startNext ? dispBtn(btnX.startNext, '>', 0.9) : dispBtn(btnX.startNext, '>', 0.5);
                endPrev ? dispBtn(btnX.endPrev, '<', 0.9) : dispBtn(btnX.endPrev, '<', 0.5);
                endNext ? dispBtn(btnX.endNext, '>', 0.9) : dispBtn(btnX.endNext, '>', 0.5);

                return null
            }

            const isXinGraph = (x >= this.graphSpaceLeft && x <= this.clientWidth - this.graphSpaceLeft)
                && (y >= this.graphSpaceBtn && y <= this.clientHeight - this.graphSpaceBtn);

            if (isXinGraph) return null

            // remove onGrab pointer outside button & graph
            this.canvas_pointer.classList.remove('pointerOnGrab');
            // decrease opacity of button outside button & graph
            dispBtn(btnX.startPrev, '<', 0.5);
            dispBtn(btnX.startNext, '>', 0.5);
            dispBtn(btnX.endPrev, '<', 0.5);
            dispBtn(btnX.endNext, '>', 0.5);

        }

        // return button methods
        return {
            show: show,
            click: click,
            hover: hover
        }
    }

    getTextDateFromNewDate(updDate: Date) {
        //return `${updDate.getFullYear()}-${ ('0' + (updDate.getMonth() + 1)).slice(-2) }-${ ('0' + updDate.getDate()).slice(-2) }`;
        // return `${updDate.getFullYear()}-${ ('0' + (updDate.getMonth() + 1)).slice(-2) }-${ ('0' + updDate.getDate()).slice(-2) }T${ ('0' + updDate.getHours()).slice(-2) }:${ ('0' + updDate.getMinutes()).slice(-2) }Z`;
        //return `${updDate.toISOString().slice(0, 16)}:00.000Z`;
        return `${updDate.toISOString().slice(0, 16)}:00.000Z`;
    }

    dataReducer(startOrEnd: string, move: number) {
        const dateBeforeModification = new Date(startOrEnd === 'start' ? this.start : this.end);
        // change start or end date by +1 year or -1 year
        const updatedDate = new Date(dateBeforeModification.setDate(dateBeforeModification.getDate() + move));
        // get new filtered data array

        const dataReduced = this.dataOrig.filter((value) => {
            const oneDate = new Date(value[this.dateField]);
            if (startOrEnd === 'start') return (oneDate >= updatedDate) && (oneDate <= new Date(this.end));
            if (startOrEnd === 'end') return (oneDate <= updatedDate) && (oneDate >= new Date(this.start));
            return null;
        });



        // check if new array is valid
        if (dataReduced[0] === null || dataReduced[0] === undefined || dataReduced.length < 2) return null;

        return this.dataReduced = dataReduced;
    }

    // download all
    async updateGraph(startOrEnd: string, move: number) {
        // promis AJAX query
        if (this.isAllDownloaded === false && this.loadPocasi) {
            try {
                const dummy = await this.loadPocasi('1999-01-01', '2099-01-01', this.graphData.common.index) as graphDataType[];
                //console.log(dummy)
                this.dataOrig = dummy[0].data
                this.isAllDownloaded = true;
            }
            catch (err) {
                console.log(err)
                return null;
            }
        }
        // 
        if (this.isAllDownloadedForOneGraph === false) {
            //this.dataOrig = this.pdoResp;
            this.isAllDownloadedForOneGraph = true;
        }
        // change start or end date for graph
        this.dataReducer(startOrEnd, move);
        // update variables needed for fresh graph
        this.refresh();
        // show fresh graph
        this.graph();
    }


    getInfo(xPos: number, yPos: number) {

        // get coordinates inside canvas
        // const x = event.offsetX;
        // const y = event.offsetY;

        this.button.hover(xPos, yPos);

        // if mouseover is inside graph
        if ((xPos >= this.graphSpaceLeft && xPos <= this.clientWidth - this.graphSpaceLeft) &&
            (yPos >= this.graphSpaceBtn && yPos <= this.clientHeight - this.graphSpaceBtn)
        ) {

            this.xForInfo = xPos;
            this.yForInfo = yPos;

            // enable cursor
            this.canvas_pointer.classList.add('pointerOn');

            // clear whole canvas
            this.ctx_pointer.clearRect(0, 0, this.clientWidth, this.clientHeight);

            // get date in format 2020-11-06 from event.clientX
            const valueX = (xPos - this.graphSpaceLeft) * this.xLimit / (this.clientWidth - 2 * this.graphSpaceLeft);
            const dayNumberInMs = (this.firstDayNumber() + valueX) * this.MILISECONDS_FOR_ONE_DAY;
            const shortDate = this.getTextDateFromNewDate(new Date(dayNumberInMs));
            const dayText = () => {
                // different x text for day and year graph
                if ((this.dataReduced[0][this.dateField] as string).length === 10) {
                    return shortDate.slice(0, 10)
                } else {
                    const [, month, day] = shortDate.slice(0, 10).split('-')
                    return `${day}.${month}. ${shortDate.slice(11, 16)}`
                }
            }

            // search entry with datum
            const valueY = (this.dataReduced).find(value =>
                [shortDate, shortDate.split('T')[0]].includes(value[this.dateField] as string));

            const showInfo = () => {

                this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)";
                // show line for x
                this.ctx_pointer.beginPath();
                this.ctx_pointer.fillRect(xPos, this.graphSpaceBtn, 1, this.clientHeight - 2 * this.graphSpaceBtn);

                // show background for X text
                this.ctx_pointer.beginPath();
                this.ctx_pointer.fillRect(xPos - 40, this.graphSpaceBtn - 20, 80, 20);

                // show X text
                this.ctx_pointer.font = '12px Arial';
                this.ctx_pointer.fillStyle = 'white';
                this.ctx_pointer.textBaseline = 'middle';
                this.ctx_pointer.textAlign = 'center';
                this.ctx_pointer.fillText(dayText(), xPos, this.graphSpaceBtn - 8);

                const infoLeftY = (type: string, yValue: number) => {
                    this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)";
                    // show line for y
                    this.ctx_pointer.beginPath();
                    this.ctx_pointer.fillRect(this.graphSpaceLeft, yValue, xPos - this.graphSpaceLeft, 1);

                    // show background for Y text
                    this.ctx_pointer.beginPath();
                    this.ctx_pointer.fillRect(0, yValue - 10, this.graphSpaceLeft, 20);

                    // show Y text
                    this.ctx_pointer.fillStyle = 'white';
                    this.ctx_pointer.textBaseline = 'middle';
                    this.ctx_pointer.textAlign = 'right';
                    this.ctx_pointer.fillText(` ${valueY && valueY[type]}`, this.graphSpaceLeft, yValue);
                }
                const infoRightY = (type: string, yValue: number) => {
                    this.ctx_pointer.fillStyle = "rgba(255, 0, 0, 0.9)";
                    // show line for y second
                    this.ctx_pointer.beginPath();
                    this.ctx_pointer.fillRect(xPos, yValue, this.clientWidth - this.graphSpaceLeft - xPos, 1);

                    // show background for Y second text
                    this.ctx_pointer.beginPath();
                    this.ctx_pointer.fillRect(this.clientWidth - this.graphSpaceLeft, yValue - 10, this.graphSpaceLeft, 20);

                    // show Y second text
                    this.ctx_pointer.fillStyle = 'white';
                    this.ctx_pointer.textBaseline = 'middle';
                    this.ctx_pointer.textAlign = 'left';
                    this.ctx_pointer.fillText(` ${valueY && valueY[type]}`, this.clientWidth - this.graphSpaceLeft, yValue);
                }
                // calculate y for graph 
                const firstInfoType = this.graphsConfig[0].sourceField;
                const y = this.yPositionFromDate(valueY ? valueY[firstInfoType] as number : 0, this.min, this.max);
                infoLeftY(firstInfoType, y);

                if (this.graphsConfig.length === 1) return null;

                // 2nd graph in canvas
                let ySecond = 0;
                const secondInfoType = this.graphsConfig[1].sourceField;
                const secondGroup = this.graphsConfig[1].group
                if (secondGroup === 1) ySecond = this.yPositionFromDate(valueY ? valueY[secondInfoType] as number : 0, this.min, this.max);
                if (secondGroup === 2) ySecond = this.yPositionFromDate(valueY ? valueY[secondInfoType] as number : 0, this.minSecond, this.maxSecond);
                infoRightY(secondInfoType, ySecond);
            }

            if (!valueY) return null;

            showInfo();

            return null

        }

        // disable cursor
        this.canvas_pointer.classList.remove('pointerOn');

    }

    axesXY(graphNumber: number) {

        //line arround graph
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'grey';
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(this.graphSpaceLeft, this.clientHeight - this.graphSpaceBtn);
        this.ctx.lineTo(this.clientWidth - this.graphSpaceLeft, this.clientHeight - this.graphSpaceBtn);
        this.ctx.lineTo(this.clientWidth - this.graphSpaceLeft, this.graphSpaceBtn);
        this.ctx.lineTo(this.graphSpaceLeft, this.graphSpaceBtn);
        this.ctx.closePath();
        this.ctx.stroke();

        // inner axesX & axesY
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'grey';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([1, 2]);
        for (let number = 10; number >= 0; number--) {
            this.textAndAxesXY(number, graphNumber);
        }
        this.ctx.stroke();

        // show red buttons
        this.button.show();

        // show graph header
        this.textHeader(graphNumber);

        // show year lines
        this.yearLine();
    }

    firstDayNumber() {
        return new Date(this.start).getTime() / this.MILISECONDS_FOR_ONE_DAY
    }

    lastDayNumber() {
        return new Date(this.end).getTime() / this.MILISECONDS_FOR_ONE_DAY
    }

    yearLine() {

        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([1, 0]);

        let firstDate = 0;
        let lastDate = 0;
        let step = 1;
        //let sliceText;
        let lineDate = '';
        let sliceStartStop: number[] = []

        const sliceTextNew = (lineDate: string, sliceStartStop: number[]) => {
            return lineDate.slice(...sliceStartStop)
        }

        // days step
        if ((this.dataReduced[0][this.dateField] as string).length === 24) {
            firstDate = new Date(this.start.slice(0, 10)).getTime();
            lastDate = new Date(this.end.slice(0, 10)).getTime();
            step = this.MILISECONDS_FOR_ONE_DAY;
            sliceStartStop = [-2]
            //sliceText = ( lineDate: string ) => lineDate.slice( -2 );
        }

        // year step
        if ((this.dataReduced[0][this.dateField] as string).length === 10) {
            firstDate = new Date(this.start).getFullYear() + 1;
            lastDate = new Date(this.end).getFullYear();
            step = 1;
            sliceStartStop = [0, 4]
            //sliceText = ( lineDate: string ) => lineDate.slice( 0, 4 );
        }


        for (let lineStep = firstDate; lineStep <= lastDate; lineStep = lineStep + step) {

            // days step
            if ((this.dataReduced[0][this.dateField] as string).length === 24) {
                lineDate = new Date(lineStep).toISOString().slice(0, 10);
            }

            // year step
            if ((this.dataReduced[0][this.dateField] as string).length === 10) {
                lineDate = `${lineStep}-01-01`;
            }

            // line for lineStep
            this.ctx.moveTo(this.xPositionFromDate(lineDate), this.graphSpaceBtn);
            this.ctx.lineTo(this.xPositionFromDate(lineDate), this.clientHeight - this.graphSpaceBtn);
            // text for lineStep
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(`${sliceTextNew(lineDate, sliceStartStop)}`, this.xPositionFromDate(lineDate), this.graphSpaceBtn);
        }
        this.ctx.stroke();
    }

    // calculate day number started from 0
    xValueFromDate(date: string) {
        const myDate = new Date(date);
        // [minutes_test]
        //get MILISECONDS_FOR_ONE_DAY() { return 1000 * 60 * 60 * 24 };
        const dayNumber = myDate.getTime() / (this.MILISECONDS_FOR_ONE_DAY);
        return dayNumber - this.firstDayNumber();
    }

    textHeader(graphNumber: number) {
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = 'top';
        this.ctx.textAlign = 'left';
        if (graphNumber === 0) { this.ctx.fillText(this.header, this.clientWidth / 2, 0) }
        if (graphNumber === 1) { this.ctx.fillText(this.header, this.clientWidth / 2, 20) }
        this.ctx.textAlign = 'right';
        if (graphNumber === 2) { this.ctx.fillText(this.header, this.clientWidth / 2, 0) }
        if (graphNumber === 3) { this.ctx.fillText(this.header, this.clientWidth / 2, 20) }
    }

    // lines + text for axes X, Y
    textAndAxesXY(number: number, graphNumber: number) {

        const Y = this.clientHeight - this.graphSpaceBtn - (this.clientHeight - 2 * this.graphSpaceBtn) * number / 10;
        const X = this.clientWidth - this.graphSpaceLeft - (this.clientWidth - 2 * this.graphSpaceLeft) * number / 10;
        // axes X 
        this.ctx.moveTo(this.graphSpaceLeft, Y);
        this.ctx.lineTo(this.clientWidth - this.graphSpaceLeft, Y);
        // axes Y
        this.ctx.moveTo(X, this.graphSpaceBtn);
        this.ctx.lineTo(X, this.clientHeight - this.graphSpaceBtn);

        const miliSec = (this.MILISECONDS_FOR_ONE_DAY) * (this.firstDayNumber() + this.xLimit * (10 - number) / 10);
        const dateX = new Date(miliSec);
        //const year = '' + dateX.getFullYear();
        const month = 1 + dateX.getUTCMonth();
        const day = dateX.getUTCDate();
        const hour = dateX.getUTCHours();
        const minutes = dateX.getUTCMinutes();

        // text for axes X
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.save();
        this.ctx.translate(X, this.clientHeight - this.graphSpaceBtn);
        this.ctx.rotate(- Math.PI / 4);
        this.ctx.textBaseline = 'hanging';
        this.ctx.textAlign = 'right';
        // different x text length for day and year graph
        if ((this.dataReduced[0][this.dateField] as string).length === 10) {
            this.ctx.fillText(`${day}.${month}.`, 0, 0);
        } else {
            this.ctx.fillText(`${('0' + hour).slice(-2)}:${('0' + minutes).slice(-2)}`, 0, 0);
        }

        this.ctx.restore();

        // text for axes Y
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = 'middle';

        let yValue = (this.min + (this.yLimit) * number / 10);

        if (this.group === 2) {
            yValue = (this.minSecond + (this.yLimitSecond) * number / 10);
        }

        let yValueRound = yValue > 100 ? yValue.toFixed(0) : yValue.toFixed(1)

        if (graphNumber === 0) {
            this.ctx.textAlign = 'right'
            this.ctx.fillText(` ${yValueRound} `, this.graphSpaceLeft, Y);
        }

        if (graphNumber === 1) {
            this.ctx.textAlign = 'left';
            this.ctx.fillText(` ${yValueRound} `, this.clientWidth - this.graphSpaceLeft, Y);
        }
    }


    xPositionFromDate(date: string) {
        return this.graphSpaceLeft + this.xValueFromDate(date) * (this.clientWidth - 2 * this.graphSpaceLeft) / this.xLimit
    }

    yPositionFromDate(value: number, min: number, max: number) {
        return this.graphSpaceBtn + (max - value) * (this.clientHeight - 2 * this.graphSpaceBtn) / (max - min)
    }

    graph = () => {

        this.clientWidth = this.canvas.clientWidth;
        this.clientHeight = this.canvas.clientHeight;
        // clear canvas
        this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);

        this.graphSelect = (graphNumber: number) => {

            const { sourceField, color, style, width, header, group, lineStyle } = this.graphsConfig[graphNumber];
            this.type = sourceField
            this.color = color
            this.style = style
            this.lineWidth = width
            this.header = header
            this.group = group
            this.lineStyle = lineStyle
        }

        // show all graphs
        for (let graphNumber = 0; graphNumber < this.graphsConfig.length; graphNumber++) {

            this.graphSelect(graphNumber);

            // show axess
            this.axesXY(graphNumber);

            // values to graph
            this.ctx.beginPath();
            this.ctx.setLineDash(this.lineStyle);
            this.ctx.strokeStyle = this.color;
            this.ctx.fillStyle = this.color;

            // minutes step
            let minutesInOneDay = 1;
            if ((this.dataReduced[0][this.dateField] as string).length === 24) minutesInOneDay = 24 * 60;

            // automatic lineWidth for 'area' type
            if (this.style === 'area') {
                const widthOfOneValue = (this.clientWidth - 2 * this.graphSpaceLeft) / (this.xLimit * minutesInOneDay);
                if (widthOfOneValue > 3) {
                    this.ctx.lineWidth = widthOfOneValue - 1
                } else {
                    this.ctx.lineWidth = widthOfOneValue < 1 ? 1 : widthOfOneValue;
                }
            } else {
                this.ctx.lineWidth = this.lineWidth;
            }

            let min = this.min;
            let max = this.max;

            if (this.graphsConfig.length > 1) {
                if (this.group === 2) {
                    min = this.minSecond;
                    max = this.maxSecond;
                }
            }

            const line = (oneEntry: pureData) => {

                // do not show direction if no wind
                if (this.graphsConfig[graphNumber].sourceField === 'WindDir' && oneEntry[this.graphsConfig[graphNumber].sourceField] === 360) return null;

                // for graph type = area
                if (this.style === 'dot') {

                    //this.ctx.beginPath();
                    this.ctx.moveTo(
                        this.xPositionFromDate(oneEntry[this.dateField] as string) + this.lineWidth,
                        - this.lineWidth / 2 + this.yPositionFromDate(oneEntry[this.graphsConfig[graphNumber].sourceField] as number, min, max)
                    )
                    this.ctx.arc(
                        this.xPositionFromDate(oneEntry[this.dateField] as string),
                        - this.lineWidth / 2 + this.yPositionFromDate(oneEntry[this.graphsConfig[graphNumber].sourceField] as number, min, max),
                        this.lineWidth,
                        0, 2 * Math.PI
                    )
                }

                if (this.style === 'area') {
                    this.ctx.moveTo(this.ctx.lineWidth / 2 + this.xPositionFromDate(oneEntry[this.dateField] as string),
                        this.clientHeight - this.graphSpaceBtn);

                    this.ctx.lineTo(this.ctx.lineWidth / 2 + this.xPositionFromDate(oneEntry[this.dateField] as string),
                        this.yPositionFromDate(oneEntry[this.graphsConfig[graphNumber].sourceField] as number, min, max));
                }

                if (this.style === 'line') {
                    this.ctx.lineTo(this.xPositionFromDate(oneEntry[this.dateField] as string),
                        this.yPositionFromDate(oneEntry[this.graphsConfig[graphNumber].sourceField] as number, min, max));
                }
            }

            this.dataReduced.forEach(oneEntry => line(oneEntry));

            //this.ctx.closePath();
            this.ctx.stroke();

        }
        // get data from graph
        this.getInfo(this.xForInfo, this.yForInfo);

    }
}