class Timer {
  state: State;
  interval: any;

  constructor() {
    this.state = {microseconds: 0, timestamp: Date.now()};
    this.interval = setInterval(() => this.tick(), 10);
  }

  tick() {
    /* ∆t */
    const dt: number = parseInt(((Date.now() - this.state.timestamp)).toString());
    this.state.microseconds = this.state.microseconds + dt;
    this.state.timestamp = Date.now();
  }

  get ms(): string {
    return (this.state.microseconds / 1000).toFixed(2);
  }
} 

interface State {microseconds: number, timestamp: number}


export default Timer;