class Flower {
  x: number;
  y: number;
  angle: number;
  dAngle: number;
  radius: number;
  color: string;
  stop: boolean;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    const dAngle = Math.random();
    this.dAngle = Math.random() > 0.5 ? dAngle : -dAngle;
    this.radius = Math.random() * 20 + 5;
    this.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    this.stop = false;
  }

  reset(x: number, y: number, angle: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.stop) return;
    this.x += Math.cos(this.angle) * this.radius;
    this.y += Math.sin(this.angle) * this.radius;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius * 0.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    this.angle += this.dAngle;
    this.radius -= 0.4;
    if (this.radius <= 0) {
      this.stop = true;
    }
  }
}

export default Flower;
