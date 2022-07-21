import React, { useEffect, useRef } from "react";
import { ballMovement } from "./ballMovement";
import './game.css';
import data from './data';
import wallCollision from "./wallCollision";
import paddle from "./paddle";

let {ballObj, paddleProps} = data;
function Game () {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {

       
        const renderCanvas = () => {
            const gameCanvas = canvasRef.current;
            const ctx = gameCanvas?.getContext('2d');
            var image  = new Image();
            image.src = 'splash_art01.png';
            image.onload = function() {
                ctx!.drawImage(image, 0, 0, gameCanvas!.width, gameCanvas!.height);
            }
        };
       
        const renderBall = () => {
            const ball= canvasRef.current;
            const ctx = ball?.getContext('2d');
            ballMovement(ctx, ballObj);
            wallCollision(ballObj, ball);
        };

        const renderPaddle = () => {
            const paddleC = canvasRef.current;
            const ctx = paddleC?.getContext('2d');
            var pdd = new Image();
            pdd.src = paddleProps.image;
            pdd.onload = function(){
                ctx!.drawImage(pdd, 0, 0 ,100, 100);
            }
            paddle(ctx, paddleC, paddleProps);

        }
       
       
        const render = () => {
            renderCanvas();
            renderBall();
            renderPaddle();
            requestAnimationFrame(render);
        };

        render();
    
    }, []);

    return (
        <canvas id="game" ref={canvasRef} width="800" height="500"></canvas>
    );
}
export default Game;