import React from "react";
import styled from "styled-components";
import { socket } from "../..";

const scoreContainer = styled.div`

`

export function JoinRoom(props: any) {
    let [p1Score, setP1Score] = React.useState(0);
    let [p2Score, setP2Score] = React.useState(0);

    socket.on('player1_scored', data => {
        if (data.side === 'left')
        {
            setP1Score(data.points);
        }
        // socket.off('player1_scored');
    });
    socket.on('player2_scored', data => {
        if (data.side === 'right') {
            setP2Score(data.points);
        }
    });

    return (
        <div className="score">
                <div className="player1">
                    <p>Player 1: {p1Score}</p>
                </div>
                <div className="player2">
                    <p>Player 2: {p2Score}</p>
                </div>
            </div>
    );
} export default JoinRoom;