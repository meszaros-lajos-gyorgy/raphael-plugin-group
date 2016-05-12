(function() {
	'use strict';
	
	// TODO: fix transformation for VML
	// VML documentation: https://www.w3.org/TR/NOTE-VML
	
	function updateScale(privates, scaleX, scaleY) {
		var transform = this.node.getAttribute('transform');
		
		var value = '';
		var scaleString = 'scale(' + scaleX + ' ' + scaleY + ')';
		
		if (!transform) {
			value = scaleString;
		}else if (transform.indexOf('scale(') === -1) {
			value = transform + ' ' + scaleString;
		}else{
			value = transform.replace(/scale\(-?[0-9]*?\.?[0-9]*?\ -?[0-9]*?\.?[0-9]*?\)/, scaleString);
		}
		
		this.node.setAttribute('transform', value);
	}
	
	function updateRotation(privates, rotation) {
		var transform = this.node.getAttribute('transform');
		
		var value = '';
		var rotateString = 'rotate(' + rotation + ')';
		
		if (!transform) {
			value = rotateString;
		}else if (transform.indexOf('rotate(') === -1) {
			value = transform + ' ' + rotateString;
		}else{
			value = transform.replace(/rotate\(-?[0-9]+(\.[0-9][0-9]*)?\)/, rotateString);
		}
		
		this.node.setAttribute('transform', value);
	}
	
	function updateTranslation(privates, x, y) {
		var transform = this.node.getAttribute('transform');
		
		var value = '';
		var translateString = 'translate(' + x + ' ' + y + ')';
		
		if (!transform) {
			value = translateString;
		}else if (transform.indexOf('translate(') === -1) {
			value = transform + ' ' + translateString;
		}else{
			value = transform.replace(/translate\(-?[0-9]*?\.?[0-9]*?\ -?[0-9]*?\.?[0-9]*?\)/, translateString);
		}
		
		this.node.setAttribute('transform', value);
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
			privates.updateScale(newScaleX, newScaleY);
			return this;
		},
		rotate: function(deg) {
			var privates = _.get(this);
			privates.updateRotation(deg);
			return this;
		},
		translate: function(newTranslateX, newTranslateY) {
			var privates = _.get(this);
			privates.updateTranslation(newTranslateX, newTranslateY);
			return this;
		},
		push: function(item) {
			var privates = _.get(this);
			privates.pushOneRaphaelVector(item);
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
	
	Raphael.fn.group = function(/* items:[]*, config:{} */) {
		var hasItems = Array.isArray(arguments[0]);
		var config   = hasItems ? {} : arguments[0];
		var items    = arguments[hasItems ? 0 : 1];
		
		return new Group(this, items);
	};
})();