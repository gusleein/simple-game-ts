

export function R(m) {m=m||1; return Math.random()*m};
export function d2r(d) {return d*Math.PI/180};
export function r2d(r) {return r*180/Math.PI};
export function sin(v) {return Math.sin(d2r(v))};
export function cos(v) {return Math.cos(d2r(v))};