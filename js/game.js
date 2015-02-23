var battlefield = {
	width: 800,
	height: 600,
}

var scores = undefined;

var gameLogics = {
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
		fireRateModifier: 1
	},
	difficultySettings:{
		spreadAngleIncreaseModifierMultiplier: 0.75,
		hitPowerModifierIncrement: 1.5,
		healthModifierIncrement: 0.1,
		speedModifierIncrement: 0.1,
		fireRateModifierMultiplier: 0.85,
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
	},
	nextLevel: function(){
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
			$selectBafs.append($('<div>',{class: 'scatter',text: 'Lower scatter', type: '1'}));
			$selectBafs.append($('<div>',{class: 'hitPower',text: 'Higher hit power', type: '2'}));
			$selectBafs.append($('<div>',{class: 'fireRate',text: 'Higher fire rate', type: '3'}));
			$('body').append($selectBafs);
		}
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
			var type = parseInt(getRandom(1,3));
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
		position: new Vector2(400,580),
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
	}
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
	this.angle = shooters[0].angle;
}