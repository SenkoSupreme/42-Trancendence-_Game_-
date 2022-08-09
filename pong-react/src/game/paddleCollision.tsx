function paddleHit(ballObj: any, paddleProps: any, paddleC: any) {
    console.log(paddleProps);
    if 
    (  
        ballObj.x  < paddleProps.width  && ballObj.y > paddleProps.y &&
        paddleProps.x < paddleProps.x + paddleProps.width &&
        ballObj.y + ballObj.rad > paddleProps.y - paddleProps.height / 2 
        
        //ballObj.y + ballObj.rad > paddleProps.y - paddleProps.height / 2
        // ballObj.y < paddleProps.y + paddleProps.height &&
        // ballObj.y > paddleProps.y &&
        // paddleProps.y < paddleProps.y + paddleProps.height &&
       
    ) 
    {
        //check where the ballObj Hit the paddle and normalize the values
        let collidePoint = ballObj.y - (paddleProps.y + paddleProps.height / 2);
        collidePoint = collidePoint / (paddleProps.height / 2);
        
        //calculate the angle of the ballObj
        let angle  = (collidePoint * Math.PI) / 3;

        ballObj.dx = ballObj.speed * Math.cos(angle);
        ballObj.dy = ballObj.speed * Math.sin(angle);

    }

}
export default paddleHit;