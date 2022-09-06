import React, { useEffect, useRef } from "react";
import './game.css';
import paddle from "./paddle";
import { JoinRoom } from "./components/Joinroom";
import { socket } from "..";
import Score, {p1_points, p2_points } from "./components/score";


function Game () {   
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let keypress: boolean = true;
    let newPlayer: boolean = false;
    let rightPaddle: any = {};
    let leftPaddle: any = {};
    let animation_id:any;
    let gameOn: boolean = false;

    
    useEffect(() => {

        
        socket.off('START_GAME').on('START_GAME', () => {
            gameOn = true;
        });

        // socket.off('WAITING_FOR_PLAYER').on('WAITING_FOR_PLAYER', () => {
        //     newPlayer = false;
        // });
        
        socket.off('player1_update').on('player1_update', data => {
            leftPaddle = data;
        });
        socket.off('player2_update').on('player2_update', data => {
            rightPaddle = data;
            newPlayer = true;
        });
        socket.off('PlayerDisconnected').on('PlayerDisconnected', () =>
        {
            console.log('player2 out');
            newPlayer = false;
            
        });
        
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
            paddle(ctx, paddleC, leftPaddle);
            if (newPlayer) {
                paddle(ctx, paddleC, rightPaddle);
            }
        }

        const initBall = () => {
            socket.off('ball_update').on('ball_update', data => {
                const ballC = canvasRef.current;
                const ctx = ballC?.getContext('2d');
                ctx?.beginPath();
                ctx?.arc(data.x, data.y, data.rad, 0, Math.PI * 2, false);
                ctx!.fillStyle = '#ffffff';
                ctx!.strokeStyle = '#000000';
                ctx?.fill();
                ctx?.stroke();
                ctx?.closePath();
            });
        }

        
        const render = () => {
            renderCanvas();
            renderPaddle();
            if (gameOn && newPlayer) {
                initBall();
                canvasRef.current!.focus();
            }
            animation_id = requestAnimationFrame(render);

            // if (p1_points === 10) {
            //     cancelAnimationFrame(animation_id);
            // }
            // else if (p2_points === 10) {
            //     cancelAnimationFrame(animation_id);
            // }

            // if (!newPlayer)
            // {
            //     cancelAnimationFrame(animation_id);
            // }
        };
            render();
            canvasRef.current?.focus();

            if (keypress) {
                api_updates();
            }
    }, [socket]);
    
    
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
        socket.on('player_moved', data => {
            if (data.side === 'left') {
                leftPaddle = data;
            }
            else if (data.side === 'right') {
                rightPaddle = data;
            }
        });
        keypress = false;
        
    }
    return (
        <>
        <JoinRoom/>
            <canvas id="game" ref={canvasRef}
            tabIndex={0}
            onKeyDown={keyboardevent}
            width="1280" height="720"></canvas>
        <Score/>
        </>
            );
    }
export default Game;

