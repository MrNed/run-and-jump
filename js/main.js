var game = new Phaser.Game(300, 420, Phaser.Canvas, 'game_cont');

game.state.add('boot', new Boot());
game.state.add('preload', new Preload());
game.state.add('menu', new Menu());
game.state.add('play', new Play());

game.state.start('boot');