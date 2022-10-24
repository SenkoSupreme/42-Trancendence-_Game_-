import React, { useState, } from "react";
import styled from "styled-components";
import bg from "../game/assets/bg.jpeg";
import { socket } from "../game/game";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
    @font-face {
        font-family: 'street';
        src: url("Act_Of_Rejection.ttf") format("truetype");
        
    }
    @font-face {
        font-family: 'spoopy';
        src: url("SpoopyGhostPixel.ttf") format("truetype");
        font-size: 1.3rem;
    }
    form {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
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
const JoinRoomButton = styled.button`
    outline: none;
    background-color: #690759;
    color: #ffffff;
    font-size: 17px;
    border: 2px solid transparent;
    border-radius: 5px;
    padding: 4px 10px;
    transition: all 230ms ease-in-out;
    margin-top: 1em;
    margin-bottom: 12px;
    cursor: pointer;
    font-family: 'street';
    font-size: 50px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0.5em;

    &:hover {
        background-color: #ED006C;
        color: #ffd300;
        border: 2px solid #02CEFC;
        
    }
    p {
        font-size: 20px;
        margin: 0;
        font-family: 'spoopy';
        animation: blink 1.5s steps(3, start) infinite;
        padding-top: 10px;
        background: radial-gradient(circle at top right, #ffd300, #B9FDD5, #ffd300);
        -webkit-background-clip: text;
	    -webkit-text-fill-color: transparent;
        font-family: 'spoopy';
        @keyframes blink {
            to {
                visibility: hidden;
            }
        }
    }

`;

function Home() {
    const navigate = useNavigate();

    const playGame = () => {
        navigate('/game');
        socket.emit('join_game');
        console.log("join game");
    }
    
    const singlePmode = () => {
        navigate('/vbot');
    }



    return (
        <Container>
            <Background />
            <form>
                <JoinRoomButton
                    type="submit"
                    onClick={playGame}
                >PLAY
                <p>PvP</p>
                </JoinRoomButton>
                <JoinRoomButton
                    type="submit"
                    onClick={singlePmode}
                    >PLAY
                    <p>PvAI</p>
                </JoinRoomButton>
            </form>
        </Container>
    );
}

export default Home;