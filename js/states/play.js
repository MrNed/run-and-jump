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