/**
  * IIFE to create the Tic-Tac-Toe board and specify its interface
  */
const gameBoard = (() => {
  // Board entry enum
  const cell = {
    empty: 0,
    X: 1,
    O: 2
  };

  // A fresh game board
  let board;

  const reset = () => {
    board = [];
    for (let i = 0; i < 3; i++) {
      board.push([]);
      for (let j = 0; j < 3; j++) {
        board[i].push(cell.empty);  
      }
    }

    return board;
  };

  // Initialize the board
  reset();

  const placeX = (x, y) => {
    let moveValid = false;
    
    // If values valid
    if ((x >= 0 && x < board.length) && (y >= 0 && y < board.length)) {
      if (board[x][y] == cell.empty) {
        board[x][y] = cell.X; 
        moveValid = true;
      }
    }

    return moveValid;
  };

  const placeO = (x, y) => {
    let moveValid = false;

    // If values valid
    if ((x >= 0 && x < board.length) && (y >= 0 && y < board.length)) {
      if (board[x][y] == cell.empty) {
        board[x][y] = cell.O; 
        moveValid = true;
      }
    }

    return moveValid;
  };

  // Checks all 8 possibilities
  const hasThreeInARow = () => {
    const checkRows = () => {
      let threeInARow = false;
      for (let i = 0; i < board.length; i++) {
        if (board[i][0] != cell.empty) {
          threeInARow = (board[i][0] == board[i][1] && board[i][1] == board[i][2]);
          if (threeInARow) {
            break;
          }
        }
      }

      return threeInARow;
    }

    const checkCols = () => {
      let threeInACol = false;
      for (let i = 0; i < board.length; i++) {
        if (board[0][i] != cell.empty) {
          threeInACol = (board[0][i] == board[1][i] && board[1][i] == board[2][i]);
          if (threeInACol) {
            break;
          }
        }
      }

      return threeInACol;
    }

    const checkDiags = () => {
      let threeInADiag = false;

      // Top left to bottom right 
      if (board[0][0] != cell.empty) {
        threeInADiag = (board[0][0] == board[1][1] && board[1][1] == board[2][2])
      }

      // Bottom left to top right
      if (!threeInADiag && board[2][0] != cell.empty) {
        threeInADiag = (board[2][0] == board[1][1] && board[1][1] == board[0][2])
      }

      return threeInADiag;
    }

    return checkRows() || checkCols() || checkDiags();
  }

  const full = () => {
    let boardFull = true;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j] == cell.empty) {
          boardFull = false;
          break;
        } 
      }

      if (!boardFull) {
        break;
      }
    }

    return boardFull;
  }

  const at = (x, y) => {
    let occupant;
    switch (board[x][y]) {
      case cell.X:
        occupant = "X";
        break;
      case cell.O:
        occupant = "O";
        break;
      case cell.empty:
        occupant = "_";
    }

    return occupant;
  }

  return { reset, placeX, placeO, hasThreeInARow, full, at };
})();

const displayController = (() => {
  let reporter = document.querySelector(".report");

  // Print the game board
  const consoleRender = () => {
    const renderRow = (row) => {
      console.log(gameBoard.at(row,0) + "|" + gameBoard.at(row,1) + "|" + gameBoard.at(row,2));
    }
    const renderBottomRow = () => {
      let tok1 = gameBoard.at(2,0);
      let tok2 = gameBoard.at(2,1);
      let tok3 = gameBoard.at(2,2);

      if (tok1 === "_") {
        tok1 = " ";
      }
      if (tok2 === "_") {
        tok2 = " ";
      }
      if (tok3 === "_") {
        tok3 = " ";
      }

      console.log(tok1 + "|" + tok2 + "|" + tok3);
    }

    for (let i = 0; i < 2; i++) {
      renderRow(i);
    }
    renderBottomRow();

    console.log("");
  }

  const render = () => {
    let gameGrid = document.querySelector(".game");
    gameGrid.replaceChildren();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let child = document.createElement("div");
        child.classList.add("cell");
        child.classList.add(`row-${i}`);
        child.classList.add(`col-${j}`);

        let token = gameBoard.at(i, j);
        child.textContent = (token == "_") ? "" : token;
        gameGrid.appendChild(child);
      }
    }
  }

  const clearReport = () => {
    reporter.textContent = "";
  }

  const drawRestartButton =  (restart) => {
    let playAgain = document.createElement("button");
    playAgain.classList.add("play-again");
    playAgain.textContent = "Play Again";
    reporter.appendChild(playAgain);

    playAgain.addEventListener("click", (event) => {
      clearReport();
      restart();
    });
  }

  const draw = (restarter) => {
    reporter.textContent = "It's a draw!";

    drawRestartButton(restarter);
  }

  const winner = (restarter, playerName) => {
    reporter.textContent = `Congratulations, ${playerName}, you've won!`; 

    drawRestartButton(restarter);
  }

  return { render, draw, winner };
})();

