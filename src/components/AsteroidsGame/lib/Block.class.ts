export class Block {
  public width: number = 1;
  public height: number = 1;
  // 'h' - horizontal
  // 'v' - vertical
  public orientation: string = ''; 

  constructor(params: {width: number, height: number}) {
    this.width = params.width;
    this.height = params.height;
  }
}