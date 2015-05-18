var Board = function(game) {
  this.score = 0;
  this.scoreTxt = '';
  this.scoreField = 'Score:';
  this.best = 0;
  this.bestTxt = '';
  this.bestField = 'Best:';

  this.board = game.add.group();

  var board = game.add.image(game.width * 0.5 - 110, 100, 'board');
  this.board.add(board);

  var menuButton = game.add.button(game.width - 75, 130, 'menu_btn', this.menuClick, this);
  menuButton.anchor.set(0.5);
  menuButton.input.useHandCursor = true;

  this.board.add(menuButton);

  var repeatButton = game.add.button(game.width - 75, 190, 'repeat_btn', this.repeatClick, this);
  repeatButton.anchor.set(0.5);
  repeatButton.input.useHandCursor = true;

  this.board.add(repeatButton);

  var textStyle = {
    font: '24px Share Tech Mono',
    fill: '#FBFBFB',
    stroke: '#424242',
    strokeThickness: 3
  };

  this.scoreText = game.add.bitmapText(game.width / 2, 150, 'font', '0', 22);
  this.scoreField = game.add.image(game.width * 0.5 - 100, 150, 'score');
  this.bestText = game.add.bitmapText(game.width / 2, 180, 'font', '0', 22);
  this.bestField = game.add.image(game.width * 0.5 - 100, 180, 'best');

  this.board.add(this.scoreText);
  this.board.add(this.scoreField);
  this.board.add(this.bestText);
  this.board.add(this.bestField);

  this.board.alpha = 0;
  this.board.y = game.height;
};

Board.prototype.menuClick = function() {
  game.state.start('menu');
};

Board.prototype.repeatClick = function() {
  game.state.start('play');
};

Board.prototype.show = function(score, best) {
  this.scoreText.text = score.toString();
  this.bestText.text = best.toString();

  game.add.tween(this.board).to({alpha:1, y: 0}, 500, Phaser.Easing.Exponential.Out, true, 0);
};