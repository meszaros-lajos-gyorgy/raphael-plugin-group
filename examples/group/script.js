var groupScale        = 1;
var groupStep         = 0.1;
var groupRotation     = 0;
var groupRotationStep = 10;
var draggable         = false;

var r    = Raphael('canvas', '100%', 500);
var square = r.rect(160, 200, 200, 200).attr({fill:'red', stroke:'black'/*, transform: 't100 120r30 0 0s1.1'*/});

/*
	//the transform string above in rect results in this XML:
	<?xml:namespace prefix = rvml ns = "urn:schemas-microsoft-com:vml" />
	<rvml:shape style="POSITION: absolute; FILTER: ; WIDTH: 1px; HEIGHT: 1px; TOP: 0px; BEHAVIOR: url(#default#VML); LEFT: 0px" class=rvml raphael="true" raphaelid="0" coordsize = "21600,21600" filled = "t" fillcolor = "red" stroked = "t" strokecolor = "black" path = " m3456000,4320000 l7776000,4320000,7776000,8640000,3456000,8640000 xe">
		<rvml:stroke class=rvml opacity = "1" miterlimit = "8"></rvml:stroke>
		<rvml:skew class=rvml on = "t" matrix = "62429f,-36045f,36044f,62429f,0,0" offset = "7256349f,4495356f"></rvml:skew>
		<rvml:fill class=rvml type = "solid"></rvml:fill>
	</rvml:shape>
*/

var circ = r.circle(340, 200, 50).attr({fill:'yellow', stroke:'black'});
var g    = r.group().push(square).push(circ);

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
