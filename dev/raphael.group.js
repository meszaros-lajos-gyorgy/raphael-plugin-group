(function() {
	'use strict';
	
	function updateScale(transform, scaleX, scaleY) {
		var scaleString = 'scale(' + scaleX + ' ' + scaleY + ')';
		if (!transform) {
			return scaleString;
		}
		if (transform.indexOf('scale(') < 0) {
			return transform + ' ' + scaleString;
		}
		return transform.replace(/scale\(-?[0-9]*?\.?[0-9]*?\ -?[0-9]*?\.?[0-9]*?\)/, scaleString);
	}
	
	function updateRotation(transform, rotation) {
		var rotateString = 'rotate(' + rotation + ')';
		if (!transform) {
			return rotateString;
		}
		if (transform.indexOf('rotate(') < 0) {
			return transform + ' ' + rotateString;
		}
		return transform.replace(/rotate\(-?[0-9]+(\.[0-9][0-9]*)?\)/, rotateString);
	}
	
	function updateTranslation(transform, x, y) {
		var translateString = 'translate(' + x + ' ' + y + ')';
		if (!transform) {
			return translateString;
		}
		if (transform.indexOf('translate(') < 0) {
			return transform + ' ' + translateString;
		}
		return transform.replace(/translate\(-?[0-9]*?\.?[0-9]*?\ -?[0-9]*?\.?[0-9]*?\)/, translateString);
	}
	
	function onMove(dx, dy) {
		this.lx = (dx * this.dragSpeed) + this.ox;
		this.ly = (dy * this.dragSpeed) + this.oy;
		this.translate(this.lx, this.ly);
	}
	function onStart() {
		if (this.node.hasAttribute('transform')) {
			var transform = this.node.getAttribute('transform').match(/translate\(([^)]*)\)/);
			if (transform && transform[1] !== undefined) {
				var t = transform[1].split(' ');
				this.ox = parseInt(t[0]);
				this.oy = parseInt(t[1]);
			}
		}
	}
	function onEnd() {
		this.ox = this.lx;
		this.oy = this.ly;
	}
	function pushOneRaphaelVector(item) {
		var i;
		if (item.type === 'set') {
			for (i = 0; i < item.length; i++) {
				pushOneRaphaelVector.apply(this, [item[i]]);
			}
		} else {
			this.node.appendChild(item.node);
			this.set.push(item);
		}
	}
	
	// -----------------
	
	function Group(raphael, items) {
		var group = raphael.raphael.vml ? document.createElement('group') : document.createElementNS('http://www.w3.org/2000/svg', 'g');
		raphael.canvas.appendChild(group);
		
		this.set = raphael.set(items);
		this.dragSpeed = 1;
		this.node = group;
		this.type = 'group';
		
		this.lx = 0;
		this.ly = 0;
		this.ox = 0;
		this.oy = 0;
		
		this.onMove = onMove.bind(this);
		this.onStart = onStart.bind(this);
		this.onEnd = onEnd.bind(this);
		this.pushOneRaphaelVector = pushOneRaphaelVector.bind(this);
	}
	
	Group.prototype = {
		scale: function (newScaleX, newScaleY) {
			if (newScaleY == undefined) {
				newScaleY = newScaleX;
			}
			this.node.setAttribute('transform', updateScale(this.node.getAttribute('transform'), newScaleX, newScaleY));
			return this;
		},
		rotate: function(deg) {
			this.node.setAttribute('transform', updateRotation(this.node.getAttribute('transform'), deg));
			return this;
		},
		push: function(item) {
			this.pushOneRaphaelVector(item);
			return this;
		},
		translate: function(newTranslateX, newTranslateY) {
			this.node.setAttribute('transform', updateTranslation(this.node.getAttribute('transform'), newTranslateX, newTranslateY));
			return this;
		},
		getBBox: function() {
			return this.set.getBBox();
		},
		draggable: function() {
			this.set.drag(this.onMove, this.onStart, this.onEnd);
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