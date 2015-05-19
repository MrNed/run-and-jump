BasicGame.Menu = function() {

  this.bg = null;
  this.ground = null;
  this.playBtn = null;

};

BasicGame.Menu.prototype = {

  create: function() {

    this.bg = new Background(game);
    this.ground = new Ground(game, 0, game.height - 48, 480, 48);

    this.playBtn = this.add.button(game.width * 0.5, game.height * 0.5, 'play_btn', this.startClick, this);
    this.playBtn.anchor.set(0.5);
    this.playBtn.input.useHandCursor = true;

  },

  shutdown: function() {

    this.bg = null;
    this.ground = null;
    this.playBtn = null;

  },

  startClick: function() {

    this.state.start('Game');

  }

};