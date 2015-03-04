var EnemyRobot = function(enemyRobotProperties){
	Enemy.call(this,enemyRobotProperties);
	this.id = 'enemyRobot' + (EnemyRobot.counter++);
	this.radius = 16;
	this.speed = 0.10*gameLogics.difficulty.speedModifier;
	this.health = 20*gameLogics.difficulty.healthModifier;
	this.maxHealth = 20*gameLogics.difficulty.healthModifier;
	this.destination = enemyRobotProperties.destination;
	this.lastTimeMissleLaunch = new Date;
	this.missleLaunchDelay = 8000;
	this.scores = 75;
	this.lauchMissle = function(){
		var now = new Date;
		if(now - this.lastTimeMissleLaunch > this.missleLaunchDelay)
		{
			this.lastTimeMissleLaunch = now;
			go.push(
				new Missile({
					position: new Vector2(this.position.x, this.position.y),
					destination: new Vector2(getRandom(15,battlefield.width - 15),battlefield.height + 20)
				})
			);
		}
	}
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
			scores.robots.count++;
			scores.total.count+=this.scores;
		}
	}
}

EnemyRobot.counter = 0;
EnemyRobot.prototype = Object.create(Enemy.prototype);

EnemyRobot.prototype.render = function(){
	if(!this.alive){
		return false;
	}

	context.drawImage(images.robot, this.position.x - this.radius, this.position.y - this.radius);
	this.drawHealthBar();
	
}

EnemyRobot.prototype.update = function(){
	delete gameLogics.enemies.placed[this.id];
	if(this.position.x <= 0 || this.position.y <= 0 || this.position.x > battlefield.width || this.position.y > battlefield.height){
		//this.alive = false;
		this.setDead();
	}

	if(!this.alive){
		return false;
	}
	

		
	if(this.destination && this.position.distance(this.destination) < 10){
		this.destination = undefined;
		this.direction = new Vector2;
		this.speed = 0;
		this.lastTimeMissleLaunch = new Date;
	}

	if(!this.destination){
		this.lauchMissle();
	}

	this.position.add(this.direction.mul(this.speed*gameLogics.bonuses.speedDecrease.value));

	gameLogics.enemies.placed[this.id] = this;
}