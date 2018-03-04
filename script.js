// Arcade Shooter game
//// Ticket #1 - Add Enemy Health
//// Description - add new enemy type that requires more than one bullet to eliminate. Make sure the original enemy type still exists as well.

// Get a reference to the canvas DOM element
var canvas = document.getElementById('canvas');
// Get the canvas drawing context
var context = canvas.getContext('2d');

// Create an object representing a square on the canvas
function makeSquare(x, y, length, speed, health) {
  return {
    x: x,
    y: y,
    l: length,
    s: speed,
    h: health,
    draw: function() {
      context.fillRect(this.x, this.y, this.l, this.l);
    }
  };
}

// The ship the user controls
var ship = makeSquare(50, canvas.height / 2 - 25, 50, 5, 300);

// Flags to tracked which keys are pressed
var up = false;
var down = false;
var space = false;

// Is a bullet already on the canvas?
var shooting = false;
// The bullets shot from the ship
var bullets = [];

// An array for enemies (in case there are more than one)
var enemies = [];

// Add an enemy object to the array
var enemyBaseSpeed = 2;

function makeEnemy() {
	enemyTypeIncrement++;

  var enemyX = canvas.width;
  var enemySize = 35;
  var enemyY = Math.round(Math.random() * (canvas.height - enemySize * 2)) + enemySize;
  var enemySpeed = 4;
/*   if (score >= 50) {
    timeBetweenEnemies
  } */
  var enemyHealth = (enemyTypeIncrement % 2) + 1;
  // **#1 - use the makeSquare constructor to add a health property to the new type of enemy instance
  // Make this create the new type of enemy as well as the old type - iterate between the two
  enemies.push(makeSquare(enemyX, enemyY, enemySize, enemySpeed, enemyHealth));
}

// Check if number a is in the range b to c (exclusive)
function isWithin(a, b, c) {
  return (a > b && a < c);
}

// Return true if two squares a and b are colliding, false otherwise
function isColliding(a, b) {
  var result = false;
  if (isWithin(a.x, b.x, b.x + b.l) || isWithin(a.x + a.l, b.x, b.x + b.l)) {
    if (isWithin(a.y, b.y, b.y + b.l) || isWithin(a.y + a.l, b.y, b.y + b.l)) {
      result = true;
    }
  }
  return result;
}

// Track the user's score
var score = 0;
// The delay between enemies (in milliseconds)
var timeBetweenEnemies = 700;
// ID to track the spawn timeout
var timeoutId = null;
var enemyTypeIncrement = 0;

// Show the game menu and instructions
function menu() {
  erase();
  context.fillStyle = '#000000';
  context.font = '36px Arial';
  context.textAlign = 'center';
  context.fillText('Shoot \'Em!', canvas.width / 2, canvas.height / 4);
  context.font = '24px Arial';
  context.fillText('Click to Start', canvas.width / 2, canvas.height / 2);
  context.font = '18px Arial';
  context.fillText('Up/Down to move, Space to shoot.', canvas.width / 2, (canvas.height / 4) * 3);
  // Start the game on a click
  canvas.addEventListener('click', startGame);
}

// Start the game
function startGame() {
	// Kick off the enemy spawn interval
  
  // **#1 change code here**
  timeoutId = setInterval(makeEnemy, timeBetweenEnemies);
  // Kick off the draw loop
  draw();
  // Stop listening for click events
  canvas.removeEventListener('click', startGame);
}

// Show the end game screen
function endGame() {
	// Stop the spawn interval
  clearInterval(timeoutId);
  // Show the final score
  erase();
  context.fillStyle = '#000000';
  context.font = '24px Arial';
  context.textAlign = 'center';
  context.fillText('Game Over. Final Score: ' + score, canvas.width / 2, canvas.height / 2);
}

