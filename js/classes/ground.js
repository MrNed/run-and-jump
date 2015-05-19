var Ground = function(game, x, y, width, height, type) {

  if (typeof type === 'undefined') {
    type = 'grass';
  }

  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground_' + type);

  // FIX FOR BROKEN COLLISION IN PHASER 2.3.0
  this.physicsType = Phaser.SPRITE;

  game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true;

  game.world.add(this);

};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.startScroll = function() {

  this.autoScroll(-150, 0);

};

Ground.prototype.stopScroll = function() {

  this.autoScroll(0, 0);

};