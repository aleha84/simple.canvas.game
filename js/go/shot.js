var Shot = function(shotProperties){
	GO.call(this);
	this.length = 10;
	this.speed = 10;
	this.direction = shotProperties.direction;
	this.position = shotProperties.position;
	this.hitPower = 1*gameLogics.difficulty.hitPowerModifier;
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

				go.unshift(new Animated({	
					totalFrameCount: 81,
					framesInRow: 9,
					framesRowsCount: 9,
					frameChangeDelay: 6,
					explosionImageType: 1,
					destinationFrameSize: new Vector2(10,10),
					sourceFrameSize: new Vector2(100,100),
					position: new Vector2(this.position.x, this.position.y)
				}));

				gameLogics.enemies.placed[_go].hitted(this.hitPower);
				break;
			}
	    }
	}

	if(!this.alive){
		return false;
	}

	this.position.add(this.direction.mul(this.speed));	
}