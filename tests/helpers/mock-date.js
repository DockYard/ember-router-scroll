/* eslint-disable */

let _Date = Date;
let now = null;

function MockDate() {
  let date;

  if (now !== null) {
    date = new _Date(now);
  } else {
    date = new _Date();
  }

  return date;
}

MockDate.now = function() {
  return new MockDate().valueOf();
};

MockDate.UTC = _Date.UTC;
MockDate.parse = function(dateString) {
  return _Date.parse(dateString);
};
MockDate.toString = function() {
  return _Date.toString();
};
MockDate.prototype = _Date.prototype;


function set(date) {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new TypeError('invalid date -' + date)
  }

  Date = MockDate;
  now = dateObj.valueOf();
}

function reset() {
  Date = _Date;
}

export default {
  set: set,
  reset: reset
};
