var Preload = function() {
  this.asset = null;
  this.ready = false;
};

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(game.width * 0.5, game.height * 0.5, 'preloader');
    this.asset.anchor.set(0.5, 0.5);

    this.game.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    // this.load.setPreloadSprite(this.asset, 0);

    this.game.load.atlas('sprites', 'res/sprites.png', 'res/sprites.json');
    this.game.load.image('ground', 'res/ground_grass.png');
    this.game.load.image('bg_front', 'res/bg_front_grass.png');
    this.game.load.image('bg_clouds_1', 'res/bg_clouds1_grass.png');
    this.game.load.image('bg_clouds_2', 'res/bg_clouds2_grass.png');

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