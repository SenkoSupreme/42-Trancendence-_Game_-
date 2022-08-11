import React, { useEffect, useRef } from "react";
import './game.css';
import io, { Socket } from 'socket.io-client';
import paddle from "./paddle";
import data from "./data";
import { JoinRoom } from "./components/Joinroom";

const socket = io('http://localhost:3001');
let {LeftpaddleProps, RightpaddleProps} = data;

function Game () {    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    
    useEffect(() => {
        
        
        const renderCanvas = () => {
            const canvasBG = canvasRef.current;
            const ctxBG = canvasBG?.getContext('2d');
            const bg = new Image();
            bg.src = 'splash_art01.png';
            bg.onload = function()
            {
                ctxBG?.drawImage(bg, 0, 0, canvasBG!.width, canvasBG!.height);
            }
        }

        const renderPaddle = () => {
            const paddleC = canvasRef.current;
            const ctx = paddleC?.getContext('2d');
            paddle(ctx, paddleC, LeftpaddleProps, 0);
            socket.on('renderNewPaddle', () => 
            {
                paddle(ctx, paddleC, RightpaddleProps, 0);
            });
        }

        const render = () => {
            renderCanvas();
            renderPaddle();
            requestAnimationFrame(render);
        };
        canvasRef.current?.focus();
        render();
        api_updates();
        
    }, []);
    
    
    const keyboardevent = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (e.key === "ArrowUp") {
            LeftpaddleProps.y -= 50;
        } else if (e.key === "ArrowDown") {
            LeftpaddleProps.y += 50;
            }
        }
        function api_updates()
        {
            socket.emit('update',LeftpaddleProps);
        }
    return (
        <>
        <JoinRoom />
            <canvas id="game" ref={canvasRef}
            tabIndex={0}
            onKeyDown={keyboardevent}
            width="1280" height="720"></canvas>
        </>
            );
    }
export default Game;

