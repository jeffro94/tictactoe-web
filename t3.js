// map from Player number to the corresponding symbol representation
const playerChars = {
    1: 'X',
    2: 'O'
}

// the player who is currently up
let playerTurn = 1;

// game status flag: set to true once a player wins or stalemate is reached
let gameOver = false;

// set up the click event listeners for game cells & reset button
document.querySelectorAll(".game-cell").forEach(function(cell) {
    cell.addEventListener("click", cellClicked);
});

document.getElementById("btnPlayAgain").addEventListener("click", playAgain);

// this function handles a cell-click event. if the game is not over
// and the cell is currently empty, update the cell contents and check 
// if the game is over
//
function cellClicked(e) {
    if (!(gameOver) && (!(e.target.innerText))) {
        // update the cell with the appropriate move
        e.target.innerText = playerChars[playerTurn];

        let movePosition = JSON.parse(e.target.dataset.position);

        if (checkForWinner(playerTurn, movePosition[0], movePosition[1])) {
            document.getElementById("info-message").innerText = `Player ${playerTurn} wins!`;

            // disable the board and enable reset option
            gameOver = true;
            document.querySelector(".game-board").classList.add("disabled");
            document.getElementById("btnPlayAgain").hidden = false;
            document.getElementById("btnPlayAgain").classList.add("btn-outline-success");
        }
        else if (checkForStalemate()) {
            document.getElementById("info-message").innerText = `The game has ended in a stalemate.`;

            // disable the board and enable reset option
            gameOver = true;
            document.querySelector(".game-board").classList.add("disabled");
            document.getElementById("btnPlayAgain").hidden = false;
            document.getElementById("btnPlayAgain").classList.add("btn-outline-warning");
        }
        else {
            // set the next player as active
            playerTurn = (playerTurn === 1) ? 2 : 1;

            // update the status message
            document.getElementById("info-message").innerText = `It's Player ${playerTurn}'s turn.`;
        }
    }
}

function playAgain() {
    // reset all game-cell values to empty
    document.querySelectorAll(".game-cell").forEach(function(cell) {
        cell.innerHTML = "";
    });

    // reset the game control variables
    gameOver = false;
    playerTurn = 1;

    // update the display content and options
    document.getElementById("info-message").innerText = `It's Player 1's turn.`;
    document.querySelector(".game-board").classList.remove("disabled");
    document.getElementById("btnPlayAgain").hidden = true;
    document.getElementById("btnPlayAgain").classList.remove("btn-outline-success", "btn-outline-warning");
}

/**
 * Check whether a player has won
 * @param {number} player - The player number of the current player to check
 * @param {number} moveRow - The row index of the last move
 * @param {number} moveCol - The column index of the last move
 * @returns {boolean}
 */
function checkForWinner(player, moveRow, moveCol) {
    // check the current row
    for (let i = 0; i < 3; i++) {
        if (document.querySelector(`.game-cell[data-position="[${moveRow},${i}]`).innerText != playerChars[player]) break;
        
        if (i == 2) return true; // if we got this far then it's a winner!
    }

    // check the current column
    for (let i = 0; i < 3; i++) {
        if (document.querySelector(`.game-cell[data-position="[${i},${moveCol}]`).innerText != playerChars[player]) break;
        
        if (i == 2) return true; // if we got this far then it's a winner!
    }

    // check the diagonal
    for (let i = 0; i < 3; i++) {
        if (document.querySelector(`.game-cell[data-position="[${i},${i}]`).innerText != playerChars[player]) break;
        
        if (i == 2) return true; // if we got this far then it's a winner!
    }

    // check the reverse diagonal
    for (let i = 0; i < 3; i++) {
        if (document.querySelector(`.game-cell[data-position="[${i},${2-i}]`).innerText != playerChars[player]) break;
        
        if (i == 2) return true; // if we got this far then it's a winner!
    }

    return false;
}

function checkForStalemate() {
    let freeSpaces = 0;
    document.querySelectorAll(".game-cell").forEach(function(cell) {
        if (cell.innerText == "") freeSpaces++;
    });
    return (freeSpaces == 0); // it's a stalemate if there are no remaining free spaces
}
