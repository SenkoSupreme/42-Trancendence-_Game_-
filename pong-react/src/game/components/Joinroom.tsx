import React, { useState } from "react";
import styled from "styled-components";
import io, { Socket } from 'socket.io-client';

const socket = io('10.12.10.3:3001'); //update this to mac pubic ip

const JoinRoomcontainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
`;

const RoomIDInput = styled.input`
    height: 30px;
    width: 20em;
    font-size: 17px;
    outline: none;
    border: 1px solid #000000;
    border-radius: 3px;
    padding: 0 10px;
`;

const JoinRoomButton = styled.button`
    outline: none;
    background-color: #8e44ad;
    color: #ffffff;
    font-size: 17px;
    border: 2px solid transparent;
    border-radius: 5px;
    padding: 4px 10px;
    transition: all 230ms ease-in-out;
    margin-top: 1em;
    margin-bottom: 12px;
    cursor: pointer;

    &:hover {
        background-color: trasparent;
        color: red;
        border: 2px solid #8e44ad;
        
    }

`;

export function JoinRoom(props: any) {

    const [roomID, setRoomID] = useState("");
    const handleRoomIDChange = (e: React.ChangeEvent<any>) => {
        const value = e.target.value;
        setRoomID(value);
        console.log(roomID);
        
    }
    const sendRoomID = () => {
    socket.emit('join_game', roomID);
    }

    return (
         <form>
            <JoinRoomcontainer>
                <h4>Enter Room ID</h4>
                <RoomIDInput type="text" 
                placeholder="Room ID" 
                value={roomID} 
                onChange={handleRoomIDChange}
                />
                <JoinRoomButton
                type="button"
                onClick={sendRoomID}
                >Join</JoinRoomButton>
            </ JoinRoomcontainer>
         </form>
    );
}