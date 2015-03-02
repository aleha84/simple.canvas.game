var battlefield = {
	width: 800,
	height: 600,
}

var scores = undefined;

var gameLogics = {
	gameOver: false,
	enemies: {
		soldier: {
			currentAmount: 0,
			maxAmount: 10
		},
		tanks: {
			currentAmount: 0,
			maxAmount: 0	
		},
		robots: {
			currentAmount: 0,
			maxAmount: -1	
		},
		placed: {},
		
	},
	difficulty:{
		healthModifier: 1,
		speedModifier: 1,
		nextLevelScores: 100,
		level: 1,
		hitPowerModifier: 1,
		spreadAngleIncreaseModifier: 1,
		fireRateModifier: 1,
		hitPointsRegenerationModifier: 1,
		timeBonusDissapearModifier: 1,
		bonusesTimeToLiveModifier: 1,
		damageAbsorbtionModifier: 1,
		regenerationTimeoutModifier: 1,
	},
	difficultySettings:{
		spreadAngleIncreaseModifierMultiplier: 0.75,
		hitPowerModifierIncrement: 1.5,
		healthModifierIncrement: 0.1,
		speedModifierIncrement: 0.1,
		fireRateModifierMultiplier: 0.85,
		hitPointsRegenerationModifierMultiplier: 1.1,
		timeBonusDissapearModifierMultiplier: 1.5,
		bonusesTimeToLiveModifierIncrement: 0.2,
		damageAbsorbtionModifierMultiplier: 0.9,
		regenerationTimeoutModifierMultiplier: 0.9,
		maxAmountsIncrement: {
			soldier: 1,
			tanks: 0.25,
			robots: 0.1
		}
	},
	bonuses: {
		speedDecrease: {
			defaultValue: 1,
			value:1,
			timeToLive: 6000,
			activatedTillTo: new Date,
		},
		superShot:{
			timeToLive: 3000,
			activatedTillTo: new Date,	
		}
	},
	hitPoints: {
		current: 100,
		maximum: 100,
		regenerationTimeout:4000,
		lastTimeRegeneration: new Date,
	},
	regeneration: function(){
		var now = new Date;
		if(now - this.hitPoints.lastTimeRegeneration > this.hitPoints.regenerationTimeout*this.difficulty.regenerationTimeoutModifier)
		{
			this.hitPoints.lastTimeRegeneration = now;
			this.hitPoints.current+=1*this.difficulty.hitPointsRegenerationModifier;
			if(this.hitPoints.current > this.hitPoints.maximum)
			{
				this.hitPoints.current = this.hitPoints.maximum	
			}
		}
		
	},
	nextLevel: function(){
		var defaultsLevelUps = [
			{ class: 'scatter', text: '<span>Lower scatter<br/>Current: <b>'+gameLogics.difficulty.spreadAngleIncreaseModifier+'</b><br/>Next: <b>'+(gameLogics.difficulty.spreadAngleIncreaseModifier*gameLogics.difficultySettings.spreadAngleIncreaseModifierMultiplier)+'</b></span>', type: '1'},
			{ class: 'hitPower', text: '<span>Higher hit power<br/>Current: <b>'+gameLogics.difficulty.hitPowerModifier+'</b><br/>Next: <b>'+(gameLogics.difficulty.hitPowerModifier+gameLogics.difficultySettings.hitPowerModifierIncrement)+'</b></span>', type: '2'},
			{ class: 'fireRate', text: '<span>Higher fire rate<br/>Current: <b>'+gameLogics.difficulty.fireRateModifier+'</b><br/>Next: <b>'+(gameLogics.difficulty.fireRateModifier*gameLogics.difficultySettings.fireRateModifierMultiplier)+'</b></span>', type: '3'},
			{ class: 'timeOutDissapear', text: '<span>Higher bonus dissapear time<br/>Current: <b>'+(3000*gameLogics.difficulty.timeBonusDissapearModifier)+'</b><br/>Next: <b>'+(3000*(gameLogics.difficulty.timeBonusDissapearModifier*gameLogics.difficultySettings.timeBonusDissapearModifierMultiplier))+'</b></span>', type: '4'},
			{ class: 'bonusTimeToLive', text: '<span>Higher bonus lifetime<br/>Current: <b>'+(6000*gameLogics.difficulty.bonusesTimeToLiveModifier)+'</b><br/>Next: <b>'+(6000*(gameLogics.difficulty.bonusesTimeToLiveModifier+gameLogics.difficultySettings.bonusesTimeToLiveModifierIncrement))+'</b></span>', type: '5'},
			{ class: 'restoreLife', text: '<span>Restore hit points</span>', type: '6'},
			{ class: 'damageAbsorbtion', text: '<span>Damage absorbtion<br/>Current: <b>'+(gameLogics.difficulty.damageAbsorbtionModifier)+'</b><br/>Next: <b>'+(gameLogics.difficulty.damageAbsorbtionModifier*gameLogics.difficultySettings.damageAbsorbtionModifierMultiplier)+'</b></span>', type: '7'},
			{ class: 'addShooter', text: '<span>Add shooter<br/>Current: <b>'+(shooters.length)+'</b><br/>Next: <b>'+(shooters.length+1)+'</b></span>', type: '8'},
			{ class: 'regenTimeOut', text: '<span>Regeneration timeout<br/>Current: <b>'+(gameLogics.hitPoints.regenerationTimeout*gameLogics.difficulty.regenerationTimeoutModifier)+'</b><br/>Next: <b>'+(gameLogics.hitPoints.regenerationTimeout*(gameLogics.difficulty.regenerationTimeoutModifier*gameLogics.difficultySettings.regenerationTimeoutModifierMultiplier))+'</b></span>', type: '9'},
			{ class: 'regenAmount', text: '<span>Regeneration amount<br/>Current: <b>'+(1*gameLogics.difficulty.hitPointsRegenerationModifier)+'</b><br/>Next: <b>'+(1*gameLogics.difficulty.hitPointsRegenerationModifier*gameLogics.difficultySettings.hitPointsRegenerationModifierMultiplier)+'</b></span>', type: '10'},
		];
		this.difficulty.level++;
		this.difficulty.nextLevelScores = Math.pow(this.difficulty.level,2)*100;
		this.difficulty.healthModifier +=this.difficultySettings.healthModifierIncrement;
		this.difficulty.speedModifier +=this.difficultySettings.speedModifierIncrement;
		this.enemies.soldier.maxAmount += this.difficultySettings.maxAmountsIncrement.soldier;
		this.enemies.tanks.maxAmount += this.difficultySettings.maxAmountsIncrement.tanks;
		this.enemies.robots.maxAmount += this.difficultySettings.maxAmountsIncrement.robots;
		if(this.difficulty.level%2 == 0)
		{
			gameLogics.isPaused =true;
			var $selectBafs = $('<div>', { class: 'bafs', css: {
				width: battlefield.width + 'px',
				margin: (battlefield.height /2 - 50) + 'px 0px'
			}});
			var currentlevelUps = defaultsLevelUps.slice();
			for(var i = 0;i<3;i++)
			{
				var index = parseInt(getRandom(0,currentlevelUps.length));
				var levelUp = currentlevelUps.splice(index,1);
				if(levelUp.length == 1)
				{
					$selectBafs.append($('<div>',{class: levelUp[0].class,html: levelUp[0].text, type: levelUp[0].type}));	
				}
				
			}
			// $selectBafs.append($('<div>',{class: 'scatter',text: 'Lower scatter', type: '1'}));
			// $selectBafs.append($('<div>',{class: 'hitPower',text: 'Higher hit power', type: '2'}));
			// $selectBafs.append($('<div>',{class: 'fireRate',text: 'Higher fire rate', type: '3'}));
			$('body').append($selectBafs);
		}
	},
	addShooter: function(){
		if(shooters.length >= 8)
		{
			alert('To many shooters, sorry.');
			return;
		}
		var newPosition = new Vector2(getRandom(15,battlefield.width-15),battlefield.height-20);
		var isNear = true;
		while(isNear)
		{
			isNear = false;
			for(var i = 0;i<shooters.length;i++)
			{
				if(Math.abs(shooters[i].position.x-newPosition.x) < 40)
				{
					isNear = true;
					newPosition = new Vector2(getRandom(15,battlefield.width-15),battlefield.height-20);
					break;
				}
			}
		}
		shooters.push(
		{
			position: new Vector2(newPosition.x,battlefield.height-20),
			lastTimeShoot: new Date(),
			shootDelay: 400,
			angle: 0.78539816339745,
			spread : {
				spreadIncreaseDate: new Date,
				spreadIncreaseDelay: 100,
				currentSpread: 0,
				maxSpread: 400,
				maxSpreadAngle: 45,
			}
		}
		);

		go.push(new Shooter({
    		index: shooters.length-1,
    		position:new Vector2((shooters[shooters.length-1].position.x),shooters[shooters.length-1].position.y)
    	}));
	},
	getRandomDestinationDelay: 1000,
	isPaused: false,
}

