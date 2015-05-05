var game = new Phaser.Game(300, 450, Phaser.AUTO, 'game_cont');

game.state.add('play', new Play());

game.state.start('play');