// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
if (!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

Raphael.fn.group = function(/*items:[]*, config:{}*/){
	'use strict';
	
	var hasItems  = Array.isArray(arguments[0]);
	var config    = hasItems ? {} : arguments[0];
	var items     = arguments[hasItems ? 0 : 1];
	var set       = this.set(items);
	var group     = this.raphael.vml ? document.createElement('group') : document.createElementNS('http://www.w3.org/2000/svg', 'g');
	var dragSpeed = 1;
	
	// -----------------
	
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
	
	// -----------------
	
	this.canvas.appendChild(group);
	
	return {
		type: 'group',
		node: group,
		scale: function (newScaleX, newScaleY) {
			if(newScaleY == undefined){
				newScaleY = newScaleX;
			}
			group.setAttribute('transform', updateScale(group.getAttribute('transform'), newScaleX, newScaleY));
			return this;
		},
		rotate: function(deg) {
			group.setAttribute('transform', updateRotation(group.getAttribute('transform'), deg));
			return this;
		},
		push: function(item) {
			function pushOneRaphaelVector(it){
				var i;
				if (it.type === 'set') {
					for (i=0; i< it.length; i++) {
						pushOneRaphaelVector(it[i]);
					}
				} else {
					group.appendChild(it.node);
					set.push(it);
				}
			}
			pushOneRaphaelVector(item)
			return this;
		},
		translate: function(newTranslateX, newTranslateY) {
			group.setAttribute('transform', updateTranslation(group.getAttribute('transform'), newTranslateX, newTranslateY));
			return this;
		},
		getBBox: function() {
			return set.getBBox();
		},
		draggable: function(){
			var lx = 0;
			var ly = 0;
			var ox = 0;
			var oy = 0;
			var self = this;
			
			function onMove(dx, dy){
				lx = (dx * dragSpeed) + ox;
				ly = (dy * dragSpeed) + oy;
				self.translate(lx, ly);
			}
			function onStart(){
				if(group.hasAttribute('transform')){
					var transform = group.getAttribute('transform').match(/translate\(([^)]*)\)/);
					if(transform && transform[1] !== undefined){
						var t = transform[1].split(' ');
						ox = parseInt(t[0]);
						oy = parseInt(t[1]);
					}
				}
			}
			function onEnd(){
				ox = lx;
				oy = ly;
			}
			
			set.drag(onMove, onStart, onEnd);
			return this;
		},
		setDragSpeed: function(s){
			dragSpeed = s;
			return this;
		},
		getDragSpeed: function(){
			return dragSpeed;
		}
	};
};