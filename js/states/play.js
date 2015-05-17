var Play = function() {
  this.player = null;
  this.ground = null;
  this.enemies = null;
  this.board = null;
  this.spawn = false;

  this.score = 0;
  this.scoreText = '';

  this.timer = null;
  this.spawnDelay = 1000;
};

Play.prototype = {
  init: function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 800;

    this.game.time.advancedTiming = true;
  },
  create: function() {
    this.bg = new Background(this.game);
    this.bg.startFrontScroll();

    this.ground = new Ground(this.game, 0, this.game.height - 48, 480, 48);
    this.ground.startScroll();

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

    this.scoreText = this.game.add.text(this.game.width / 2, 5, '0', textStyle);

    this.timer = new Phaser.Timer(this.game);
    this.timer.add(this.spawnDelay, function() {
      this.spawn = true;
    }, this);
    this.timer.start();

    this.board = new Board(this.game);
  },
  update: function() {
    this.timer.update(this.game.time.time);

    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.enemies, this.die, null, this);

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

    this.board.show();
  },
  checkScore: function(enemy) {
    if (enemy.exists && !enemy.hasScored && enemy.world.x <= this.player.world.x) {
      enemy.hasScored = true;

      this.score++;
      this.scoreText.text = this.score.toString();
    }
  },
  render: function() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
  }
};