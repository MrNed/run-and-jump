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
    this.ground.stopScroll();
    this.bg.stopFrontScroll();

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