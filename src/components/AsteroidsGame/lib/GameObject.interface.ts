/**
 * Created by @gusleein (Andrey Sanatullov)
 * https://github.com/gusleein
 *
 * on 01/05/2020.
 */
import IModel from "components/AsteroidsGame/lib/IModel";

export default interface IGameObject {
  model: IModel;
  x: number;
  y: number;
}
