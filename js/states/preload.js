var Preload = function() {
  this.asset = null;
  this.ready = false;
};

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(game.width * 0.5, game.height * 0.5, 'preloader');
    this.asset.anchor.set(0.5, 0.5);

    this.game.load.onLoadComplete.addOnce(this.onLoadComplete, this);

    this.game.load.atlas('sprites', 'res/sprites.png', 'res/sprites.json');
    this.game.load.image('ground', 'res/ground_grass.png');
    this.game.load.image('bg_front', 'res/bg_front_grass.png');
    this.game.load.image('bg_clouds_1', 'res/bg_clouds1_grass.png');
    this.game.load.image('bg_clouds_2', 'res/bg_clouds2_grass.png');
    this.game.load.image('board', 'res/board.png');
    this.game.load.image('play_btn', 'res/play.png');
    this.game.load.image('repeat_btn', 'res/repeat.png');
    this.game.load.image('menu_btn', 'res/menu.png');
    this.game.load.image('score', 'res/score.png');
    this.game.load.image('best', 'res/best.png');
    this.load.bitmapFont('font', 'res/font.png', 'res/font.fnt');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if (!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }

};