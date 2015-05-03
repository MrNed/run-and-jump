var Player = function(game, x, y, key, playerType, defaultFrame) {
  if (typeof defaultFrame === 'undefined') {
    defaultFrame = 'walk_2';
  }

  Phaser.Sprite.call(this, game, x, y, key, playerType + '_' + defaultFrame + '.png');

  game.physics.arcade.enable(this);

  this.body.bounce.y = 0.2;
  this.body.gravity.y = 300;
  this.body.collideWorldBounds = true;

  this.animations.add('runRight', [playerType + '_walk_1.png', playerType + '_walk_2.png'], 10, true);

  game.world.add(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.onGround = function() {
  return this.body.blocked.down || this.body.touching.down;
}

Player.prototype.jump = function() {
  if (this.onGround()) {
    this.animations.stop();
    this.frameName = 'blue_jump.png';
    this.body.velocity.y = -500;
  }
};