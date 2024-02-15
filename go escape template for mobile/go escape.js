const gameContainer = document.getElementById('game-container');
const levelDisplay = document.getElementById('level-display');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const player = document.getElementById('player');

let playerX = 10;
let playerY = 10;
let level = 1;
let score = 0;
let time = 60;
let timerInterval;

initializeLevel();

gameContainer.addEventListener('touchstart', function(event) {
    const touch = event.touches[0];
    const touchX = touch.clientX - gameContainer.offsetLeft;
    const touchY = touch.clientY - gameContainer.offsetTop;

    movePlayer(touchX, touchY);
});

function initializeLevel() {
    levelDisplay.textContent = `Level: ${level}`;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${time}`;

    playerX = 10;
    playerY = 10;
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    clearInterval(timerInterval);
    time = 60;
    timerInterval = setInterval(updateTimer, 1000);

    gameContainer.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());

    createObstacles(level);

    const exit = document.createElement('div');
    exit.classList.add('exit');
    exit.style.left = getRandomPosition(20, 280) + 'px';
    exit.style.top = getRandomPosition(20, 280) + 'px';
    gameContainer.appendChild(exit);
}

function movePlayer(x, y) {
    const maxX = gameContainer.clientWidth - player.clientWidth;
    const maxY = gameContainer.clientHeight - player.clientHeight;

    playerX = Math.min(Math.max(0, x), maxX);
    playerY = Math.min(Math.max(0, y), maxY);

    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    checkWin();
    checkCollision();
}

function checkWin() {
    const exit = document.querySelector('.exit');
    const exitRect = exit.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (playerRect.left + playerRect.width >= exitRect.left &&
        playerRect.top + playerRect.height >= exitRect.top &&
        playerRect.left <= exitRect.left + exitRect.width &&
        playerRect.top <= exitRect.top + exitRect.height) {
        score += level * 100;
        scoreDisplay.textContent = `Score: ${score}`;
        alert(`Congratulations! You escaped Level ${level}!`);
        level++;
        initializeLevel();
    }
}

function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const obstacles = document.querySelectorAll('.obstacle');

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (playerRect.left + playerRect.width >= obstacleRect.left &&
            playerRect.top + playerRect.height >= obstacleRect.top &&
            playerRect.left <= obstacleRect.left + obstacleRect.width &&
            playerRect.top <= obstacleRect.top + obstacleRect.height) {
            clearInterval(timerInterval);
            alert('Game Over! You collided with an obstacle.');
            initializeLevel();
        }
    });
}

function createObstacles(level) {
    for (let i = 0; i < level * 2; i++) {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = getRandomPosition(20, 280) + 'px';
        obstacle.style.top = getRandomPosition(20, 280) + 'px';
        obstacle.style.width = getRandomPosition(30, 70) + 'px';
        obstacle.style.height = getRandomPosition(30, 70) + 'px';
        gameContainer.appendChild(obstacle);
    }
}

function getRandomPosition(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function updateTimer() {
    time--;
    timerDisplay.textContent = `Time: ${time}`;
    if (time === 0) {
        clearInterval(timerInterval);
        alert('Time is up! Game Over.');
        initializeLevel();
    }
}