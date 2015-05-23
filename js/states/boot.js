var BasicGame = {};

BasicGame.Boot = function() {

};

BasicGame.Boot.prototype = {

  init: function() {

    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = true;

  },

  preload: function() {

    this.load.image('preloader', 'res/preloader.gif');

  },

  create: function() {

    this.stage.backgroundColor = '#d0f4f7';

    this.state.start('Preload');

  }

};