var Animated = function(animationPropperties){
	this.totalFrameCount = animationPropperties.totalFrameCount;
	this.currentFrame = 0;
	this.framesInRow = animationPropperties.framesInRow;
	this.framesRowsCount = animationPropperties.framesRowsCount;
	this.frameChangeDelay = animationPropperties.frameChangeDelay;
	this.lastTimeFrameChange = new Date;
	this.explosionImageType = animationPropperties.explosionImageType; //1 : explosion
	this.destinationFrameSize = animationPropperties.destinationFrameSize
	this.sourceFrameSize = animationPropperties.sourceFrameSize;
	this.currentDestination = new Vector2;
	
	this.position = animationPropperties.position;
	this.alive = true;
}

Animated.prototype.update = function(){
	var now = new Date;
	if(now - this.lastTimeFrameChange > this.frameChangeDelay){
		this.lastTimeFrameChange = now;
		this.currentFrame++;

		var crow = this.framesRowsCount - parseInt((this.totalFrameCount - this.currentFrame) / this.framesInRow);
		var ccol = this.framesInRow + parseInt((this.currentFrame - (this.framesInRow * crow)));
		this.currentDestination = new Vector2(ccol - 1, crow - 1);
	}
	if(this.currentFrame > this.totalFrameCount){
		this.alive = false;
	}
}

Animated.prototype.render = function(){

	context.drawImage(this.explosionImageType == 1? images.explosion : images.explosion, 
		this.currentDestination.x * this.sourceFrameSize.x,
		this.currentDestination.y * this.sourceFrameSize.y,
		this.sourceFrameSize.x,
		this.sourceFrameSize.y,
		this.position.x - this.destinationFrameSize.x/2,
		this.position.y - this.destinationFrameSize.y/2,
		this.destinationFrameSize.x,
		this.destinationFrameSize.y
	);
}