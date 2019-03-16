

var generateRandom = function (type, max) {
  var random = Math.random();
  if (type.toLowerCase() === "boolean") {
    return (Math.floor(random * 10)) % 2 === 0
  }
  return (Math.floor(random * max));
}


function Ball () {
  this.currentX = null;
  this.currentY = null;
  this.boundaries = {
    x: {
      max: null,
      min: 0,
    },
    y: {
      max: null,
      min: 0,
    }
  },

  this.addX = generateRandom('boolean');
  this.addY = generateRandom('boolean');
  this.gameStarted = false;
  this.startTime = 0;
  this.clickTime = 0;
  this.ballSpeed = 80;
}


Ball.prototype.setPosition = function () {
  var posString = this.currentX+"px,"+this.currentY+"px";
  this.element.style.transform = "translate("+posString+")";
}


Ball.prototype.createEntity = function (parent, id, gameLevel) {
  var dSize = 150;
  var currentSize = dSize - (0.1 * gameLevel * dSize);

  this.ballSpeed = this.ballSpeed - (5 * gameLevel)
  console.log(this.ballSpeed);

  var transition = 'all ' + this.ballSpeed/100 + "s linear";
  console.log(transition);


  var element = document.createElement('div');
  element.setAttribute('class', 'ball');
  element.setAttribute('id', 'ball-id-'+id);
  element.setAttribute('data-ball-number', id);
  element.style.background = ballBgColorArray[id];
  element.style.width = currentSize+'px';
  element.style.height = currentSize+'px';
  element.style.transition = transition
  this.element = element;
  this.gamePad = parent;
  parent.appendChild(this.element);
  var style = window.getComputedStyle(this.element);
  var matrix = new WebKitCSSMatrix(style.webkitTransform);

}

Ball.prototype.removeEntity = function () {
  this.element.style.transition = 'all 0.25s ease';
  this.element.style.width = "0px";
  this.element.style.height = "0px";
  var that = this;
  setTimeout(function(){
    that.gamePad.removeChild(that.element);
  },250)
}


Ball.prototype.init = function () {
  this.startTime = ((new Date()).getTime())
  this.getCurrentBoundaries();
  this.startMoving();
}


Ball.prototype.startMoving = function() {
  var that = this
  this.gameStarted = setInterval(function(){
    that.getNewPosition();
  }, 50);
  // this.gameStarted ();
}

Ball.prototype.stopMoving = function() {
  clearInterval(this.gameStarted);
  this.gameStarted = false;
  this.clickTime = ((new Date()).getTime()) - this.startTime;
  this.removeEntity();
  console.log(this.clickTime);
}



Ball.prototype.getCurrentBoundaries = function () {
  var minX = this.gamePad.clientLeft;
  var minY = this.gamePad.clientTop;
  var maxX = minX + this.gamePad.clientWidth - this.element.clientWidth - 1;
  var maxY = minY + this.gamePad.clientHeight - this.element.clientHeight - 1;
  this.boundaries.x = {
    max: maxX,
    min: minX
  };
  this.boundaries.y = {
    max: maxY,
    min: minY
  };

  this.currentX = generateRandom('number', this.boundaries.x.max);
  this.currentY = generateRandom('number', this.boundaries.y.max);
  this.setPosition();
}

Ball.prototype.getNewPosition = function () {
  var random = parseInt((Math.random() * 10).toFixed(0));
  if (this.addX === true) {
    this.currentX = this.currentX + random;
    if (this.currentX >= this.boundaries.x.max) {
      this.currentX = this.boundaries.x.max;
      this.addX = false;
    }
  } else if (this.addX === false) {
    this.currentX = this.currentX - random;
    if (this.currentX <= this.boundaries.x.min)  {
      this.currentX = 0;
      this.addX = true;
    }
  }

  if (this.addY === true) {
    this.currentY = this.currentY + random;
    if (this.currentY >= this.boundaries.y.max) {
      this.currentY = this.boundaries.y.max;
      this.addY = false;
    }
  } else if (this.addY === false) {
    this.currentY = this.currentY - random;
    if (this.currentY <= this.boundaries.y.min)  {
      this.currentY = 0;
      this.addY = true;
    }
  }
  this.setPosition();
}