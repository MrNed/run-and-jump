var BasicGame = {};

BasicGame.Boot = function() {

};

BasicGame.Boot.prototype = {

  init: function() {

    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = true;

  },

  preload: function() {

    this.load.atlas('preloader', 'res/preloader.png', 'res/preloader.json');
    // this.load.image('preloader', 'res/preloader.gif');

  },

  create: function() {

    this.stage.backgroundColor = '#F5F5F5';

    this.state.start('Preload');

  }

};