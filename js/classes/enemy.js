var Enemy = function(game, x, y, key, enemyType, group) {
  if (typeof ground === 'undefined') {
    ground = game.world;
  }

  Phaser.Sprite.call(this, game, x, y, key, enemyType + '.png');

  game.physics.arcade.enable(this);

  this.body.velocity.x = -150;

  this.animations.add('move', [enemyType + '.png', enemyType + '_move.png'], 5, true);
  this.animations.play('move');

  group.add(this);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;