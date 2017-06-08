var groupScale        = 1;
var groupStep         = 0.1;
var groupRotation     = 0;
var groupRotationStep = 10;
var draggable         = false;

var r    = Raphael('canvas', '100%', 500);
var rect = r.rect(160, 200, 200, 200).attr({fill:'red', stroke:'black'});
var circ = r.circle(340, 200, 50).attr({fill:'yellow', stroke:'black'});
var g    = r.group().push(rect).push(circ);

var i = 10;
var rectSet = r.set();
var rect;
while(i--){
	rect = r.rect(0, 40 * (i + 1), 40 * (i + 1), 20).attr({fill: 'red', stroke: 'yellow'});
	
	// remove() does not work with IE8
	if(window.addEventListener){
		dom.on(rect.node, 'click', function(){
			this.remove();
		});
	}
	
	rectSet.push(rect); // just for an example of pushing a set into a group later
}

g.push(rectSet);

function updateScale(){
	g.scale(groupScale);
	updateInfo();
}

function updateRotation(){
	g.rotate(groupRotation);
	updateInfo();
}

// ----- UI ----- //

function updateInfo(){
	dom.text(
		document.getElementById('info'),
		'size: ' + groupScale
		+ ' | rotation degree: ' + groupRotation
		+ ' | draggable: ' + (draggable ? 'yes' : 'no')
		+ (draggable ? ' | drag speed: ' + g.dragSpeed : '')
	);
}

dom.on(document.getElementById('increase-size'), 'click', function(){
	groupScale = (groupScale * 10 + groupStep * 10) / 10;
	updateScale();
});
dom.on(document.getElementById('decrease-size'), 'click', function(){
	groupScale = (groupScale * 10 - groupStep * 10) / 10;
	updateScale();
});
dom.on(document.getElementById('rotate-clockwise'), 'click', function(){
	groupRotation = groupRotation + groupRotationStep;
	updateRotation();
});
dom.on(document.getElementById('rotate-counter-clockwise'), 'click', function(){
	groupRotation = groupRotation - groupRotationStep;
	updateRotation();
});
dom.on(document.getElementById('make-it-draggable'), 'click', function(){
	if(!draggable){
		g.draggable(); // you only need this line to make the group draggable
		
		this.setAttribute('disabled', 'disabled');
		document.getElementById('increase-drag-speed').removeAttribute('disabled');
		document.getElementById('decrease-drag-speed').removeAttribute('disabled');
		draggable = true;
		updateInfo();
	}
});
dom.on(document.getElementById('increase-drag-speed'), 'click', function(){
	g.dragSpeed *= 2;
	updateInfo();
});
dom.on(document.getElementById('decrease-drag-speed'), 'click', function(){
	g.dragSpeed /= 2;
	updateInfo();
});

updateInfo();
