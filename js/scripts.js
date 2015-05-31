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

Background.prototype.scroll = function(x) {

  this.front.autoScroll(x, 0);

};

Background.prototype.scrollClouds = function(x1, x2) {

  this.cloudsFirst.autoScroll(x1, 0);
  this.cloudsSecond.autoScroll(x2, 0);
};

Background.prototype.change = function(type) {

  this.front.loadTexture('bg_' + type);

  // SO WRONG...
  var self = this;
  setTimeout(function() {
    self.front.loadTexture('bg_' + type);
  }, 25);

};
var Enemies = function (game) {

  Phaser.Group.call(this, game, game.world, 'Enemies', false, true, Phaser.Physics.ARCADE);

  this.nextSpawn = 0;
  this.minSpawnRate = 1000;
  this.maxSpawnRate = 1800;
  this.minSpeed = 200;
  this.maxSpeed = 400;

  this.spawnSpeed = 0;
  this.spawnRate = 0;
  this.spawnX = 0;
  this.direction = 'left';

  var i = 0;
  for (i; i < 2; i++) {
    this.add(new Mouse(game));
    this.add(new Bee(game));
    this.add(new Fly(game));
    this.add(new Ladybug(game));
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

  this.spawnSpeed = game.rnd.integerInRange(this.minSpeed, this.maxSpeed);
  this.spawnRate = game.rnd.integerInRange(this.minSpawnRate, this.maxSpawnRate);

  if (this.direction === 'random') {
    this.fromSide = game.rnd.pick(['left', 'right']);
  } else {
    this.fromSide = this.direction;
  }

  if (this.fromSide === 'left') {
    this.spawnSpeed *= -1;
    this.spawnX = game.width + 20;
  } else if (this.fromSide === 'right') {
    this.fromSide = 'right';
    this.spawnX = 0;
  }

  this.getFirstExists(false).spawn(this.spawnX, this.spawnSpeed, this.fromSide);

  this.nextSpawn = this.game.time.time + this.spawnRate;

};

Enemies.prototype.stop = function() {

  this.forEach(function(enemy) {
    enemy.stop();
  });

};

Enemies.prototype.countOnScreen = function() {

  var test = 0;

  this.forEach(function(enemy) {
    if (enemy.exists) {
      test++;
    }
  });

  return test;

};
var Enemy = function() {

  this.direction = 'left';

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.create = function(game, type) {

  Phaser.Sprite.call(this, game, 0, 0, 'sprites', type + '.png');

  game.physics.arcade.enable(this);

  this.anchor.set(0.5, 1);

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;

  this.body.allowGravity = false;

  this.animations.add('move', [type + '.png', type + '_move' + '.png'], 5, true);
  this.animations.play('move');
}

Enemy.prototype.stop = function() {

  this.body.velocity.x = 0;
  this.body.moves = false;
  this.animations.stop();

};

Enemy.prototype.spawn = function(posX, speed, direction) {

  if (direction !== this.direction) {
    this.direction = direction;
    this.scale.x *= -1;
  }

  this.reset(posX, this.posY);
  this.hasScored = false;

  this.body.velocity.x = speed;

};

Enemy.prototype.checkScore = function(player) {

  if (this.exists && !this.hasScored) {
    if (this.direction === 'left' && this.world.x <= player.world.x) {
      return true;
    } else if (this.direction === 'right' && this.world.x >= player.world.x) {
      return true;
    }
  } else {
    return false;
  }

};
/*
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
    posY -= 14;
    // posY -= 24;
  }

  if (direction === 'right') {
    this.scale.x *= -1;
  }

  this.reset(posX, posY);
  this.hasScored = false;

  if (this.enemyType === 'fly') {
    game.time.events.repeat(25, 80, function() {
      this.body.velocity.y = Math.sin(game.time.now) * 50;
    }, this);
  }

  // this.body.velocity.x = speed;
  game.physics.arcade.moveToXY(this, 0, posY, -speed);
};
*/
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

Ground.prototype.scroll = function(x) {

  this.autoScroll(x, 0);

};

Ground.prototype.change = function(type) {

  this.loadTexture('ground_' + type);

  // SO WRONG...
  var self = this;
  setTimeout(function() {
    self.loadTexture('bg_' + type);
  }, 25);

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

  var menuButton = game.add.button(game.width - 75, 130, 'sprites', this.menuClick, this, 'menu_btn.png', 'menu_btn.png', 'menu_btn_hover.png');
  menuButton.anchor.set(0.5);
  menuButton.input.useHandCursor = true;

  this.board.add(menuButton);

  var repeatButton = game.add.button(game.width - 75, 190, 'sprites', this.repeatClick, this, 'repeat_btn.png', 'repeat_btn.png', 'repeat_btn_hover.png');
  repeatButton.anchor.set(0.5);
  repeatButton.input.useHandCursor = true;

  this.board.add(repeatButton);

  this.scoreText = game.add.bitmapText(game.width / 2, 120, 'font', '0', 22);
  this.scoreField = game.add.image(game.width * 0.5 - 100, 120, 'score');
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
var Player = function(game, x, y, key, type, sound) {

  this.soundMute = sound;
  this.playerType = type;
  this.typesArr = ['blue', 'beige', 'green', 'pink', 'yellow'];
  this.alive = true;
  this.allowJump = false;
  this.doubleJump = true;
  this.jumpHeight = 500;
  this.tweenInProgress = false;

  this.jumpSound = game.add.audio('jump');
  this.doublejumpSound = game.add.audio('doublejump');

  Phaser.Sprite.call(this, game, x, y, key, type + '_walk_2.png');

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

      if (!this.soundMute) {
        this.doublejumpSound.play();
      }
    } else {
      this.body.velocity.y = -this.jumpHeight;

      if (!this.soundMute) {
        this.jumpSound.play();
      }
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
var Bee = function(game) {

  this.posY = game.height - 72;

  this.create(game, 'bee');

};

Bee.prototype = new Enemy();
Bee.prototype.constructor = Bee;
var Fly = function(game) {

  this.posY = game.height - 72;

  this.create(game, 'fly');

};

Fly.prototype = new Enemy();
Fly.prototype.constructor = Fly;

Fly.prototype.update = function() {

  game.time.events.repeat(25, 100, function() {
    this.body.velocity.y = Math.sin(game.time.now) * 50;
  }, this);


};
var Ladybug = function(game) {

  this.posY = game.height - 48;

  this.create(game, 'ladybug');

};

Ladybug.prototype = new Enemy(game);
Ladybug.prototype.constructor = Ladybug;
var Mouse = function(game) {

  this.posY = game.height - 48;

  this.create(game, 'mouse');

};

Mouse.prototype = new Enemy(game);
Mouse.prototype.constructor = Mouse;
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
  this.music = null;
  this.hitSound = null;

  this.score = 0;
  this.scoreText = '';
  this.bestScore = 0;

  this.timer = null;
  this.spawnDelay = 1000;
  this.firstPlay = true;

  this.phase = 1;
  this.phaseTwoStartScore = 15;
  this.phaseThreeStartScore = 30;
};

BasicGame.Game.prototype = {

  init: function (config) {

    this.config = config;

    game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 800;

  },

  create: function() {
    this.music = game.add.audio('music', 0.75, true);

    if (!this.config.music_mute) {
      this.music.play();
    }

    this.hitSound = game.add.audio('hit');

    this.bg = new Background(game, this.config.bgType);
    this.bg.scroll(-50);

    this.ground = new Ground(game, this.config.bgType);
    this.ground.scroll(-150);

    this.player = new Player(game, -20, game.height - 74, 'sprites', this.config.playerType, this.config.sound_mute);

    var runInto = this.add.tween(this.player).to({x: 48}, 500, Phaser.Easing.Default, true);
    runInto.onComplete.add(function() {
      this.player.allowJump = true;
      this.timer.start();
    }, this);

    this.enemies = new Enemies(game);

    this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    var jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    jumpKey.onDown.add(this.player.jump, this.player);

    this.input.onDown.add(this.player.jump, this.player);

    this.scoreText = this.add.bitmapText(game.width * 0.5, 5, 'font', '0', 22);

    this.timer = new Phaser.Timer(game);
    this.timer.add(this.spawnDelay, function() {
      this.spawn = true;
      this.firstPlay = false;
      this.infoText.destroy();
    }, this);

    this.board = new Board(game, this.config);

    if (this.firstPlay) {
      var textStyle = {
        font: '20px Verdana',
        fill: '#FBFBFB',
        stroke: '#424242',
        strokeThickness: 2
      };

      this.infoText = this.game.add.text(game.width * 0.5, game.height * 0.5, 'Click to Jump', textStyle);
      this.infoText.anchor.set(0.5);
    }

  },

  update: function() {

    this.physics.arcade.collide(this.player, this.ground);
    this.physics.arcade.collide(this.player, this.enemies, this.die, null, this);

    this.player.run();

    if (this.spawn) {
      this.enemies.spawn();

      this.enemies.forEach(function(enemy) {

        if (enemy.checkScore(this.player)) {
          enemy.hasScored = true;

          this.score++;
          this.scoreText.text = this.score.toString();
        }

      }, this);
    } else {
      this.timer.update(game.time.time);
    }

    if (this.score >= this.phaseTwoStartScore && this.phase === 1 && this.player.onGround()) {
      this.moveToNextPhase(2);
    }

    if (this.score >= this.phaseThreeStartScore && this.phase === 2 && this.player.onGround()) {
      this.moveToNextPhase(3);
    }

  },

  shutdown: function() {

    this.player = null;
    this.ground = null;
    this.enemies = null;
    this.board = null;
    this.spawn = false;
    this.score = 0;
    this.timer = null;
    this.phase = 1;
    this.music.stop();

  },

  die: function(player, enemy) {

    if (!this.config.sound_mute) {
      this.hitSound.play();
    }

    this.spawn = false;

    this.physics.arcade.gravity.y = 0;
    this.ground.scroll(0);
    this.bg.scroll(0);

    player.hitEnemy();

    this.enemies.stop();

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }

    this.board.show(this.score, this.bestScore);

  },

  moveToNextPhase: function(phase) {

    if (this.enemies.countOnScreen() === 0) {
      this.spawn = false;
      this.player.allowJump = false;

      if (phase === 2) {
        this.phaseTwo();
      } else if (phase === 3) {
        this.phaseThree();
      }
    }
  },

  phaseTwo: function() {

    this.bg.scroll(-100);
    this.bg.scrollClouds(-60, -40);
    this.ground.scroll(-200);

    var destination = game.width - 48;

    if (this.player.x < destination) {
      game.physics.arcade.moveToXY(this.player, destination, this.player.y, 150);
    } else {
      this.phase = 2;
      this.player.body.velocity.x = 0;
      this.player.allowJump = true;

      this.bg.scroll(-50);
      this.bg.scrollClouds(-40, -20);
      this.ground.scroll(-150);

      this.spawn = true;
      this.enemies.direction = 'right';
    }

  },

  phaseThree: function() {

    this.bg.scroll(-25);
    this.bg.scrollClouds(-30, -10);
    this.ground.scroll(-100);

    var destination = game.width / 2;

    if (this.player.x > destination) {
      game.physics.arcade.moveToXY(this.player, destination, this.player.y, 150);
    } else {
      this.phase = 3;
      this.player.body.velocity.x = 0;
      this.player.allowJump = true;

      this.bg.scroll(-50);
      this.bg.scrollClouds(-40, -20);
      this.ground.scroll(-150);

      this.spawn = true;
      this.enemies.maxSpeed = 275;
      this.minSpawnRate = 1200;
      this.maxSpawnRate = 2000;
      this.enemies.direction = 'random';
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
        bestScore: 0,
        music_mute: false,
        sound_mute: false
      };
    }

    this.config = config;
  },

  create: function() {

    this.bg = new Background(game, this.config.bgType);
    this.ground = new Ground(game, this.config.bgType);

    this.menu = this.add.group();

    var playBtn = this.add.button(game.width * 0.5 - 48, game.height * 0.5, 'sprites', this.startClick, this, 'play_btn.png', 'play_btn.png', 'play_btn_hover.png');
    playBtn.anchor.set(0.5);
    playBtn.input.useHandCursor = true;
    this.menu.add(playBtn);

    var optionsBtn = this.add.button(game.width * 0.5 + 48, game.height * 0.5, 'sprites', this.showOptions, this, 'options_btn.png', 'options_btn.png', 'options_btn_hover.png');
    optionsBtn.anchor.set(0.5);
    optionsBtn.input.useHandCursor = true;
    this.menu.add(optionsBtn);

    this.bgSelect = this.add.group();

    var grassBtn = this.add.button(game.width * 0.5 - 140, 100, 'sprites', this.selectBg, this, 'grass_btn.png', 'grass_btn.png', 'grass_btn_hover.png');
    grassBtn.type = 'grass';
    grassBtn.input.useHandCursor = true;
    this.bgSelect.add(grassBtn);

    var desertBtn = this.add.button(game.width * 0.5 - 44, 100, 'sprites', this.selectBg, this, 'desert_btn.png', 'desert_btn.png', 'desert_btn_hover.png');
    desertBtn.type = 'desert';
    desertBtn.input.useHandCursor = true;
    this.bgSelect.add(desertBtn);

    var dirtBtn = this.add.button(game.width * 0.5 + 52, 100, 'sprites', this.selectBg, this, 'dirt_btn.png', 'dirt_btn.png', 'dirt_btn_hover.png');
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

    var nextBtn = this.add.button(game.width * 0.5 + 36, 320, 'sprites', this.selectPlayer, this, 'next_btn.png', 'next_btn.png', 'next_btn_hover.png');
    nextBtn.direction = 'next';
    nextBtn.input.useHandCursor = true;
    this.playerSelect.add(nextBtn);

    var prevBtn = this.add.button(game.width * 0.5 - 64, 320, 'sprites', this.selectPlayer, this, 'prev_btn.png', 'prev_btn.png', 'prev_btn_hover.png');
    prevBtn.direction = 'prev';
    prevBtn.input.useHandCursor = true;
    this.playerSelect.add(prevBtn);

    this.playerSelect.y = -20;
    this.playerSelect.alpha = 0;

    this.menuReturn = this.add.button(-48, 16, 'sprites', this.showMenu, this, 'menu_btn.png', 'menu_btn.png', 'menu_btn_hover.png');
    this.menuReturn.alpha = 0;
    this.menuReturn.input.useHandCursor = true;

    this.startBtn = this.add.button(game.width, 16, 'sprites', this.startClick, this, 'play_btn.png', 'play_btn.png', 'play_btn_hover.png');
    this.startBtn.alpha = 0;
    this.startBtn.input.useHandCursor = true;

    this.minMenu = this.add.group();

    this.helpBtn = this.add.button(5, 5, 'sprites', this.help, this, 'help_btn.png', 'help_btn.png', 'help_btn_hover.png');
    this.helpBtn.input.useHandCursor = true;
    this.minMenu.add(this.helpBtn);

    this.musicOnBtn = this.add.button(game.width - 28, 6, 'sprites', this.mute, this, 'music_on_btn.png', 'music_on_btn.png', 'music_on_btn_hover.png');
    this.musicOnBtn.input.useHandCursor = true;
    this.musicOnBtn.action = 'off';
    this.musicOnBtn.type = 'music';
    this.minMenu.add(this.musicOnBtn);

    this.musicOffBtn = this.add.button(game.width - 28, 6, 'sprites', this.mute, this, 'music_off_btn.png', 'music_off_btn.png', 'music_off_btn_hover.png');
    this.musicOffBtn.input.useHandCursor = true;
    this.musicOffBtn.action = 'on';
    this.musicOffBtn.type = 'music';
    this.minMenu.add(this.musicOffBtn);

    if (this.config.music_mute) {
      this.musicOnBtn.alpha = 0;
      this.musicOnBtn.exists = false;
    } else {
      this.musicOffBtn.alpha = 0;
      this.musicOffBtn.exists = false;
    }

    this.soundOnBtn = this.add.button(game.width - 56, 9, 'sprites', this.mute, this, 'sound_on_btn.png', 'sound_on_btn.png', 'sound_on_btn_hover.png');
    this.soundOnBtn.input.useHandCursor = true;
    this.soundOnBtn.action = 'off';
    this.soundOnBtn.type = 'sound';
    this.minMenu.add(this.soundOnBtn);

    this.soundOffBtn = this.add.button(game.width - 56, 9, 'sprites', this.mute, this, 'sound_off_btn.png', 'sound_off_btn.png', 'sound_off_btn_hover.png');
    this.soundOffBtn.input.useHandCursor = true;
    this.soundOffBtn.action = 'on';
    this.soundOffBtn.type = 'sound';
    this.minMenu.add(this.soundOffBtn);

    if (this.config.sound_mute) {
      this.soundOnBtn.alpha = 0;
      this.soundOnBtn.exists = false;
    } else {
      this.soundOffBtn.alpha = 0;
      this.soundOffBtn.exists = false;
    }

    this.board = game.add.group();

    var board = game.add.image(game.width * 0.5 - 110, game.height * 0.5 + 40, 'board');

    this.board.add(board);
    this.board.alpha = 0;
    this.board.y = game.height;

    var textStyle = {
      font: '18px Verdana',
      fill: '#424242'
    };

    this.graphics = this.game.add.text(game.width * 0.5, game.height * 0.5 + 75, 'Graphics: kenney.nl', textStyle);
    this.graphics.anchor.set(0.5);

    this.board.add(this.graphics);

    this.music = this.game.add.text(game.width * 0.5, game.height * 0.5 + 100, 'Music: ', textStyle);
    this.music.anchor.set(0.5);

    this.board.add(this.music);

    this.song = this.game.add.text(game.width * 0.5, game.height * 0.5 + 125, 'Eric Skiff - Chibi Ninja', textStyle);
    this.song.anchor.set(0.5);

    this.board.add(this.song);

  },

  update: function() {

    this.physics.arcade.collide(this.player, this.ground);

  },

  startClick: function() {

    this.state.start('Game', true, false, this.config);

  },

  showOptions: function() {

    if (this.board.alpha === 1) {
      this.add.tween(this.board).to({alpha:0, y: game.height}, 500, Phaser.Easing.Exponential.Out, true, 0);
    }

    var menuOut = this.add.tween(this.menu).to({y: -100, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);
    var minMenuOut = this.add.tween(this.minMenu).to({y: -100, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);
    var playerIn = this.add.tween(this.player).to({x: game.width * 0.5}, 900, Phaser.Easing.Default, false);
    playerIn.onComplete.add(function() {
      this.player.play('stand');
      this.tweenInProgress = false;

      this.add.tween(this.bgSelect).to({x: 0, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
      this.add.tween(this.playerSelect).to({y: 0, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
      this.add.tween(this.menuReturn).to({x: 16, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
      this.add.tween(this.startBtn).to({x: game.width - 42, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
    }, this);

    menuOut.onComplete.add(function() {
      playerIn.start();
    });

  },

  showMenu: function() {

    var playerOut = this.add.tween(this.player).to({x: game.width + 24}, 900, Phaser.Easing.Default, false);
    playerOut.onComplete.add(function() {
      this.player.x = -24;
      this.add.tween(this.menu).to({y: 0, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
      this.add.tween(this.minMenu).to({y: 0, alpha: 1}, 250, Phaser.Easing.Cubic.Out, true);
    }, this);

    var optionsOut = this.add.tween(this.bgSelect).to({x: game.width, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);
    this.add.tween(this.playerSelect).to({y: -20, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);
    this.add.tween(this.menuReturn).to({x: -48, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);
    this.add.tween(this.startBtn).to({x: game.width, alpha: 0}, 250, Phaser.Easing.Cubic.Out, true);

    optionsOut.onComplete.add(function() {
      this.player.play('runRight');
      playerOut.start();
    }, this);

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

      var fadeIn = this.add.tween(this.playerSelect).to({y: 0, alpha: 1}, 100);
      var fadeOut = this.add.tween(this.playerSelect).to({y: -20, alpha: 0}, 100);

      var runOutScreen = this.add.tween(this.player).to({x: game.width + 24}, 900, Phaser.Easing.Default, false);
      runOutScreen.onComplete.add(function() {
        this.player.addAnimations(this.player.typesArr[this.typeCounter]);
        this.player.play('runRight');

        this.player.x = -24;
      }, this);

      var runIntoScreen = this.add.tween(this.player).to({x: game.width * 0.5}, 900, Phaser.Easing.Default, false);
      runIntoScreen.onComplete.add(function() {
        this.player.play('stand');
        this.tweenInProgress = false;

        fadeIn.start();
      }, this);

      runOutScreen.chain(runIntoScreen);

      fadeOut.onComplete.add(function() {
        runOutScreen.start();
      });

      fadeOut.start();

      this.config.playerType = this.player.typesArr[this.typeCounter];
    }
  },

  mute: function(item) {

    var btnOn = null;
    var btnOff = null;

    if (item.type === 'music') {
      btnOn = this.musicOnBtn;
      btnOff = this.musicOffBtn;
    } else {
      btnOn = this.soundOnBtn;
      btnOff = this.soundOffBtn;
    }

    if (item.action === 'off') {
      if (item.type === 'music') {
        this.config.music_mute = true;
      } else {
        this.config.sound_mute = true;
      }

      var t = this.add.tween(btnOn).to({alpha: 0}, 100);
      t.onComplete.add(function() {
        this.add.tween(btnOff).to({alpha: 1}, 100, Phaser.Easing.Default, true);
        btnOn.exists = false;
        btnOff.exists = true;
      }, this);
      t.start();
    } else if (item.action === 'on') {
      if (item.type === 'music') {
        this.config.music_mute = false;
      } else {
        this.config.sound_mute = false;
      }

      var t = this.add.tween(btnOff).to({alpha: 0}, 100);
      t.onComplete.add(function() {
        this.add.tween(btnOn).to({alpha: 1}, 100, Phaser.Easing.Default, true);
        btnOff.exists = false;
        btnOn.exists = true;
      }, this);
      t.start();
    }

  },

  help: function() {

    if (this.board.alpha === 1) {
      this.add.tween(this.board).to({alpha:0, y: game.height}, 500, Phaser.Easing.Exponential.Out, true, 0);
    } else {
      this.add.tween(this.board).to({alpha:1, y: 0}, 500, Phaser.Easing.Exponential.Out, true, 0);
    }



  },

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
    this.load.image('score', 'res/score.png');
    this.load.image('best', 'res/best.png');
    this.load.audio('music', 'res/audio/music.ogg');
    this.load.audio('jump', 'res/audio/jump.wav');
    this.load.audio('doublejump', 'res/audio/doublejump.wav');
    this.load.audio('hit', 'res/audio/hit.wav');
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