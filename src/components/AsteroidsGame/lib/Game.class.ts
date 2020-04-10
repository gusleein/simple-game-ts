export interface Game {}

export class Game implements Game {
  ctx?: CanvasRenderingContext2D;
  lastRender: number = 0;

  width: number = 300;
  height: number = 300;

  state: State = {
    position: {
      x: this.width / 2,
      y: this.height / 2,
    },
    movement: {
      x: 0,
      y: 0
    },
    rotation: 0,
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
    const p = progress / 16

    this.updateRotation(p)
    this.updateMovement(p)
    this.updatePosition(p)
  }

  updateRotation(p: number) {
    if (this.state.pressedKeys.left) { 
      this.state.rotation -= p * 5
    }
    else if (this.state.pressedKeys.right) {
      this.state.rotation += p * 5
    }
  }

  updateMovement(p: number) {
    const state = this.state
    const accelerationVector = {
      x: p * .2 * Math.cos((state.rotation - 90) * (Math.PI/180)),
      y: p * .2 * Math.sin((state.rotation - 90) * (Math.PI/180))
    }
    const speedLimit = 5

    if (state.pressedKeys.up) {
      state.movement.x += accelerationVector.x;
      state.movement.y += accelerationVector.y;
    } else if (state.pressedKeys.down) {
      state.movement.x -= accelerationVector.x;
      state.movement.y -= accelerationVector.y;
    }

    // limit movement speed
    if (state.movement.x > speedLimit) {
      state.movement.x = speedLimit;
    } else if (state.movement.x < -speedLimit) {
      state.movement.x = -speedLimit
    }

    if (state.movement.y > speedLimit) {
      state.movement.y = speedLimit
    } else if (state.movement.y < -speedLimit) {
      state.movement.y = -speedLimit
    }
  }

  updatePosition(p: number) {
    const state = this.state;

    state.position.x += state.movement.x
    state.position.y += state.movement.y

    // detect boundaries
    if (state.position.x > this.width) {
      state.position.x -= this.width
    } else if (state.position.x < 0) {
      state.position.x += this.width
    }

    if (state.position.y > this.height) {
      state.position.y -= this.height
    } else if (state.position.y < 0) {
      state.position.y += this.height
    }
  }

  draw() {
    if (this.ctx) {
      const ctx = this.ctx
      ctx.clearRect(0, 0, this.width, this.height)

      ctx.save()
      ctx.translate(this.state.position.x, this.state.position.y)
      ctx.rotate((Math.PI/180) * this.state.rotation)

      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(5, 5)
      ctx.lineTo(0, -10)
      ctx.lineTo(-5, 5)
      ctx.lineTo(0, 0)
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
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
  position: {x: number, y: number},
  movement: {x: number, y: number},
  rotation: number,
  pressedKeys: PressedKeys,
}

type KeyMap = {
  [key: number]: string
}
type PressedKeys = {
  [key: string]: boolean
}