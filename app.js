let score = 0;
let hight_score = 0;
let game_over = false;
const app = () => {
  const showAndUpdateScore = () => {
    const scoreEl = document.querySelector(".score");
    score = score + 10;
    scoreEl.innerText = `Score: ${score}`;
  };

  const generateObstacle = (
    MIN_OBSTACLE_HEIGHT,
    VARIABLE_OBSTACLE_HEIGHT,
    GAP_HEIGHT
  ) => {
    const body = document.querySelector("body");
    const totalHeight = body.clientHeight;

    const obstacleUpper = document.createElement("div");
    const obstacleLower = document.createElement("div");

    obstacleUpper.classList.add("obstacle", "upper-obstacle", "move-obstacle");
    obstacleLower.classList.add("obstacle", "lower-obstacle", "move-obstacle");

    //Add a timestamp to the obstacle using data attribute as to when it was created
    const timeStamp = new Date().getTime();
    obstacleUpper.dataset.createdAt = timeStamp;
    obstacleLower.dataset.createdAt = timeStamp;

    const randomHeight =
      Math.floor(Math.random() * VARIABLE_OBSTACLE_HEIGHT) +
      MIN_OBSTACLE_HEIGHT;

    obstacleUpper.style.height = `${randomHeight}px`;
    obstacleLower.style.height = totalHeight - randomHeight - GAP_HEIGHT + "px";

    body.append(obstacleUpper, obstacleLower);
  };

  const removeObstacle = (delay) => {
    const createdObstacles = document.querySelectorAll(".obstacle");
    createdObstacles.forEach((obstacle) => {
      if (new Date().getTime() - obstacle.dataset.createdAt > delay) {
        obstacle.remove();
      }
    });
  };

  const applyGravityOnBird = () => {
    const bird = document.querySelector(".flappy-bird");
    bird.style.top = bird.getBoundingClientRect().top + 100 + "px";
  };

  const generateObstacleIntervalId = setInterval(
    () => generateObstacle(200, 100, 180),
    1000
  );
  const removeIntervalId = setInterval(() => removeObstacle(7000), 1000);
  const applyGravityIntervalId = setInterval(applyGravityOnBird, 250);
  const showAndUpdateScoreIntervalId = setInterval(showAndUpdateScore, 1000);

  const gameOver = () => {
    game_over = true;
    const obstacles = document.querySelectorAll(".obstacle");
    clearInterval(applyGravityIntervalId);
    clearInterval(generateObstacleIntervalId);
    clearInterval(removeIntervalId);

    obstacles.forEach((obstacle) => {
      obstacle.remove();
    });

    const body = document.querySelector("body");
    body.classList.add("game-over");
    body.innerHTML = `<div>
      <h1>Game Over</h1>
      <p>Your score: ${score}</p>
      </div>`;
  };
  const checkCollision = () => {
    const bird = document.querySelector(".flappy-bird");
    const birdRect = bird.getBoundingClientRect();
    const obstacles = document.querySelectorAll(".obstacle");

    for (const obstacle of obstacles) {
      const obstacleRect = obstacle.getBoundingClientRect();

      // Check for horizontal overlap
      const horizontalOverlap =
        birdRect.right > obstacleRect.left &&
        birdRect.left < obstacleRect.right;

      // Check for vertical overlap with upper and lower obstacles
      const upperObstacleOverlap =
        birdRect.top < obstacleRect.bottom &&
        obstacle.classList.contains("upper-obstacle");
      const lowerObstacleOverlap =
        birdRect.bottom > obstacleRect.top &&
        obstacle.classList.contains("lower-obstacle");

      // If there's horizontal overlap and either vertical overlap
      if (horizontalOverlap && (upperObstacleOverlap || lowerObstacleOverlap)) {
        gameOver();
        break;
      }
    }
  };
  setInterval(checkCollision, 250);

  //listen to keyboard events
  document.addEventListener("keydown", (event) => {
    if (!game_over && event.code === "Space") {
      const bird = document.querySelector(".flappy-bird");
      bird.style.top = bird.getBoundingClientRect().top - 200 + "px";
      setTimeout(() => {
        document.querySelector(".flappy-bird").classList.remove("jump");
      }, 500);
    }
  });
};

app();
