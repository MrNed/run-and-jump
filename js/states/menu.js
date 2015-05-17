var Menu = function() {};

Menu.prototype = {
  create: function() {
    this.bg = new Background(this.game);
    this.ground = new Ground(this.game, 0, this.game.height - 48, 480, 48);

    var startButton = this.add.button(game.width * 0.5, game.height * 0.5, 'play_btn', this.startClick, this);
    startButton.anchor.set(0.5);
    startButton.input.useHandCursor = true;
  },
  startClick: function() {
    this.game.state.start('play');
  }

};