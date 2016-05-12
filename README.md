# RaphaelJS plugins

_Original notes by: [Matthew Taylor](https://github.com/rhyolight)_

This is an updated version of the Raphael.group.js plugin. It adds support for moving groups and scaling the X and Y axis independently. 

**WARNING**: These plugins were not tested in IE, and I don't care.

These are plugins I've created for the RaphaelJS library (~~[http://raphaeljs.com/](http://raphaeljs.com/)~~ => https://github.com/DmitryBaranovskiy/raphael) for my own personal use. Feel free to use them as well.

## Update!

If you don't need to worry about IE8 (or below) users, then I suggest you to migrate over to the newer SnapSVG library,
which is more lightweight, produced by the same author, has a similar syntax and has all the features of SVG covered, that was missing from RaphaelJS, including groups.

RaphaelJS tries to even out the differences between SVG and the old, outdated Microsoft Vector Markup Language (VML).
It only supports features, which are present in both SVG and VML, and grouping is only supported in SVG.

## Links

* [SnapSVG homepage](http://snapsvg.io/)
* [RaphaelJS project](https://github.com/DmitryBaranovskiy/raphael)

## Requirement

Though **Raphael.group.js** may be working in a browser as old as IE8, it uses the following new ES5 and ES6 features:

* [Array.prototype.isArray (ES5)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
* [Function.prototype.bind (ES5)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
* [WeakMap (ES6)](https://developer.mozilla.org/hu/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

The polyfills for these are not included in the raphael plugins themselves, but instead present in the **polyfills.min.js** file.
