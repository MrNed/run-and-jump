var Enemies = function (game) {

  this.enemiesCounter = 0;
  this.possibleEnemies = ['mouse', 'bee'];

  Phaser.Group.call(this, game, game.world, 'Enemies', false, true, Phaser.Physics.ARCADE);

  this.nextSpawn = 0;
  this.minSpawnRate = 1000;
  this.maxSpawnRate = 2000;
  this.minSpeed = 200;
  this.maxSpeed = 400;

  var i = 0,
      length = this.possibleEnemies.length;

  for (i; i < length; i++) {
    for (j = 0; j < 3; j++) {
      this.add(new Enemy(game, 'sprites', this.possibleEnemies[i]), true);
    }
  }

  return this;

};

Enemies.prototype = Object.create(Phaser.Group.prototype);
Enemies.prototype.constructor = Enemies;

Enemies.prototype.spawn = function () {

  if (this.game.time.time < this.nextSpawn) {
    return;
  }

  // RANDOMIZE ENEMIES - PROBABLY CAN BE DONE BETTER
  this.children.sort(function() { return 0.5 - Math.random() });

  var speed = -(game.rnd.integerInRange(this.minSpeed, this.maxSpeed) + (this.enemiesCounter * 5));
  var spawn = game.rnd.integerInRange(this.minSpawnRate, this.maxSpawnRate) - (this.enemiesCounter * 10);

  this.getFirstExists(false).spawn(this.game.width, this.game.height - 72, speed);

  this.nextSpawn = this.game.time.time + spawn;

  this.enemiesCounter++;

};