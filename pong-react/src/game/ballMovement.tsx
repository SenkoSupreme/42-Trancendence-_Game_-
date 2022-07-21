export function ballMovement(ctx:any, ballObj:any)
{
    let data = new Ball(ballObj.x, ballObj.y, ballObj.rad);
    data.draw(ctx);
    ballObj.x += ballObj.dx;
    ballObj.y += ballObj.dy;
}

class Ball {
    x:number;
    y:number;
    rad:number;

    constructor(x:number, y:number, rad:number) {
        this.x = x;
        this.y = y;
        this.rad = rad;
    }

    draw(ctx:CanvasRenderingContext2D)
    {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
        ctx!.fillStyle = "white";
        ctx!.strokeStyle = "black";
        ctx!.lineWidth = 2;
        ctx!.fill();
        ctx!.stroke();
        ctx!.closePath();
    }
}