// Listen for keydown events
canvas.addEventListener('keydown', function(event) {
  event.preventDefault();
  if (event.keyCode === 38) { // UP
    up = true;
  }
  if (event.keyCode === 40) { // DOWN
    down = true;
  }
  if (event.keyCode === 32) { // SPACE
    shoot();
  }
});

// Listen for keyup events
canvas.addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.keyCode === 38) { // UP 
    up = false;
  }
  if (event.keyCode === 40) { // DOWN
    down = false;
  }
});

// Clear the canvas
function erase() {
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, 600, 400);
}

// Shoot the bullet (if not already on screen)
function shoot() {
  	var bullet = makeSquare(0, 0, 10, 10);
    var bullet2 = makeSquare(0, 0, 10, 10);
    var bullet3 = makeSquare(0, 0, 10, 10);
    shooting = true;
    bullet.x = ship.x + ship.l;
    bullet.y = ship.y + ship.l /2;
    
    bullet2.x = ship.x + ship.l;
    bullet2.y = ship.y + ship.l;
    bullet3.x = ship.x + ship.l;
    bullet3.y = ship.y + ship.l * 1.5;
    bullets.push(bullet);
    bullets.push(bullet2);
    bullets.push(bullet3);
}

// The main draw loop
function draw() {
  erase();
  var gameOver = false;
  
  // Move and draw the enemies
  enemies.forEach(function(enemy, i) {
    enemy.x -= enemy.s;
    if (enemy.x < 0) {
      ship.h = ship.h - 1;
      delete enemies[i];
    }
    if (enemy.h > 1) {
      context.fillStyle = '#808000';
    } else {
	    context.fillStyle = '#00FF00';
    }
    
    enemy.draw();
    // check for ship collision
    if (isColliding(enemy, ship)) {
      // remove ten health from ship
			ship.h = ship.h - 10;
      // remove enemy when it collides
			delete enemies[i];

      // if ship is at 0 health, set gameOver to true
    }
    if (ship.h <= 0) {
      gameOver = true;
    }
    
  });

  // Move the ship
  if (down) {
    ship.y += ship.s;
  }
  if (up) {
    ship.y -= ship.s;
  }
  // Don't go out of bounds
  if (ship.y < 0) {
    ship.y = 0;
  }
  if (ship.y > canvas.height - ship.l) {
    ship.y = canvas.height - ship.l;
  }
  // Draw the ship
  context.fillStyle = '#FF0000';
  ship.draw();
  // Move and draw the bullets
  if (shooting) {
    // Move the bullets
    bullets.forEach(function(bullet, bulletIndex) {
      bullet.x += bullet.s;
      // Collide the bullet with enemies
      
      // **#1 - Change code here**
      enemies.forEach(function(enemy, enemyIndex) {

        if (isColliding(bullet, enemy)) {
					bullets.splice(bulletIndex, 1);
          // decrease enemy health by 1
          enemy.h--;
          // check if enemy health is at or below zero
          console.log('this enemy\'s health', enemy.h);
          if (enemy.h <= 0) {
            // if it is remove the enemy
            enemies.splice(enemyIndex, 1);

            score++;
            // increase ship health when kill enemy
            ship.h++;
          }
        }

      });
    });

    // Collide with the wall
    bullets.forEach(function(bullet, i) {
      if ( bullet.x > 600 ) {
			  delete bullets[i];
      }
    });
    // Draw the bullet
    context.fillStyle = '#0000FF';
    bullets.forEach(function(bullet) {
      bullet.draw();    
    });

  }
  // Draw the score
  context.fillStyle = '#000000';
  context.font = '24px Arial';
  context.textAlign = 'left';
  context.fillText('Score: ' + score, 1, 25)
  // Draw the health meter
  context.fillStyle = '#000000';
  context.font = '24px Arial';
  context.textAlign = 'start';
  context.fillText('Health: ' + ship.h, 2, 50)
  // End or continue the game
  if (gameOver) {
    endGame();
  } else {
    window.requestAnimationFrame(draw);
  }
}

// Start the game
menu();
canvas.focus();
