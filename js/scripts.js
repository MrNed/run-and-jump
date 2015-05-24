var Background = function(game, type) {

  if (typeof type === 'undefined') {
    type = 'grass';
  }


  game.stage.backgroundColor = '#d0f4f7';

  this.cloudsSecond = game.add.tileSprite(0, game.height - 320, 967, 177, 'bg_clouds_2');
  this.cloudsSecond.autoScroll(-20, 0);

  this.cloudsFirst = game.add.tileSprite(-200, game.height - 250, 967, 177, 'bg_clouds_1');
  this.cloudsFirst.autoScroll(-40, 0);

  this.front = game.add.tileSprite(0, game.height - 264, 967, 264, 'bg_' + type);

};

Background.prototype = Object.create(Phaser.Group.prototype);
Background.prototype.constructor = Background;

Background.prototype.startFrontScroll = function() {

  this.front.autoScroll(-50, 0);

};

Background.prototype.stopFrontScroll = function() {

  this.front.autoScroll(0, 0);

};

Background.prototype.change = function(type) {

  this.front.loadTexture('bg_' + type);

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
var Ground = function(game, type) {
  if (typeof type === 'undefined') {
    type = 'grass';
  }

  Phaser.TileSprite.call(this, game, 0, game.height - 48, 480, 48, 'ground_' + type);

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

Ground.prototype.change = function(type) {

  this.loadTexture('ground_' + type);

};
var Board = function(game, config) {

  this.config = config;
  this.score = 0;
  this.scoreTxt = '';
  this.scoreField = 'Score:';
  this.best = 0;
  this.bestTxt = '';
  this.bestField = 'Best:';

  this.board = game.add.group();

  var board = game.add.image(game.width * 0.5 - 110, 100, 'board');
  this.board.add(board);

  var menuButton = game.add.button(game.width - 75, 130, 'sprites', this.menuClick, this, 'menu_btn_hover.png', 'menu_btn.png');
  menuButton.anchor.set(0.5);
  menuButton.input.useHandCursor = true;

  this.board.add(menuButton);

  var repeatButton = game.add.button(game.width - 75, 190, 'sprites', this.repeatClick, this, 'repeat_btn_hover.png', 'repeat_btn.png');
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

  game.state.start('Menu', true, false, this.config);

};

Board.prototype.repeatClick = function() {

  game.state.start('Game', true, false, this.config);

};

Board.prototype.show = function(score, best) {

  this.scoreText.text = score.toString();
  this.bestText.text = best.toString();

  game.add.tween(this.board).to({alpha:1, y: 0}, 500, Phaser.Easing.Exponential.Out, true, 0);

};
var Player = function(game, x, y, key, type, defaultFrame) {

  this.playerType = type;
  this.typesArr = ['blue', 'beige', 'green', 'pink', 'yellow'];
  this.alive = true;
  this.doubleJump = true;
  this.jumpHeight = 500;
  this.tweenInProgress = false;

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

Player.prototype.addAnimations = function(type) {

  this.animations.add('runRight', [type + '_walk_1.png',
                                   type + '_walk_2.png'], 10, true);
  this.animations.add('stand', [type + '_front.png',
                                type + '_stand_right.png',
                                type + '_front.png',
                                type + '_stand_left.png'], 0.75, true);

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

    this.load.atlas('preloader', 'res/preloader.png', 'res/preloader.json');

  },

  create: function() {

    this.stage.backgroundColor = '#F5F5F5';

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

  init: function (config) {

    this.config = config;

    game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 800;

  },

  create: function() {

    this.bg = new Background(game, this.config.bgType);
    this.bg.startFrontScroll();

    this.ground = new Ground(game, this.config.bgType);
    this.ground.startScroll();

    this.player = new Player(game, 48, game.height - 78, 'sprites', this.config.playerType);
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

    this.board = new Board(game, this.config);

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
  this.typeCounter = 0;
  this.tweenInProgress = false;

};

BasicGame.Menu.prototype = {

  init: function(config) {
    if (!config) {
      config = {
        bgType: 'grass',
        playerType: 'blue',
        bestScore: 0
      };
    }

    this.config = config;
  },

  create: function() {

    this.bg = new Background(game, this.config.bgType);
    this.ground = new Ground(game, this.config.bgType);

    this.menu = this.add.group();

    var playBtn = this.add.button(game.width * 0.5 - 48, game.height * 0.5, 'sprites', this.startClick, this, 'play_btn_hover.png', 'play_btn.png', 'play_btn.png');
    playBtn.anchor.set(0.5);
    playBtn.input.useHandCursor = true;
    this.menu.add(playBtn);

    var optionsBtn = this.add.button(game.width * 0.5 + 48, game.height * 0.5, 'sprites', this.showOptions, this, 'options_btn_hover.png', 'options_btn.png', 'options_btn.png');
    optionsBtn.anchor.set(0.5);
    optionsBtn.input.useHandCursor = true;
    this.menu.add(optionsBtn);

    this.bgSelect = this.add.group();

    var grassBtn = this.add.button(game.width * 0.5 - 140, 100, 'sprites', this.selectBg, this, 'grass_btn_hover.png', 'grass_btn.png', 'grass_btn.png');
    grassBtn.type = 'grass';
    grassBtn.input.useHandCursor = true;
    this.bgSelect.add(grassBtn);

    var desertBtn = this.add.button(game.width * 0.5 - 44, 100, 'sprites', this.selectBg, this, 'desert_btn_hover.png', 'desert_btn.png', 'desert_btn.png');
    desertBtn.type = 'desert';
    desertBtn.input.useHandCursor = true;
    this.bgSelect.add(desertBtn);

    var dirtBtn = this.add.button(game.width * 0.5 + 52, 100, 'sprites', this.selectBg, this, 'dirt_btn_hover.png', 'dirt_btn.png', 'dirt_btn.png');
    dirtBtn.type = 'dirt';
    dirtBtn.input.useHandCursor = true;
    this.bgSelect.add(dirtBtn);

    this.bgSelect.x = game.width;
    this.bgSelect.alpha = 0;

    this.player = new Player(game, game.width * 0.5, game.height - 78, 'sprites', this.config.playerType);
    this.player.body.allowGravity = false;
    this.player.x = -24;
    this.player.play('runRight');
    this.playerSelect = this.add.group();

    var nextBtn = this.add.button(game.width * 0.5 + 36, 320, 'sprites', this.selectPlayer, this, 'next_btn_hover.png', 'next_btn.png', 'next_btn.png');
    nextBtn.direction = 'next';
    nextBtn.input.useHandCursor = true;
    this.playerSelect.add(nextBtn);

    var prevBtn = this.add.button(game.width * 0.5 - 64, 320, 'sprites', this.selectPlayer, this, 'prev_btn_hover.png', 'prev_btn.png', 'prev_btn.png');
    prevBtn.direction = 'prev';
    prevBtn.input.useHandCursor = true;
    this.playerSelect.add(prevBtn);

    this.playerSelect.y = -20;
    this.playerSelect.alpha = 0;

    this.menuReturn = this.add.button(-48, 16, 'sprites', this.showMenu, this, 'menu_btn_hover.png', 'menu_btn.png');
    this.menuReturn.alpha = 0;
    this.menuReturn.input.useHandCursor = true;

    this.startBtn = this.add.button(game.width, 16, 'sprites', this.startClick, this, 'play_btn_hover.png', 'play_btn.png', 'play_btn.png');
    this.startBtn.alpha = 0;
    this.startBtn.input.useHandCursor = true;

  },

  update: function() {

    this.physics.arcade.collide(this.player, this.ground);

  },

  startClick: function() {

    this.state.start('Game', true, false, this.config);

  },

  showOptions: function() {

    var self = this;
    var menuOut = this.add.tween(this.menu).to({y: -100, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);
    var playerIn = this.add.tween(this.player).to({x: game.width * 0.5}, 900, Phaser.Easing.Default, false);
    playerIn.onComplete.add(function() {
      self.player.play('stand');
      self.tweenInProgress = false;

      self.add.tween(self.bgSelect).to({x: 0, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
      self.add.tween(self.playerSelect).to({y: 0, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
      self.add.tween(self.menuReturn).to({x: 16, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
      self.add.tween(self.startBtn).to({x: game.width - 42, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
    });

    menuOut.onComplete.add(function() {
      playerIn.start();
    });

  },

  showMenu: function() {

    var self = this;
    var playerOut = this.add.tween(this.player).to({x: game.width + 24}, 900, Phaser.Easing.Default, false);
    playerOut.onComplete.add(function() {
      self.player.x = -24;
      self.add.tween(self.menu).to({y: 0, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
    });

    var optionsOut = this.add.tween(self.bgSelect).to({x: game.width, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);
    this.add.tween(self.playerSelect).to({y: -20, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);
    this.add.tween(self.menuReturn).to({x: -48, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);
    this.add.tween(self.startBtn).to({x: game.width, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);

    optionsOut.onComplete.add(function() {
      self.player.play('runRight');
      playerOut.start();
    });

  },

  selectBg: function(item) {

    this.bg.change(item.type);
    this.ground.change(item.type);

    this.config.bgType = item.type;

  },

  selectPlayer: function(item) {
    if (!this.tweenInProgress) {
      this.tweenInProgress = true;

      this.player.animations.stop();
      this.player.play('runRight');

      if (item.direction === 'next') {
        this.typeCounter++;

        if (this.typeCounter >= this.player.typesArr.length) {
          this.typeCounter = 0;
        }
      } else {
        this.typeCounter--;

        if (this.typeCounter < 0) {
          this.typeCounter = this.player.typesArr.length - 1;
        }
      }

      var self = this,
          player = this.player;

      var fadeIn = this.add.tween(this.playerSelect).to({y: 0, alpha: 1}, 100);
      var fadeOut = this.add.tween(this.playerSelect).to({y: -20, alpha: 0}, 100);

      var runOutScreen = this.add.tween(player).to({x: game.width + 24}, 900, Phaser.Easing.Default, false);
      runOutScreen.onComplete.add(function() {
        player.addAnimations(player.typesArr[self.typeCounter]);
        player.play('runRight');

        player.x = -24;
      });

      var runIntoScreen = this.add.tween(player).to({x: game.width * 0.5}, 900, Phaser.Easing.Default, false);
      runIntoScreen.onComplete.add(function() {
        player.play('stand');
        self.tweenInProgress = false;

        fadeIn.start();
      });

      runOutScreen.chain(runIntoScreen);

      fadeOut.onComplete.add(function() {
        runOutScreen.start();
      });

      fadeOut.start();

      this.config.playerType = this.player.typesArr[this.typeCounter];
    }
  }
};
BasicGame.Preload = function() {

  this.preloadBar = null;
  this.ready = false;

};

BasicGame.Preload.prototype = {

  preload: function() {

    this.preloadBar = this.add.sprite(game.width * 0.5, game.height * 0.5, 'preloader', 0);
    this.preloadBar.anchor.set(0.5, 0.5);

    var preloaderFrames = [],
        i = 0;

    for (i; i < 33; i++) {
      preloaderFrames[i] = i;
    }

    this.preloadBar.animations.add('loading', preloaderFrames, 60, true);
    this.preloadBar.play('loading');

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

    this.load.atlas('sprites', 'res/sprites.png', 'res/sprites.json');
    this.load.image('ground_grass', 'res/ground_grass.png');
    this.load.image('ground_desert', 'res/ground_desert.png');
    this.load.image('ground_dirt', 'res/ground_dirt.png');
    this.load.image('bg_grass', 'res/bg_grass.png');
    this.load.image('bg_desert', 'res/bg_desert.png');
    this.load.image('bg_dirt', 'res/bg_dirt.png');
    this.load.image('bg_clouds_1', 'res/bg_clouds_1.png');
    this.load.image('bg_clouds_2', 'res/bg_clouds_2.png');
    this.load.image('board', 'res/board.png');
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
var game = new Phaser.Game(300, 420, Phaser.AUTO, 'game_cont');

game.state.add('Boot', BasicGame.Boot);
game.state.add('Preload', BasicGame.Preload);
game.state.add('Menu', BasicGame.Menu);
game.state.add('Game', BasicGame.Game);

game.state.start('Boot');