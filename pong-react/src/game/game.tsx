import React, { useEffect, useRef } from "react";
import './game.css';
import io, { Socket } from 'socket.io-client';
import paddle from "./paddle";
import data from "./data";
import { JoinRoom } from "./components/Joinroom";

const socket = io('10.12.10.3:3001'); //update this to mac pubic ip
let {paddleProps} = data;

function Game () {    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let keypress: boolean = true;
    let newPlayer: boolean = false;
    let rightPaddle: any = {};
    let leftPaddle: any = paddleProps;
    let aPaddle: any = {};

    
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
        
        socket.on('Second_Player', data => 
        {
            console.log('player2 in');
            newPlayer = true;
            rightPaddle = data;
            
        });

        socket.on('player1_update', data => {
            leftPaddle = data;
        })
        socket.on('player2_update', data => {
            rightPaddle = data;
        })
        socket.on('PlayerDisconnected', () =>
        {
            console.log('player2 out');
            newPlayer = false;

        });

        console.log(`is New : ${newPlayer}`);
        const renderPaddle = () => {
            const paddleC = canvasRef.current;
            const ctx = paddleC?.getContext('2d');
            paddle(ctx, paddleC, leftPaddle);
            if (newPlayer)
            {
                paddle(ctx, paddleC, rightPaddle);
            }
        }
        
        const render = () => {
            renderCanvas();
            renderPaddle();
            requestAnimationFrame(render);
        };
        canvasRef.current?.focus();
        if(keypress) {
            api_updates();
        }
        render();
        
    }, []);
    
    
    const keyboardevent = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (e.key === "ArrowUp") {
            socket.emit('arrow_keyUP');
            keypress = true;
        } 
        else if (e.key === "ArrowDown") {
            socket.emit('arrow_keyDown');
            keypress = true;
        }
    }
    function api_updates()
    {
        socket.emit('update',leftPaddle);
        keypress = false;
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

