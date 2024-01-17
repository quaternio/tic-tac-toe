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
  // Print the game board
  const render = () => {
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

  return { render };
})();

const player = (placePiece, name = "") => {
  let playerName = name;
  const makeMove = () => {
    let coordStr = prompt(`${playerName} where do you place your token? (use comma separation)`);
    const coords = coordStr.split(",");

    let moveValid = false;
    if (coords.length == 2) {
      let x = +coords[0];
      let y = +coords[1];

      if ((x >= 0 && x < 3) && (y >= 0 && y < 3)) {
        moveValid = placePiece(x, y);
      }
    }
     
    return moveValid;
  }

  const getName = () => { return playerName } 

  return { makeMove, getName };
}

const gameController = (() => {
  const p1Name = prompt("Player 1, please enter your name");
  const p2Name = prompt("Player 2, please enter your name");

  const player1 = player(gameBoard.placeX, p1Name);
  const player2 = player(gameBoard.placeO, p2Name);

  const playRound = () => {
    const results = {
      finished: false,
      draw: false,
      winner: null
    }

    let valid = false;
    while (!valid) {
      valid = player1.makeMove();  
    }

    if (gameBoard.hasThreeInARow()) {
      results.finished = true;
      results.winner = player1.getName();
    } else if (gameBoard.full()) { // NOTE: This can only happen with X's
      results.finished = true;
      results.draw = true;
    }

    displayController.render();

    // If player1 didn't win from previous move
    if (!results.finished) {
      valid = false;
      while (!valid) {
        valid = player2.makeMove();
      }

      if (gameBoard.hasThreeInARow()) {
        results.finished = true;
        results.winner = player2.getName();
      }

      displayController.render();
    }

    return results;
  }

  const resetGame = () => {
    gameBoard.reset();
  }

  return { playRound, resetGame }
})();

/**
  * The main game loop
  */
const runGame = () => {
  let finished = false; 

  // Display the initial game board
  displayController.render();

  while (!finished) {
    results = gameController.playRound();

    finished = results.finished;
    draw = results.draw;

    if (finished) {
      if (draw) {
        console.log("It's a draw!");
      } else {
        winner = results.winner;
        console.log(`Congratulations, ${winner}! You've won!`);
      }
      console.log("To play again, please refresh browser");
    }
  }
}

// Run the game
runGame();
