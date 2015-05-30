var Ladybug = function(game) {

  this.posY = game.height - 48;

  this.create(game, 'ladybug');

};

Ladybug.prototype = new Enemy(game);
Ladybug.prototype.constructor = Ladybug;