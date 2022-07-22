import React, { useEffect, useRef, useState } from "react";
import { ballMovement } from "./ballMovement";
import './game.css';
import data from './data';
import wallCollision from "./wallCollision";
import paddle from "./paddle";
import io, { Socket } from 'socket.io-client';

let {ballObj, paddleProps} = data;
const socket = io('http://localhost:3001');

function Game () {    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    
    useEffect(() => {
        const renderCanvas = () => {
            const gameCanvas = canvasRef.current;
            const ctx = gameCanvas?.getContext('2d');
            //ctx?.clearRect(0, 0, gameCanvas!.width, gameCanvas!.height);
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
            pdd.src = paddleProps.colour;
            paddle(ctx, paddleC, paddleProps);

        }
       
       
        const render = () => {
            renderCanvas();
            renderBall();
            renderPaddle();
            requestAnimationFrame(render);
        };
        
        canvasRef.current?.focus();
        
        

        function multiplayer() {
            socket.emit('update', {x: paddleProps.x, y: paddleProps.y});
        }
        
        render();
        multiplayer();
        
    }, []);
    
    const keyboardevent = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (e.key === "ArrowUp") {
            paddleProps.y -= 50;
        } else if (e.key === "ArrowDown") {
            paddleProps.y += 50;
        }
    }

    return (
        <canvas id="game" ref={canvasRef}
        tabIndex={0}
        onKeyDown={keyboardevent}
        width="800" height="500"></canvas>
        );
}
export default Game;