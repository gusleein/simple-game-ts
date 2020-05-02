/**
 * Created by @gusleein (Andrey Sanatullov)
 * https://github.com/gusleein
 *
 * on 02/05/2020.
 */
import IModel from "./IModel";

export default class ShipWithFireModel implements IModel {
  get path(): number[][] {
    return this._path;
  }

  private _path: number[][] = [[]];
}
