
function Game () {
	var that = this;

	// References of html element
	this.scoreAlert = document.getElementsByClassName('scoreAlert')[0];
	this.scoreElement = this.scoreAlert.getElementsByClassName('points')[0];
	this.levelElement = this.scoreAlert.getElementsByClassName('level')[0];

	// reference of area in which ball bounces
	this.gamePad = document.getElementsByClassName('gamePad')[0];
	this.gamePad.addEventListener('click', function(e) {
		that.clickTracker(e)
	});

	
	// reference of player select dropdown
	this.userSelectInput = document.getElementById("user");
	this.currentUserId = this.userSelectInput.value
	this.currentUser = {};
	this.userSelectInput.addEventListener('change', function(event){
		that.changeUser();
	})

	// reference of popupOverlay i.e score card alert, game over alert
	this.popupOverlay = document.getElementsByClassName('popupOverlay')[0];

	this.input = document.getElementById('newPlayerName');
	this.input.addEventListener('change', function(e){
		var value = that.input.value;
		that.addOptionToUser(value);
		that.changeUser();
		that.input.value = '';
	})

	// reference of next button in scorecard alert
	this.nextButton = document.getElementById('next-button');
	this.nextButton.addEventListener('click', function(e){
		e.stopPropagation();
		that.toggleScoreAlert();
		that.levelUp();
	});

	// reference of gameover card
	this.gameOver = document.getElementsByClassName('gameOver')[0];
	this.gameOverLevel = this.gameOver.getElementsByClassName('level')[0];
	this.gameOverScore= this.gameOver.getElementsByClassName('points')[0];
	this.startAgainButton = document.getElementById('start-new-game');
	this.startAgainButton.addEventListener('click', function(e){
		e.stopPropagation();
		that.toggleGameOverCard();
		that.init();
	});

	//reference of score card related items in right column
	this.scoreBoardElement = document.getElementsByClassName('scoreBoardCardContainer')[0]
	this.highestScoreElement = document.getElementsByClassName('highestScore')[0]
	this.scoreBoard = {};


	this.level = 1;					// level initialized at 1
	this.clickCount = 0;			// click count equals level, level is cleared
	this.gameUsers = {};			// reference object to hold data of all users involved in the game

	this.highestGameScore = {}		// refrence object of highest score
	this.highestScoreCard = {};		// refrence of highest score element
	this.maxGameLevel = 8;			// max level to which game can be played
}



// Calculates the total score of the game for current player
Game.prototype.getTotalScore = function () {
	var gameUser = this.gameUsers[this.currentUserId];
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
	return score;
}

// returns the the current level on which current player is playing
Game.prototype.getCurrentLevel = function () {
	var gameUser = this.gameUsers[this.currentUserId];
	var currentLevel = gameUser.lastGameDetails.level;
	return currentLevel;
}

// toggles the game over information card
Game.prototype.toggleGameOverCard = function(gameFinished) {
	var currentLevel = this.getCurrentLevel();
	this.gameOver.setAttribute('class', 'gameOver gameFinished')
	if (gameFinished === undefined) {
		currentLevel = currentLevel + 1;
		this.gameOver.setAttribute('class', 'gameOver')
	}
	var score = this.getTotalScore();
	// this.gameOver.classList = classList.join('');

	this.gameOverLevel.innerText = 'Level :' + currentLevel;
	this.gameOverScore.innerText = score.toLocaleString();

	this.popupOverlay.style.display = this.popupOverlay.style.display === 'block' ? 'none' : 'block';
	this.gameOver.style.display = this.gameOver.style.display === 'block' ? 'none' : 'block';

	this.discardGame();
	delete this.gameUsers[this.currentUserId];
	this.validateUserObject();
}


// toggles the score card after each level
Game.prototype.toggleScoreAlert = function() {
	var gameUser = this.gameUsers[this.currentUserId];
	var currentLevel = this.getCurrentLevel();
	var score = 0;
	for (var i=0; i<gameUser[currentLevel].score.length; i++) {
		score = score + gameUser[currentLevel].score[i]
	}
	this.scoreElement.innerText = score.toLocaleString();
	this.levelElement.innerText = 'Level : ' + currentLevel;
	this.popupOverlay.style.display = this.popupOverlay.style.display === 'block' ? 'none' : 'block';
	this.scoreAlert.style.display = this.scoreAlert.style.display === 'block' ? 'none' : 'block';
}


// creates the scorecard to be displayed in score board
Game.prototype.createScoreCard = function() {
	var currentLevel = this.getCurrentLevel();
	var totalScore = this.getTotalScore();

	var element = document.createElement('div');
	element.setAttribute('class', 'scoreCard');

	var divUser = document.createElement('div');
	divUser.innerText = 'Player : '+this.currentUserId;
	divUser.setAttribute('class', 'user');

	var divLevel = document.createElement('div');
	divLevel.innerText = 'Level : '+currentLevel;
	divLevel.setAttribute('class', 'level');

	var divScore = document.createElement('div');
	divScore.innerText = 'Score :' + totalScore.toLocaleString();
	divScore.setAttribute('class', 'score');

	element.appendChild(divUser);
	element.appendChild(divLevel);
	element.appendChild(divScore);


	return element;
}

