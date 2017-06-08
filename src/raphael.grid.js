/* global Raphael */

/**
 * This was swiped from the RaphaelJS example here: http://raphaeljs.com/analytics.js and modified for my own purposes
 */
Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color = '#000') {
  const path = [
    'M', Math.round(x), Math.round(y),
    'L', Math.round(x + w),
    Math.round(y),
    Math.round(x + w),
    Math.round(y + h),
    Math.round(x),
    Math.round(y + h),
    Math.round(x),
    Math.round(y)
  ]
  const rowHeight = h / hv
  const columnWidth = w / wv

  for (let i = 1; i < hv; i++) {
    path.push(['M', Math.round(x), Math.round(y + i * rowHeight), 'H', Math.round(x + w)])
  }

  for (let i = 1; i < wv; i++) {
    path.push(['M', Math.round(x + i * columnWidth), Math.round(y), 'V', Math.round(y + h)])
  }

  return this.path(path.join(',')).attr({stroke: color})
}
