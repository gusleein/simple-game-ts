import React from 'react';
import {Props} from 'shared/helpers';

export class SimpleGame extends React.Component<any, any> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null = null;

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
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