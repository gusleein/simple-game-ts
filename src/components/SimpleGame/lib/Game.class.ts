export interface Game {}
export class Game implements Game {
  ctx?: CanvasRenderingContext2D;
  lastRender: number = 0;

  width: number = 300;
  height: number = 300;

  state = {
    x: this.width / 2,
    y: this.height / 2
  }

  constructor(ctx?: CanvasRenderingContext2D) {
    if (ctx) {
      this.ctx = ctx;
      this.loop = this.loop.bind(this)
      window.requestAnimationFrame(this.loop)
    }
  }

  update(progress: number) {
    this.state.x += progress;

    if (this.state.x > this.width) {
      this.state.x -= this.width;
    }
  }

  draw() {
    if (this.ctx) {
      this.ctx.fillStyle = "red"
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.fillRect(this.state.x - 5, this.state.y - 5, 10, 10)
    }
  }

  loop(timestamp: number) {
    let progress = timestamp - this.lastRender;

    this.update(progress);
    this.draw();

    this.lastRender = timestamp;
    window.requestAnimationFrame(this.loop);
  }
}