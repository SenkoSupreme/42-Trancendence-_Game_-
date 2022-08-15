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
    let keypress: boolean = true;
    
    useEffect(() => {
        
        
        let newPlayer: boolean = false;
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
        socket.on('player_update', data => {
            LeftpaddleProps = data;
        })
        socket.on('renderNewPaddle', () => 
        {
            console.log('player2 in');
            newPlayer = true;
        });
        socket.on('PlayerDisconnected', () =>
        {
            console.log('player2 out');
            newPlayer = false;
        });

        console.log(`is New : ${newPlayer}`);
        const renderPaddle = () => {
            const paddleC = canvasRef.current;
            const ctx = paddleC?.getContext('2d');
            paddle(ctx, paddleC, LeftpaddleProps, 0);
            if (newPlayer)
            {
                paddle(ctx, paddleC, RightpaddleProps, 1);
            }
        }
        
        const render = () => {
            renderCanvas();
            renderPaddle();
            if(keypress) {
                api_updates();
            }
            requestAnimationFrame(render);
        };
        canvasRef.current?.focus();
        render();
        
    }, []);
    
    
    const keyboardevent = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (e.key === "ArrowUp") {
            LeftpaddleProps.y -= 50;
            keypress = true;
        } 
        else if (e.key === "ArrowDown") {
            LeftpaddleProps.y += 50;
            keypress = true;
        }
    }
    function api_updates()
    {
        socket.emit('update',LeftpaddleProps);
        keypress = false;
    }
    return (
        <>
        <JoinRoom />
            <canvas id="game" ref={canvasRef}
            tabIndex={0}
            onKeyDown={keyboardevent}
            // onLoad={() => {setNewPlayer(newPlayer + 1)}}
            width="1280" height="720"></canvas>
        </>
            );
    }
export default Game;

