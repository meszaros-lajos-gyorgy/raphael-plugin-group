(function() {
	'use strict';
	
	function updateScale(privates, transform, scaleX, scaleY) {
		var scaleString = 'scale(' + scaleX + ' ' + scaleY + ')';
		if (!transform) {
			return scaleString;
		}
		if (transform.indexOf('scale(') < 0) {
			return transform + ' ' + scaleString;
		}
		return transform.replace(/scale\(-?[0-9]*?\.?[0-9]*?\ -?[0-9]*?\.?[0-9]*?\)/, scaleString);
	}
	
	function updateRotation(privates, transform, rotation) {
		var rotateString = 'rotate(' + rotation + ')';
		if (!transform) {
			return rotateString;
		}
		if (transform.indexOf('rotate(') < 0) {
			return transform + ' ' + rotateString;
		}
		return transform.replace(/rotate\(-?[0-9]+(\.[0-9][0-9]*)?\)/, rotateString);
	}
	
	function updateTranslation(privates, transform, x, y) {
		var translateString = 'translate(' + x + ' ' + y + ')';
		if (!transform) {
			return translateString;
		}
		if (transform.indexOf('translate(') < 0) {
			return transform + ' ' + translateString;
		}
		return transform.replace(/translate\(-?[0-9]*?\.?[0-9]*?\ -?[0-9]*?\.?[0-9]*?\)/, translateString);
	}
	
	function onMove(privates, dx, dy) {
		privates.lx = (dx * this.dragSpeed) + privates.ox;
		privates.ly = (dy * this.dragSpeed) + privates.oy;
		this.translate(privates.lx, privates.ly);
	}
	
	function onStart(privates) {
		if (this.node.hasAttribute('transform')) {
			var transform = this.node.getAttribute('transform').match(/translate\(([^)]*)\)/);
			if (transform && transform[1] !== undefined) {
				var t = transform[1].split(' ');
				privates.ox = parseInt(t[0]);
				privates.oy = parseInt(t[1]);
			}
		}
	}
	
	function onEnd(privates) {
		privates.ox = privates.lx;
		privates.oy = privates.ly;
	}
	
	function pushOneRaphaelVector(privates, item) {
		var i;
		if (item.type === 'set') {
			for (i = 0; i < item.length; i++) {
				pushOneRaphaelVector.apply(this, [privates, item[i]]);
			}
		} else {
			this.node.appendChild(item.node);
			this.set.push(item);
		}
	}
	
	// -----------------
	
	var _ = new WeakMap();
	
	function Group(raphael, items) {
		var group = raphael.raphael.vml ? document.createElement('group') : document.createElementNS('http://www.w3.org/2000/svg', 'g');
		raphael.canvas.appendChild(group);
		
		this.set = raphael.set(items);
		this.dragSpeed = 1;
		this.node = group;
		this.type = 'group';
		
		var privates = {
			lx : 0,
			ly : 0,
			ox : 0,
			oy : 0
		};
		privates.onMove = onMove.bind(this, privates);
		privates.onStart = onStart.bind(this, privates);
		privates.onEnd = onEnd.bind(this, privates);
		privates.pushOneRaphaelVector = pushOneRaphaelVector.bind(this, privates);
		privates.updateScale = updateScale.bind(this, privates);
		privates.updateRotation = updateRotation.bind(this, privates);
		privates.updateTranslation = updateTranslation.bind(this, privates);
		
		_.set(this, privates);
	}
	
	Group.prototype = {
		scale: function (newScaleX, newScaleY) {
			var privates = _.get(this);
			if (newScaleY == undefined) {
				newScaleY = newScaleX;
			}
			this.node.setAttribute('transform', privates.updateScale(this.node.getAttribute('transform'), newScaleX, newScaleY));
			return this;
		},
		rotate: function(deg) {
			var privates = _.get(this);
			this.node.setAttribute('transform', privates.updateRotation(this.node.getAttribute('transform'), deg));
			return this;
		},
		push: function(item) {
			var privates = _.get(this);
			privates.pushOneRaphaelVector(item);
			return this;
		},
		translate: function(newTranslateX, newTranslateY) {
			var privates = _.get(this);
			this.node.setAttribute('transform', privates.updateTranslation(this.node.getAttribute('transform'), newTranslateX, newTranslateY));
			return this;
		},
		getBBox: function() {
			var privates = _.get(this);
			return this.set.getBBox();
		},
		draggable: function() {
			var privates = _.get(this);
			this.set.drag(privates.onMove, privates.onStart, privates.onEnd);
			return this;
		}
	};
	
	Raphael.fn.group = function(/*items:[]*, config:{}*/) {
		var hasItems = Array.isArray(arguments[0]);
		var config   = hasItems ? {} : arguments[0];
		var items    = arguments[hasItems ? 0 : 1];
		
		return new Group(this, items);
	};
})();