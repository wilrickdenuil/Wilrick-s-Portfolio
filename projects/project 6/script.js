// DATA
const colours = ["yellow", "blue", "red", "green"];

let sequence = [];
let playerInput = [];

let score = 0;
let highscore = Number(localStorage.getItem("highscore")) || 0;

let playerTurn = false;

// START

$(".highscore").text(`Highscore: ${highscore}`);

$(".start-button").click(startGame);

$(".game-button").click(function () {
  if (!playerTurn) {
    return;
  }

  const colour = $(this).val();

  showButton(colour);

  playerInput.push(colour);

  validatePlayerInput();
});

// FUNCTIONS

function startGame() {
  $(".start-button").prop("disabled", true);

  sequence = [];

  score = 0;

  updateScore();

  addSequence();

  showSequence();
}

function addSequence() {
  const randomColour = colours[Math.floor(Math.random() * colours.length)];

  sequence.push(randomColour);
}

async function showSequence() {
  playerTurn = false;

  playerInput = [];

  await wait(500);

  for (const colour of sequence) {
    showButton(colour);

    await wait(700);
  }

  playerTurn = true;
}

function showButton(colour) {
  const button = $(`button[value="${colour}"]`);

  button.addClass("active");

  setTimeout(() => {
    button.removeClass("active");
  }, 300);
}

function validatePlayerInput() {
  const index = playerInput.length - 1;

  if (playerInput[index] !== sequence[index]) {
    endGame();

    return;
  }

  if (playerInput.length === sequence.length) {
    score++;

    updateScore();

    setTimeout(() => {
      addSequence();

      showSequence();
    }, 1000);
  }
}

function updateScore() {
  $(".level").text(`Score: ${score}`);

  if (score > highscore) {
    highscore = score;

    localStorage.setItem("highscore", highscore);
  }

  $(".highscore").text(`Highscore: ${highscore}`);
}

function endGame() {
  alert(`Game over!\nScore: ${score}\nHighscore: ${highscore}`);

  $(".start-button").prop("disabled", false);

  sequence = [];

  playerInput = [];

  playerTurn = false;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
