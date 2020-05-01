import React from 'react';
import {Paths, Sounds} from './consts';
import * as helpers from './helpers';

class Game {
  init() {

  }
}

function TheGame() {
  // текущие размеры окна
  let _w = window.innerWidth;
  let _h = window.innerHeight;
  const WindowParams = {
    width: _w,
    height: _h,
    width2: _w >> 1,
    height2: _h >> 1
  };
  // создаем игровое поле
  const canvas = document.createElement('canvas');
  // скрытый canvas для расчета столкновений
  const canvas2 = document.createElement('canvas');
  canvas2.padding = 30;

  // устанавливаем размер игрового поля
  canvas.width = WindowParams.width;
  canvas.height = WindowParams.height;

  canvas2.width = WindowParams.width;
  canvas2.height = WindowParams.height;
  // canvas для детектирования столкновений расширена на величину,
  // достаточную для полной отрисовки корабля
  canvas2.width += 2 * canvas2.padding;
  canvas2.height += 2 * canvas2.padding;

  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  ctx.strokeStyle = 'white';

  // максимальное кол-во пуль
  const BulletsMaxCount = 8;
  // скорость снаряда
  const BulletMaxSpeed = 5;
  // неуязвимость время в кадрах
  const GodModeMax = 120;
  const AsteroidsMaxCount = 6;
  const ShipMaxSpeed = 3;

  // объекты на игровом поле
  // objs[0] это всегда корабль
  // init begin
  let gameObjects = [];
  let gameIsStopped = true;
  let asteroidsCount = 0;
  // параметры player'a
  let bulletsCount = 0;
  let lives = 3;
  let score = 0;
  let godMode = GodModeMax;
  // init end

  /*
  Параметры:
      t - тип объекта (0-корабль, 1-астероид, 2-пуля)
      p - индекс списка вершин
      x,y - координаты центральной точки объекта относительно центра мира
      b - размер стороны ограничивающего объема
      sx,sy - проекции скорости на оси
      ss - коэффициент затухания (торможения) скоростей (>1 для замедления, <1 для ускорения)
      a - начальный угол поворота (0 - вверх, 90 - вправо)
      sa - скорость поворота (градусов за "такт")
      ttl - время жизни объекта в "тактах"

  Добавляются:
      r - радиус описанной окружности
      b2 - половина b
  */
  function addGameObject(t, p, x, y, b, sx, sy, ss, a, sa, ttl) {
    let r = Math.trunc(Math.sqrt(2) * (b >> 1));
    gameObjects.push({
      t: t,
      p: p,
      x: x,
      y: y,
      b: b,
      b2: (b >> 1),
      r: r,
      sx: sx,
      sy: sy,
      ss: ss,
      a: a,
      sa: sa,
      ttl: ttl
    });
  }

  // добавление астероида на игровое поле
  function addAsteroid(x, y, b) {
    b = ('undefined' == typeof b) ? Math.trunc(helpers.random(7) + 1) * 10 : b;
    // если (x,y) не указано, то прижимаю место появления астероида к краю экрана
    let _x = helpers.random(WindowParams.width) - WindowParams.width2,
      _y = helpers.random(WindowParams.height) - WindowParams.height2,
      _sign = (helpers.random() > 0.5) ? 1 : -1,
      p = Math.trunc(helpers.random(Paths.length - 3) + 3);
    // 50/50 выравниваю то по горизонтали, то по вертикали
    if (helpers.random() > 0.5) {
      _x = _sign * (WindowParams.width2 + b);
    } else {
      _y = _sign * (WindowParams.height2 + b);
    }

    x = ('undefined' == typeof x) ? _x : x;
    y = ('undefined' == typeof y) ? _y : y;
    addGameObject(1, p, x, y, b, -x / (helpers.random(WindowParams.width) + (WindowParams.width >> 2)), -y / (helpers.random(WindowParams.height) + (WindowParams.height >> 2)), 1, helpers.random(360), helpers.random(8) - 4, -1);
  }

  // отрисовываем объект на игровом поле
  function drawGameObject(S, fill, padding) {
    let c = ('undefined' == typeof fill) ? ctx : ctx2;
    if (fill) {
      c.fillStyle = fill;
    }
    padding = padding || 0;

    c.save();
    c.translate(WindowParams.width2 + S.x + padding, WindowParams.height2 + S.y + padding);
    c.rotate(helpers.d2r(S.a));
    c.scale(S.b2, S.b2);
    c.beginPath();
    Paths[S.p].forEach(function (p, j) {
      c[j ? 'lineTo' : 'moveTo'].apply(c, [p[0], p[1]]);
    });
    c.closePath();
    c.restore();

    fill ? c.fill() : c.stroke();
  }

  function init() {
    addGameObject(0, 0, 0, 0, 26, 0, 0, 1.01, 0, 0, -1);
  }

  function drawMessage(ctx, text) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WindowParams.width, WindowParams.height);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(text, WindowParams.width2, WindowParams.height2);
    ctx.restore();
  }

  // столкновения
  function checkCollision(a, b) {
    let collision = false;
    ctx2.save();
    ctx2.fillStyle = '#000';
    ctx2.fillRect(0, 0, WindowParams.width + 2 * canvas2.padding, WindowParams.height + 2 * canvas2.padding);
    ctx2.globalAlpha = 0.5;
    drawGameObject(a, '#F00', canvas2.padding);
    drawGameObject(b, '#0F0', canvas2.padding);

    let x0 = Math.min(a.x - a.r, b.x - b.r),
      y0 = Math.min(a.y - a.r, b.y - b.r),
      x1 = Math.max(a.x + a.r, b.x + b.r),
      y1 = Math.max(a.y + a.r, b.y + b.r);

    let data = ctx2.getImageData(x0 + WindowParams.width2 + canvas2.padding, y0 + WindowParams.height2 + canvas2.padding, x1 - x0 + 1, y1 - y0 + 1).data;
    for (let i = data.length - 4; i >= 0; i -= 4) {
      if (data[i] && data[i + 1]) {
        collision = true;
        break;
      }
    }
    ctx2.restore();

    return collision;
  }

  // взрыв астероида
  function asteroidBreak(A) {
    // осколки
    let asize = 10 * Math.trunc(A.b / 10 - (helpers.random(2) + 1));
    if (asize > 0) {
      for (let r = Math.trunc(helpers.random(2) + 1); r > 0; --r) {
        addAsteroid(A.x, A.y, asize);
      }
    }
    // мусор
    for (let r = Math.trunc(helpers.random(2) + 3); r > 0; --r) {
      let a = helpers.random(360);
      addGameObject(3, 2, A.x, A.y, 2, helpers.sin(a), -helpers.cos(a), 1, 0, 0, 30);
    }
  }

  document.onmousemove = function (e) {
    let v = {
      x: (e.pageX - WindowParams.width2 - gameObjects[0].x),
      y: (e.pageY - WindowParams.height2 - gameObjects[0].y)
    };
    gameObjects[0].a = helpers.r2d((Math.acos(-v.y / (Math.sqrt(v.x * v.x + v.y * v.y))));
    if (e.pageX - WindowParams.width2 < gameObjects[0].x) {
      gameObjects[0].a = (360 - gameObjects[0].a);
    }
  };
  document.onkeydown = function (e) {
    if (e.code === '13'/*enter*/ && gameIsStopped) {
      gameIsStopped = false;
      init();
    } else if ((e.code === '38'/*up*/) || (e.code === '87'/*W*/)) {
      if (Math.sqrt(Math.pow(gameObjects[0].sx, 2) + Math.pow(gameObjects[0].sy, 2)) > ShipMaxSpeed) return;
      Sounds.Impulse.pause() || Sounds.Impulse.play();
      gameObjects[0].p = 1; // для "мигания" двигателем при ускорении меняю геометрию корабля на вариант с пламенем
      gameObjects[0].sx += 2 * helpers.sin(gameObjects[0].a);
      gameObjects[0].sy -= 2 * helpers.cos(gameObjects[0].a);
    }
  };
  document.onclick = function (e) {
    if (gameIsStopped || (bulletsCount >= BulletsMaxCount)) return;
    Sounds.Shoot.pause() || Sounds.Shoot.play();
    let S = gameObjects[0];
    // пуля вылетает из "носа" корабля, а не из его центра
    let x = S.x + S.b2 * helpers.sin(S.a),
      y = S.y - S.b2 * helpers.cos(S.a);
    addGameObject(2, 2, x, y, 4, BulletMaxSpeed * helpers.sin(S.a), -BulletMaxSpeed * helpers.cos(S.a), 1, 0, 10, 60);
  };

  init();
  drawMessage(ctx, 'Asteroids! Press ENTER to begin');

  function render() {
    if (gameIsStopped) return;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WindowParams.width, WindowParams.height);

    while (asteroidsCount < AsteroidsMaxCount) {
      addAsteroid();
      ++asteroidsCount;
    }

    let scoreMultiplier = Math.max(1, Math.trunc(asteroidsCount / 5));

    let toDelete = [];
    for (let i = gameObjects.length - 1; i >= 0; --i) {
      if (toDelete.indexOf(i) > -1) continue;
      let S = gameObjects[i];

      // обработка короткоживущих объектов
      if ((S.ttl > -1) && (!--S.ttl)) {
        toDelete.push(i);
        continue;
      }

      S.a = (S.a + S.sa) % 360;
      S.x += (S.sx /= S.ss);
      S.y += (S.sy /= S.ss);

      // "заворачивание" за краем экрана
      [{x: 'x', W: WindowParams.width}, {x: 'y', W: WindowParams.height}].forEach(function (_) {
        let limit = (_.W >> 1) + S.r, diff = _.W + 2 * S.r;
        if (S[_.x] < -limit) {
          S[_.x] += diff;
        } else if (S[_.x] > limit) {
          S[_.x] -= diff;
        }
      });

      // коллизии
      let may_draw = true;
      for (let j = i - 1; j >= 0; --j) {
        if (toDelete.indexOf(j) > -1) continue;
        let Sj = gameObjects[j];

        // маска столкновения (что с чем): "[012][12]"
        let ab = Math.min(S.t, Sj.t) + '' + Math.max(S.t, Sj.t);
        // не проверяю столкновения: корабль+пуля, астероид+астероид, пуля+пуля, все 4 варианта с участием частиц взрыва
        let ignore_ab = ['02', '11', '22', '03', '13', '23', '33'];
        // проверка на ignore_ab + пересечение оболочек + точное попиксельное пересечение
        if ((ignore_ab.indexOf(ab) == -1) && (helpers.distance(S.x, S.y, Sj.x, Sj.y) < S.r + Sj.r) && checkCollision(S, Sj)) {
          if (('01' == ab) && !godMode) { // столкновение корабля с астероидом
            if (--lives > 0) {
              // при уроне без гибели, включаю временный godmode и удаляю астероид целиком
              Sounds.Damage.play();
              godMode = GodModeMax;
              toDelete.push((1 == S.t) ? i : j);
              asteroidBreak((1 == S.t) ? S : Sj);
            } else {
              Sounds.Die.play();
              gameIsStopped = true;
              drawMessage(ctx, `GAME OVER! Score: ${score}. Press ENTER to retry`);
            }
            may_draw = false;
            i = -1; // завершаем обход объектов
            break;
          } else if ('12' == ab) { // пуля попала в астероид
            Sounds.Hit.pause() || Sounds.Hit.play();
            toDelete.push(i, j);
            score += scoreMultiplier;
            AsteroidsMaxCount = Math.trunc(score / 20) + 6;
            // создание обломков
            let A = (1 == S.t) ? S : Sj;
            asteroidBreak(A);

            may_draw = false;
            break;
          }
        }
      }

      // опциональная отрисовка + мигание корабля в godmode каждые 6 тиков
      if (may_draw && (i || !godMode || (Math.trunc(--godMode / 6) % 2))) {
        drawGameObject(S);
      }
    }

    if (toDelete.length) {
      toDelete.sort(function (a, b) {
        return b - a;
      }).forEach(function (i) {
        gameObjects.splice(i, 1);
      });
    }

    asteroidsCount = bulletsCount = 0;
    gameObjects.forEach(function (S) {
      if (1 == S.t) ++asteroidsCount; else if (2 == S.t) ++bulletsCount;
    });

    gameObjects[0].p = 0; // "выключаем" двигатель для корабля на следующий тик после "включения"

    if (!gameIsStopped) {
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = 'white';
      ctx.fillText(Array(Math.max(lives + 1, 0)).join('A '), 5, 12);
      ctx.fillText('Score: ' + score + ' * ' + scoreMultiplier + ' ' + Array(Math.max(BulletsMaxCount - bulletsCount + 1, 1)).join('|'), 50, 12);
    }
  }

  (function () {
    let lastTime = 0;
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback) {
      let currTime = new Date().getTime();
      let timeToCall = Math.max(0, 16 - (currTime - lastTime));
      let id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  })();

  (function renderLoop() {
    render();
    requestAnimationFrame(renderLoop);
  })();

  return (
    <div></div>
  );
}

export default TheGame;
