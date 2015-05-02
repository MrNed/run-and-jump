function Play() {
  this.player = null;
  this.facing = 'left';
  this.jumpTimer = 0;
  this.controls = null;
  this.ground = null;
};

Play.prototype = {
  init: function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 800;
  },
  preload: function() {
    this.game.load.atlas('blue', 'res/sprites.png', 'res/sprites.json');

    this.game.load.image('ground', 'res/ground_grass.png');
    this.game.load.image('background', 'res/bg_grass.png');
  },
  create: function() {
    this.bg = this.game.add.tileSprite(0, 0, 480, 967, 'background');
    this.bg.autoScroll(-50, 0);

    this.ground2 = this.game.add.sprite(0, this.game.height - 34, 'ground');
    this.game.physics.arcade.enable(this.ground2);
    this.ground2.body.allowGravity = false;
    this.ground2.body.immovable = true;

    this.ground = this.game.add.tileSprite(0, this.game.height - 37, 448, 37, 'ground');
    this.ground.autoScroll(-150, 0);

    this.player = this.game.add.sprite(48, this.game.height - 96, 'blue', 'blue_walk_2.png');

    this.game.physics.arcade.enable(this.player);

    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;

    this.player.animations.add('jump', ['blue_jump.png'], 10, true, true);
    this.player.animations.add('right', ['blue_walk_1.png', 'blue_walk_2.png'], 10, true);

    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    this.controls = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.controls.onDown.add(this.jump, this.player);

    this.input.onDown.add(this.jump, this.player);
  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.ground2);

    var standing = this.player.body.blocked.down || this.player.body.touching.down;

    if (standing) {
      this.player.play('right');
    }
  },
  jump: function() {
    var player = this;
    var standing = player.body.blocked.down || player.body.touching.down;

    if (standing) {
      player.animations.stop();
      player.frameName = 'blue_jump.png';
      player.body.velocity.y = -500;
    }
  }
}
function Game() {};

Game.prototype = {
  start: function() {
    var game = new Phaser.Game(320, 480, Phaser.AUTO, 'game_cont');

    game.state.add('play', new Play());

    game.state.start('play');
  }
}

var game = new Game();
game.start();