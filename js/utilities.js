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
		if(!to || !(to instanceof Vector2)){
			return undefined;
		}

		return new Vector2(to.x-this.x,to.y - this.y).module();
	}

	this.direction = function(to){
		if(!to || !(to instanceof Vector2)){
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
		if(!to || !(to instanceof Vector2)){
			return 0;
		}

		return this.x*to.x + this.y*to.y;
	}

	this.rotate = function(angle){
		return new Vector2(this.x*Math.cos(angle*Math.PI/180) - this.y* Math.sin(angle*Math.PI/180),
						   this.x*Math.sin(angle*Math.PI/180) + this.y* Math.cos(angle*Math.PI/180) )
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

var pointerEventToXY = function(e){
  var out = {x:0, y:0};
  if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    out.x = touch.pageX;
    out.y = touch.pageY;
  } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
    out.x = e.pageX;
    out.y = e.pageY;
  }
  return out;
};

function absorbTouchEvent(event) {
	if(event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel'){
		var e = event || window.event;
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();
		e.cancelBubble = true;
		e.returnValue = false;
		return false;		
	}
  
}

function roundRect(x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  if (stroke) {
  	context.fillStyle = fill;
    context.stroke();
  }
  if (fill) {
  	context.strokeStyle = stroke;
    context.fill();
  }        
}
