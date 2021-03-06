// raphael-plugin-group - created by Lajos Meszaros <m_lajos@hotmail.com> - MIT licence - last built on 2017-08-04
/* eslint-disable */

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
    }

    var toArray = function (a) {
      var arr = [];
      for (var i = a.length; i--; arr.unshift(a[i])){  }
      return arr
    };
    var aArgs = toArray(arguments).slice(1);
    var fToBind = this;
    var fNOP = function () {};
    var fBound = function () {
      return fToBind.apply(
        this instanceof fNOP ? this : oThis,
        aArgs.concat(toArray(arguments))
      )
    };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound
  };
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Polyfill
if (!Date.now) {
  Date.now = function now () {
    return new Date().getTime()
  };
}

// https://raw.githubusercontent.com/webcomponents/webcomponentsjs/master/src/WeakMap/WeakMap.js
if (typeof WeakMap === 'undefined') {
  (function () {
    var defineProperty = Object.defineProperty;
    var counter = Date.now() % 1e9;

    var WeakMap = function () {
      this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
    };

    WeakMap.prototype = {
      set: function (key, value) {
        var entry = key[this.name];
        if (entry && entry[0] === key) {
          entry[1] = value;
        } else {
          if (window.attachEvent) {
            key[this.name] = [key, value];
          } else {
            defineProperty(key, this.name, {value: [key, value], writable: true});
          }
        }
        return this
      },
      get: function (key) {
        var entry;
        return (entry = key[this.name]) && entry[0] === key ? entry[1] : undefined
      },
      'delete': function (key) {
        var entry = key[this.name];
        if (!entry || entry[0] !== key) { return false }
        entry[0] = entry[1] = undefined;
        return true
      },
      has: function (key) {
        var entry = key[this.name];
        if (!entry) { return false }
        return entry[0] === key
      }
    };

    window.WeakMap = WeakMap;
  })();
}

/* eslint-enable */
