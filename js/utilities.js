function Vector2(x,y){
	if(x == undefined){
		x = 0;
	}
	if(y == undefined){
		y = 0;
	}
	this.x = x;
	this.y = y;

	this.distance = function(to){
		if(!to || !to instanceof Vector2){
			return undefined;
		}

		return new Vector2(to.x-this.x,to.y - this.y).module();
	}

	this.direction = function(to){
		if(!to || !to instanceof Vector2){
			return new Vector2()
		}

		return new Vector2(to.x-this.x,to.y - this.y).normalize();
	}

	this.normalize = function(){
		var module = this.module();
		this.x /= module;
		this.y /= module;
		return this;
	}

	this.module = function(){
		return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
	}

	this.add = function(summand){
		if(summand instanceof Vector2){
			this.x +=summand.x;
			this.y +=summand.y;
		}
	}

	this.mul = function(coef){
		return new Vector2(this.x*coef,this.y*coef);
	}

	this.mulVector = function(to){
		if(!to || !to instanceof Vector2){
			return 0;
		}

		return this.x*to.x + this.y*to.y;
	}
}

function getRandomDestination(height, width)
{
	return new Vector2(getRandom(width.min,width.max),getRandom(height.min, height.max));
	//return new Vector2(Math.random() * (height.max - height.min) + height.min,Math.random() * (width.max - width.min) + width.min);
}

function getRandom(min, max){
	return Math.random() * (max - min) + min;
}
