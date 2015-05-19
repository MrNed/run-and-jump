var Background = function(game, type) {

  if (typeof type === 'undefined') {
    type = 'grass';
  }


  game.stage.backgroundColor = '#d0f4f7';

  this.cloudsSecond = game.add.tileSprite(0, game.height - 320, 967, 177, 'bg_clouds_2');
  this.cloudsSecond.autoScroll(-20, 0);

  this.cloudsFirst = game.add.tileSprite(-200, game.height - 250, 967, 177, 'bg_clouds_1');
  this.cloudsFirst.autoScroll(-40, 0);

  this.front = game.add.tileSprite(0, game.height - 264, 967, 264, 'bg_front_' + type);

};

Background.prototype = Object.create(Phaser.Group.prototype);
Background.prototype.constructor = Background;

Background.prototype.startFrontScroll = function() {

  this.front.autoScroll(-50, 0);

};

Background.prototype.stopFrontScroll = function() {

  this.front.autoScroll(0, 0);

};
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
    for (j = 0; j < 3; j++) {
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
var Ground = function(game, x, y, width, height, type) {

  if (typeof type === 'undefined') {
    type = 'grass';
  }

  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground_' + type);

  // FIX FOR BROKEN COLLISION IN PHASER 2.3.0
  this.physicsType = Phaser.SPRITE;

  game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true;

  game.world.add(this);

};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.startScroll = function() {

  this.autoScroll(-150, 0);

};

Ground.prototype.stopScroll = function() {

  this.autoScroll(0, 0);

};
var Board = function(game) {

  this.score = 0;
  this.scoreTxt = '';
  this.scoreField = 'Score:';
  this.best = 0;
  this.bestTxt = '';
  this.bestField = 'Best:';

  this.board = game.add.group();

  var board = game.add.image(game.width * 0.5 - 110, 100, 'board');
  this.board.add(board);

  var menuButton = game.add.button(game.width - 75, 130, 'menu_btn', this.menuClick, this);
  menuButton.anchor.set(0.5);
  menuButton.input.useHandCursor = true;

  this.board.add(menuButton);

  var repeatButton = game.add.button(game.width - 75, 190, 'repeat_btn', this.repeatClick, this);
  repeatButton.anchor.set(0.5);
  repeatButton.input.useHandCursor = true;

  this.board.add(repeatButton);

  var textStyle = {
    font: '24px Share Tech Mono',
    fill: '#FBFBFB',
    stroke: '#424242',
    strokeThickness: 3
  };

  this.scoreText = game.add.bitmapText(game.width / 2, 150, 'font', '0', 22);
  this.scoreField = game.add.image(game.width * 0.5 - 100, 150, 'score');
  this.bestText = game.add.bitmapText(game.width / 2, 180, 'font', '0', 22);
  this.bestField = game.add.image(game.width * 0.5 - 100, 180, 'best');

  this.board.add(this.scoreText);
  this.board.add(this.scoreField);
  this.board.add(this.bestText);
  this.board.add(this.bestField);

  this.board.alpha = 0;
  this.board.y = game.height;

};

Board.prototype.menuClick = function() {

  game.state.start('Menu');

};

Board.prototype.repeatClick = function() {

  game.state.start('Game');

};

Board.prototype.show = function(score, best) {

  this.scoreText.text = score.toString();
  this.bestText.text = best.toString();

  game.add.tween(this.board).to({alpha:1, y: 0}, 500, Phaser.Easing.Exponential.Out, true, 0);

};
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
var BasicGame = {};

BasicGame.Boot = function() {

};

BasicGame.Boot.prototype = {

  init: function() {

    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = true;

  },

  preload: function() {

    this.load.image('preloader', 'res/preloader.gif');

  },

  create: function() {

    this.stage.backgroundColor = '#d0f4f7';

    this.state.start('Preload');

  }

};
BasicGame.Game = function(game) {

  this.player = null;
  this.ground = null;
  this.enemies = null;
  this.board = null;
  this.spawn = false;

  this.score = 0;
  this.scoreText = '';
  this.bestScore = 0;

  this.timer = null;
  this.spawnDelay = 1000;

};

BasicGame.Game.prototype = {

  init: function () {

    game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 800;

  },

  create: function() {

    this.bg = new Background(game);
    this.bg.startFrontScroll();

    this.ground = new Ground(game, 0, game.height - 48, 480, 48);
    this.ground.startScroll();

    this.player = new Player(game, 48, game.height - 108, 'sprites', 'blue');
    this.enemies = new Enemies(game);

    this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    var jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    jumpKey.onDown.add(this.player.jump, this.player);

    this.input.onDown.add(this.player.jump, this.player);

    this.scoreText = this.add.bitmapText(game.width * 0.5, 5, 'font', '0', 22);

    this.timer = new Phaser.Timer(game);
    this.timer.add(this.spawnDelay, function() {
      this.spawn = true;
    }, this);
    this.timer.start();

    this.board = new Board(game);

  },

  update: function() {

    this.timer.update(game.time.time);

    this.physics.arcade.collide(this.player, this.ground);
    this.physics.arcade.collide(this.player, this.enemies, this.die, null, this);

    this.player.run();

    if (this.spawn) {
      this.enemies.spawn();
    }

    var self = this;
    this.enemies.forEach(function(enemy) {
      self.checkScore(enemy);
    });

  },

  shutdown: function() {

    this.score = 0;
    this.spawn = false;
    this.timer = null;

  },

  die: function(player, enemy) {

    this.spawn = false;

    this.physics.arcade.gravity.y = 0;
    this.ground.stopScroll();
    this.bg.stopFrontScroll();

    player.hitEnemy();

    var self = this;
    this.enemies.forEach(function(enemy) {
      enemy.stop();
    });

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }

    this.board.show(this.score, this.bestScore);

  },

  checkScore: function(enemy) {

    if (enemy.exists && !enemy.hasScored && enemy.world.x <= this.player.world.x) {
      enemy.hasScored = true;

      this.score++;
      this.scoreText.text = this.score.toString();
    }

  },

};
BasicGame.Menu = function() {

  this.bg = null;
  this.ground = null;
  this.playBtn = null;

};

