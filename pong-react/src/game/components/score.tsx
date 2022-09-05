import React, { useEffect } from "react";
import styled from "styled-components";
import { socket } from "../..";

const ScoreContainer = styled.div`
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    width: 70rem;
    margin: 0 auto;
    padding: 0.5rem;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    font-size: 1.5rem;
    font-weight: bold;
    color: #000;

`;

const ScoreContainerP1 = styled.div`
    outline: none;
    background-color: #f3cd26;
    color: #ffffff;
    font-size: 17px;
    border: 2px solid transparent;
    border-radius: 5px;
    padding: 4px 10px;
    margin-right: 0.5em;
    float : left;
    width: 100%;
`;
const ScoreContainerP2 = styled.div`
    outline: none;
    background-color: #9e2626;
    color: #ffffff;
    font-size: 17px;
    border: 2px solid transparent;
    border-radius: 5px;
    padding: 4px 10px;
    float : right;
    margin-left: 0.5em;
    width :100%;
`;

export let is_score: boolean = false;
export let p1_points: number = 0;
export let p2_points: number = 0;

export function JoinRoom(props: any) {
    const [p1Score, setP1Score] = React.useState(0);
    const [p2Score, setP2Score] = React.useState(0);

    useEffect(() => {


        socket.on('player1_scored', data => {

            setP1Score(data);
            //console.log('player1 scored', data);
            p1_points = p1Score;
            // console.log(p1_points);
            // is_score = true;

        });

        socket.on('player2_scored', data => {

            setP2Score(data);
            // console.log('player2 scored');
            p2_points = p2Score;
            // console.log(p2_points);

        });
    }, []);

    return (
        <>
            <ScoreContainer>
                <ScoreContainerP1>
                    <p> Player 1: {p1Score}</p>
                </ScoreContainerP1>

                <ScoreContainerP2>
                    <p> Player 2: {p2Score}</p>
                </ScoreContainerP2>
            </ScoreContainer>
        </>
    );
} export default JoinRoom;