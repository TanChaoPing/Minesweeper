import "./App.css";

// Minesweeper Code
let answer_board;
let checked_zeros = [];
let global_timer;

function table_gen(width, height) {
  let empty_table = new Array(height).fill("O");
  for (let i = 0; i < height; i++) {
    empty_table[i] = new Array(width).fill("O");
  }
  return empty_table;
}

function table_gen2(diff) {
  let ms_table = [];
  let bombs = 0;
  switch (diff) {
    case 1: // Easy
      ms_table = table_gen(9, 9);
      bombs = 10;
      break;
    case 2: // Medium
      ms_table = table_gen(16, 16);
      bombs = 40;
      break;
    case 3: // Hard
      ms_table = table_gen(32, 16);
      bombs = 99;
      break;
  }
  return [ms_table, bombs];
}

function bomb_count(ms_table, h, w) {
  let bomb_count = 0;
  let height = ms_table.length;
  let width = ms_table[0].length;

  for (
    let curRow = Math.max(h - 1, 0);
    curRow <= Math.min(h + 1, height - 1);
    curRow++
  ) {
    for (
      let curCol = Math.max(w - 1, 0);
      curCol <= Math.min(w + 1, width - 1);
      curCol++
    ) {
      if (ms_table[curRow][curCol] == "💣") bomb_count++;
    }
  }
  return bomb_count;
}

function checkDuplicateBombs(bomb_coords, bomb_x, bomb_y) {
  for (let j = 0; j < bomb_coords.length; j++) {
    if (bomb_coords[j][1] == bomb_y && bomb_coords[j][0] == bomb_x) {
      return true;
    }
  }
  return false;
}

function table_fill(diff) {
  let [ms_table, bombs] = table_gen2(diff);
  let width = ms_table[0].length;
  let height = ms_table.length;

  let bomb_coords = [];
  for (let i = 0; i < bombs; i++) {
    do {
      var bomb_x = Math.floor(Math.random() * width);
      var bomb_y = Math.floor(Math.random() * height);
    } while (checkDuplicateBombs(bomb_coords, bomb_x, bomb_y));
    bomb_coords.push([bomb_x, bomb_y]);
    ms_table[bomb_y][bomb_x] = "💣";
  }

  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      if (ms_table[h][w] != "💣") {
        ms_table[h][w] = bomb_count(ms_table, h, w);
      }
    }
  }

  answer_board = ms_table;
  return ms_table;
}

// Web Code
function setButtonEvent() {
  for (let j = 0; j < answer_board.length; j++) {
    for (let i = 0; i < answer_board[0].length; i++) {
      let curButton = document.getElementById(`b-${i}-${j}`);
      curButton.addEventListener("mousedown", (event) => {
        if (event.button == 0) revealButton(i, j); // Left Click
        if (event.button == 2) flagButton(i, j); // Right Click
      });
      switch (answer_board[j][i]) {
        case 0:
          curButton.style.color = "White";
          break;
        case 1:
          curButton.style.color = "blue";
          break;
        case 2:
          curButton.style.color = "Green";
          break;
        case 3:
          curButton.style.color = "Red";
          break;
        case 4:
          curButton.style.color = "Brown";
          break;
        case 5:
          curButton.style.color = "Indigo";
          break;
        case 6:
          curButton.style.color = "SeaGreen";
          break;
        case 7:
          curButton.style.color = "Black";
          break;
        case 8:
          curButton.style.color = "Gray";
          break;
      }
    }
  }
}

function flagButton(i, j) {
  let curButton = document.getElementById(`b-${i}-${j}`);
  let bombs_left = document.getElementById("bombs-left").innerText;

  if (parseInt(bombs_left.slice(bombs_left.search(":") + 2)) > 0) {
    if (curButton.innerText == "🚩") {
      curButton.innerText = "";
      document.getElementById("bombs-left").innerText =
        "Bombs left: " +
        (parseInt(bombs_left.slice(bombs_left.search(":") + 2)) + 1).toString();
    } else {
      curButton.innerText = "🚩";
      document.getElementById("bombs-left").innerText =
        "Bombs left: " +
        (parseInt(bombs_left.slice(bombs_left.search(":") + 2)) - 1).toString();
    }

    if (parseInt(bombs_left.slice(bombs_left.search(":") + 2)) == 0)
      checkSolution();
  } else if (curButton.innerText == "🚩") {
    curButton.innerText = "";
    document.getElementById("bombs-left").innerText =
      "Bombs left: " +
      (parseInt(bombs_left.slice(bombs_left.search(":") + 2)) + 1).toString();
  } else {
    alert("You ran out of flags!");
  }
}

function revealButton(i, j) {
  if (document.getElementById(`b-${i}-${j}`).innerText == "🚩") {
    let bombs_left = document.getElementById("bombs-left").innerText;
    document.getElementById("bombs-left").innerText =
      "Bombs left: " +
      (parseInt(bombs_left.slice(bombs_left.search(":") + 2)) + 1).toString();
  }
  let curButton = answer_board[j][i];

  if (answer_board[j][i] != "0")
    document.getElementById(`b-${i}-${j}`).innerText = curButton;
  if (curButton == "💣") {
    alert("Game Over!");
    revealSolution();
  }

  if (curButton == "0") {
    let connected_zeros = [];
    connected_zeros.push(`${i}-${j}`);
    while (connected_zeros.length > 0) {
      let blocks = connected_zeros[0].split("-");
      let neighbors = neighbor_zeros(parseInt(blocks[0]), parseInt(blocks[1]));
      for (let neighbor of neighbors) {
        if (
          !(
            connected_zeros.includes(neighbor) ||
            checked_zeros.includes(neighbor)
          )
        ) {
          connected_zeros.push(neighbor);
        }
      }
      checked_zeros.push(connected_zeros.shift());
    }
  }
  document.getElementById(`b-${i}-${j}`).setAttribute("disabled", true);
}

