var EnemyTank = function(enemyTankProperties){
	Enemy.call(this,enemyTankProperties);
	this.id = 'enemyTank' + (EnemyTank.counter++);
	this.radius = 20;
	this.speed = 0.25;
	this.health = 10;
	this.maxHealth = 10;
	//this.direction = enemyTankProperties.direction;
	//this.position = enemyTankProperties.position;
	// this.frameChangeRate = 300;
	// this.lastTimeFrameChange = new Date;
	this.currentFrame = 0;

	this.hitted = function(hitPower){
		this.health-=hitPower;

		if(this.health <= 0)
		{

			go.unshift(new Animated({	
				totalFrameCount: 81,
				framesInRow: 9,
				framesRowsCount: 9,
				frameChangeDelay: 6,
				explosionImageType: 1,
				destinationFrameSize: new Vector2(40,40),
				sourceFrameSize: new Vector2(100,100),
				position: new Vector2(this.position.x, this.position.y)
			}));

			this.setDead();
			scores.tanks.count++;
			go.push(new TankRemains({position: new Vector2(this.position.x,this.position.y)}));
			for(var i = 0;i<5;i++){
				go.push(new Enemy({position:new Vector2(getRandom(this.position.x-25,this.position.x+25),getRandom(this.position.y-25,this.position.y+25)),direction:new Vector2(getRandom(-1,1),getRandom(0,1))}))
				gameLogics.enemies.soldier.currentAmount++;
			}
		}
	}
}
EnemyTank.counter = 0;
EnemyTank.prototype = Object.create(Enemy.prototype);

EnemyTank.prototype.render = function(){
	if(!this.alive){
		return false;
	}

	//context.drawImage(images.tank, this.position.x - this.radius, this.position.y - this.radius);
	context.drawImage(images.tank, 0,this.currentFrame*50,50,50,this.position.x - this.radius, this.position.y - this.radius,40,40);

	//draw health bar
	var healthRate = this.health / this.maxHealth;
	var healthBarLength = healthRate * this.radius*2;
	var healthBarColor = '#00FF00';
	context.beginPath();
	context.lineWidth = 3;
	if(healthRate >= 1){
		healthBarColor = 'lightgreen';
	}
	else if(healthRate >= 0.5 && healthRate < 1){
		healthBarColor = 'orange';
	}
	else
	{
		healthBarColor = 'red';
	}
	context.strokeStyle = healthBarColor;
    context.moveTo(this.position.x - this.radius, this.position.y - this.radius);
    context.lineTo(this.position.x  - this.radius + healthBarLength, this.position.y - this.radius);
	context.stroke();	
}

EnemyTank.prototype.update = function(){
	delete gameLogics.enemies.placed[this.id];
	if(this.position.x <= 0 || this.position.y <= 0 || this.position.x > battlefield.width || this.position.y > battlefield.height){
		//this.alive = false;
		this.setDead();
	}

	if(!this.alive){
		return false;
	}
	
	if(!this.destination && this.position.y < battlefield.height - 20){
		this.getRandomDestination();
		//this.position.add(this.direction.mul(this.speed));
	}

		
	if(this.destination && this.position.distance(this.destination) < 10){
		this.destination = undefined;
	}
	//else{
	this.position.add(this.direction.mul(this.speed));
	//}

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