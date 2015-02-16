var EnemyRobot = function(enemyRobotProperties){
	Enemy.call(this,enemyRobotProperties);
	this.id = 'enemyRobot' + (EnemyRobot.counter++);
	this.radius = 16;
	this.speed = 0.15;
	this.health = 20*gameLogics.enemies.healthModifier;
	this.maxHealth = 20*gameLogics.enemies.healthModifier;
	this.destination = enemyRobotProperties.destination;
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
	}
	this.position.add(this.direction.mul(this.speed));

	gameLogics.enemies.placed[this.id] = this;
}