function neighbor_zeros(i, j) {
  let neighbors = [];
  for (
    let curRow = Math.max(j - 1, 0);
    curRow <= Math.min(j + 1, answer_board.length - 1);
    curRow++
  ) {
    for (
      let curCol = Math.max(i - 1, 0);
      curCol <= Math.min(i + 1, answer_board[0].length - 1);
      curCol++
    ) {
      if (curRow == j && curCol == i) continue;
      if (answer_board[curRow][curCol] == "0") {
        neighbors.push(`${curCol}-${curRow}`);
      }
      if (answer_board[curRow][curCol] != "0")
        document.getElementById(`b-${curCol}-${curRow}`).innerText =
          answer_board[curRow][curCol];
      document
        .getElementById(`b-${curCol}-${curRow}`)
        .setAttribute("disabled", true);
    }
  }
  return neighbors;
}

function checkSolution() {
  let bomb_number;
  switch (answer_board[0].length) {
    case 9:
      bomb_number = 10;
      break;
    case 16:
      bomb_number = 40;
      break;
    case 32:
      bomb_number = 99;
      break;
  }

  let correct_bomb = 0;
  for (let j = 0; j < answer_board.length; j++) {
    for (let i = 0; i < answer_board[0].length; i++) {
      if (
        answer_board[j][i] == "💣" &&
        document.getElementById(`b-${i}-${j}`).innerText == "🚩"
      )
        correct_bomb++;
    }
  }

  if (correct_bomb == bomb_number) {
    clearInterval(global_timer);
    alert("You win!");
  } else {
    alert("Some flags are misplaced!");
  }
}

function tableGeneration(ms_table) {
  let allRows = "";

  for (let j = 0; j < ms_table.length; j++) {
    var tempStr = "";
    for (let i = 0; i < ms_table[0].length; i++) {
      tempStr += `<td><button class="ms-buttons" id="b-${i}-${j}"}></button></td>`;
    }
    allRows += `<tr>${tempStr}</tr>`;
  }
  return `<center><table>${allRows}</table></center>`;
}

function afterButtonPress() {
  setButtonEvent();
  for (let x of document.getElementsByClassName("end-buttons")) {
    x.style.display = "inline-block";
  }
  checked_zeros = [];
  setTimer();
}

function setTimer() {
  clearInterval(global_timer);
  let timer = document.getElementById("timer");
  let curTime = 0;
  global_timer = setInterval(() => {
    timer.innerText =
      "Timer: " +
      Math.floor(curTime / 60)
        .toString()
        .padStart(2, "0") +
      ":" +
      (curTime % 60).toString().padStart(2, "0");
    curTime++;
  }, 1000);
}

function difficultyButtons() {
  return (
    <>
      <center>
        <span>
          <a href="#line-2">
            <button
              class="diff-buttons"
              id="easy"
              onClick={() => {
                document.getElementById("ms-table").innerHTML = tableGeneration(
                  table_fill(1)
                );

                document.getElementById("bombs-left").innerText =
                  "Bombs left: 10";
                afterButtonPress();
              }}
            >
              Easy
            </button>
          </a>
          &nbsp; &nbsp;
          <a href="#line-2">
            <button
              class="diff-buttons"
              id="normal"
              onClick={() => {
                document.getElementById("ms-table").innerHTML = tableGeneration(
                  table_fill(2)
                );

                document.getElementById("bombs-left").innerText =
                  "Bombs left: 40";
                setButtonEvent();
                for (let x of document.getElementsByClassName("end-buttons")) {
                  x.style.display = "inline-block";
                }
                checked_zeros = [];
                setTimer();
              }}
            >
              Normal
            </button>
          </a>
          &nbsp; &nbsp;
          <a href="#line-2">
            <button
              class="diff-buttons"
              id="hard"
              onClick={() => {
                document.getElementById("ms-table").innerHTML = tableGeneration(
                  table_fill(3)
                );

                document.getElementById("bombs-left").innerText =
                  "Bombs left: 99";
                setButtonEvent();
                for (let x of document.getElementsByClassName("end-buttons")) {
                  x.style.display = "inline-block";
                }
                checked_zeros = [];
                setTimer();
              }}
            >
              Hard
            </button>
          </a>
        </span>
      </center>
      <br />
      <hr id="line-2" />
    </>
  );
}

function revealSolution() {
  clearInterval(global_timer);
  for (let j = 0; j < answer_board.length; j++) {
    for (let i = 0; i < answer_board[0].length; i++) {
      let cur = document.getElementById(`b-${i}-${j}`);
      if (answer_board[j][i] != "0") cur.innerHTML = `${answer_board[j][i]}`;
      cur.setAttribute("disabled", true);
      if (answer_board[j][i] == "💣") cur.style.backgroundColor = "pink";
    }
  }
}

function App() {
  return (
    <>
      <p id="test"></p>
      {difficultyButtons()}
      <center>
        <span>
          <h2 id="bombs-left"></h2>
          <h2 id="timer">Timer: N/A</h2>
        </span>

        <div id="ms-table"></div>
      </center>
      <br />
      <div>
        <center>
          <button
            class="end-buttons"
            id="sol-button"
            onClick={() => {
              revealSolution();
            }}
          >
            Show Solution!
          </button>
          &nbsp; &nbsp;
          <button
            class="end-buttons"
            id="check-button"
            onClick={() => {
              checkSolution();
            }}
          >
            Check Solution!
          </button>
        </center>
      </div>
    </>
  );
}

export default App;