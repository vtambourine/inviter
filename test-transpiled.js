"use strict";

let foo = (function () {
  var ref = _asyncToGenerator(function* foo() {
    var values = yield getValues();
    console.log(values);
  });

  return function foo() {
    return ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// require('babel-polyfill');

function getValues() {
  return Promise.resolve([1, 2, 3, 4]);
}

foo();
