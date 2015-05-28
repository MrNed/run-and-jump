var Enemy = function(game, key, enemyType, direction) {

  this.enemyType = enemyType;

  Phaser.Sprite.call(this, game, 0, 0, key, enemyType + '_' + direction + '.png');

  game.physics.arcade.enable(this);

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;
  this.body.allowGravity = false;
  this.anchor.set(1);
  this.animations.add('move', [enemyType + '_' + direction +'.png', enemyType + '_move' + '_' + direction + '.png'], 5, true);
  this.animations.play('move');

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.stop = function() {

  this.body.velocity.x = 0;
  this.body.moves = false;
  this.animations.stop();

};

Enemy.prototype.spawn = function (posX, posY, speed, direction) {

  if (this.enemyType === 'bee') {
    posY -= 24;
  }

  if (this.enemyType === 'fly') {
    // posY -= 14;
    posY -= 24;
  }

  if (direction === 'right') {
    this.scale.x *= -1;
  }

  this.reset(posX, posY);
  this.hasScored = false;
/*
  if (this.enemyType === 'fly') {
    this.tween = this.game.add.tween(this).to({y: posY - 12}, 250, Phaser.Easing.Default, true, 0, -1, true);
  }
*/
  this.body.velocity.x = speed;

};