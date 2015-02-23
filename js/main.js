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
	explosion: 'content/explosion.png',
	robot: 'content/robot.png',
	missile: 'content/missile.png',
	ice: 'content/ice.png',
	nuclearbomb: 'content/nuclearbomb.png'
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
			el: $(".scores>.soldiers>.count")	
		},
		tanks: {
			count: 0,
			el: $(".scores>.tanks>.count")	
		},
		robots: {
			count: 0,
			el: $(".scores>.robots>.count")		
		},
		total: {
			count: 0,
			el: $(".scores>.total>.count")		
		},
		difficulty: {
			levelEl: $(".scores>.level>.amount")
		},
		bonuses: {
			freeze:{
				active: false,
				el: $(".scores>.freeze>.amount")	
			}
			
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
	absorbTouchEvent(e);
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
			if(distance!=undefined && distance  <= gameLogics.enemies.placed[_go].radius && !(gameLogics.enemies.placed[_go] instanceof EnemyRobot)){
				gameLogics.enemies.placed[_go].getRandomDestination();	
				break;
			}
	    }
	}


});

$(document).on('mouseout touchleave','#battlefield',function(e){
	absorbTouchEvent(e);
	mousestate.leftButtonDown = false;
});

$(document).on('mousedown touchstart','#battlefield',function(e){
	absorbTouchEvent(e);
	mousestate.leftButtonDown = true;
});

$(document).on('mouseup touchend','#battlefield',function(e){
	//var posX = $(this).offset().left, posY = $(this).offset().top;
	//var target = new Vector2(e.pageX - posX,e.pageY - posY);
	absorbTouchEvent(e);
	mousestate.leftButtonDown = false;
	shooters[0].spread.currentSpread = 0;
});

$(document).on('keypress', function(e){
	if(e.charCode == 32)
	{
		gameLogics.isPaused = !gameLogics.isPaused;
	}

	// if(e.charCode == 98)
	// {		
	// }
});

$(document).on('click', '.bafs>div', function(e){
	var el = $(e.currentTarget);
	var type = el.attr('type');
	if(type!=undefined){
		switch(type){
			case '1':
				gameLogics.difficulty.spreadAngleIncreaseModifier *=gameLogics.difficultySettings.spreadAngleIncreaseModifierMultiplier;
				break;
			case '2':
				gameLogics.difficulty.hitPowerModifier+=gameLogics.difficultySettings.hitPowerModifierIncrement;
				break;
			case '3':
				gameLogics.difficulty.fireRateModifier*=gameLogics.difficultySettings.fireRateModifierMultiplier;
				break;
			default:
				break;
		}
	}
	$('.bafs').remove();
	gameLogics.isPaused = false;
});

function draw(){
	var now = new Date;
	if(!gameLogics.isPaused && mousestate.leftButtonDown){
		for(var i = 0;i<shooters.length;i++){
			if(now - shooters[i].spread.spreadIncreaseDate > shooters[i].spread.spreadIncreaseDelay){
				shooters[i].spread.spreadIncreaseDate = now;
				shooters[i].spread.currentSpread +=gameLogics.difficulty.spreadAngleIncreaseModifier;//shooters[i].spread.spreadAngleIncrease;
				if(shooters[i].spread.currentSpread > shooters[i].spread.maxSpreadAngle){
					shooters[i].spread.currentSpread  = shooters[i].spread.maxSpreadAngle; 
				}
			}


			if((now - shooters[i].lastTimeShoot) > shooters[i].shootDelay*gameLogics.difficulty.fireRateModifier){
				var pos = new Vector2(shooters[i].position.x,shooters[i].position.y);
				var spreadAngle = getRandom(-1*shooters[i].spread.currentSpread,shooters[i].spread.currentSpread);
				var dir = pos.direction(new Vector2(mousestate.position.x,mousestate.position.y)).rotate(spreadAngle);

				go.push(new Shot(
					{
						position:pos,
						direction:dir
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

	if(gameLogics.enemies.robots.currentAmount < gameLogics.enemies.robots.maxAmount){
		var robotPosition = new Vector2(getRandom(18,battlefield.width-18),10);
		go.push(new EnemyRobot({position: robotPosition, destination: new Vector2(robotPosition.x, getRandom(battlefield.height / 8,battlefield.height / 4)),direction:new Vector2(0,1)}));
		gameLogics.enemies.robots.currentAmount++;
	}

	context.drawImage(images.background,0,0,battlefield.width,battlefield.height);
	// context.fillStyle = 'rgb(245,245,245)';
 // 	context.fillRect( 0, 0, battlefield.width, battlefield.height );
	var freezeActiveAmount = now - gameLogics.bonuses.speedDecrease.activatedTillTo;
	scores.bonuses.freeze.active = freezeActiveAmount < 0;

 	if(scores.bonuses.freeze.active)
 	{
 		gameLogics.bonuses.speedDecrease.value = 0.1
 		if(!scores.bonuses.freeze.el.is(":visible"))
 		{
 			scores.bonuses.freeze.el.parent().show();	
 		}
 		scores.bonuses.freeze.el.html(parseInt(freezeActiveAmount/-1000));
 	}
 	else
 	{
 		gameLogics.bonuses.speedDecrease.value = gameLogics.bonuses.speedDecrease.defaultValue;
 		if(scores.bonuses.freeze.el.is(":visible"))
 		{
	 		scores.bonuses.freeze.el.parent().hide();
	 	}
 	}


 	var i = go.length;
	while (i--) {
		if(!gameLogics.isPaused)
		{
			go[i].update();
		}
		go[i].render();
		if(!go[i].alive){
			var deleted = go.splice(i,1);
		}
	}

	if(scores.soldiers.count > 0 && !scores.soldiers.el.is(":visible"))
	{
		scores.soldiers.el.parent().show();	
	}
	scores.soldiers.el.html(scores.soldiers.count);
	if(scores.tanks.count > 0 && !scores.tanks.el.is(":visible"))
	{
		scores.tanks.el.parent().show();	
	}
	scores.tanks.el.html(scores.tanks.count);
	if(scores.robots.count > 0 && !scores.robots.el.is(":visible"))
	{
		scores.robots.el.parent().show();	
	}
	scores.robots.el.html(scores.robots.count);

	scores.total.el.html(scores.total.count);
	$('#debug').html('shots.length = ' + go.length + '<br/>' + 'mousestate: ' + JSON.stringify(mousestate) + '<br/> shooter angle: ' + shooters[0].angle);

	if(scores.total.count > gameLogics.difficulty.nextLevelScores){
		gameLogics.nextLevel();
	}

	scores.difficulty.levelEl.html(gameLogics.difficulty.level);
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