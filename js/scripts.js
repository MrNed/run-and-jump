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

Enemy.prototype.hitPlayer = function() {
  this.body.velocity.x = 0;
  this.body.moves = false;
  this.animations.stop();
};
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
var Player = function(game, x, y, key, playerType, defaultFrame) {
  this.playerType = playerType;
  this.died = false;

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
};

Player.prototype.jump = function() {
  if (this.onGround()) {
    this.animations.stop();
    this.frameName = this.playerType + '_jump.png';
    this.body.velocity.y = -500;
  }
};

Player.prototype.run = function() {
  if (this.onGround() && !this.died) {
    this.play('runRight');
  }
};

Player.prototype.hitEnemy = function() {
  this.died = true;
  this.animations.stop();
  this.frameName = this.playerType + '_hit.png';

  this.body.gravity.y = 0;
  this.body.moves = false;
};
var Play = function() {
  this.player = null;
  this.ground = null;
  this.enemies = null;
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

    this.ground = new Ground(this.game, 0, this.game.height - 48, 480, 48);

    this.player = new Player(this.game, 48, this.game.height - 108, 'sprites', 'blue');

    this.enemies = this.add.group();

    var enemy = new Enemy(this.game, this.game.width - 48, this.game.height - 70, 'sprites', 'mouse', this.enemies);

    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    var jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    jumpKey.onDown.add(this.player.jump, this.player);

    this.input.onDown.add(this.player.jump, this.player);
  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.enemies, this.ground);
    this.game.physics.arcade.collide(this.player, this.enemies, this.die, null, this);

    this.player.run();

  },
  die: function(player, enemy) {
    this.physics.arcade.gravity.y = 0;

    this.ground.autoScroll(0, 0);
    this.bg.autoScroll(0, 0);

    player.hitEnemy();
    enemy.hitPlayer();
  }
};
var game = new Phaser.Game(300, 450, Phaser.AUTO, 'game_cont');

game.state.add('play', new Play());

game.state.start('play');