window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
})();

var mousestate = {
	position: new Vector2,
	mouseVector: new Vector2,
	leftButtonDown: false
}

var canvas, context;

var go = [];
var src = {
	gun: 'content/gun.png',
	enemyImage: 'content/soldier.png',
	soldierRemains: 'content/soldierremains.png',
	background: 'content/bg.jpg',
	tank: 'content/tank.png',
	tankRemains: 'content/tankremains.png',
	explosion: 'content/explosion.png'
};
var images = {
}


function animate() {
    requestAnimationFrame( animate );
    draw();
}

$(document).ready(function(){
	scores = {
		soldiers: {
			count: 0,
			el: $(".scores>.soldiers")	
		}
	}

	loadImages(src,function(){
		canvas = document.getElementById('battlefield');
	    context = canvas.getContext('2d');
	    go.push(new Shooter({position:new Vector2((battlefield.width/2),580)}))
	    animate();
	});


/*
	images.enemyImage.onload = function() {
        canvas = document.getElementById('battlefield');
	    context = canvas.getContext('2d');
	    //shots.push(new Shot({position:new Vector2(400,580),direction:new Vector2(0,-1)}))
	    //shots.push(new Shot({position:new Vector2(400,580),direction:new Vector2(-0.5,-0.5)}))
	    //shots.push(new Shot({position:new Vector2(400,580),direction:new Vector2(0.5,-0.5)}))
	    //go.push(new Enemy({position:new Vector2(400,10),direction:new Vector2(0,1)}))
	    animate();
    };
*/	
});

$(document).on('mousemove touchmove','#battlefield',function(e){
	var posX = $(this).offset().left, posY = $(this).offset().top;
	var eventPos = pointerEventToXY(e);
	mousestate.position = new Vector2(eventPos.x - posX,eventPos.y - posY);

	var mouseVector = new Vector2(mousestate.position.x - shooters[0].position.x, mousestate.position.y - shooters[0].position.y);
	mousestate.mouseVector = mouseVector;
	var centralVector = new Vector2(0, -1);
	var radians = Math.acos((mouseVector.mulVector(centralVector))/mouseVector.module()*centralVector.module());
	if(mousestate.position.x < shooters[0].position.x){
		radians*=-1;
	}

	shooters[0].angle = radians;

	for (var _go in gameLogics.enemies.placed) {
	    if (gameLogics.enemies.placed.hasOwnProperty(_go)) {
	        var distance = mousestate.position.distance(gameLogics.enemies.placed[_go].position);
			if(distance!=undefined && distance  <= gameLogics.enemies.placed[_go].radius){
				gameLogics.enemies.placed[_go].getRandomDestination();	
				break;
			}
	    }
	}


});

$(document).on('mouseout touchleave','#battlefield',function(){
	mousestate.leftButtonDown = false;
});

$(document).on('mousedown touchstart','#battlefield',function(){
	mousestate.leftButtonDown = true;
});

$(document).on('mouseup touchend','#battlefield',function(){
	//var posX = $(this).offset().left, posY = $(this).offset().top;
	//var target = new Vector2(e.pageX - posX,e.pageY - posY);
	mousestate.leftButtonDown = false;
	shooters[0].spread.currentSpread = 0;
});

function draw(){
	var now = new Date;
	if(mousestate.leftButtonDown){
		for(var i = 0;i<shooters.length;i++){
			if(now - shooters[i].spread.spreadIncreaseDate > shooters[i].spread.spreadIncreaseDelay){
				shooters[i].spread.spreadIncreaseDate = now;
				shooters[i].spread.currentSpread +=10;
			}


			if((now - shooters[i].lastTimeShoot) > shooters[i].shootDelay){
				go.push(new Shot(
					{
						position:new Vector2(shooters[i].position.x,shooters[i].position.y),
						direction:shooters[i].position.direction(
							new Vector2(
								getRandom(mousestate.position.x-shooters[i].spread.currentSpread,mousestate.position.x+shooters[i].spread.currentSpread),
								getRandom(mousestate.position.y-shooters[i].spread.currentSpread,mousestate.position.y+shooters[i].spread.currentSpread)
								)
						)
					}
				));	
				shooters[i].lastTimeShoot = now;
			}
			
		}	
	}
	
	if(gameLogics.enemies.soldier.currentAmount < gameLogics.enemies.soldier.maxAmount){
		go.push(new Enemy({position:new Vector2(getRandom(12,battlefield.width-12),10),direction:new Vector2(0,1)}));
		gameLogics.enemies.soldier.currentAmount++;
	}

	if(gameLogics.enemies.tanks.currentAmount < gameLogics.enemies.tanks.maxAmount){
		go.push(new EnemyTank({position:new Vector2(getRandom(18,battlefield.width-18),10),direction:new Vector2(0,1)}));
		gameLogics.enemies.tanks.currentAmount++;
	}

	context.drawImage(images.background,0,0,battlefield.width,battlefield.height);
	// context.fillStyle = 'rgb(245,245,245)';
 // 	context.fillRect( 0, 0, battlefield.width, battlefield.height );
	
 	var i = go.length;
	while (i--) {
		go[i].update();
		go[i].render();
		if(!go[i].alive){
			var deleted = go.splice(i,1);
		}
	}

	scores.soldiers.el.html(scores.soldiers.count);
	$('#debug').html('shots.length = ' + go.length + '<br/>' + 'mousestate: ' + JSON.stringify(mousestate) + '<br/> shooter angle: ' + shooters[0].angle);

}

function loadImages(sources, callback) {
    //var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
  }