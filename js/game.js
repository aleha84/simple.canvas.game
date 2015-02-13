var battlefield = {
	width: 800,
	height: 600,
}

var scores = undefined;

var gameLogics = {
	enemies: {
		soldier: {
			currentAmount: 0,
			maxAmount: 0
		},
		tanks: {
			currentAmount: 0,
			maxAmount: 1	
		},
		placed: {}
	},
	getRandomDestinationDelay: 1000
}

var GO = function(){
	this.position = new Vector2;
	this.alive = true;
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
			currentSpread: 0
		}
	}
];

//var shots = [];

var Shot = function(shotProperties){
	GO.call(this);
	this.length = 10;
	this.speed = 10;
	this.direction = shotProperties.direction;
	this.position = shotProperties.position;
	this.hitPower = 1;
	//this.timeToLive = shotProperties.timeToLive;
}
Shot.prototype = Object.create(GO.prototype);
Shot.prototype.render = function(){

	if(!this.alive){
		return false;
	}
	context.beginPath();
	context.lineWidth = 3;
	context.strokeStyle = '#ff0000';
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.position.x - (this.direction.x*this.length), this.position.y - (this.direction.y*this.length));
	context.stroke();

}
Shot.prototype.update = function(){
	if(this.position.x <= 0 || this.position.y <= 0 || this.position.x > battlefield.width || this.position.y > battlefield.height){
		this.alive = false;
	}

	if(!this.alive){
		return false;
	}

	for (var _go in gameLogics.enemies.placed) {
	    if (gameLogics.enemies.placed.hasOwnProperty(_go)) {
	        var distance = this.position.distance(gameLogics.enemies.placed[_go].position);
			if(distance!=undefined && distance  <= gameLogics.enemies.placed[_go].radius){
				this.alive = false;
				gameLogics.enemies.placed[_go].health-=this.hitPower;
				if(gameLogics.enemies.placed[_go].health <= 0)
				{
					gameLogics.enemies.placed[_go].alive = false;
					if(gameLogics.enemies.placed[_go] instanceof Enemy){
						scores.soldiers.count++;
					}
					go.push(new Remains({position: new Vector2(gameLogics.enemies.placed[_go].position.x,gameLogics.enemies.placed[_go].position.y)}))
					break;
				}
			}
	    }
	}

	if(!this.alive){
		return false;
	}

	this.position.add(this.direction.mul(this.speed));	
}

var Enemy = function(enemyProperties){
	GO.call(this);
	this.id = 'enemy' + (Enemy.counter++);
	this.radius = 12;
	this.speed = 1;
	this.health = 1;
	this.direction = enemyProperties.direction;
	this.position = enemyProperties.position;
	this.destination = undefined;
	this.lastTimeGetRandomDestination = (new Date - 2000);
	this.getRandomDestination = function(){
		var now = new Date;
		if(now - this.lastTimeGetRandomDestination > gameLogics.getRandomDestinationDelay){
			this.destination = getRandomDestination({min:this.position.y,max:battlefield.height},{min:12,max:battlefield.width-12})
			this.direction = this.position.direction(this.destination);	
			this.lastTimeGetRandomDestination = now;
		}
	}
}
Enemy.counter = 0;
Enemy.prototype = Object.create(GO.prototype);
Enemy.prototype.render = function(){

	if(!this.alive){
		return false;
	}
	// if(this.destination){
	// 	context.beginPath();
	// 	context.lineWidth = 1;
	// 	context.strokeStyle = '#0000ff';
	//     context.moveTo(this.position.x, this.position.y);
	//     context.lineTo(this.destination.x, this.destination.y);
	// 	context.stroke();	
	// }
	

	context.drawImage(images.enemyImage, this.position.x - this.radius, this.position.y - this.radius);
}
Enemy.prototype.update = function(){
	delete gameLogics.enemies.placed[this.id];
	if(this.position.x <= 0 || this.position.y <= 0 || this.position.x > battlefield.width || this.position.y > battlefield.height){
		this.alive = false;
	}

	if(!this.alive){
		return false;
	}
	
	if(!this.destination && this.position.x < battlefield.height - 20){
		this.getRandomDestination();
		this.position.add(this.direction.mul(this.speed));
	}

		
	if(this.position.distance(this.destination) < 10){
		this.destination = undefined;
	}
	else{
		this.position.add(this.direction.mul(this.speed));
	}

	gameLogics.enemies.placed[this.id] = this;
}

var EnemyTank = function(enemyTankProperties){
	Enemy.call(this,enemyTankProperties);
	this.id = 'enemyTank' + (EnemyTank.counter++);
	this.radius = 20;
	this.speed = 0.25;
	this.health = 10;
	//this.direction = enemyTankProperties.direction;
	//this.position = enemyTankProperties.position;
	// this.frameChangeRate = 300;
	// this.lastTimeFrameChange = new Date;
	this.currentFrame = 0;
}
EnemyTank.counter = 0;
EnemyTank.prototype = Object.create(Enemy.prototype);

EnemyTank.prototype.render = function(){
	if(!this.alive){
		return false;
	}

	//context.drawImage(images.tank, this.position.x - this.radius, this.position.y - this.radius);
	context.drawImage(images.tank, 0,this.currentFrame*50,50,50,this.position.x - this.radius, this.position.y - this.radius,40,40);
}

EnemyTank.prototype.update = function(){
	delete gameLogics.enemies.placed[this.id];
	if(this.position.x <= 0 || this.position.y <= 0 || this.position.x > battlefield.width || this.position.y > battlefield.height){
		this.alive = false;
	}

	if(!this.alive){
		return false;
	}
	
	if(!this.destination && this.position.x < battlefield.height - 20){
		this.getRandomDestination();
		this.position.add(this.direction.mul(this.speed));
	}

		
	if(this.position.distance(this.destination) < 10){
		this.destination = undefined;
	}
	else{
		this.position.add(this.direction.mul(this.speed));
	}

	this.currentFrame = 0;

	if(this.direction.x >= -0.5 && this.direction.x < 0.5 && this.direction.y < -0.5){
		this.currentFrame = 3;
	}

	if(this.direction.y >= -0.5 && this.direction.y < 0.5 && this.direction.x >= 0.5){
		this.currentFrame = 2;
	}

	if(this.direction.x >= -0.5 && this.direction.x < 0.5 && this.direction.y >= 0.5){
		this.currentFrame = 0;
	}

	if(this.direction.y >= -0.5 && this.direction.y < 0.5 && this.direction.x < -0.5){
		this.currentFrame = 1;
	}

	gameLogics.enemies.placed[this.id] = this;
}

var Remains = function(remainsProperty){
	GO.call(this);
	this.position = remainsProperty.position;
	this.timeToShow = 2000;
	this.createDate = new Date;
	this.alpha = 1;
	this.radius = 12;
}

Remains.prototype = Object.create(GO.prototype);
Remains.prototype.render = function(){
	if(!this.alive){
		return false;
	}
	context.save();
	context.globalAlpha = this.alpha;
	context.drawImage(images.soldierRemains, this.position.x - this.radius, this.position.y - this.radius);
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
}

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