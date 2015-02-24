var Animated = function(animationPropperties){
	this.totalFrameCount = animationPropperties.totalFrameCount;
	this.currentFrame = 0;
	this.framesInRow = animationPropperties.framesInRow;
	this.framesRowsCount = animationPropperties.framesRowsCount;
	this.frameChangeDelay = animationPropperties.frameChangeDelay;
	this.lastTimeFrameChange = new Date;
	this.explosionImageType = animationPropperties.explosionImageType; //1 : explosion, 2: gameOver
	this.destinationFrameSize = animationPropperties.destinationFrameSize
	this.sourceFrameSize = animationPropperties.sourceFrameSize;
	this.currentDestination = new Vector2;
	this.loop = animationPropperties.loop || false;
	this.position = animationPropperties.position;
	this.alive = true;
}

Animated.prototype.update = function(){
	var now = new Date;
	if(now - this.lastTimeFrameChange > this.frameChangeDelay){
		this.lastTimeFrameChange = now;
		this.currentFrame++;
		if(this.currentFrame > this.totalFrameCount){
			if(this.loop)
			{
				this.currentFrame = 1;
			}
			else
			{
				this.alive = false;
			}
		}
		var crow = this.framesRowsCount - parseInt((this.totalFrameCount - this.currentFrame) / this.framesInRow);
		var ccol = this.framesInRow + parseInt((this.currentFrame - (this.framesInRow * crow)));
		this.currentDestination = new Vector2(ccol - 1, crow - 1);
	}
		
}

Animated.prototype.render = function(){

	context.drawImage(this.explosionImageType == 1? images.explosion : (this.explosionImageType == 2?images.gameover: images.explosion),  
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