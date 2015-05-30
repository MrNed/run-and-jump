var Player = function(game, x, y, key, type, defaultFrame) {

  this.playerType = type;
  this.typesArr = ['blue', 'beige', 'green', 'pink', 'yellow'];
  this.alive = true;
  this.allowJump = false;
  this.doubleJump = true;
  this.jumpHeight = 500;
  this.tweenInProgress = false;

  this.jumpSound = game.add.audio('jump');
  this.doublejumpSound = game.add.audio('doublejump');

  if (typeof defaultFrame === 'undefined') {
    defaultFrame = 'walk_2';
  }

  Phaser.Sprite.call(this, game, x, y, key, type + '_' + defaultFrame + '.png');

  game.physics.arcade.enable(this);

  this.anchor.set(0.5, 0.5);
  this.body.bounce.y = 0;
  this.body.gravity.y = 500;

  this.addAnimations(type);

  game.world.add(this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.onGround = function() {

  return this.body.blocked.down || this.body.touching.down;

};

Player.prototype.jump = function() {

  if (this.alive && this.allowJump && (this.onGround() || (!this.onGround() && this.doubleJump))) {
    this.animations.stop();
    this.frameName = this.playerType + '_jump.png';

    if (!this.onGround()) {
      this.doubleJump = false;
      this.body.velocity.y = -(this.jumpHeight * 0.75);
      this.doublejumpSound.play();
    } else {
      this.body.velocity.y = -this.jumpHeight;
      this.jumpSound.play();
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

Player.prototype.addAnimations = function(type) {

  this.animations.add('runRight', [type + '_walk_1.png',
                                   type + '_walk_2.png'], 10, true);
  this.animations.add('stand', [type + '_front.png',
                                type + '_stand_right.png',
                                type + '_front.png',
                                type + '_stand_left.png'], 0.75, true);

};