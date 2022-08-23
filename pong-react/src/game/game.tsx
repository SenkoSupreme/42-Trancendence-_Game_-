import React, { useEffect, useRef } from "react";
import './game.css';
import io, { Socket } from 'socket.io-client';
import paddle from "./paddle";
import data from "./data";
import { JoinRoom } from "./components/Joinroom";
import { socket } from "..";

let {ballObj} = data;

function Game () {    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let keypress: boolean = true;
    let newPlayer: boolean = false;
    let rightPaddle: any = {};
    let leftPaddle: any = {};
    // let p1Score: number = 0;
    // let p2Score: number = 0;
    let [p1Score, setP1Score] = React.useState(0);
    let [p2Score, setP2Score] = React.useState(0);

    
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
        
        socket.on('player2_update', data => 
        {
            console.log('player2 in');
            newPlayer = true;
            
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

        const renderPaddle = () => {
            const paddleC = canvasRef.current;
            const ctx = paddleC?.getContext('2d');
            paddle(ctx, paddleC, leftPaddle);
            if (newPlayer) {
                paddle(ctx, paddleC, rightPaddle);
            }
        }

        const initBall = () => {
            socket.emit('ball_init', ballObj);
            socket.on('ball_update', data => {
                ballObj = data;
            });
            const ballC = canvasRef.current;
            const ctx = ballC?.getContext('2d');
            ctx?.beginPath();
            ctx?.arc(ballObj.x, ballObj.y, ballObj.rad, 0, Math.PI * 2, false);
            ctx!.fillStyle = '#ffffff';
            ctx!.strokeStyle = '#000000';
            ctx?.fill();
            ctx?.stroke();
            ctx?.closePath();
        }
        const scoreUpdate = () => {
            socket.on('player1_scored', data => {
                console.log('player1 scored');
                if (data.side === 'left')
                {  
                    setP1Score(data.points);
                }
                // socket.off('player1_scored');
            });
            socket.on('player2_scored', data => {
                console.log('player2 scored');
                if (data.side === 'right') {
                    console.log(data.points);
                    setP2Score(data.points);
                }
            });
            socket.off('player2_scored');
           
        }
        scoreUpdate();
        const render = () => {
            renderCanvas();
            renderPaddle();
            initBall();
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
        socket.emit('update');
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
        <JoinRoom />
            <canvas id="game" ref={canvasRef}
            tabIndex={0}
            onKeyDown={keyboardevent}
            width="1280" height="720"></canvas>
            <div className="score">
                <div className="player1">
                    <p>Player 1: {p1Score}</p>
                </div>
                <div className="player2">
                    <p>Player 2: {p2Score}</p>
                </div>
            </div>
        </>
            );
    }
export default Game;

