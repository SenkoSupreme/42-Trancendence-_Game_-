import React, { useState } from "react";
import styled from "styled-components";
import { socket } from "../..";

const ContainerBaground = styled.div`
    width: 100%;
    height: 80%;
    background-color: #ffffff;
    position: fixed;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
`;
const JoinRoomcontainer = styled.div`
    width: 20em;
    align-items: center;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    margin: auto;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    font-size: 1.5rem;
    font-weight: bold;
    color: #000;
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


    export function JoinRoom(props: any) 
    {
        const [roomID, setRoomID] = useState("");
        const [is_joined, setIsJoined] = useState(true); 
        const handleRoomIDChange = (e: React.ChangeEvent<any>) => {
            const value = e.target.value;
            setRoomID(value);
            console.log(roomID);
            
    }


    const sendRoomID = () => 
    {
        if (roomID.length > 0) {
            socket.emit('join_game', roomID);
            (document.getElementById("roomIDInput")! as HTMLInputElement ).value  = "";
            setIsJoined(false);
        }
        else {
            alert("Please enter a room ID");
        }
    }

    return (
        <>
            {is_joined && <ContainerBaground>
                <JoinRoomcontainer>
                    <h4>Enter Room ID *</h4>
                    <RoomIDInput 
                    id = "roomIDInput"
                    type="text" 
                    placeholder="Room ID" 
                    value={roomID} 
                    onChange={handleRoomIDChange}
                    />
                    <JoinRoomButton
                    type="button"
                    onClick={sendRoomID}
                    >Join</JoinRoomButton>
                </ JoinRoomcontainer> 
            </ContainerBaground> }
        </>
    );
}