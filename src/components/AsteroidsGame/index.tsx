import React from 'react';
import Timer from './lib/Timer.class'
import './styles.css'
import {Game} from './lib/Game.class'

export class AsteroidsGame extends React.Component<Props, State> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx?: CanvasRenderingContext2D;
  state: State;
  timer: any;
  interval: any;
  game?: Game;
  width: number = 600
  height: number = 600

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {level: 0, time: '0.00'};
  }

  componentDidMount() {
    if (this.canvasRef.current) {
      const ctx = this.canvasRef.current.getContext('2d')
      this.initGame(ctx);
    }
  }

  initGame(ctx: CanvasRenderingContext2D | null) {
    if (ctx) {
      this.game = new Game(ctx, this.width, this.height);
      this.startTimer();
    }
  }

  startTimer() {
    this.timer = new Timer();
    this.interval = setInterval(() => this.setState({time: this.timer.ms}), 10)
  }

  stopTimer() {
    this.timer = null;
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <canvas width={this.width} height={this.height} ref={this.canvasRef} className="SimpleGame_canvas"></canvas>
        <div>{this.state.time}</div>
      </div>
    )
  }

}

interface State {
  level: number;
  time: string;
}

interface Props {}

export default AsteroidsGame