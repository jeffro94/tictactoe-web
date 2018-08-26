// map from Player number to the corresponding symbol representation
const playerChars = {
    1: 'X',
    2: 'O'
}

// the player who is currently up
let playerTurn = 1;

// game status flag: set to true once a player wins or stalemate is reached
let gameOver = false;

// set up the event listeners for game cells & reset button
document.querySelectorAll(".game-cell").forEach(function(cell) {
    cell.addEventListener("click", cellClicked);
    cell.addEventListener("touchstart", cellClicked);
});
document.getElementById("btnPlayAgain").addEventListener("click", playAgain);

// this function handles a cell-click event. if the game is not over
// and the cell is currently empty, make the move
//
function cellClicked(e) {
    let autoPlayOn = document.getElementById("autoPlay").checked;

    if (!(gameOver) && (!(e.target.innerText)) && (!(autoPlayOn && (playerTurn == 2)))) {
        let movePosition = JSON.parse(e.target.dataset.position);

        makeMove(playerTurn, movePosition[0], movePosition[1]);
    }
}

function makeAIMove(difficulty) {
    let moveRow;
    let moveCol;

    if (difficulty == 1) {
        // Level 1: choose a random cell that is not currently occupied
        do {
            moveRow = Math.floor(Math.random() * 3);
            moveCol = Math.floor(Math.random() * 3);
        } while (document.querySelector(`.game-cell[data-position="[${moveRow},${moveCol}]`).innerText != "");
    } 
    else {
        // Level 2: First, try the middle spot. if occupied then,
        //  try the 4 corners in a random order, if occupied
        //  try the four center-side spots in a random order
        moveRow = moveCol = 1;
        let validMove = false;
        if (document.querySelector(`.game-cell[data-position="[${moveRow},${moveCol}]`).innerText == "") validMove = true;

        if (!validMove) {
            let corners = [[0,0], [0,2], [2,0], [2,2]];
            shuffleArray(corners); // randomize the order;
            for (let i = 0; i < 4; i++) {
                if (document.querySelector(`.game-cell[data-position="[${corners[i][0]},${corners[i][1]}]`).innerText == "") {
                    moveRow = corners[i][0];
                    moveCol = corners[i][1];
                    validMove = true;
                    break;
                }
            }
        }

        if (!validMove) {
            let sides = [[0,1], [1,2], [2,1], [1,0]];
            shuffleArray(sides); // randomize the order;
            for (let i = 0; i < 4; i++) {
                if (document.querySelector(`.game-cell[data-position="[${sides[i][0]},${sides[i][1]}]`).innerText == "") {
                    moveRow = sides[i][0];
                    moveCol = sides[i][1];
                    validMove = true;
                    break;
                }
            }
        }
    }
    
    makeMove(2,moveRow,moveCol);
}

// this function makes a move for the specified player and location
// this includes checking for winner, stalement, and updating the player
// next up, and triggering the AI-move for player 2 if it's enabled
//
function makeMove(player, moveRow, moveCol) {
    // update the cell with the appopriate move
    document.querySelector(`.game-cell[data-position="[${moveRow},${moveCol}]`).innerText = playerChars[player];

    let winningSpaces = checkForWinner(player, moveRow, moveCol);

    if (winningSpaces) {
        document.getElementById("info-message").innerText = `Player ${player} wins!`;

        // disable the board and enable reset option
        gameOver = true;
        document.querySelector(".game").classList.add("win");

        // highlight the winning spaces
        winningSpaces.forEach(function(cell) {
            document.querySelector(`.game-cell[data-position="[${cell[0]},${cell[1]}]`).classList.add("winning-space");
        })
    }
    else if (checkForStalemate()) {
        document.getElementById("info-message").innerText = `The game has ended in a stalemate.`;

        // disable the board and enable reset option
        gameOver = true;
        document.querySelector(".game").classList.add("tie");
    }
    else {
        // set the next player as active
        playerTurn = (player === 1) ? 2 : 1;

        // update the status message
        document.getElementById("info-message").innerText = `It's Player ${playerTurn}'s turn.`;

        if ((playerTurn == 2) && document.getElementById("autoPlay").checked) {
            window.setTimeout(makeAIMove, 500, document.getElementById("difficulty").value);
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
    document.querySelector(".game").classList.remove("win", "tie");
    document.querySelectorAll(".game-cell").forEach(function(cell) { cell.classList.remove("winning-space"); });
}

/**
 * Check whether a player has won
 * @param {number} player - The player number of the current player to check
 * @param {number} moveRow - The row index of the last move
 * @param {number} moveCol - The column index of the last move
 * @returns {Object} array of the winning spaces if yes, otherwise nothing
 */
function checkForWinner(player, moveRow, moveCol) {
    var winningSpaces = []; // keep track of the potential winning spaces

    // check the current row
    for (let i = 0; i < 3; i++) {
        if (document.querySelector(`.game-cell[data-position="[${moveRow},${i}]`).innerText != playerChars[player]) break;

        winningSpaces.push([moveRow,i]);

        if (i == 2) return winningSpaces; // if we got this far then it's a winner!
    }
    winningSpaces = [];

    // check the current column
    for (let i = 0; i < 3; i++) {
        if (document.querySelector(`.game-cell[data-position="[${i},${moveCol}]`).innerText != playerChars[player]) break;

        winningSpaces.push([i,moveCol]);
        
        if (i == 2) return winningSpaces; // if we got this far then it's a winner!
    }
    winningSpaces = [];

    // check the diagonal
    for (let i = 0; i < 3; i++) {
        if (document.querySelector(`.game-cell[data-position="[${i},${i}]`).innerText != playerChars[player]) break;

        winningSpaces.push([i,i]);
        
        if (i == 2) return winningSpaces; // if we got this far then it's a winner!
    }
    winningSpaces = [];

    // check the reverse diagonal
    for (let i = 0; i < 3; i++) {
        if (document.querySelector(`.game-cell[data-position="[${i},${2-i}]`).innerText != playerChars[player]) break;

        winningSpaces.push([i,2-i]);
        
        if (i == 2) return winningSpaces; // if we got this far then it's a winner!
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

// function to randomly sort an array. source: 
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
