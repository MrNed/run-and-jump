var Bee = function(game) {

  this.posY = game.height - 72;

  this.create(game, 'bee');

};

Bee.prototype = new Enemy();
Bee.prototype.constructor = Bee;