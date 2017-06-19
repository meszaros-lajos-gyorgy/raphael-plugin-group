/* global Raphael */

// TODO: fix transformation for VML
// VML documentation: https://www.w3.org/TR/NOTE-VML

const scaleRegex = /scale\([^)]*\)/
const rotateRegex = /rotate\([^)]*\)/
const translateRegex = /translate\([^)]*\)/

function adjustTransform (compareRegex, replacementString, transformString) {
  let value = replacementString

  if (transformString) {
    value = (
      compareRegex.test(transformString)
      ? transformString.replace(compareRegex, replacementString)
      : transformString.concat(' ', replacementString)
    )
  }

  return value
}

// -----------------

const updateScale = (self, privates) => (scaleX, scaleY) => {
  if (privates.isVML) {

  } else {
    const transform = self.node.getAttribute('transform')
    const value = adjustTransform(scaleRegex, `scale(${scaleX} ${scaleY})`, transform)

    self.node.setAttribute('transform', value)
  }
}

const updateRotation = (self, privates) => (rotation) => {
  if (privates.isVML) {

  } else {
    const transform = self.node.getAttribute('transform')
    const value = adjustTransform(rotateRegex, `rotate(${rotation})`, transform)

    self.node.setAttribute('transform', value)
  }
}

const updateTranslation = (self, privates) => (x, y) => {
  if (privates.isVML) {
    self.node.style.left = x + 'px'
    self.node.style.top = y + 'px'
  } else {
    const transform = self.node.getAttribute('transform')
    const value = adjustTransform(translateRegex, `translate(${x} ${y})`, transform)

    self.node.setAttribute('transform', value)
  }
}

const onMove = (self, privates) => (dx, dy) => {
  privates.lx = (dx * self.dragSpeed) + privates.ox
  privates.ly = (dy * self.dragSpeed) + privates.oy
  self.translate(privates.lx, privates.ly)
}

const onStart = (self, privates) => () => {
  if (self.node.hasAttribute('transform')) {
    let transform = self.node.getAttribute('transform').match(/translate\(([^)]*)\)/)
    if (transform && transform[1] !== undefined) {
      const [x, y] = transform[1].split(' ').map(num => parseFloat(num))
      privates.ox = x
      privates.oy = y
    }
  }
}

const onEnd = (self, privates) => () => {
  privates.ox = privates.lx
  privates.oy = privates.ly
}

const pushOneRaphaelVector = (self, privates) => (item) => {
  if (item.type === 'set') {
    item.forEach(pushOneRaphaelVector(self, privates))
  } else {
    self.node.appendChild(item.node)
    self.set.push(item)
  }
}

// -----------------

const _ = new WeakMap()

class Group {
  constructor (raphael, items) {
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

    privates.onMove = onMove(this, privates)
    privates.onStart = onStart(this, privates)
    privates.onEnd = onEnd(this, privates)
    privates.pushOneRaphaelVector = pushOneRaphaelVector(this, privates)
    privates.updateScale = updateScale(this, privates)
    privates.updateRotation = updateRotation(this, privates)
    privates.updateTranslation = updateTranslation(this, privates)

    _.set(this, privates)
  }

  scale (newScaleX, newScaleY) {
    _.get(this).updateScale(newScaleX, newScaleY === undefined ? newScaleX : newScaleY)
    return this
  }
  rotate (deg) {
    _.get(this).updateRotation(deg)
    return this
  }
  translate (newTranslateX, newTranslateY) {
    _.get(this).updateTranslation(newTranslateX, newTranslateY)
    return this
  }
  push (item) {
    _.get(this).pushOneRaphaelVector(item)
    return this
  }
  getBBox () {
    return this.set.getBBox()
  }
  draggable () {
    const privates = _.get(this)
    this.set.drag(privates.onMove, privates.onStart, privates.onEnd)
    return this
  }
}

Raphael.fn.group = function (items = []) {
  return new Group(this, items)
}
