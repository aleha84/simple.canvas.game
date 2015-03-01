var TimeBonus = function(timeBonusProperties) {
	GO.call(this);
	this.id = 'timeBonus' + (TimeBonus.counter++);
	this.radius = 15;
	this.speed = 0;
	this.position = timeBonusProperties.position;
	this.bonusType = timeBonusProperties.bonusType;
	switch(this.bonusType)
	{
		case 1:
			this.img = images.ice;
			break;
		case 2:
			this.img = images.nuclearbomb;
			break;
		case 3:
			this.img = images.restorehp;
			break;
		default:
			break;
	}
	gameLogics.enemies.placed[this.id] = this;
	this.scale = new Vector2(1,1);
	this.baseSize = new Vector2(30,30);
	this.dissapearTimeOut = 3000;
	this.creationTime = new Date;
	this.hitted = function(hitPower){
		this.setDead();
		var now = new Date;
		switch(this.bonusType)
		{
			case 1:
				gameLogics.bonuses.speedDecrease.activatedTillTo = scores.bonuses.freeze.active? new Date(+gameLogics.bonuses.speedDecrease.activatedTillTo+(gameLogics.bonuses.speedDecrease.timeToLive*gameLogics.difficulty.bonusesTimeToLiveModifier)) :new Date(+now +(gameLogics.bonuses.speedDecrease.timeToLive*gameLogics.difficulty.bonusesTimeToLiveModifier));	
				break;
			case 2:
				go.unshift(new Animated({	
					totalFrameCount: 81,
					framesInRow: 9,
					framesRowsCount: 9,
					frameChangeDelay: 6,
					explosionImageType: 1,
					destinationFrameSize: new Vector2(250,250),
					sourceFrameSize: new Vector2(100,100),
					position: new Vector2(this.position.x, this.position.y)
				}));

				for (var _go in gameLogics.enemies.placed) {
				    if (gameLogics.enemies.placed.hasOwnProperty(_go)) {
				        var distance = this.position.distance(gameLogics.enemies.placed[_go].position);
						if(distance!=undefined && distance  <= 175){
							gameLogics.enemies.placed[_go].hitted(100);
						}
				    }
				}
				break;
			case 3:
				gameLogics.hitPoints.current+=10;
				if(gameLogics.hitPoints.current > gameLogics.hitPoints.maximum)
				{
					gameLogics.hitPoints.current = gameLogics.hitPoints.maximum;	
				}
				break;
			default:
				break;
		}
	}
	this.getRandomDestination = function(){}

	this.radianCounter = 0;
}

TimeBonus.counter = 0;
TimeBonus.prototype = Object.create(GO.prototype);
TimeBonus.prototype.render = function(){
	if(!this.alive){
		return false;
	}
	context.translate(this.position.x, this.position.y);
	context.drawImage(this.img, -this.radius, -this.radius,this.baseSize.x * this.scale.x,this.baseSize.y * this.scale.y);
	context.translate(-this.position.x, -this.position.y);
}
TimeBonus.prototype.update = function(){
	var now = new Date;
	
	if(now - this.creationTime > this.dissapearTimeOut*gameLogics.difficulty.timeBonusDissapearModifier)
	{
		this.setDead();
	}

	if(!this.alive){
		return false;
	}

	this.scale.x = Math.abs(Math.cos(this.radianCounter))*0.2 + 0.8;
	this.scale.y = Math.abs(Math.cos(this.radianCounter))*0.2 + 0.8;
	this.radianCounter+=0.05;
}