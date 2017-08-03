// raphael-plugin-group - created by Lajos Meszaros <m_lajos@hotmail.com> - MIT licence - last built on 2017-08-04
var RaphaelGrid = (function (exports) {
'use strict';

/* global Raphael */

/**
 * This was swiped from the RaphaelJS example here: http://raphaeljs.com/analytics.js and modified for my own purposes
 */
Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
  if ( color === void 0 ) color = '#000';

  var path = [
    'M', Math.round(x), Math.round(y),
    'L', Math.round(x + w),
    Math.round(y),
    Math.round(x + w),
    Math.round(y + h),
    Math.round(x),
    Math.round(y + h),
    Math.round(x),
    Math.round(y)
  ];
  var rowHeight = h / hv;
  var columnWidth = w / wv;

  for (var i = 1; i < hv; i++) {
    path.push(['M', Math.round(x), Math.round(y + i * rowHeight), 'H', Math.round(x + w)]);
  }

  for (var i$1 = 1; i$1 < wv; i$1++) {
    path.push(['M', Math.round(x + i$1 * columnWidth), Math.round(y), 'V', Math.round(y + h)]);
  }

  return this.path(path.join(',')).attr({stroke: color})
};

return exports;

}({}));
