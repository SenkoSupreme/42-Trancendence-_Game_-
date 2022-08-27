import React, { useEffect, useRef } from "react";
import './game.css';
import paddle from "./paddle";
import data from "./data";
import { JoinRoom } from "./components/Joinroom";
import { socket } from "..";
import Score, {p1_points, p2_points } from "./components/score";

let {ballObj} = data;

function Game () {   
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let keypress: boolean = true;
    let newPlayer: boolean = false;
    let rightPaddle: any = {};
    let leftPaddle: any = {};
    let animation_id:any;
    
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

        
        const render = () => {
            renderCanvas();
            renderPaddle();
            //put condition here to check if player is connected
            //initBall();
           animation_id = requestAnimationFrame(render);
        //    if (!newPlayer) {
        //         alert('waiting for player 2');
        //     }
            if (p1_points >= 10) {
                cancelAnimationFrame(animation_id);
                //alert('YELLOW wins');
            }
            else if (p2_points >= 10) {
                cancelAnimationFrame(animation_id);
                alert('RED wins');
            }
        };
        canvasRef.current?.focus();
        render();
        
        if(keypress) {
            api_updates();
        }

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

