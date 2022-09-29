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

    &:hover {
        background-color: #ED006C;
        color: #ffd300;
        border: 2px solid #02CEFC;
        
    }

`;

function Home() {
    const navigate = useNavigate();

    const playGame = () => {
        navigate('/game');
        socket.emit('join_game');
        console.log("join game");
    }



    return (
        <Container>
            <Background />
            <form>
                <JoinRoomButton
                    type="submit"
                    onClick={playGame}
                >PLAY
                </JoinRoomButton>
            </form>
        </Container>
    );
}

export default Home;