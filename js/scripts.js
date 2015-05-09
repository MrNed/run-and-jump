var Enemies = function (game) {
  this.enemiesCounter = 0;
  this.possibleEnemies = ['mouse', 'bee'];

  Phaser.Group.call(this, game, game.world, 'Enemies', false, true, Phaser.Physics.ARCADE);

  this.nextSpawn = 0;
  this.minSpawnRate = 1000;
  this.maxSpawnRate = 2000;
  this.minSpeed = 200;
  this.maxSpeed = 400;

  var i = 0,
      length = this.possibleEnemies.length;

  for (i; i < length; i++) {
    for (j = 0; j < 5; j++) {
      this.add(new Enemy(game, 'sprites', this.possibleEnemies[i]), true);
    }
  }

  return this;
};

Enemies.prototype = Object.create(Phaser.Group.prototype);
Enemies.prototype.constructor = Enemies;

Enemies.prototype.spawn = function () {
  if (this.game.time.time < this.nextSpawn) {
    return;
  }

  // RANDOMIZE ENEMIES - PROBABLY CAN BE DONE BETTER
  this.children.sort(function() { return 0.5 - Math.random() });

  var speed = -(game.rnd.integerInRange(this.minSpeed, this.maxSpeed) + (this.enemiesCounter * 5));
  var spawn = game.rnd.integerInRange(this.minSpawnRate, this.maxSpawnRate) - (this.enemiesCounter * 10);

  this.getFirstExists(false).spawn(this.game.width, this.game.height - 72, speed);

  this.nextSpawn = this.game.time.time + spawn;

  this.enemiesCounter++;
};
var Enemy = function(game, key, enemyType) {
  this.enemyType = enemyType;

  Phaser.Sprite.call(this, game, 0, 0, key, enemyType + '.png');

  game.physics.arcade.enable(this);

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;
  this.body.allowGravity = false;

  this.animations.add('move', [enemyType + '.png', enemyType + '_move.png'], 5, true);
  this.animations.play('move');
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.stop = function() {
  this.body.velocity.x = 0;
  this.body.moves = false;
  this.animations.stop();
};

Enemy.prototype.spawn = function (x, y, speed) {
  if (this.enemyType === 'bee') {
    y = y - 24;
  }

  this.reset(x, y);
  this.hasScored = false;

  this.body.velocity.x = speed;
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
  this.doubleJump = true;
  this.jumpHeight = 500;

  if (typeof defaultFrame === 'undefined') {
    defaultFrame = 'walk_2';
  }

  Phaser.Sprite.call(this, game, x, y, key, playerType + '_' + defaultFrame + '.png');

  game.physics.arcade.enable(this);

  this.body.bounce.y = 0.1;
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
  if (this.onGround() || (!this.onGround() && this.doubleJump)) {
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
  if (this.onGround() && !this.died) {
    this.doubleJump = true;
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
  this.paused = false;

  this.score = 0;
  this.scoreText = '';
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
    this.enemies = new Enemies(this.game);

    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    var jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    jumpKey.onDown.add(this.player.jump, this.player);

    this.input.onDown.add(this.player.jump, this.player);

    var textStyle = {
      font: '24px Share Tech Mono',
      fill: '#FBFBFB',
      stroke: '#424242',
      strokeThickness: 3
    };

    this.scoreText = this.game.add.text(5, 5, '0', textStyle);
  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.enemies, this.die, null, this);

    this.player.run();

    if (!this.paused) {
      this.enemies.spawn();
    }

    var self = this;
    this.enemies.forEach(function(enemy) {
      self.checkScore(enemy);
    });
  },
  die: function(player, enemy) {
    this.paused = true;

    this.physics.arcade.gravity.y = 0;
    this.ground.autoScroll(0, 0);
    this.bg.autoScroll(0, 0);

    player.hitEnemy();

    var self = this;
    this.enemies.forEach(function(enemy) {
      enemy.stop();
    });
  },
  checkScore: function(enemy) {
    if (enemy.exists && !enemy.hasScored && enemy.world.x <= this.player.world.x) {
      enemy.hasScored = true;

      this.score++;
      this.scoreText.text = this.score.toString();
    }
  }
};
var game = new Phaser.Game(300, 450, Phaser.AUTO, 'game_cont');

game.state.add('play', new Play());

game.state.start('play');