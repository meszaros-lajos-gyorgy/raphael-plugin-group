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

// ES6 WeakMap shim (https://github.com/Polymer/WeakMap/blob/master/weakmap.js):
if(typeof WeakMap === 'undefined'){
	(function(){
		var defineProperty = Object.defineProperty;
		var counter = Date.now() % 1e9;
		
		var WeakMap = function(){
			this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
		};
		
		WeakMap.prototype = {
			set: function(key, value){
				var entry = key[this.name];
				if (entry && entry[0] === key){
					entry[1] = value;
				}else{
					defineProperty(key, this.name, {value: [key, value], writable: true});
				}
				return this;
			},
			get: function(key){
				var entry;
				return (
					(entry = key[this.name]) && entry[0] === key
					? entry[1]
					: undefined
				);
			},
			delete: function(key){
				var entry = key[this.name];
				if(!entry){
					return false;
				}
				var hasValue = entry[0] === key;
				entry[0] = entry[1] = undefined;
				return hasValue;
			},
			has: function(key){
				var entry = key[this.name];
				if(!entry){
					return false;
				}
				return entry[0] === key;
			}
		};
		
		window.WeakMap = WeakMap;
	})();
}