var GO = function(){
	this.position = new Vector2;
	this.alive = true;
	this.id = '';
	this.setDead = function() {
		delete gameLogics.enemies.placed[this.id];
		this.alive = false;
		var tryGetBonus = false;
		if(this instanceof EnemyTank){
			gameLogics.enemies.tanks.currentAmount--;	
			tryGetBonus = true;
		}
		else if(this instanceof EnemyRobot){
			gameLogics.enemies.robots.currentAmount--;	
			tryGetBonus = true;
		}
		else if(this instanceof Enemy){
			gameLogics.enemies.soldier.currentAmount--;	
			tryGetBonus = true;
		}	
		if(tryGetBonus && getRandom(0,25) <= 1)
		{
			var type = parseInt(getRandom(1,4));
			go.push(new TimeBonus({
				position: new Vector2(getRandom(15,battlefield.height-15),getRandom(15,battlefield.width)),
				bonusType: type
			}));
		}
	}
}

GO.prototype.isAlive = function(){ return this.alive;}

var shooters = [
	{
		position: new Vector2(battlefield.width/2,battlefield.height-20),
		lastTimeShoot: new Date(),
		shootDelay: 100,
		angle: 0.78539816339745,
		spread : {
			spreadIncreaseDate: new Date,
			spreadIncreaseDelay: 100,
			currentSpread: 0,
			maxSpread: 400,
			maxSpreadAngle: 45,
			//spreadAngleIncrease: 1*gameLogics.difficulty.spreadAngleIncreaseModifier,
		}
	},
];

