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