export interface Game {}

export class Game implements Game {
  ctx?: CanvasRenderingContext2D;
  lastRender: number = 0;

  width: number = 600;
  height: number = 600;
  playersInGame: number = 2;


  players: Player[] = [{
    color: 'white',
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
      'fire': false,
    },
    keyMap: {
      68: 'right',
      65: 'left',
      87: 'up',
      83: 'down',
      32: 'fire',
    }
  },{
    color: 'red',
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
      'fire': false,
    },
    keyMap: {
      39: 'right',
      37: 'left',
      38: 'up',
      40: 'down',
      93: 'fire',
    }
  }];

  constructor(ctx?: CanvasRenderingContext2D, width?: number, height?: number) {
    if (width) {
      this.width = width
    }
    if (height) {
      this.height = height
    }
    if (ctx) {
      this.ctx = ctx;
      this.loop = this.loop.bind(this);
      this.keyDown = this.keyDown.bind(this);
      this.keyUp = this.keyUp.bind(this);

      window.requestAnimationFrame(this.loop);
      window.addEventListener("keydown", this.keyDown, false);
      window.addEventListener("keyup", this.keyUp, false)
    }
  }

  update(progress: number) {
    const p = progress / 16;

    for (let i = 0; i < this.players.length; i++) {
      this.updateRotation(p, this.players[i]);
      this.updateMovement(p, this.players[i]);
      this.updatePosition(p, this.players[i])
    }
  }

  updateRotation(p: number, state: Player) {
    if (state.pressedKeys.left) { 
      state.rotation -= p * 5
    }
    else if (state.pressedKeys.right) {
      state.rotation += p * 5
    }
  }

  updateMovement(p: number, state: Player) {

    const accelerationVector = {
      x: p * .2 * Math.cos((state.rotation - 90) * (Math.PI / 180)),
      y: p * .2 * Math.sin((state.rotation - 90) * (Math.PI / 180))
    };
    const speedLimit = 5;

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

  updatePosition(p: number, state: Player) {
    state.position.x += state.movement.x;
    state.position.y += state.movement.y;

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
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      this.drawPlayer(ctx, this.players[0]);

      if (this.playersInGame > 1) {
        this.drawPlayer(ctx, this.players[1])
      }
    }
  }

  drawAsteroid(ctx: CanvasRenderingContext2D, player: Player) {
    
  }

  drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
    ctx.save();
    ctx.translate(player.position.x, player.position.y);
    ctx.rotate((Math.PI / 180) * player.rotation);

    ctx.strokeStyle = player.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(5, 5);
    ctx.lineTo(0, -10);
    ctx.lineTo(-5, 5);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.restore()
  }

  loop(timestamp: number) {
    let progress = timestamp - this.lastRender;

    this.update(progress);
    this.draw();

    this.lastRender = timestamp;
    window.requestAnimationFrame(this.loop);
  }

  keyDown(e: KeyboardEvent) {
    let key = this.players[0].keyMap[e.keyCode];
    this.players[0].pressedKeys[key] = true;
    
    if (this.playersInGame > 1){
      key = this.players[1].keyMap[e.keyCode];
      this.players[1].pressedKeys[key] = true;
    }
  }

  keyUp(e: KeyboardEvent) {
    let key = this.players[0].keyMap[e.keyCode];
    this.players[0].pressedKeys[key] = false;

    if (this.playersInGame > 1){
      key = this.players[1].keyMap[e.keyCode];
      this.players[1].pressedKeys[key] = false;
    }
  }
}

interface Player {
  color: string,
  position: {x: number, y: number},
  movement: {x: number, y: number},
  rotation: number,
  pressedKeys: PressedKeys,
  keyMap: KeyMap,
}

type KeyMap = {
  [key: number]: string
}
type PressedKeys = {
  [key: string]: boolean
}
