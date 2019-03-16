// starting the game
(function startGame() {
	var gameContainer = document.getElementsByClassName('gameContainer')[0];
	gameContainer.style.height = (window.innerHeight - 30) +"px"

	var game = new Game();
	game.init();
})();

