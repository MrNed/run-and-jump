function Game() {};

Game.prototype = {
  start: function() {
    var game = new Phaser.Game(320, 480, Phaser.AUTO, 'game_cont');

    game.state.add('play', new Play());

    game.state.start('play');
  }
}

var game = new Game();
game.start();