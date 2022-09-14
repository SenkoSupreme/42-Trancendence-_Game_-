import React, { useState } from "react";
import styled from "styled-components";
import { socket } from "../..";
import loading from "../assets/loading.webp";
import background from "../assets/bg.jpeg";

const ContainerBaground = styled.div`
    width: 100%;
    height: 100%;
    //background: linear-gradient(112.85deg, #16213E 0.53%, rgba(15, 52, 96, 0.81) 39.36%, rgba(120, 52, 131, 0.85) 63.75%, rgba(233, 69, 96, 0.7) 99.58%, rgba(233, 69, 96, 0.7) 99.58%);;
    //background: white;
    background-image: url(${background});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: fixed;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    top : 0;
    &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: .6;
        z-index: -1;
    }
`;
const JoinRoomcontainer = styled.div`
    width: 20em;
    align-items: center;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    background: linear-gradient(112.85deg, #16213E 0.53%, rgba(15, 52, 96, 0.81) 39.36%, rgba(120, 52, 131, 0.85) 63.75%, rgba(233, 69, 96, 0.7) 99.58%, rgba(233, 69, 96, 0.7) 99.58%);;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    font-size: 1.5rem;
    font-weight: bold;
    position: relative;
    h4 {
        font-size: 1.5rem;
        margin-bottom: 0.8rem;
        margin-top: 1rem;
        justify-content: center;
        align-items: center;
        display: flex;
        color: white;
        z-index: 2;
    }
`;

const RoomIDInput = styled.input`
    height: 30px;
    width: 20em;
    font-size: 17px;
    outline: none;
    border: 1px solid #000000;
    border-radius: 3px;
    padding: 0 10px;
    margin-top: 0.5rem;

`;

const LoadingImg = styled.img`
    width: 5em;
    height: 5em;
    margin-bottom: 0.5rem;
    padding: 0 10px;
`;
LoadingImg.defaultProps = {
    src: loading,
};

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

    &:hover {
        background-color: trasparent;
        color: red;
        border: 2px solid #690759;
        
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
        <form>
            {is_joined && <ContainerBaground>
                <JoinRoomcontainer>
                    <h4>Enter Room ID *</h4>
                    <LoadingImg />
                    <RoomIDInput 
                    id = "roomIDInput"
                    type="text" 
                    placeholder="Room ID" 
                    value={roomID} 
                    onChange={handleRoomIDChange}
                    />
                    <JoinRoomButton
                    type="submit"
                    onClick={sendRoomID}
                    >Join</JoinRoomButton>
                </ JoinRoomcontainer> 
            </ContainerBaground> }
        </form>
        </>
    );
}