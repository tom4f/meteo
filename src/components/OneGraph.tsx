import { useRef, useEffect } from 'react';
import Draw from './Draw1';
import oneGraphStyles from './../css/OneGraph.module.scss'
import { OneGraphType, showGraphType } from './TypeDefinition';

export const OneGraph = ({ graphData }: OneGraphType) => {

    const graphHeight = 300;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvas_pointerRef = useRef<HTMLCanvasElement | null>(null);
    const loadPocasiAsync = () => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const canvas_pointer = canvas_pointerRef.current as HTMLCanvasElement;
        const newDraw = new Draw(canvas, canvas_pointer, graphData);
        const showGraph: showGraphType = (canvas, canvas_pointer, graphHeight) => {
            const clientWidth = document.documentElement.clientWidth;
            //const clientHeight = document.documentElement.clientHeight;
            canvas.width = clientWidth > 724 ? 724 : clientWidth;;
            canvas.height = graphHeight;
            canvas_pointer.width = clientWidth > 724 ? 724 : clientWidth;;
            canvas_pointer.height = graphHeight;
            newDraw.graph();
        }
        canvas && canvas_pointer && showGraph(canvas, canvas_pointer, graphHeight)
        window.addEventListener('resize', () =>
            canvas && canvas_pointer && showGraph(canvas, canvas_pointer, graphHeight)
        )
    }
    useEffect(loadPocasiAsync, [graphData]);
    return (
        <article className={oneGraphStyles.allGraphs} >
            <canvas ref={canvasRef} className={oneGraphStyles.canvas} />
            <canvas ref={canvas_pointerRef} className={oneGraphStyles.canvas_pointer} />
        </article>
    )
}