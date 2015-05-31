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