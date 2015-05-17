var Board = function(game) {
  this.board = game.add.group();

  var board = game.add.image(game.width * 0.5 - 110, 100, 'board');
  this.board.add(board);

  var repeatButton = game.add.button(game.width - 75, 190, 'repeat_btn', this.repeatClick, this);
  repeatButton.anchor.set(0.5);
  repeatButton.input.useHandCursor = true;

  this.board.add(repeatButton);

  this.board.alpha = 0;
  this.board.y = game.height;
};

Board.prototype.repeatClick = function() {
  game.state.start('play');
};

Board.prototype.show = function() {
  game.add.tween(this.board).to({alpha:1, y: 0}, 500, Phaser.Easing.Exponential.Out, true, 0);
};