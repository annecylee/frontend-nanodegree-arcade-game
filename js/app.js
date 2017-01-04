// Control game flow
var Game = function(allEnemies, player, trapped) {
  this.allEnemies = allEnemies;
  this.player = player;
  this.trapped = trapped
}

//Reset game
Game.prototype.reset = function() {
  ctx2.clearRect(0,0,505,606);
  this.trapped.reset();
  this.player.reset();
  this.won = false
}

//Move player based on user input and game state
Game.prototype.movePlayer = function(direction) {
  //If wins, user cannot move player
  if (! this.won) {
    this.player.handleInput(direction);
  }

}

//Update game
Game.prototype.update = function() {
  this.trapped.update();
  for (var e of allEnemies) {
    this.player.isCollided(e.x, e.y);
  }
  if (this.player.collided) {
    this.reset()
  }
}

//Check if is won, user can press Enter to reset game once
//wins the game
Game.prototype.isWon = function(input) {
  if (this.trapped.y > 310) {
    this.won = true;
    this.wonScreen();
    if (input === 'enter') {
      this.reset()
    }
  }
}

// Show prompt
Game.prototype.wonScreen = function() {
  ctx2.clearRect(0,0,505,606);
  ctx2.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx2.fillRect(0,0,505,606);
  ctx2.font = "40px serif"
  ctx2.fillStyle= "#ffffff";
  ctx2.fillText("You win!", 200, 300)
  ctx2.font = "20px serif"
  ctx2.fillText("Press Enter to restart", 180, 350)
}


// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.y = (Math.floor(Math.random() * 3 + 1)) * 83;
    //column width is 101, set the start location to -101 before enter
    // row 1-3 is stone. The enemy's start row is randomly choosed
    this.x = -101;
    this.speed = Math.floor(Math.random() * 500 + 50);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed  * dt);
    //if enemy-bug move outside canvas, move to left side of the canvas
    if (this.x > 606) {
      this.x = -101;
      this.y = (Math.floor(Math.random() * 3 + 1)) * 75;
    }

  }

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class with an initial a x, y coordinate, horizontal and
// vertical movement, and sorce.
var Player = function() {
  this.sprite = 'images/char-horn-girl.png';
  this.reset()

}

//Check if player collides with enemy
Player.prototype.isCollided = function(x, y) {
  if (x - 50 < this.x && this.x < x + 50) {
    if (y - 40 < this.y && this.y < y + 40) {
        this.collided = true
    }
  }
}

//Reset player
Player.prototype.reset = function() {
  this.x = 202;
  this.y = 400;
  this.horizontalStep = 101;
  this.verticalStep = 83;
  this.collided = false;
}


//Render player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


//How to player based on user's key input
Player.prototype.handleInput = function(direction) {

  if (direction === 'left') {
    if (this.x < 10) {
      this.x = 400;
    } else{
      this.x -= this.horizontalStep;
    }
  } else if (direction === 'right') {
    if (this.x > 350) {
      this.x = 0;
    } else {
      this.x += this.horizontalStep;
    }
  }
  else if (direction === 'up') {
    if (this.y > 0) {
      this.y -= this.verticalStep;
    }
  }
  else if (direction === 'down') {
    if (this.y < 400) {
      this.y += this.verticalStep;
    }
  }

}

//The trapped one that player to be save to win the game
var Trapped = function(sprite) {
  this.sprite = sprite;
  this.reset()
}

//Reset trapped one
Trapped.prototype.reset = function() {
  this.followPlayer = false;
  this.x = 200;
  this.y = -10;
}

//Render trapped
Trapped.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Trapped.prototype.update = function() {
  if (this.followPlayer || player.y < 40) {
    this.x = player.x + 60;
    this.y = player.y;
    this.followPlayer = true;
  }
}


// Place all enemy objects in an array called allEnemies
var enemy1 = new Enemy ();
var enemy2 = new Enemy ();
var enemy3 = new Enemy ();
var allEnemies = [enemy1, enemy2, enemy3];
// Place the player object in a variable called player
var player = new Player();
// Place the traped one object in a variable called trapped
var trapped = new Trapped('images/char-boy.png');
// Place the game object in a variable called game
var game = new Game(allEnemies, player, trapped);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    game.movePlayer(allowedKeys[e.keyCode])
});

// Once user wins the game, he can hit Enter to play again
document.addEventListener('keyup', function(e) {
    var restartKey = {
      13: 'enter'
    }

    game.isWon(restartKey[e.keyCode])
});
