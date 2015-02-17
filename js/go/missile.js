var Missile = function(missileProperties){
	GO.call(this);
	this.id = 'missile' + (Missile.counter++);
	this.radius = 10;
	this.speed = 0;
	this.maxSpeed = 10;
	this.speedCurrent = 1;
	this.speedIncrement = 0.01;
	this.health = 1;
	this.maxHealth = 1;
	this.position = missileProperties.position;
	this.destination = missileProperties.destination;
	this.direction = this.position.direction(this.destination);
	this.scores = 10;
	this.width = 9;
	this.height = 29;
	var destinationVector = new Vector2(this.destination.x - this.position.x, this.destination.y - this.position.y);
	var centralVector = new Vector2(0, -1);
	var radians = Math.acos((destinationVector.mulVector(centralVector))/destinationVector.module()*centralVector.module());
	if(this.destination.x < this.position.x){
		radians*=-1;
	}

	this.angle = radians;

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
				destinationFrameSize: new Vector2(20,20),
				sourceFrameSize: new Vector2(100,100),
				position: new Vector2(this.position.x, this.position.y)
			}));

			this.setDead();
			scores.total.count+=this.scores;
		}
	}
}

Missile.counter = 0;
Missile.prototype = Object.create(GO.prototype);

Missile.prototype.render = function(){
	if(!this.alive){
		return false;
	}

    context.translate(this.position.x,this.position.y);
    context.rotate(this.angle);
	context.drawImage(images.missile, -this.width/2, -this.height/2);
    context.rotate(-this.angle);
    context.translate(-this.position.x,-this.position.y);
}

Missile.prototype.update = function(){
	delete gameLogics.enemies.placed[this.id];
	if(this.position.x <= 0 || this.position.y <= 0 || this.position.x > battlefield.width || this.position.y > battlefield.height){
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

	if(this.speed < this.maxSpeed)
	{
		this.speed=Math.pow(this.speedCurrent,2);
		this.speedCurrent+=this.speedIncrement;
	}

	this.position.add(this.direction.mul(this.speed));

	gameLogics.enemies.placed[this.id] = this;
}