export default  (ctx:any, paddleC: any, paddleProps:any) => {

    class Paddle {
        x:number;
        y:number;
        width:number;
        height:number;
        image:string;

    constructor(x:number, y:number, width:number, height:number, image:string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    }

    let paddle = new Paddle(paddleProps.x, paddleProps.y, paddleProps.width, paddleProps.height, paddleProps.image);

    if (paddleProps.x <= 0) 
    {
        paddleProps.x = 0;
    }
    else if (paddleProps.x + paddleProps.width >= paddleC.width) 
    {
        paddleProps.x = paddleC.width - paddleProps.width;
     }
};