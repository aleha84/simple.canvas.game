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
	this.hitted = function(hitPower){
		this.health-=hitPower;
		if(this.health <= 0)
		{
			this.alive = false;
			scores.soldiers.count++;
			go.push(new Remains({position: new Vector2(this.position.x,this.position.y)}));
			gameLogics.enemies.soldier.currentAmount--;
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