var TimeBonus = function(timeBonusProperties) {
	GO.call(this);
	this.id = 'timeBonus' + (TimeBonus.counter++);
	this.radius = 15;
	this.speed = 0;
	this.position = timeBonusProperties.position;
	this.bonusType = timeBonusProperties.bonusType;
	this.img = timeBonusProperties.image;
	gameLogics.enemies.placed[this.id] = this;
	this.scale = new Vector2(1,1);
	this.baseSize = new Vector2(30,30);
	this.dissapearTimeOut = 3000;
	this.creationTime = new Date;
	this.hitted = function(hitPower){
		this.setDead();
		var now = new Date;
		if(this.bonusType == 1)
		{
			gameLogics.bonuses.speedDecrease.activatedTillTo = scores.bonuses.freeze.active? new Date(+gameLogics.bonuses.speedDecrease.activatedTillTo+gameLogics.bonuses.speedDecrease.timeToLive) :new Date(+now +gameLogics.bonuses.speedDecrease.timeToLive);	
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
	
	if(now - this.creationTime > this.dissapearTimeOut)
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