//var shots = [];







var Remains = function(remainsProperty){
	GO.call(this);
	this.position = remainsProperty.position;
	this.timeToShow = 2000;
	this.createDate = new Date;
	this.alpha = 1;
	this.radius = 12;
	this.remainsType = 1;
}

Remains.prototype = Object.create(GO.prototype);
Remains.prototype.render = function(){
	if(!this.alive){
		return false;
	}
	context.save();
	context.globalAlpha = this.alpha;
	context.drawImage(
		this.remainsType == 1?
			images.soldierRemains: 
			this.remainsType == 2? 
				images.tankRemains: 
				images.soldierRemains
		, this.position.x - this.radius, this.position.y - this.radius);
	context.restore();
}

Remains.prototype.update = function(){
	if(!this.alive){
		return false;
	}

	var now = new Date;
	if((now - this.createDate) >this.timeToShow){
		this.alive = false;
	}

	var alpha = 1 - ((now - this.createDate)/this.timeToShow);
	if(alpha > 1){ alpha = 1;}
	this.alpha = alpha;

	if(this.remainsType ==1){
		this.position.y-=0.1;
	}
}

var TankRemains = function(remainsProperty){
	Remains.call(this, remainsProperty);
	this.radius = 20;
	this.remainsType = 2;
}

TankRemains.prototype = Object.create(Remains.prototype);

var Shooter = function(shooterPropertis){
	GO.call(this);
	this.position = shooterPropertis.position;
	this.angle = 0;
	this.radius = 12;
	this.index = shooterPropertis.index;
}

Shooter.prototype = Object.create(GO.prototype);
Shooter.prototype.render = function(){
	//console.log('gun');
	context.save();
    context.translate(this.position.x,this.position.y);
    context.rotate(this.angle);
	context.drawImage(images.gun, -this.radius, -this.radius);
    context.restore();


	//context.translate(this.position.x,this.position.x);
	//context.rotate(this.angle);
	//context.drawImage(images.gun, this.position.x - this.radius, this.position.y - this.radius);
	//context.rotate(-this.angle);
	//context.translate(-this.position.x,-this.position.x);
}

Shooter.prototype.update = function(){
	this.angle = shooters[this.index].angle;
}