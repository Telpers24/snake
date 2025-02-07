const closeBtn = document.getElementById("closeModel");
const model = document.getElementById("model");

closeBtn.addEventListener("click", () => {
    model.classList.remove("open");
    reset();
});

const CANVAS_BORDER_COLOR = 'black';
const CANVAS_BACKGROUND_COLOR = 'green';
const SNAKE_COLOR = 'lightgreen';
const SNAKE_BORDER_COLOR = 'darkgreen';
const FOOD_COLOR = 'red';
const FOOD_BORDER_COLOR = 'darkred';

let gameSpeed = 100;

let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150}
]

// The user's score
let score = 0;
// the user's high score
let highScore = 0;
// When set to true the snake is changing direction
let changingDirection = false;
// Food x-coord
let foodX;
// Food y-coord
let foodY;
// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

// Get the canvas element
const gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
const ctx = gameCanvas.getContext("2d");

// // Start game
// main();
// // Create the first food location
// createFood();

// Have Snake Game Prompt before game begins
clearCanvas();
model.classList.add("open");
// Call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);

/**
 * This function resets the game
 */
function reset() {
    snake = [{x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}];
    dx = 10;
    dy = 0;
    score = 0;
    gameSpeed = 100;
    document.getElementById('score').innerHTML = score;
    main();
    createFood();
}

/**
 * Main function of the game
 * called repeatedly to advance the game
 */
function main() {
    if (didGameEnd()) {
        if (score > highScore) {
            highScore = score;
        }
        document.getElementById("highScore").innerHTML = "High Score: " + highScore;
        model.classList.add("open");
        return;
    }

    setTimeout(function onTick() {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        // Call game again
        main();
    }, gameSpeed);
}


/**
 * Change the background color of the canvas to CANVAS_BACKGROUND_COLOR 
 * and draw a border around it
 */
function clearCanvas() {
    // Select the color to fill the drawing
    ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
    // Select the color for the border of the canvas
    ctx.strokestyle = CANVAS_BORDER_COLOR;

    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a "border" around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

/**
 * Draw the food on the canvas
 */
function drawFood() {
    ctx.fillStyle = FOOD_COLOR;
    ctx.strokestyle = FOOD_BORDER_COLOR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

/**
 * Advances the snake by changing the x-coords of its parts
 * according to teh horizontal velocity and the y-coords of its parts
 * according to teh vertical velocity
 */
function advanceSnake() {
    // Create the new Snake's head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // Add the new head ot the beginning of hte snake body
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        // Increases score
        score += 1;
        // Display score on screen
        document.getElementById('score').innerHTML = score;

        if (score % 3 == 0 && gameSpeed > 6) {
            
            gameSpeed -= 5;
        }
        //Generate new food location
        createFood();
    } else {
        // Remove the last part of the snake body
        snake.pop();
    }
}

/**
 * Returns true if the head of the snake touched another 
 * part of the game or any of the walls
 */
function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

/**
 * Generates a random number that is a multiple of 10 given
 * a minimum and a maximum number
 * @param min - min number the random number can be
 * @param max - max num the random num can be
 */
function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

/**
 * Creates random set of coords for the snake food
 */
function createFood() {
    // Generate a random num for the food x-coord
    foodX = randomTen(0, gameCanvas.width - 10);
    // Generate a random num for the food y-coord
    foodY = randomTen(0, gameCanvas.height - 10);

    // If the new food location is where the snake is, try again
    snake.forEach( function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) createFood();
    });
}

/**
 * Draws the snake on the canvas
 */
function drawSnake() {
    // loop through the snake parts drawing each part on the canvas
    snake.forEach(drawSnakePart);
}

/**
 * Draws a part of the snake on the canvas
 * @param { object }snakePart - the coords where the part should be drawn
 */
function drawSnakePart(snakePart) {
    // Set the color of the snake
    ctx.fillStyle = SNAKE_COLOR;
    // Set the border color of the snake
    ctx.strokestyle = SNAKE_BORDER_COLOR;

    // Draw a "filled" rectangle to show snake at cords
    // Box colored in
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);

    // Draw border around part
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

/**
 * Changes the vertical and horizontal verlocity of the snake
 * according to the key that was pressed.
 * The direction cannot be switched to teh opposite direction,
 * to prevent the snake form reversing
 * @param { object } event - the keydown event
 */
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;

    changingDireciton = true;

    const keyPressed = event.keyCode;

    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}
