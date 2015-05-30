var Fly = function(game) {

  this.posY = game.height - 72;

  this.create(game, 'fly');

};

Fly.prototype = new Enemy();
Fly.prototype.constructor = Fly;

Fly.prototype.update = function() {

  game.time.events.repeat(25, 100, function() {
    this.body.velocity.y = Math.sin(game.time.now) * 50;
  }, this);


};