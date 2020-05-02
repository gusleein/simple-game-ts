/**
 * Created by @gusleein (Andrey Sanatullov)
 * https://github.com/gusleein
 *
 * on 02/05/2020.
 */
import IGameObject from "./IGameObject";
import IModel from "./IModel";

export default class AsteroidObject implements IGameObject {
  static AsteroidsMaxCount = 6;

  x = 0;
  y = 0;
  model!: IModel;

  constructor(o?: IGameObject) {
    if (o) {
      this.x = o.x || 0;
      this.y = o.y || 0;
      this.model = o.model || null
    }
  }

}
