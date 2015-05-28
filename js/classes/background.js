var Background = function(game, type) {

  if (typeof type === 'undefined') {
    type = 'grass';
  }

  game.stage.backgroundColor = '#d0f4f7';

  this.cloudsSecond = game.add.tileSprite(0, game.height - 320, 967, 177, 'bg_clouds_2');
  this.cloudsSecond.autoScroll(-20, 0);

  this.cloudsFirst = game.add.tileSprite(-200, game.height - 250, 967, 177, 'bg_clouds_1');
  this.cloudsFirst.autoScroll(-40, 0);

  this.front = game.add.tileSprite(0, game.height - 264, 967, 264, 'bg_' + type);

};

Background.prototype = Object.create(Phaser.Group.prototype);
Background.prototype.constructor = Background;

Background.prototype.startFrontScroll = function() {

  this.front.autoScroll(-50, 0);

};

Background.prototype.stopFrontScroll = function() {

  this.front.autoScroll(0, 0);

};

Background.prototype.change = function(type) {

  this.front.loadTexture('bg_' + type);

  // SO WRONG...
  var self = this;
  setTimeout(function() {
    self.front.loadTexture('bg_' + type);
  }, 25);

};