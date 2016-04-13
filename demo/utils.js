var utils, dom;

(function(){
	'use strict';
	
	// we need to be able to call window.attachEvent.apply in utils.on()
	if(window.attachEvent && !window.attachEvent.apply){
		window.attachEvent = Function.prototype.call.bind(window.attachEvent, window);
	}

	utils = {
		cloneArray : function(a){
			// http://stackoverflow.com/q/3199588/1806628
			// Array.prototype.slice.call does not support objects, like NodeList in IE8
			var arr = [];
			for(var i = a.length; i--; arr.unshift(a[i]));
			return arr;
		}
	};

	dom = {
		on : function(/*element, eventName, handler, useCapture*/){
			var args    = utils.cloneArray(arguments);
			var element = args.shift();
			var oldIE   = !element.addEventListener;
			
			if(oldIE){
				args = ['on' + args[0], args[1].bind(element)];
			}
			
			element[oldIE ? 'attachEvent' : 'addEventListener'].apply(element, args);
			return this;
		},
		off : function(/*element, eventName, handler, useCapture*/){
			var args    = utils.cloneArray(arguments);
			var element = args.shift();
			var oldIE   = !element.addEventListener;
			
			if(oldIE){
				args   = ['on' + args[0], args[1].bind(element)];
			}
			
			element[oldIE ? 'detachEvent' : 'removeEventListener'].apply(element, args);
			return this;
		},
		text : function(element, content){
			var method = 'textContent' in element ? 'textContent' : 'innerText';
			if(content){
				element[method] = content;
				return this;
			}else{
				return element[method];
			}
		}
	};
})();