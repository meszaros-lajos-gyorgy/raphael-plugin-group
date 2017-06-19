/* global Raphael */

// TODO: fix transformation for VML
// VML documentation: https://www.w3.org/TR/NOTE-VML

const scaleRegex = /scale\([^)]*\)/
const rotateRegex = /rotate\([^)]*\)/
const translateRegex = /translate\([^)]*\)/

function adjustTransform (compareRegex, replacementString, transformString) {
  let value = ''

  if (!transformString) {
    value = replacementString
  } else if (!compareRegex.test(transformString)) {
    value = transformString + ' ' + replacementString
  } else {
    value = transformString.replace(compareRegex, replacementString)
  }

  return value
}

// -----------------

function updateScale (privates, scaleX, scaleY) {
  const self = this
  if (privates.isVML) {

  } else {
    const transform = self.node.getAttribute('transform')
    const value = adjustTransform(scaleRegex, `scale(${scaleX} ${scaleY})`, transform)

    self.node.setAttribute('transform', value)
  }
}

function updateRotation (privates, rotation) {
  const self = this
  if (privates.isVML) {

  } else {
    const transform = self.node.getAttribute('transform')
    const value = adjustTransform(rotateRegex, `rotate(${rotation})`, transform)

    self.node.setAttribute('transform', value)
  }
}

function updateTranslation (privates, x, y) {
  const self = this
  if (privates.isVML) {
    self.node.style.left = x + 'px'
    self.node.style.top = y + 'px'
  } else {
    const transform = self.node.getAttribute('transform')
    const value = adjustTransform(translateRegex, `translate(${x} ${y})`, transform)

    self.node.setAttribute('transform', value)
  }
}

function onMove (privates, dx, dy) {
  const self = this
  privates.lx = (dx * self.dragSpeed) + privates.ox
  privates.ly = (dy * self.dragSpeed) + privates.oy
  self.translate(privates.lx, privates.ly)
}

function onStart (privates) {
  const self = this
  if (self.node.hasAttribute('transform')) {
    let transform = self.node.getAttribute('transform').match(/translate\(([^)]*)\)/)
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
  const self = this
  if (item.type === 'set') {
    item.forEach(node => pushOneRaphaelVector.apply(self, [privates, node]))
  } else {
    self.node.appendChild(item.node)
    self.set.push(item)
  }
}

// -----------------

const _ = new WeakMap()

function Group (raphael, items) {
  const privates = {
    lx: 0,
    ly: 0,
    ox: 0,
    oy: 0,
    isVML: raphael.raphael.vml
  }

  let group

  if (privates.isVML) {
    group = document.createElement('rvml:group')

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
    group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  }

  raphael.canvas.appendChild(group)

  this.set = raphael.set(items)
  this.dragSpeed = 1
  this.node = group
  this.type = 'group'

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
    const privates = _.get(this)
    privates.updateScale(newScaleX, newScaleY === undefined ? newScaleX : newScaleY)
    return this
  },
  rotate: function (deg) {
    const privates = _.get(this)
    privates.updateRotation(deg)
    return this
  },
  translate: function (newTranslateX, newTranslateY) {
    const privates = _.get(this)
    privates.updateTranslation(newTranslateX, newTranslateY)
    return this
  },
  push: function (item) {
    const privates = _.get(this)
    privates.pushOneRaphaelVector(item)
    return this
  },
  getBBox: function () {
    return this.set.getBBox()
  },
  draggable: function () {
    const privates = _.get(this)
    this.set.drag(privates.onMove, privates.onStart, privates.onEnd)
    return this
  }
}

Raphael.fn.group = function (items = []) {
  return new Group(this, items)
}
