// Transistor Math engine: base resistor for a switch, base/collector current from a resistor, and an emitter resistor. Exact integers (ohms, hundredths of a V, hundredths of a mA), half-up on display only. Vbe is the standard 0.7 V chart constant.
function _p(t, err, intDigits, places, lo, hi) {
  t = typeof t === "string" ? t.trim() : "";
  var m = new RegExp("^([0-9]{1," + intDigits + "})(?:\\.([0-9]{1," + places + "}))?$").exec(t);
  if (!m) throw new Error(err);
  var v = parseInt(m[1], 10) * Math.pow(10, places) + (m[2] ? parseInt(m[2].padEnd(places, "0"), 10) : 0);
  if (v < lo || v > hi) throw new Error(err);
  return v;
}
function _pi(t, err, lo, hi) {
  t = typeof t === "string" ? t.trim() : "";
  if (!/^[0-9]{1,8}$/.test(t)) throw new Error(err);
  var v = parseInt(t, 10);
  if (v < lo || v > hi) throw new Error(err);
  return v;
}
var _V = "each voltage must be from 0.01 to 100 V with at most two decimal places";
var _I = "each current must be from 0.01 to 100000 mA with at most two decimal places";
var _R = "the resistor must be a whole number from 1 to 10000000 Ω";
var _B = "beta must be a whole number from 1 to 1000";
var _DROP = "the drive voltage must be more than 0.7 V, the standard base-emitter drop";
function _hu(n, d) { return Math.floor((2 * n + d) / (2 * d)); }
function _dec(v, places) {
  if (v < 0) return "-" + _dec(-v, places);
  var base = Math.pow(10, places);
  var s = String(Math.floor(v / base)), f = String(v % base).padStart(places, "0").replace(/0+$/, "");
  return f ? s + "." + f : s;
}
function _v(v) { return _dec(v, 2) + " V"; }
function _ma(v) { return _dec(v, 2) + " mA"; }
function _ohm(r) { return r + " Ω"; }
function _volt(t) { return _p(t, _V, 3, 2, 1, 10000); }
function _cur(t) { return _p(t, _I, 6, 2, 1, 10000000); }
function _res(t) { return _pi(t, _R, 1, 10000000); }
function _beta(t) { return _pi(t, _B, 1, 1000); }
function _drop(vin100) {
  var d = vin100 - 70;
  if (d <= 0) throw new Error(_DROP);
  return d;
}

function baseTruth(vin, beta, ic) {
  var v = _volt(vin), b = _beta(beta), c = _cur(ic);
  var d = _drop(v);
  var rb = _hu(1000 * d * b, c);
  var ib = _hu(c, b);
  return "With a " + _v(v) + " drive, a 0.7 V junction drop and a beta of " + b + ", switching " + _ma(c) + " calls for a " + _ohm(rb) + " base resistor (" + _ma(ib) + " of base current).";
}
function currentTruth(vin, rb, beta) {
  var v = _volt(vin), r = _res(rb), b = _beta(beta);
  var d = _drop(v);
  var ib = _hu(1000 * d, r);
  var ic = b * ib;
  return "A " + _v(v) + " drive through a " + _ohm(r) + " resistor pushes " + _ma(ib) + " into the base. A beta of " + b + " scales that to " + _ma(ic) + " of collector current.";
}
function emitterTruth(ve, ie) {
  var e = _volt(ve), i = _cur(ie);
  var re = _hu(1000 * e, i);
  return _v(e) + " across the emitter resistor at " + _ma(i) + " works out to " + _ohm(re) + ".";
}
