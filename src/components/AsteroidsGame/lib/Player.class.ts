/**
 * Created by @gusleein (Andrey Sanatullov)
 * https://github.com/gusleein
 *
 * on 02/05/2020.
 */
export interface IPlayer {
  bulletsCount?: number;
  lives?: number;
  score?: number;
  godMode?: number;
}

export default class Player implements IPlayer {
  static readonly BulletsMaxCount = 8;
  // скорость снаряда
  static readonly BulletMaxSpeed = 5;
  // неуязвимость время в кадрах
  static readonly GodModeMax = 120;
  static readonly ShipMaxSpeed = 3;

  static readonly Path = {
    ship: [[0, -1], [0.5, 0.3], [-0.5, 0.3]],
    withFire: [[0, -1], [0.5, 0.3], [-0.5, 0.3], [-0.2, 0.3], [0, 1], [0.2, 0.3], [-0.5, 0.3]]
  };

  bulletsCount?: number = 0;
  lives?: number = 3;
  score?: number = 0;
  godMode?: number = Player.GodModeMax;

  constructor(p?: IPlayer) {
    if (p) {
      this.bulletsCount = 0;
      this.lives = 3;
      this.score = 0;
      this.godMode = Player.GodModeMax;
    }
  }
}
