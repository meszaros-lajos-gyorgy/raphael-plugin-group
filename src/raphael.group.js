/* global Raphael */

// TODO: fix transformation for VML
// VML documentation: https://www.w3.org/TR/NOTE-VML

const scaleRegex = /scale\([^)]*\)/
const rotateRegex = /rotate\([^)]*\)/
const translateRegex = /translate\([^)]*\)/

function adjustTransform (compareRegex, replacementString, transformString) {
  var value = ''

  if (!transformString) {
    value = replacementString
  } else if (!compareRegex.test(transformString)) {
    value = transformString + ' ' + replacementString
  } else {
    value = transformString.replace(compareRegex, replacementString)
  }

  return value
}

function updateScale (privates, scaleX, scaleY) {
  const transform = this.node.getAttribute('transform')
  const value = adjustTransform(scaleRegex, `scale(${scaleX} ${scaleY})`, transform)

  this.node.setAttribute('transform', value)
}

function updateRotation (privates, rotation) {
  const transform = this.node.getAttribute('transform')
  const value = adjustTransform(rotateRegex, `rotate(${rotation})`, transform)

  this.node.setAttribute('transform', value)
}

function updateTranslation (privates, x, y) {
  const transform = this.node.getAttribute('transform')
  const value = adjustTransform(translateRegex, `translate(${x} ${y})`, transform)

  this.node.setAttribute('transform', value)
}

function onMove (privates, dx, dy) {
  privates.lx = (dx * this.dragSpeed) + privates.ox
  privates.ly = (dy * this.dragSpeed) + privates.oy
  this.translate(privates.lx, privates.ly)
}

function onStart (privates) {
  if (this.node.hasAttribute('transform')) {
    let transform = this.node.getAttribute('transform').match(/translate\(([^)]*)\)/)
    if (transform && transform[1] !== undefined) {
      const [x, y] = transform[1].split(' ').map(num => parseFloat(num))
      privates.ox = x
      privates.oy = y
    }
  }
}

function onEnd (privates) {
  privates.ox = privates.lx
  privates.oy = privates.ly
}

function pushOneRaphaelVector (privates, item) {
  if (item.type === 'set') {
    item.forEach(node => pushOneRaphaelVector.apply(this, [privates, node]))
  } else {
    this.node.appendChild(item.node)
    this.set.push(item)
  }
}

// -----------------

var _ = new WeakMap()

function Group (raphael, items) {
  var group = raphael.raphael.vml ? document.createElement('group') : document.createElementNS('http://www.w3.org/2000/svg', 'g')
  raphael.canvas.appendChild(group)

  this.set = raphael.set(items)
  this.dragSpeed = 1
  this.node = group
  this.type = 'group'

  var privates = {
    lx: 0,
    ly: 0,
    ox: 0,
    oy: 0
  }
  privates.onMove = onMove.bind(this, privates)
  privates.onStart = onStart.bind(this, privates)
  privates.onEnd = onEnd.bind(this, privates)
  privates.pushOneRaphaelVector = pushOneRaphaelVector.bind(this, privates)
  privates.updateScale = updateScale.bind(this, privates)
  privates.updateRotation = updateRotation.bind(this, privates)
  privates.updateTranslation = updateTranslation.bind(this, privates)

  _.set(this, privates)
}

Group.prototype = {
  scale: function (newScaleX, newScaleY) {
    var privates = _.get(this)
    if (newScaleY === undefined) {
      newScaleY = newScaleX
    }
    privates.updateScale(newScaleX, newScaleY)
    return this
  },
  rotate: function (deg) {
    var privates = _.get(this)
    privates.updateRotation(deg)
    return this
  },
  translate: function (newTranslateX, newTranslateY) {
    var privates = _.get(this)
    privates.updateTranslation(newTranslateX, newTranslateY)
    return this
  },
  push: function (item) {
    var privates = _.get(this)
    privates.pushOneRaphaelVector(item)
    return this
  },
  getBBox: function () {
    return this.set.getBBox()
  },
  draggable: function () {
    var privates = _.get(this)
    this.set.drag(privates.onMove, privates.onStart, privates.onEnd)
    return this
  }
}

Raphael.fn.group = function (items = []) {
  return new Group(this, items)
}
