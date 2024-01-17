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
    // If values valid
    if ((x >= 0 && x < board.length) && (y >= 0 && y < board.length)) {
      if (board[x][y] == cell.empty) {
        board[x][y] = cell.X; 
      }
    }
  };

  const placeO = (x, y) => {
    // If values valid
    if ((x >= 0 && x < board.length) && (y >= 0 && y < board.length)) {
      if (board[x][y] == cell.empty) {
        board[x][y] = cell.O; 
      }
    }
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

  return { reset, placeX, placeO, hasThreeInARow, at };
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

const runGame = () => {
  let finished = false; 
  let player1Turn = true;

  while (!finished) {
    // Display the game board
    displayController.render();

    if (player1Turn) {
      let coordStr = prompt("Player 1 where do you place your 'X'? (use comma separation)");
      const coords = coordStr.split(",");

      if (coords.length == 2) {
        let x = +coords[0];
        let y = +coords[1];

        if ((x >= 0 && x < 3) && (y >= 0 && y < 3)) {
          gameBoard.placeX(x, y);

          if (gameBoard.hasThreeInARow()) {
            finished = true;
            displayController.render();
            console.log("Congratulations, Player 1! You've won!");
          } else {
            player1Turn = false;
          }
        }
      }
    } else {
      let coordStr = prompt("Player 2 where do you place your 'O'? (use comma separation)");
      const coords = coordStr.split(",");

      if (coords.length == 2) {
        let x = +coords[0];
        let y = +coords[1];

        if ((x >= 0 && x < 3) && (y >= 0 && y < 3)) {
          gameBoard.placeO(x, y);

          if (gameBoard.hasThreeInARow()) {
            finished = true;
            displayController.render();
            console.log("Congratulations, Player 2! You've won!");
          } else {
            player1Turn = true;
          }
        }
      }
    }
  }
}

// Run the game
runGame();