const player = (placePiece, name = "") => {
  let playerName = name;
  const makeMove = (x, y) => {
    let moveValid = false;
    if ((x >= 0 && x < 3) && (y >= 0 && y < 3)) {
      moveValid = placePiece(x, y);
    }
     
    return moveValid;
  }

  const getName = () => { return playerName } 

  return { makeMove, getName };
}

const gameController = (() => {
  let player1 = player(gameBoard.placeX, "Player 1");
  let player2 = player(gameBoard.placeO, "Player 2");
  let player1Turn = true;

  let move = {
    fresh: false,
    x: null,
    y: null
  }

  // Listen for player moves
  document.addEventListener('click', (event) => {
    console.log("Got here");
    let classes = event.target.className.split(" ");

    // If the component is a cell
    if (classes.indexOf("cell") !== -1) {
      classes.forEach((item) => {
        if (item != "cell") {
          let classData = item.split("-");
          switch (classData[0]) {
            case "row":
              move.x = +classData[1];
              break;
            case "col":
              move.y = +classData[1];
              break;
          }
        }
      }); 

      console.log(move.x, move.y);
      move.fresh = true;
    }
  });

  const playRound = async () => {
    const sleep = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    const results = {
      finished: false,
      draw: false,
      winner: null
    }

    let valid = false;
    while (!valid) {
      if (move.fresh) {
        valid = player1.makeMove(move.x, move.y);  
      }
      await sleep(20);
    }

    // Manually make move stale since it was just used
    move.fresh = false;

    // Check if game is finished
    if (gameBoard.hasThreeInARow()) {
      results.finished = true;
      results.winner = player1.getName();
    } else if (gameBoard.full()) { // NOTE: This can only happen with X's
      results.finished = true;
      results.draw = true;
    }

    // Re-render the board
    displayController.render();

    player1Turn = false;

    // If player1 didn't win from previous move
    if (!results.finished) {
      valid = false;
      while (!valid) {
        if (move.fresh) {
          valid = player2.makeMove(move.x, move.y);
        }
        await sleep(20);
      }

      move.fresh = false;

      if (gameBoard.hasThreeInARow()) {
        results.finished = true;
        results.winner = player2.getName();
      }

      displayController.render();

      player1Turn = true;
    }

    return results;
  }

  const resetGame = () => {
    player1 = player(gameBoard.placeX, "Player 1");
    player2 = player(gameBoard.placeO, "Player 2");
    player1Turn = true;

    move = {
      fresh: false,
      x: null,
      y: null
    }

    gameBoard.reset();
    displayController.render();

    runGame();
  }

  return { playRound, player1Turn, resetGame }
})();

/**
  * The main game loop
  */
const runGame = async () => {
  let finished = false; 

  // Display the initial game board
  displayController.render();

  while (!finished) {
    results = await gameController.playRound();

    finished = results.finished;
    draw = results.draw;

    if (finished) {
      if (draw) {
        displayController.draw(gameController.resetGame);
      } else {
        winner = results.winner;
        displayController.winner(gameController.resetGame, winner);
      }
    }
  }
}

// Run the game
runGame();
