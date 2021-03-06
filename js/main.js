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
	nuclearbomb: 'content/nuclearbomb.png',
	gameover:'content/gameover.gif',
	restorehp:'content/restore_hp.png',
	supershot:'content/supershot.png',
	invulnerability: 'content/invulnerability.png',
	shield: 'content/shield.png',
};
var images = {
}


function animate() {
    requestAnimationFrame( animate );
    draw();
}

$(document).ready(function(){
	//tests

	//gameLogics.difficulty.damageAbsorbtionModifier = 0.5;
	//gameLogics.addShooter();
	//gameLogics.addShooter();
	//tests
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
			},
			superShot:{
				active: false,
				el: $(".scores>.superShot>.amount")	
			},
			invulnerability:{
				active: false,
				el: $(".scores>.invulnerability>.amount")	
			}

		}
	}

	loadImages(src,function(){
		canvas = document.getElementById('battlefield');
	    context = canvas.getContext('2d');
	    for(var i = 0;i<shooters.length;i++)
	    {
	    	go.push(new Shooter({
	    		index: i,
	    		position:new Vector2((shooters[i].position.x),shooters[i].position.y)
	    	}));	
	    }
	    
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
	var centralVector = new Vector2(0, -1);
	for(var i = 0;i<shooters.length;i++)
	{
		var mouseVector = new Vector2(mousestate.position.x - shooters[i].position.x, mousestate.position.y - shooters[i].position.y);
		mousestate.mouseVector = mouseVector;
		
		var radians = Math.acos((mouseVector.mulVector(centralVector))/mouseVector.module()*centralVector.module());
		if(mousestate.position.x < shooters[i].position.x){
			radians*=-1;
		}
	
		shooters[i].angle = radians;
	}

	for (var _go in gameLogics.enemies.placed) {
	    if (gameLogics.enemies.placed.hasOwnProperty(_go)) {
	        var distance = mousestate.position.distance(gameLogics.enemies.placed[_go].position);
			if(distance!=undefined && distance  <= gameLogics.enemies.placed[_go].radius && !(gameLogics.enemies.placed[_go] instanceof EnemyRobot) && gameLogics.enemies.placed[_go].getRandomDestination){
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
	for(var i = 0;i<shooters.length;i++)
	{
		shooters[i].spread.currentSpread = 0;
	}
});

$(document).on('keypress', function(e){
	if(e.charCode == 32)
	{
		var now = new Date;
		gameLogics.isPaused = !gameLogics.isPaused;
		if(gameLogics.isPaused)
		{
			gameLogics.bonuses.speedDecrease.tillTo = gameLogics.bonuses.speedDecrease.activatedTillTo - now;
			gameLogics.bonuses.superShot.tillTo = gameLogics.bonuses.superShot.activatedTillTo - now;
		}
		else{
			gameLogics.bonuses.speedDecrease.activatedTillTo = new Date(+now +gameLogics.bonuses.speedDecrease.tillTo);
			gameLogics.bonuses.superShot.activatedTillTo = new Date(+now +gameLogics.bonuses.superShot.tillTo);
		}
	}

	if(e.charCode == 98)
	{
		go.push(new TimeBonus({
			position: new Vector2(getRandom(15,battlefield.height-15),getRandom(15,battlefield.width)),
			bonusType: 5
		}));		
	}
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
			case '4':
				gameLogics.difficulty.timeBonusDissapearModifier*=gameLogics.difficultySettings.timeBonusDissapearModifierMultiplier;
				break;
			case '5':
				gameLogics.difficulty.bonusesTimeToLiveModifier+=gameLogics.difficultySettings.bonusesTimeToLiveModifierIncrement;
				break;
			case '6':
				gameLogics.hitPoints.current=gameLogics.hitPoints.maximum;
				break;
			case '7':
				gameLogics.difficulty.damageAbsorbtionModifier*=gameLogics.difficultySettings.damageAbsorbtionModifierMultiplier;
				break;
			case '8':
				gameLogics.addShooter();
				break;
			case '9':
				gameLogics.difficulty.regenerationTimeoutModifier*=gameLogics.difficultySettings.regenerationTimeoutModifierMultiplier;
				break;
			case '10':
				gameLogics.difficulty.hitPointsRegenerationModifier*=gameLogics.difficultySettings.hitPointsRegenerationModifierMultiplier
				break;
			case '11':
				gameLogics.difficulty.shotSpeedModifier+=gameLogics.difficultySettings.shotSpeedModifierIncrement
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

	bonusesWork(now);

 	var i = go.length;
	while (i--) {
		if(!gameLogics.isPaused && !gameLogics.gameOver)
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
	//$('#debug').html('shots.length = ' + go.length + '<br/>' + 'mousestate: ' + JSON.stringify(mousestate) + '<br/> shooter angle: ' + shooters[0].angle);

	if(scores.total.count > gameLogics.difficulty.nextLevelScores){
		gameLogics.nextLevel();
	}

	scores.difficulty.levelEl.html(gameLogics.difficulty.level);

	drawHealthBar();
	if(gameLogics.hitPoints.current > 0) //regeneration
	{
		if(!gameLogics.isPaused && !gameLogics.gameOver)
		{
			gameLogics.regeneration();
		}
	}
	else
	{
		gameLogics.gameOver = true;
		drawGameOver();
	}
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

  function drawHealthBar(){
  	context.save();
  	var hpBarHeight = battlefield.height-40;
  	roundRect(battlefield.width - 10,10,5,hpBarHeight,5,'#F00','#0F0');
  	if(gameLogics.hitPoints.current > 0)
  	{
  		var currentHeight = hpBarHeight*gameLogics.hitPoints.current/100;
  	  	roundRect(battlefield.width - 9,11+hpBarHeight - currentHeight -2,3,currentHeight,0,'#0F0',undefined);
  	}
  	context.restore();
  }

  function drawGameOver() {
  	if(this.opacity == undefined)
  	{
  		this.opacity = 0;
  		this.opacityIncrement = 0.01;
  		this.animation = new Animated({	
				totalFrameCount: 60,
				framesInRow: 10,
				framesRowsCount: 6,
				frameChangeDelay: 20,
				explosionImageType: 2,
				destinationFrameSize: new Vector2(64,64),
				sourceFrameSize: new Vector2(64,64),
				position: new Vector2(100,100),
				loop: true
			})
  	}

  	context.beginPath();
    context.rect(0, 0, battlefield.width, battlefield.height);
    context.fillStyle = 'rgba(225,225,225,'+this.opacity+')';
    context.fill();
    this.opacity+=this.opacityIncrement;
    if(this.opacity > 0.5)
    {
    	this.opacity = 0.5;
    	this.animation.render();
    	this.animation.update();
    }
  }

	function bonusesWork(now)
	{
		var freezeActiveAmount = now - (gameLogics.isPaused? new Date(+now +gameLogics.bonuses.speedDecrease.tillTo): gameLogics.bonuses.speedDecrease.activatedTillTo);
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

	 	var superShotActiveAmount = now - (gameLogics.isPaused? new Date(+now +gameLogics.bonuses.superShot.tillTo): gameLogics.bonuses.superShot.activatedTillTo);//gameLogics.bonuses.superShot.activatedTillTo;
		scores.bonuses.superShot.active = superShotActiveAmount < 0;

	 	if(scores.bonuses.superShot.active)
	 	{
	 		if(!scores.bonuses.superShot.el.is(":visible"))
	 		{
	 			scores.bonuses.superShot.el.parent().show();	
	 		}
	 		scores.bonuses.superShot.el.html(parseInt(superShotActiveAmount/-1000));
	 	}
	 	else
	 	{
	 		if(scores.bonuses.superShot.el.is(":visible"))
	 		{
		 		scores.bonuses.superShot.el.parent().hide();
		 	}
	 	}

	 	var invulnerabilityActiveAmount = now - (gameLogics.isPaused? new Date(+now +gameLogics.bonuses.invulnerability.tillTo): gameLogics.bonuses.invulnerability.activatedTillTo);//gameLogics.bonuses.invulnerability.activatedTillTo;
		scores.bonuses.invulnerability.active = invulnerabilityActiveAmount < 0;

	 	if(scores.bonuses.invulnerability.active)
	 	{
	 		if(!scores.bonuses.invulnerability.el.is(":visible"))
	 		{
	 			scores.bonuses.invulnerability.el.parent().show();	
	 		}
	 		scores.bonuses.invulnerability.el.html(parseInt(invulnerabilityActiveAmount/-1000));
	 	}
	 	else
	 	{
	 		if(scores.bonuses.invulnerability.el.is(":visible"))
	 		{
		 		scores.bonuses.invulnerability.el.parent().hide();
		 	}
	 	}

	}