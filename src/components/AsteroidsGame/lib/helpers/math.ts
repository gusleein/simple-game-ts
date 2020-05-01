/**
 * Created by @gusleein (Andrey Sanatullov)
 * https://github.com/gusleein
 *
 * on 01/05/2020.
 */

export function random(m?: number): number {
  m = m || 1;
  return Math.random() * m
}

export function d2r(d: number): number {
  return d * Math.PI / 180;
}

export function r2d(r: number): number {
  return r * 180 / Math.PI;
}

export function sin(v: number): number {
  return Math.sin(d2r(v));
}

export function cos(v: number): number {
  return Math.cos(d2r(v))
}

// расстояние между двумя точками
function distance(x0: number, y0: number, x1: number, y1: number): number {
  return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
}
