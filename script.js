const solution = [
  [9,5,8,7,4,1,2,6,3],
  [2,6,3,8,9,5,4,1,7],
  [4,1,7,3,2,6,9,5,8],
  [7,9,5,1,3,4,8,2,6],
  [3,4,1,6,8,2,7,9,5],
  [8,2,6,5,7,9,3,4,1],
  [5,8,2,4,1,7,6,3,9],
  [1,7,9,2,6,3,5,8,4],
  [6,3,4,9,5,8,1,7,2]
];

const messages = [
  "Congratulations! One puzzle completed 💕",
  "Great job! Your brain did amazing 🧠✨",
  "Puzzle solved! Keep going 🌸",
  "You did it! Koala is proud 🐨💖",
  "Sudoku mastered! 🎉"
];

const difficulties = {
  easy: 45,
  moderate: 35,
  hard: 25
};

const board = document.getElementById("sudoku");
const overlay = document.getElementById("overlay");
const messageText = overlay.querySelector("p");
const timerDisplay = document.getElementById("timer");
const difficultySelect = document.getElementById("difficulty");

let seconds = 0;
let timer;

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    timerDisplay.textContent = `⏱ ${m}:${s}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function generatePuzzle(level) {
  const cellsToKeep = difficulties[level];
  const puzzle = solution.flat();
  const indexes = [...Array(81).keys()].sort(() => Math.random() - 0.5);

  indexes.slice(0, 81 - cellsToKeep).forEach(i => puzzle[i] = 0);

  return puzzle;
}

function createBoard() {
  stopTimer();
  seconds = 0;
  timerDisplay.textContent = "⏱ 00:00";
  overlay.classList.add("hidden");
  board.innerHTML = "";
  startTimer();

  const puzzle = generatePuzzle(difficultySelect.value);

  puzzle.forEach((val, i) => {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.className = "cell";

    if (val !== 0) {
      input.value = val;
      input.disabled = true;
    } else {
      input.addEventListener("input", () => handleInput(input, i));
    }

    board.appendChild(input);
  });
}

function handleInput(input, index) {
  input.value = input.value.replace(/[^1-9]/g, "");
  input.classList.remove("hint");

  if (!isValidMove(index, input.value)) {
    input.value = "";
    return;
  }

  checkCompletion();
}

function isValidMove(index, value) {
  if (!value) return true;

  const cells = document.querySelectorAll(".cell");
  const row = Math.floor(index / 9);
  const col = index % 9;

  for (let i = 0; i < 9; i++) {
    if (cells[row * 9 + i].value == value && i !== col) return false;
    if (cells[i * 9 + col].value == value && i !== row) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      const idx = r * 9 + c;
      if (cells[idx].value == value && idx !== index) return false;
    }
  }

  return true;
}

function checkCompletion() {
  const cells = document.querySelectorAll(".cell");

  for (let i = 0; i < 81; i++) {
    const r = Math.floor(i / 9);
    const c = i % 9;
    if (Number(cells[i].value) !== solution[r][c]) return;
  }

  finishGame();
}

function finishGame() {
  stopTimer();
  messageText.textContent =
    messages[Math.floor(Math.random() * messages.length)];
  overlay.classList.remove("hidden");
}

function giveHint() {
  const cells = document.querySelectorAll(".cell");
  const empty = [];

  cells.forEach((cell, i) => {
    if (!cell.value && !cell.disabled) empty.push(i);
  });

  if (!empty.length) return;

  const index = empty[Math.floor(Math.random() * empty.length)];
  const r = Math.floor(index / 9);
  const c = index % 9;

  cells[index].value = solution[r][c];
  cells[index].classList.add("hint");
  checkCompletion();
}

document.getElementById("restartBtn").onclick = createBoard;
document.getElementById("hintBtn").onclick = giveHint;
difficultySelect.onchange = createBoard;

createBoard();