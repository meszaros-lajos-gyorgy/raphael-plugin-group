// raphael-plugin-group - created by Lajos Meszaros <m_lajos@hotmail.com> - MIT licence - last built on 2017-08-04
var RaphaelGroup = (function (exports) {
'use strict';

/* global Raphael */

// TODO: fix transformation for VML
// VML documentation: https://www.w3.org/TR/NOTE-VML

var scaleRegex = /scale\([^)]*\)/;
var rotateRegex = /rotate\([^)]*\)/;
var translateRegex = /translate\([^)]*\)/;

function adjustTransform (compareRegex, replacementString, transformString) {
  var value = replacementString;

  if (transformString) {
    value = (
      compareRegex.test(transformString)
      ? transformString.replace(compareRegex, replacementString)
      : transformString.concat(' ', replacementString)
    );
  }

  return value
}

// -----------------

// TODO: add ramda to clean this up with curry()
var updateScale = function (self, privates) { return function (scaleX, scaleY) {
  if (privates.isVML) {

  } else {
    var transform = self.node.getAttribute('transform');
    var value = adjustTransform(scaleRegex, ("scale(" + scaleX + " " + scaleY + ")"), transform);

    self.node.setAttribute('transform', value);
  }
}; };

var updateRotation = function (self, privates) { return function (rotation) {
  if (privates.isVML) {

  } else {
    var transform = self.node.getAttribute('transform');
    var value = adjustTransform(rotateRegex, ("rotate(" + rotation + ")"), transform);

    self.node.setAttribute('transform', value);
  }
}; };

var updateTranslation = function (self, privates) { return function (x, y) {
  if (privates.isVML) {
    self.node.style.left = x + 'px';
    self.node.style.top = y + 'px';
  } else {
    var transform = self.node.getAttribute('transform');
    var value = adjustTransform(translateRegex, ("translate(" + x + " " + y + ")"), transform);

    self.node.setAttribute('transform', value);
  }
}; };

var onMove = function (self, privates) { return function (dx, dy) {
  privates.lx = (dx * self.dragSpeed) + privates.ox;
  privates.ly = (dy * self.dragSpeed) + privates.oy;
  self.translate(privates.lx, privates.ly);
}; };

var onStart = function (self, privates) { return function () {
  if (self.node.hasAttribute('transform')) {
    var transform = self.node.getAttribute('transform').match(/translate\(([^)]*)\)/);
    if (transform && transform[1] !== undefined) {
      var ref = transform[1].split(' ').map(function (num) { return parseFloat(num); });
      var x = ref[0];
      var y = ref[1];
      privates.ox = x;
      privates.oy = y;
    }
  }
}; };

var onEnd = function (self, privates) { return function () {
  privates.ox = privates.lx;
  privates.oy = privates.ly;
}; };

var pushOneRaphaelVector = function (self, privates) { return function (item) {
  if (item.type === 'set') {
    item.forEach(pushOneRaphaelVector(self, privates));
  } else {
    self.node.appendChild(item.node);
    self.set.push(item);
  }
}; };

// -----------------

var _ = new WeakMap();

var Group = function Group (raphael, items) {
  var privates = {
    lx: 0,
    ly: 0,
    ox: 0,
    oy: 0,
    isVML: raphael.raphael.vml
  };

  var group;

  if (privates.isVML) {
    group = document.createElement('rvml:group');

    /*
    group.style.behavior = 'url(#default#VML)';
    group.style.position = 'absolute';
    group.style.filter = '';
    group.style.width = '100px';
    group.style.height = '100px';
    group.style.top = '0px';
    group.style.left = '0px';
    group.className = 'rvml';
    */
  } else {
    group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  }

  raphael.canvas.appendChild(group);

  this.set = raphael.set(items);
  this.dragSpeed = 1;
  this.node = group;
  this.type = 'group';

  privates.onMove = onMove(this, privates);
  privates.onStart = onStart(this, privates);
  privates.onEnd = onEnd(this, privates);
  privates.pushOneRaphaelVector = pushOneRaphaelVector(this, privates);
  privates.updateScale = updateScale(this, privates);
  privates.updateRotation = updateRotation(this, privates);
  privates.updateTranslation = updateTranslation(this, privates);

  _.set(this, privates);
};

Group.prototype.scale = function scale (newScaleX, newScaleY) {
  _.get(this).updateScale(newScaleX, newScaleY === undefined ? newScaleX : newScaleY);
  return this
};
Group.prototype.rotate = function rotate (deg) {
  _.get(this).updateRotation(deg);
  return this
};
Group.prototype.translate = function translate (newTranslateX, newTranslateY) {
  _.get(this).updateTranslation(newTranslateX, newTranslateY);
  return this
};
Group.prototype.push = function push (item) {
  _.get(this).pushOneRaphaelVector(item);
  return this
};
Group.prototype.getBBox = function getBBox () {
  return this.set.getBBox()
};
Group.prototype.draggable = function draggable () {
  var privates = _.get(this);
  this.set.drag(privates.onMove, privates.onStart, privates.onEnd);
  return this
};

Raphael.fn.group = function (items) {
  if ( items === void 0 ) items = [];

  return new Group(this, items)
};

return exports;

}({}));
