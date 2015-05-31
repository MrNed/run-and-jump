var Enemies = function (game) {

  Phaser.Group.call(this, game, game.world, 'Enemies', false, true, Phaser.Physics.ARCADE);

  this.nextSpawn = 0;
  this.minSpawnRate = 1000;
  this.maxSpawnRate = 1800;
  this.minSpeed = 200;
  this.maxSpeed = 400;

  this.spawnSpeed = 0;
  this.spawnRate = 0;
  this.spawnX = 0;
  this.direction = 'left';

  var i = 0;
  for (i; i < 2; i++) {
    this.add(new Mouse(game));
    this.add(new Bee(game));
    this.add(new Fly(game));
    this.add(new Ladybug(game));
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

  this.spawnSpeed = game.rnd.integerInRange(this.minSpeed, this.maxSpeed);
  this.spawnRate = game.rnd.integerInRange(this.minSpawnRate, this.maxSpawnRate);

  if (this.direction === 'random') {
    this.fromSide = game.rnd.pick(['left', 'right']);
  } else {
    this.fromSide = this.direction;
  }

  if (this.fromSide === 'left') {
    this.spawnSpeed *= -1;
    this.spawnX = game.width + 20;
  } else if (this.fromSide === 'right') {
    this.fromSide = 'right';
    this.spawnX = 0;
  }

  this.getFirstExists(false).spawn(this.spawnX, this.spawnSpeed, this.fromSide);

  this.nextSpawn = this.game.time.time + this.spawnRate;

};

Enemies.prototype.stop = function() {

  this.forEach(function(enemy) {
    enemy.stop();
  });

};

Enemies.prototype.countOnScreen = function() {

  var test = 0;

  this.forEach(function(enemy) {
    if (enemy.exists) {
      test++;
    }
  });

  return test;

};