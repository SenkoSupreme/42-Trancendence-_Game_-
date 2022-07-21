import React, { useEffect, useRef } from "react";
import './game.css';

function Game () {
    //let x = 0;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {

       
        const renderCanvas = () => {
            const gameCanvas = canvasRef.current;
            const ctx = gameCanvas?.getContext('2d');
            ctx!.fillStyle = "#771d1d";
            ctx!.fillRect(0, 0, gameCanvas!.width, gameCanvas!.height);
        };
       
       
        const renderBall = () => {
            const ball= canvasRef.current;
            const ctx = ball?.getContext('2d');
            ctx!.fillStyle = "white";
            ctx!.beginPath();
            ctx!.arc(100, 100, 10, 0, Math.PI * 2);
            ctx!.strokeStyle = "black";
            ctx!.lineWidth = 2;
            ctx!.fill();
            ctx!.stroke();
            ctx!.closePath();
            //x += 1;
        };
       
       
        const render = () => {
            renderCanvas();
            renderBall();
            requestAnimationFrame(render);
        };

        render();
    
    }, []);

    return (
        <canvas id="game" ref={canvasRef} width="800" height="500"></canvas>
    );
}
export default Game;