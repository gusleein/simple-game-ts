import React from 'react';

export class SimpleGame extends React.Component<Props, State> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null = null;
  state: State;

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {level: 0, time: 0}
  }

  componentDidMount() {
    if (this.canvasRef.current)
      this.ctx = this.canvasRef.current.getContext('2d')  
  }

  render() {
    return (
      <canvas width={300} height={300} ref={this.canvasRef}></canvas>
    )
  }
}

interface State {
  level: number;
  time: number;
}

interface Props {}