var Ground = function(game, type) {
  if (typeof type === 'undefined') {
    type = 'grass';
  }

  Phaser.TileSprite.call(this, game, 0, game.height - 48, 480, 48, 'ground_' + type);

  // FIX FOR BROKEN COLLISION IN PHASER 2.3.0
  this.physicsType = Phaser.SPRITE;

  game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true;

  game.world.add(this);

};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.scroll = function(x) {

  this.autoScroll(x, 0);

};

Ground.prototype.change = function(type) {

  this.loadTexture('ground_' + type);

  // SO WRONG...
  var self = this;
  setTimeout(function() {
    self.loadTexture('bg_' + type);
  }, 25);

};