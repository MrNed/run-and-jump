var Mouse = function(game) {

  this.posY = game.height - 48;

  this.create(game, 'mouse');

};

Mouse.prototype = new Enemy(game);
Mouse.prototype.constructor = Mouse;