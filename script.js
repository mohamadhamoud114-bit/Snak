const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridCount = 20;
const gridSize = canvas.width / gridCount;

let snake = [];
let food = {};
let direction = "RIGHT";
let nextDirection = "RIGHT";
let score = 0;
let highScore = localStorage.getItem("snake_high_score") || 0;
let gameLoop = null;
let gameSpeed = 120;

document.getElementById("high-score").innerText = highScore;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    document.getElementById("current-score").innerText = score;
    spawnFood();
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * gridCount),
        y: Math.floor(Math.random() * gridCount),
        type: Math.random() > 0.8 ? "SUPER" : "NORMAL"
    };
}

function changeDirection(newDir) {
    if (newDir === "UP" && direction !== "DOWN") nextDirection = "UP";
    if (newDir === "DOWN" && direction !== "UP") nextDirection = "DOWN";
    if (newDir === "LEFT" && direction !== "RIGHT") nextDirection = "LEFT";
    if (newDir === "RIGHT" && direction !== "LEFT") nextDirection = "RIGHT";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") changeDirection("UP");
    if (e.key === "ArrowDown") changeDirection("DOWN");
    if (e.key === "ArrowLeft") changeDirection("LEFT");
    if (e.key === "ArrowRight") changeDirection("RIGHT");
});

function update() {
    direction = nextDirection;
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= 1;
    if (direction === "DOWN") head.y += 1;
    if (direction === "LEFT") head.x -= 1;
    if (direction === "RIGHT") head.x += 1;

    // الاصطدام بالجدران
    if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
        gameOver();
        return;
    }

    // الاصطدام بجسم الثعبان
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // أكل الطعام
    if (head.x === food.x && head.y === food.y) {
        score += food.type === "SUPER" ? 30 : 10;
        document.getElementById("current-score").innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snake_high_score", highScore);
            document.getElementById("high-score").innerText = highScore;
        }
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    // مسح الشاشة
    ctx.fillStyle = "#050508";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // رسم الطعام بتأثير نيون مضيء
    ctx.shadowBlur = 15;
    if (food.type === "SUPER") {
        ctx.fillStyle = "#ff007f";
        ctx.shadowColor = "#ff007f";
    } else {
        ctx.fillStyle = "#00f0ff";
        ctx.shadowColor = "#00f0ff";
    }
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);

    // رسم الثعبان
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = "#ff007f";
            ctx.shadowColor = "#ff007f";
        } else {
            ctx.fillStyle = "#00f0ff";
            ctx.shadowColor = "#00f0ff";
        }
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });

    ctx.shadowBlur = 0;
}

function startGame() {
    document.getElementById("startOverlay").style.display = "none";
    initGame();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update, gameSpeed);
}

function gameOver() {
    clearInterval(gameLoop);
    alert(`انتهت اللعبة! مجموع نقاطك: ${score}`);
    document.getElementById("startOverlay").style.display = "flex";
}
