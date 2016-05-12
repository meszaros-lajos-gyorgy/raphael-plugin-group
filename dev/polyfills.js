// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill
if (!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}
		
		var toArray = function(a){
			var arr = [];
			for(var i = a.length; i--; arr.unshift(a[i]));
			return arr;
		};
		var aArgs   = toArray(arguments).slice(1);
		var fToBind = this;
		var fNOP    = function() {};
		var fBound  = function() {
			return fToBind.apply(
				this instanceof fNOP ? this : oThis,
				aArgs.concat(toArray(arguments))
			);
		};

		fNOP.prototype   = this.prototype;
		fBound.prototype = new fNOP();
		
		return fBound;
	};
}