// updates the score card in score board
Game.prototype.updateScoreCard = function(elm){

	var currentLevel = this.getCurrentLevel();
	var totalScore = this.getTotalScore();
	
	var divUser = elm.getElementsByClassName('user')[0];
	divUser.innerText = 'Player : '+ this.currentUserId;
	
	var divLevel = elm.getElementsByClassName('level')[0];
	divLevel.innerText = 'Level : '+currentLevel;
	

	var divScore = elm.getElementsByClassName('score')[0];
	divScore.innerText = 'Score : ' + totalScore.toLocaleString();
}


Game.prototype.highestScore = function () {
	var score = this.getTotalScore();
	if (Object.keys(this.highestGameScore).length === 0) {
		this.highestGameScore = this.gameUsers[this.currentUserId];
		this.highestGameScore.totalScore = score;
		this.highestScoreCard = this.createScoreCard();
		this.highestScoreElement.appendChild(this.highestScoreCard);
		return;
	}

	if (this.highestGameScore.totalScore >= score) {

	} else {
		this.highestGameScore = this.gameUsers[this.currentUserId];
		this.highestGameScore.totalScore = score;
		this.updateScoreCard(this.highestScoreCard);
	}
}


// function to decide if scorecard has to be created or updated
Game.prototype.createUpdateScoreBoard = function () {
	if (this.scoreBoard.hasOwnProperty(this.currentUserId)) {
		this.updateScoreCard(this.scoreBoard[this.currentUserId]);
	} else {
		this.scoreBoard[this.currentUserId] = this.createScoreCard();
		this.scoreBoardElement.appendChild(this.scoreBoard[this.currentUserId]);

	}
}


// add new users in the player option list and selects the newly added player
Game.prototype.addOptionToUser = function (value) {
	var index = user.children.length + 1;
	var option = document.createElement("option");
	option.innerText = value;
	option.setAttribute("value", value);
	option.setAttribute("selected", "selected");
	this.userSelectInput.appendChild(option);
}

// discards the complete game of current user.
// called when user restarts the game after game over
// when player is changed and another player is selected
Game.prototype.discardGame = function () {
	if (this.ball.length > 0) {
		for( var i=0; i<this.level; i++) { 
			this.ball[i].removeEntity();
		}
	}
	this.ball = [];
}



// to start the game
Game.prototype.startGame = function () {
	this.level = this.getCurrentLevel() === undefined ? 1 : (this.getCurrentLevel() + 1);
	this.ball = []
	for( var i=0; i<this.level; i++) { 
	  this.ball[i] = new Ball();
	  this.ball[i].createEntity(this.gamePad, i, this.level);
	}
}


// to increase the level
Game.prototype.levelUp = function() {
	this.clickCount = 0;
	this.level = this.level + 1;
	this.startGame();
}


// calculates the score for each ball clicked
// at each level
Game.prototype.getScore = function (level, clickTime) {
	var defaultScoreMax = 1000000 * level;
	var defaultScoreMin = 100;
	var score = Math.floor(defaultScoreMax/clickTime);
	return Math.max(score, defaultScoreMin);
}


// checks for the user if it exist or not. if note create an object and use it store user related information
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

Game.prototype.removeAllPopups = function () {
	this.popupOverlay.style.display = 'none';
	this.gameOver.style.display = 'none';
	this.scoreAlert.style.display = 'none';
}

// changes the player/user
Game.prototype.changeUser = function() {
	if (this.popupOverlay.style.display !== 'block') {
		this.discardGame();
	}
	this.removeAllPopups();
	this.validateUserObject();
	this.startGame();
}


// validates the user reference object
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

// tracks if user clicked on ball or game pad
// clicked on game pad = game over
// clicked on ball = show score card of the level
Game.prototype.clickTracker = function (event) {
	if (event.target.className === 'ball') {
		var elm = event.target;
		var ballNumber = parseInt(elm.dataset.ballNumber);
		var ballRef = this.ball[ballNumber];
		ballRef.stopMoving();
		this.processForTheUser(ballRef);
		this.clickCount = this.clickCount + 1;
		if (this.clickCount >= this.level) {
			this.createUpdateScoreBoard();
			this.highestScore();
			if (this.level === this.maxGameLevel) {
				this.gameFinished();
			} else {
				this.toggleScoreAlert();
				
			}
		}

	} else {
		this.toggleGameOverCard();
	}
	event.stopPropagation();
}

// called when user completes the game to all level
Game.prototype.gameFinished = function () {
	this.toggleGameOverCard(true);
	this.gameOver.className += ' gameFinished'
}

//initializes the game
Game.prototype.init = function () {
	this.validateUserObject();
	this.startGame();
}

