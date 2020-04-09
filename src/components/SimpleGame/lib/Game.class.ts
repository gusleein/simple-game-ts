export interface Game {}
export class Game implements Game {
  ctx?: CanvasRenderingContext2D;
  lastRender: number = 0;

  width: number = 300;
  height: number = 300;

  state: State = {
    x: this.width / 2,
    y: this.height / 2,
    pressedKeys: {
      'left': false,
      'right': false,
      'up': false,
      'down': false,
    }
  }

  keyMap: KeyMap = {
    68: 'right',
    65: 'left',
    87: 'up',
    83: 'down',
  }

  constructor(ctx?: CanvasRenderingContext2D) {
    if (ctx) {
      this.ctx = ctx;
      this.loop = this.loop.bind(this)
      this.keyDown = this.keyDown.bind(this)
      this.keyUp = this.keyUp.bind(this)

      window.requestAnimationFrame(this.loop)
      window.addEventListener("keydown", this.keyDown, false)
      window.addEventListener("keyup", this.keyUp, false)
    }
  }

  update(progress: number) {
    if (this.state.pressedKeys.left)
      this.state.x -= progress;
    if (this.state.pressedKeys.right)
      this.state.x += progress;
    if (this.state.pressedKeys.up)
      this.state.y -= progress;
    if (this.state.pressedKeys.down)
      this.state.y += progress;

    if (this.state.x > this.width) 
      this.state.x -= this.width;
    if (this.state.x < 0) 
      this.state.x += this.width;
    if (this.state.y > this.height) 
      this.state.y -= this.height;
    if (this.state.y < 0) 
      this.state.y += this.height;
    
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

  keyDown(e: KeyboardEvent) {
    let key = this.keyMap[e.keyCode];
    this.state.pressedKeys[key] = true;
  }

  keyUp(e: KeyboardEvent) {
    let key = this.keyMap[e.keyCode];
    this.state.pressedKeys[key] = false;
  }
}
interface State {
  x: number,
  y:  number,
  pressedKeys: PressedKeys,
}

type KeyMap = {
  [key: number]: string
}
type PressedKeys = {
  [key: string]: boolean
}