var Player = function(game, x, y, key, playerType, defaultFrame) {
  this.playerType = playerType;
  this.alive = true;
  this.doubleJump = true;
  this.jumpHeight = 500;

  if (typeof defaultFrame === 'undefined') {
    defaultFrame = 'walk_2';
  }

  Phaser.Sprite.call(this, game, x, y, key, playerType + '_' + defaultFrame + '.png');

  game.physics.arcade.enable(this);

  this.body.bounce.y = 0;
  this.body.gravity.y = 500;
  this.body.collideWorldBounds = true;

  this.animations.add('runRight', [playerType + '_walk_1.png', playerType + '_walk_2.png'], 10, true);

  game.world.add(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.onGround = function() {
  return this.body.blocked.down || this.body.touching.down;
};

Player.prototype.jump = function() {
  if (this.alive && (this.onGround() || (!this.onGround() && this.doubleJump))) {
    this.animations.stop();
    this.frameName = this.playerType + '_jump.png';

    if (!this.onGround()) {
      this.doubleJump = false;
      this.body.velocity.y = -(this.jumpHeight * 0.75);
    } else {
      this.body.velocity.y = -this.jumpHeight;
    }
  }
};

Player.prototype.run = function() {
  if (this.onGround() && this.alive) {
    this.doubleJump = true;
    this.play('runRight');
  }
};

Player.prototype.hitEnemy = function() {
  this.alive = false;
  this.animations.stop();
  this.frameName = this.playerType + '_hit.png';

  this.body.gravity.y = 0;
  this.body.moves = false;
};