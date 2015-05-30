var Enemy = function() {

  this.direction = 'left';

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.create = function(game, type) {

  Phaser.Sprite.call(this, game, 0, 0, 'sprites', type + '.png');

  game.physics.arcade.enable(this);

  this.anchor.set(0.5, 1);

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;

  this.body.allowGravity = false;

  this.animations.add('move', [type + '.png', type + '_move' + '.png'], 5, true);
  this.animations.play('move');
}

Enemy.prototype.stop = function() {

  this.body.velocity.x = 0;
  this.body.moves = false;
  this.animations.stop();

};

Enemy.prototype.spawn = function(posX, speed, direction) {

  if (direction !== this.direction) {
    this.direction = direction;
    this.scale.x *= -1;
  }

  this.reset(posX, this.posY);
  this.hasScored = false;

  this.body.velocity.x = speed;

};

Enemy.prototype.checkScore = function(player) {

  if (this.exists && !this.hasScored) {
    if (this.direction === 'left' && this.world.x <= player.world.x) {
      return true;
    } else if (this.direction === 'right' && this.world.x >= player.world.x) {
      return true;
    }
  } else {
    return false;
  }

};