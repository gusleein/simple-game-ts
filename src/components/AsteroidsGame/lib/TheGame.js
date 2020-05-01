import React from 'react';
import {Paths, Sounds} from './consts';
import * as helpers from './helpers';

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
  const bulletsMax = 8;
  // скорость снаряда
  const bulletSpeed = 5;
  // неуязвимость время в кадрах
  const godModeMax = 120;
  const maxShipSpeed = 3;
  const stopped = true;

  // объекты на игровом поле
  // objs[0] это всегда корабль
  let objs = [];
  let bullets_cnt = 0;
  let asteroids_cnt = 0;
  let asteroids_max = 6;
  let lives = 3;
  let score = 0;
  let godMode = godModeMax;

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
  function obj_add(t, p, x, y, b, sx, sy, ss, a, sa, ttl) {
    let r = Math.trunc(Math.sqrt(2) * (b >> 1));
    objs.push({t: t, p: p, x: x, y: y, b: b, b2: (b >> 1), r: r, sx: sx, sy: sy, ss: ss, a: a, sa: sa, ttl: ttl});
  }

  // добавление астероида на игровое поле
  function asteroid_add(x, y, b) {
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
    obj_add(1, p, x, y, b, -x / (helpers.random(WindowParams.width) + (WindowParams.width >> 2)), -y / (helpers.random(WindowParams.height) + (WindowParams.height >> 2)), 1, helpers.random(360), helpers.random(8) - 4, -1);
  }

  function obj_draw(S, fill, padding) {
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

  function dist(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
  }

  function init() {
    let objs = [], bullets_cnt = 0, asteroids_cnt = 0, asteroids_max = 6, lives = 3, score = 0, godmode = godModeMax;
    obj_add(0, 0, 0, 0, 26, 0, 0, 1.01, 0, 0, -1);
  }

  function drawMsg(ctx, text) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WindowParams.width, WindowParams.height);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(txt, WindowParams.width2, WindowParams.height2);
    ctx.restore();
  }

  // столкновения
  function test_collision(a, b) {
    let collision = false;
    ctx2.save();
    ctx2.fillStyle = '#000';
    ctx2.fillRect(0, 0, WindowParams.width + 2 * canvas2_padding, WindowParams.height + 2 * canvas2_padding);
    ctx2.globalAlpha = 0.5;
    obj_draw(a, '#F00', canvas2_padding);
    obj_draw(b, '#0F0', canvas2_padding);

    let x0 = Math.min(a.x - a.r, b.x - b.r),
      y0 = Math.min(a.y - a.r, b.y - b.r),
      x1 = Math.max(a.x + a.r, b.x + b.r),
      y1 = Math.max(a.y + a.r, b.y + b.r);

    let data = ctx2.getImageData(x0 + WindowParams.width2 + canvas2_padding, y0 + WindowParams.height2 + canvas2_padding, x1 - x0 + 1, y1 - y0 + 1).data;
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
  function asteroid_break(A) {
    // осколки
    let asize = 10 * parseInt(A.b / 10 - (helpers.random(2) + 1));
    if (asize > 0) {
      for (let r = parseInt(helpers.random(2) + 1); r > 0; --r) {
        asteroid_add(A.x, A.y, asize);
      }
    }
    // мусор
    for (let r = parseInt(helpers.random(2) + 3); r > 0; --r) {
      let a = helpers.random(360);
      obj_add(3, 2, A.x, A.y, 2, sin(a), -cos(a), 1, 0, 0, 30);
    }
  }

  document.onmousemove = function (e) {
    let v = {x: (e.pageX - WindowParams.width2 - objs[0].x), y: (e.pageY - WindowParams.height2 - objs[0].y)};
    objs[0].a = helpers.r2d((Math.acos(-v.y / (Math.sqrt(v.x * v.x + v.y * v.y))));
    if (e.pageX - WindowParams.width2 < objs[0].x) {
      objs[0].a = (360 - objs[0].a);
    }
  };
  document.onkeydown = function (e) {
    if (e.code === '13'/*enter*/ && stopped) {
      stopped = false;
      init();
    } else if ((e.code === '38'/*up*/) || (e.code === '87'/*W*/)) {
      if (Math.sqrt(Math.pow(objs[0].sx, 2) + Math.pow(objs[0].sy, 2)) > maxShipSpeed) return;
      Sounds.Impulse.pause() || Sounds.Impulse.play();
      objs[0].p = 1; // для "мигания" двигателем при ускорении меняю геометрию корабля на вариант с пламенем
      objs[0].sx += 2 * sin(objs[0].a);
      objs[0].sy -= 2 * cos(objs[0].a);
    }
  };
  document.onclick = function (e) {
    if (stopped || (bullets_cnt >= bulletsMax)) return;
    Sounds.Shoot.pause() || Sounds.Shoot.play();
    let S = objs[0];
    // пуля вылетает из "носа" корабля, а не из его центра
    let x = S.x + S.b2 * sin(S.a),
      y = S.y - S.b2 * cos(S.a);
    obj_add(2, 2, x, y, 4, bulletSpeed * sin(S.a), -bulletSpeed * cos(S.a), 1, 0, 10, 60);
  };

  init();
  drawMsg(ctx, 'Asteroids! Press ENTER to begin');

  function render() {
    if (stopped) return;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WindowParams.width, WindowParams.height);

    while (asteroids_cnt < asteroids_max) {
      asteroid_add();
      ++asteroids_cnt;
    }

    let score_multiplier = Math.max(1, parseInt(asteroids_cnt / 5));

    let to_delete = [];
    for (let i = objs.length - 1; i >= 0; --i) {
      if (to_delete.indexOf(i) > -1) continue;
      let S = objs[i];

      // обработка короткоживущих объектов
      if ((S.ttl > -1) && (!--S.ttl)) {
        to_delete.push(i);
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
        if (to_delete.indexOf(j) > -1) continue;
        let Sj = objs[j];

        // маска столкновения (что с чем): "[012][12]"
        let ab = Math.min(S.t, Sj.t) + '' + Math.max(S.t, Sj.t);
        // не проверяю столкновения: корабль+пуля, астероид+астероид, пуля+пуля, все 4 варианта с участием частиц взрыва
        let ignore_ab = ['02', '11', '22', '03', '13', '23', '33'];
        // проверка на ignore_ab + пересечение оболочек + точное попиксельное пересечение
        if ((ignore_ab.indexOf(ab) == -1) && (dist(S.x, S.y, Sj.x, Sj.y) < S.r + Sj.r) && test_collision(S, Sj)) {
          if (('01' == ab) && !godMode) { // столкновение корабля с астероидом
            if (--lives > 0) {
              // при уроне без гибели, включаю временный godmode и удаляю астероид целиком
              Sounds.Damage.play();
              godMode = godModeMax;
              to_delete.push((1 == S.t) ? i : j);
              asteroid_break((1 == S.t) ? S : Sj);
            } else {
              Sounds.Die.play();
              stopped = true;
              drawMsg(ctx, `GAME OVER! Score: ${score}. Press ENTER to retry`);
            }
            may_draw = false;
            i = -1; // завершаем обход объектов
            break;
          } else if ('12' == ab) { // пуля попала в астероид
            Sounds.Hit.pause() || Sounds.Hit.play();
            to_delete.push(i, j);
            score += score_multiplier;
            asteroids_max = parseInt(score / 20) + 6;
            // создание обломков
            let A = (1 == S.t) ? S : Sj;
            asteroid_break(A);

            may_draw = false;
            break;
          }
        }
      }

      // опциональная отрисовка + мигание корабля в godmode каждые 6 тиков
      if (may_draw && (i || !godMode || (parseInt(--godMode / 6) % 2))) {
        obj_draw(S);
      }
    }

    if (to_delete.length) {
      to_delete.sort(function (a, b) {
        return b - a;
      }).forEach(function (i) {
        objs.splice(i, 1);
      });
    }

    asteroids_cnt = bullets_cnt = 0;
    objs.forEach(function (S) {
      if (1 == S.t) ++asteroids_cnt; else if (2 == S.t) ++bullets_cnt;
    });

    objs[0].p = 0; // "выключаем" двигатель для корабля на следующий тик после "включения"

    if (!stopped) {
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = 'white';
      ctx.fillText(Array(Math.max(lives + 1, 0)).join('A '), 5, 12);
      ctx.fillText('Score: ' + score + ' * ' + score_multiplier + ' ' + Array(Math.max(bulletsMax - bullets_cnt + 1, 1)).join('|'), 50, 12);
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

  (function renderloop() {
    render();
    requestAnimationFrame(renderloop);
  })();

  return (
    <div></div>
  );
}

export default TheGame;
