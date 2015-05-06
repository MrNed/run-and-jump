var Enemy = function(game, key, enemyType) {
  Phaser.Sprite.call(this, game, 0, 0, key, enemyType + '.png');

  game.physics.arcade.enable(this);

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;

  this.animations.add('move', [enemyType + '.png', enemyType + '_move.png'], 5, true);
  this.animations.play('move');
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.hitPlayer = function() {
  this.body.velocity.x = 0;
  this.body.moves = false;
  this.animations.stop();
};

Enemy.prototype.spawn = function (x, y, speed) {
  if (!this.stopSpawning) {
    this.reset(x, y);

    this.body.velocity.x = speed;
  }
};