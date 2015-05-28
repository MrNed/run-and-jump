var Enemies = function (game) {

  this.enemiesCounter = 0;
  this.possibleEnemies = ['mouse', 'bee', 'fly', 'ladybug'];
  // this.possibleEnemies = ['fly'];

  Phaser.Group.call(this, game, game.world, 'Enemies', false, true, Phaser.Physics.ARCADE);

  this.nextSpawn = 0;
  this.minSpawnRate = 1000;
  this.maxSpawnRate = 2000;
  this.minSpeed = 200;
  this.maxSpeed = 400;

  this.spawnSpeed = 0;
  this.spawnRate = 0;
  this.spawnX = 0;
  this.direction = 'left';

  var i = 0,
      j,
      length = this.possibleEnemies.length;

  for (i; i < length; i++) {
    for (j = 0; j < 3; j++) {
      this.add(new Enemy(game, 'sprites', this.possibleEnemies[i], 'left'));
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

  // this.spawnSpeed = game.rnd.integerInRange(this.minSpeed, this.maxSpeed) + (this.enemiesCounter * 5);
  this.spawnSpeed = game.rnd.integerInRange(this.minSpeed, this.maxSpeed) + (this.enemiesCounter * 2.5);
  // this.spawnSpeed = game.rnd.integerInRange(this.minSpeed, this.maxSpeed);

  if (this.direction === 'left') {
    this.spawnSpeed *= -1;
    this.spawnX = this.game.width + 24;
  } else {
    this.spawnX = 0;
  }

  // this.spawnRate = game.rnd.integerInRange(this.minSpawnRate, this.maxSpawnRate) - (this.enemiesCounter * 10);
  this.spawnRate = game.rnd.integerInRange(this.minSpawnRate, this.maxSpawnRate) - (this.enemiesCounter * 5);
  // this.spawnRate = game.rnd.integerInRange(this.minSpawnRate, this.maxSpawnRate);

  this.getFirstExists(false).spawn(this.spawnX, this.game.height - 48, this.spawnSpeed, this.direction);

  this.nextSpawn = this.game.time.time + this.spawnRate;

  this.enemiesCounter++;

};