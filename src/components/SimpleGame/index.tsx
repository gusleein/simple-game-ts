import React from 'react';
import Timer from './lib/Timer.class'

export class SimpleGame extends React.Component<Props, State> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null = null;
  state: State;
  timer: any;
  interval: any;

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {level: 0, time: '0.00'};
  }

  componentDidMount() {
    if (this.canvasRef.current) {
      this.ctx = this.canvasRef.current.getContext('2d')
      // this.newGame();
    }

  }

  newGame() {
     this.startTimer(); 
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
        <canvas width={300} height={300} ref={this.canvasRef}></canvas>
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