# Group plugin for RaphaelJS

A RaphaelJS plugin, which adds support for the SVG `<g>` tag.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UQCK5GG46L4D8)
[![Build Status](https://travis-ci.org/meszaros-lajos-gyorgy/raphael-plugin-group.svg?branch=master)](https://travis-ci.org/meszaros-lajos-gyorgy/raphael-plugin-group)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Original notes by: [Matthew Taylor](https://github.com/rhyolight)

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

## Requirements

Though **raphael.group.js** may work in a browser as old as IE8, it uses some Javascript features, which might not be supported by that browser. For this purpose a separate **polyfills.js** can be included among the plugins to patch up old browsers.
