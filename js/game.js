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
			maxAmount: 1	
		},
		robots: {
			currentAmount: 0,
			maxAmount: 1	
		},
		placed: {},
		healthModifier: 1
	},
	getRandomDestinationDelay: 1000
}

var GO = function(){
	this.position = new Vector2;
	this.alive = true;
	this.id = '';
	this.setDead = function() {
		delete gameLogics.enemies.placed[this.id];
		this.alive = false;
		if(this instanceof EnemyTank){
			gameLogics.enemies.tanks.currentAmount--;	
		}
		else if(this instanceof EnemyRobot){
			gameLogics.enemies.robots.currentAmount--;	
		}
		else if(this instanceof Enemy){
			gameLogics.enemies.soldier.currentAmount--;	
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
			maxSpread: 400
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