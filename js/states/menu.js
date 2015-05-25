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

    this.menuReturn = this.add.button(-48, 16, 'sprites', this.showMenu, this, 'menu_btn.png', 'menu_btn.png', 'menu_btn_hover');
    this.menuReturn.alpha = 0;
    this.menuReturn.input.useHandCursor = true;

    this.startBtn = this.add.button(game.width, 16, 'sprites', this.startClick, this, 'play_btn.png', 'play_btn.png', 'play_btn_hover.png');
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