function wallCollision(ballObj:any, ball:any) {
    if (ballObj.y - ballObj.rad <= 0 ||
        ballObj.y + ballObj.rad >= ball!.height) 
    {
        ballObj.dy *= -1;
    }
    if (ballObj.x - ballObj.rad <= 0 ||
        ballObj.x + ballObj.rad >= ball!.width)
        {
            ballObj.dx *= -1;
        }
};
export default wallCollision;