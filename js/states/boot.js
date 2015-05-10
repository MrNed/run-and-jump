var Boot = function() {};

Boot.prototype = {
  preload: function() {
    this.game.load.image('preloader', 'res/preloader.gif');
  },
  create: function() {
    this.game.stage.backgroundColor = '#d0f4f7';
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }

};