var Ground = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');

  this.autoScroll(-150, 0);

  // FIX FOR BROKEN COLLISION IN PHASER 2.3.0
  this.physicsType = Phaser.SPRITE;

  game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true;

  game.world.add(this);
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {

};
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
var Play = function() {
  this.player = null;
  this.ground = null;
};

Play.prototype = {
  init: function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 800;
  },
  preload: function() {
    this.game.load.atlas('sprites', 'res/sprites.png', 'res/sprites.json');

    this.game.load.image('ground', 'res/ground_grass.png');
    this.game.load.image('background', 'res/bg_grass.png');
  },
  create: function() {
    this.bg = this.game.add.tileSprite(0, 0, 480, 967, 'background');
    this.bg.autoScroll(-50, 0);

    this.ground = new Ground(this.game, 0, this.game.height - 37, 448, 37);

    this.player = new Player(this.game, 48, this.game.height - 96, 'sprites', 'blue');

    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    var jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    jumpKey.onDown.add(this.player.jump, this.player);

    this.input.onDown.add(this.player.jump, this.player);

  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.ground);

    if (this.player.onGround()) {
      this.player.play('runRight');
    }
  }
}
var game = new Phaser.Game(320, 480, Phaser.AUTO, 'game_cont');

game.state.add('play', new Play());

game.state.start('play');