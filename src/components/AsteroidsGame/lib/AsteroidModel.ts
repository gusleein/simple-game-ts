/**
 * Created by @gusleein (Andrey Sanatullov)
 * https://github.com/gusleein
 *
 * on 02/05/2020.
 */
import IModel from "components/AsteroidsGame/lib/IModel";

export default class AsteroidModel implements IModel {
  get path(): number[][] {
    return this._path
  }

  private _path: number[][] = [[]]
}
