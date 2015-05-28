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
  this.firstPlay = true;

  this.phase = 1;

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

    this.player = new Player(game, -20, game.height - 74, 'sprites', this.config.playerType);

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
        this.checkScore(enemy);
      }, this);
    } else {
      this.timer.update(game.time.time);
    }

/*
    if (this.score === 2 && this.phase === 1 && this.player.onGround()) {
      this.player.allowJump = false;

        var moveToEnd = game.add.tween(this.player).to({x: game.width - 48}, 500);
        moveToEnd.onComplete.add(function() {
          this.enemies.direction = 'right';
          this.player.allowJump = true;
          // this.spawn = true;
          this.phase = 2;
          // console.log('END!');
        }, this);
        moveToEnd.start();

    }
*/

  },

  shutdown: function() {

    this.player = null;
    this.ground = null;
    this.enemies = null;
    this.board = null;
    this.spawn = false;
    this.score = 0;
    this.timer = null;

  },

  die: function(player, enemy) {

    this.spawn = false;

    this.physics.arcade.gravity.y = 0;
    this.ground.stopScroll();
    this.bg.stopFrontScroll();

    player.hitEnemy();

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