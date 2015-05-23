BasicGame.Preload = function() {

  this.preloadBar = null;
  this.ready = false;

};

BasicGame.Preload.prototype = {

  preload: function() {

    this.preloadBar = this.add.sprite(game.width * 0.5, game.height * 0.5, 'preloader');
    this.preloadBar.anchor.set(0.5, 0.5);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

    this.load.atlas('sprites', 'res/sprites.png', 'res/sprites.json');
    this.load.image('ground_grass', 'res/ground_grass.png');
    this.load.image('ground_desert', 'res/ground_desert.png');
    this.load.image('ground_dirt', 'res/ground_dirt.png');
    this.load.image('bg_front_grass', 'res/bg_front_grass.png');
    this.load.image('bg_front_desert', 'res/bg_front_desert.png');
    this.load.image('bg_front_dirt', 'res/bg_front_dirt.png');
    this.load.image('bg_clouds_1', 'res/bg_clouds_1.png');
    this.load.image('bg_clouds_2', 'res/bg_clouds_2.png');
    this.load.image('board', 'res/board.png');
    this.load.image('play_btn', 'res/play.png');
    this.load.image('repeat_btn', 'res/repeat.png');
    this.load.image('menu_btn', 'res/menu.png');
    this.load.image('score', 'res/score.png');
    this.load.image('best', 'res/best.png');

    this.load.bitmapFont('font', 'res/font.png', 'res/font.fnt');

  },

  create: function() {

    this.preloadBar.cropEnabled = false;

  },

  update: function() {

    if (this.ready) {
      this.state.start('Menu');
    }

  },

  onLoadComplete: function() {

    this.ready = true;

  }

};