var ballBgColorArray = ['#1abc9c',  '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#f1c40f', '#c0392b', '#8e44ad'];

function Game () {
	// this.gamePadBgColorArray = [ '#2c3e50', '#34495e', '#2d3436', '#192a56', '#2f3640', '#182C61', '#2c2c54', '#511717'];
	var that = this;
	this.gamePad = document.getElementsByClassName('gamePad')[0];
	this.scoreAlert = document.getElementsByClassName('scoreAlert')[0];
	this.scoreElement = this.scoreAlert.getElementsByClassName('points')[0];
	this.levelElement = this.scoreAlert.getElementsByClassName('level')[0];



	this.gamePad.addEventListener('click', function(e) {
		that.clickTracker(e)
	});
	this.level = 1;
	this.clickCount = 0;
	this.gameUsers = {};

	this.userSelectInput = document.getElementById("user");
	this.currentUserId = this.userSelectInput.value
	this.currentUser = {};
	this.userSelectInput.addEventListener('change', function(event){
		that.changeUser();
	})

	this.popupOverlay = document.getElementsByClassName('popupOverlay')[0];

	this.input = document.getElementById('newPlayerName');
	this.input.addEventListener('change', function(e){
		var value = that.input.value;
		that.addOptionToUser(value);
		that.changeUser();
		that.input.value = '';
	})

	this.nextButton = document.getElementById('next-button');
	this.nextButton.addEventListener('click', function(e){
		e.stopPropagation();
		that.toggleScoreAlert();
		that.levelUp();
	});


	this.gameOver = document.getElementsByClassName('gameOver')[0];
	this.gameOverLevel = this.gameOver.getElementsByClassName('level')[0];
	this.gameOverScore= this.gameOver.getElementsByClassName('points')[0];
	this.startAgainButton = document.getElementById('start-new-game');
	this.startAgainButton.addEventListener('click', function(e){
		e.stopPropagation();
		that.toggleGameOverCard();
		that.startAgain();
	});
}

Game.prototype.startAgain = function() {
	var currentUser = this.currentUserId;
	this.discardGame();
	delete this.gameUsers[currentUser];
	this.init();
}


Game.prototype.toggleGameOverCard = function() {
	var gameUser = this.gameUsers[this.currentUserId];
	var currentLevel = gameUser.lastGameDetails.level + 1;
	var score = 0;
	for (var key in gameUser) {
		var arr = gameUser[key].score;
		if (arr === undefined) {
			continue;
		}
		for (var i=0; i<arr.length; i++) {
			score = score+arr[i];
		}
	}

	this.gameOverLevel.innerText = 'Level :' + currentLevel;
	this.gameOverScore.innerText = score.toLocaleString();

	this.popupOverlay.style.display = this.popupOverlay.style.display === 'block' ? 'none' : 'block';
	this.gameOver.style.display = this.gameOver.style.display === 'block' ? 'none' : 'block';
}


Game.prototype.toggleScoreAlert = function() {
	var gameUser = this.gameUsers[this.currentUserId];
	var currentLevel = gameUser.lastGameDetails.level;
	var score = 0;
	for (var i=0; i<gameUser[currentLevel].score.length; i++) {
		score = score + gameUser[currentLevel].score[i]
	}
	this.scoreElement.innerText = score.toLocaleString();
	this.levelElement.innerText = 'Level : ' + currentLevel;
	this.popupOverlay.style.display = this.popupOverlay.style.display === 'block' ? 'none' : 'block';
	this.scoreAlert.style.display = this.scoreAlert.style.display === 'block' ? 'none' : 'block';
}


Game.prototype.addOptionToUser = function (value) {
	var index = user.children.length + 1;
	var option = document.createElement("option");
	option.innerText = value;
	option.setAttribute("value", "user_"+index);
	option.setAttribute("selected", "selected");
	this.userSelectInput.appendChild(option);
}


Game.prototype.discardGame = function () {
	for( var i=0; i<this.level; i++) { 
	  this.ball[i].removeEntity();
	}
}

Game.prototype.getLevel = function() {
	if (this.gameUsers[this.currentUserId] === undefined) {
		return 1;
	} else {
		return this.gameUsers[this.currentUserId].lastGameDetails.level === undefined ? 1 :  this.gameUsers[this.currentUserId].lastGameDetails.level + 1
	}
}

Game.prototype.startGame = function () {
	this.level = this.getLevel();
	this.ball = []
	for( var i=0; i<this.level; i++) { 
	  this.ball[i] = new Ball();
	  this.ball[i].createEntity(this.gamePad, i, this.level);
	  this.ball[i].init();
	}
}




Game.prototype.levelUp = function() {
	this.level = this.level + 1;
	this.clickCount = 0;
	this.startGame();
}



Game.prototype.getScore = function (level, clickTime) {
	var defaultScoreMax = 1000000 * level;
	var defaultScoreMin = 100;
	var score = Math.floor(defaultScoreMax/clickTime);
	return Math.max(score, defaultScoreMin);
}


Game.prototype.processForTheUser = function(ballRef) {
	var obj = this.gameUsers[this.currentUserId];
	var levelObj = {}
	var score = this.getScore(this.level, ballRef.clickTime)
	if (obj.hasOwnProperty(this.level)) {
		levelObj = obj[this.level];
	} else {
		obj[this.level] = {};
		levelObj = obj[this.level];
	}
	if (levelObj.hasOwnProperty('clickTime')){
		levelObj.score.push(score);
	} else {

		levelObj.score = [score];
	}

	obj.lastGameDetails.level = this.level;
}




Game.prototype.changeUser = function() {
	this.validateUserObject();
	this.discardGame();
	this.startGame();
}


Game.prototype.validateUserObject = function() {
	this.currentUserId = user.value
	if (this.gameUsers.hasOwnProperty(this.currentUserId)) {
		this.currentUser = this.gameUsers[this.currentUserId];

	} else {
		this.gameUsers[this.currentUserId] = {
			lastGameDetails: {
			}
		}
		this.currentUser = this.gameUsers[this.currentUserId];
	}
}


Game.prototype.clickTracker = function (event) {
	if (event.target.className === 'ball') {
		var elm = event.target;
		var ballNumber = parseInt(elm.dataset.ballNumber);
		var ballRef = this.ball[ballNumber];
		ballRef.stopMoving();
		this.processForTheUser(ballRef);
		this.clickCount = this.clickCount + 1;
		if (this.clickCount >= this.level) {
			this.toggleScoreAlert();
		}

	} else {
		// alert('game over');
		this.toggleGameOverCard();
	}
	event.stopPropagation();
}


Game.prototype.gameOver = function () {

}



Game.prototype.init = function () {
	this.validateUserObject();
	this.startGame();
}




var game = new Game();
game.init();
console.log(game);





