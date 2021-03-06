var EnemyTank = function(enemyTankProperties){
	Enemy.call(this,enemyTankProperties);
	this.id = 'enemyTank' + (EnemyTank.counter++);
	this.radius = 20;
	this.speed = 0.25*gameLogics.difficulty.speedModifier;
	this.health = 10*gameLogics.difficulty.healthModifier;
	this.maxHealth = 10*gameLogics.difficulty.healthModifier;
	this.scores = 25;
	this.currentFrame = 0;
	this.damage = 5;
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
			scores.total.count+=this.scores;
			go.push(new TankRemains({position: new Vector2(this.position.x,this.position.y)}));
			var newEnemyCount = parseInt(getRandom(1,10));
			for(var i = 0;i<newEnemyCount;i++){
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
	context.drawImage(images.tank, 0,this.currentFrame*50,50,50,this.position.x - this.radius, this.position.y - this.radius,40,40);
	this.drawHealthBar();	
}

EnemyTank.prototype.update = function(){
	delete gameLogics.enemies.placed[this.id];
	if(this.position.x <= 0 || this.position.y <= 0 || this.position.x > battlefield.width || this.position.y > battlefield.height){
		if(this.position.y > battlefield.height)
		{
			if(!scores.bonuses.invulnerability.active)
			{gameLogics.hitPoints.current-=(this.damage*gameLogics.difficulty.damageAbsorbtionModifier);}
		}
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
	this.position.add(this.direction.mul(this.speed*gameLogics.bonuses.speedDecrease.value));
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