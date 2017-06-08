/* global Raphael */

/**
 * This was swiped from the RaphaelJS example here: http://raphaeljs.com/analytics.js and modified
 * for my own purposes
 */
Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color = '#000') {
  const rnd = Math.round
  let modifier = 0
  const path = [
    'M', rnd(x) + modifier, rnd(y) + modifier,
    'L', rnd(x + w) + modifier,
    rnd(y) + modifier,
    rnd(x + w) + modifier,
    rnd(y + h) + modifier,
    rnd(x) + modifier,
    rnd(y + h) + modifier,
    rnd(x) + modifier,
    rnd(y) + modifier
  ]
  const rowHeight = h / hv
  const columnWidth = w / wv

  for (let i = 1; i < hv; i++) {
    path.push(['M', rnd(x) + modifier, rnd(y + i * rowHeight) + modifier, 'H', rnd(x + w) + modifier])
  }

  for (let i = 1; i < wv; i++) {
    path.push(['M', rnd(x + i * columnWidth) + modifier, rnd(y) + modifier, 'V', rnd(y + h) + modifier])
  }

  return this.path(path.join(',')).attr({stroke: color})
}
