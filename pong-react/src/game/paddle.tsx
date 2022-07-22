export default  (ctx:any, paddleC: any, paddleProps:any) => {

    class Paddle {
        x:number;
        y:number;
        width:number;
        height:number;
        colour:string;

    constructor(x:number, y:number, width:number, height:number, colour:string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
    }

    move() {
        ctx.beginPath();
        ctx.rect(0, this.y, this.width, this.height);
        ctx.fillStyle =  "white" ;
        ctx.strokeStyle =  "Yellow";
        ctx.lineWidth = 1;
        ctx.fillStyle = "white";
        ctx.shadowBlur = 0;
        ctx.shadowColor = "blue";
        ctx.strokeRect(0, this.y, this.width, this.height);
        ctx.fill();
      }

    }

    let paddle = new Paddle(paddleProps.x, paddleProps.y, paddleProps.width, paddleProps.height, paddleProps.colour);
    paddle.move();
    if (paddleProps.y <= 0) 
    {
        paddleProps.y = 0;
    } 
    else if (paddleProps.y >= paddleC.height - paddleProps.height) 
    {
        paddleProps.y = paddleC.height - paddleProps.height;
    }
};