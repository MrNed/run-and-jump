var Enemies = function (game) {
  Phaser.Group.call(this, game, game.world, 'Enemies', false, true, Phaser.Physics.ARCADE);

  this.nextSpawn = 0;
  this.enemySpeed = -150;
  this.spawnRate = 2500;

  var i = 0;
  for (i; i < 4; i++) {
    this.add(new Enemy(game, 'sprites', 'mouse'), true);
  }

  return this;
};

Enemies.prototype = Object.create(Phaser.Group.prototype);
Enemies.prototype.constructor = Enemies;

Enemies.prototype.spawn = function () {
  if (this.game.time.time < this.nextSpawn) {
    return;
  }

  this.getFirstExists(false).spawn(this.game.width, this.game.height - 70, this.enemySpeed);

  this.nextSpawn = this.game.time.time + this.spawnRate;
};