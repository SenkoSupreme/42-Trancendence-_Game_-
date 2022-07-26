import React, { useEffect, useRef, useState } from "react";
import paddle from "./paddle";
import { JoinRoom } from "./components/Joinroom";
import Score, { p1_points, p2_points } from "./components/score";
import styled from "styled-components";
import bg from "./assets/bg.jpeg";
import { io, Socket } from "socket.io-client";
import { render } from "@testing-library/react";
export const socket = io('0.0.0.0:3001', {
    query: {
        userLogin: 'mougnou',
    }
}); //update this to mac pubic ip

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
`;
const GameContainer = styled.canvas`
    outline: 1px solid #ffd300;
    align-content: center;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin: auto auto 0 auto;
    padding: .4rem;
`;

const Background = styled.div`
    background-image: url(${bg});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: fixed;
    opacity: 98%;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
`;


function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let keypress: boolean = true;
    let newPlayer: boolean = false;
    let rightPaddle: any = {};
    let leftPaddle: any = {};
    let animation_id: any;
    // let gameOn: boolean = false;
    const [gameOn, setGameOn] = useState(false);
    const audio = new Audio('touch.wav');
    
    
    
    useEffect(() => {

        socket.off('START_GAME').on('START_GAME', () => {
        // socket.on('START_GAME', () => {
            newPlayer = true;
            setGameOn(true);
            console.log('game started');
            console.log(gameOn);
            
        });

        // socket.off('WAITING_FOR_PLAYER').on('WAITING_FOR_PLAYER', () => {
        //     newPlayer = false;
        // });

        socket.off('player1_update').on('player1_update', data => {
            leftPaddle = data;
            console.log(leftPaddle);
            
        });
        socket.off('player2_update').on('player2_update', data => {
            rightPaddle = data;
            console.log(newPlayer);
            
        });
        socket.off('PlayerDisconnected').on('PlayerDisconnected', () => {
            console.log('player2 out');
            // newPlayer = false;

        });

        const renderCanvas = () => {
            const canvasBG = canvasRef.current;
            const ctxBG = canvasBG?.getContext('2d');
            const bg = new Image();
            bg.src = 'splash.png';
            bg.onload = function () {
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
            if (newPlayer) {
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
        }
        
        const render = () => {
            
            renderCanvas();
            renderPaddle();
            if (newPlayer) {
                    initBall(); 
            }
            // socket.off('player1_won').on('player1_won', () => {
            //         alert('Player 1 won!');
            //         cancelAnimationFrame(animation_id);
            //     });
            //     socket.off('player2_won').on('player2_won', () => {
            //         alert('Player 2 won!');
            //         cancelAnimationFrame(animation_id);
            //     });
                canvasRef.current!.focus();
                // if (!newPlayer)
                // {
                //     cancelAnimationFrame(animation_id);
                // }
                animation_id = requestAnimationFrame(render);
            };
            requestAnimationFrame(render);
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
    function api_updates() {
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
    socket.off('play_sound').on('play_sound', () => {
        audio.play();
    });
    return (
        <>
            <Background />
            {!gameOn && <JoinRoom />}
            <Container>
                <GameContainer id="game" ref={canvasRef}
                    tabIndex={0}
                    onKeyDown={keyboardevent}
                    width="1280" height="720">
                </GameContainer>
                <Score />
            </Container>
        </>
    );
}
export default Game;