BasicGame.Menu.prototype = {

  create: function() {

    this.bg = new Background(game, 'grass');
    this.ground = new Ground(game, 0, game.height - 48, 480, 48, 'grass');

    this.playBtn = this.add.button(game.width * 0.5, game.height * 0.5, 'play_btn', this.startClick, this);
    this.playBtn.anchor.set(0.5);
    this.playBtn.input.useHandCursor = true;

  },

/*
  shutdown: function() {

    this.bg = null;
    this.ground = null;
    this.playBtn = null;

  },
*/

  startClick: function() {

    this.state.start('Game');

  }

};
BasicGame.Preload = function() {

  this.preloadBar = null;
  this.ready = false;

};

BasicGame.Preload.prototype = {

  preload: function() {

    this.preloadBar = this.add.sprite(game.width * 0.5, game.height * 0.5, 'preloader');
    this.preloadBar.anchor.set(0.5, 0.5);
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

    this.load.atlas('sprites', 'res/sprites.png', 'res/sprites.json');
    this.load.image('ground_grass', 'res/ground_grass.png');
    this.load.image('bg_front_grass', 'res/bg_front_grass.png');
    this.load.image('bg_clouds_1', 'res/bg_clouds_1.png');
    this.load.image('bg_clouds_2', 'res/bg_clouds_2.png');
    this.load.image('board', 'res/board.png');
    this.load.image('play_btn', 'res/play.png');
    this.load.image('repeat_btn', 'res/repeat.png');
    this.load.image('menu_btn', 'res/menu.png');
    this.load.image('score', 'res/score.png');
    this.load.image('best', 'res/best.png');
    this.load.bitmapFont('font', 'res/font.png', 'res/font.fnt');

  },

  create: function() {

    this.preloadBar.cropEnabled = false;

  },

  update: function() {

    if (this.ready) {
      this.state.start('Menu');
    }

  },

  onLoadComplete: function() {

    this.ready = true;

  }

};
var game = new Phaser.Game(300, 420, Phaser.Canvas, 'game_cont');

game.state.add('Boot', BasicGame.Boot);
game.state.add('Preload', BasicGame.Preload);
game.state.add('Menu', BasicGame.Menu);
game.state.add('Game', BasicGame.Game);

game.state.start('Boot');