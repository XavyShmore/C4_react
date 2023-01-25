export class Game {
    gameState = {
        state: 0, // 0 if games continues, 1 if player 1 win, 2 if player 2 win and 3 if draw
        board: [], //gameboard representation
        winningStreak: [],
        movePlayed: 0, // movePlayed since the begining of the game.
        gameDimention: [3, 7, 6], // [both player,player 1, player 2], [columns], [rows]
        isFirstPlayerTurn() {
            return this.movePlayed % 2 === 0 ? true : false;
        },

        fullColumns() {
            let fullColumnsLst = [];
            this.board[0].forEach((column, i) => {
                for (const caseValue of column) {
                    if (!caseValue) return;
                }
                fullColumnsLst.push(i);
            });

            return fullColumnsLst;
        }
    }
    constructor(gameState = 0, safe = false) { // is safe if gamestate as been produced by the gameEngine
        if (gameState === 0) { //if no board is passed create a new game
            for (let i = 0; i < this.gameState.gameDimention[0]; i++) {
                this.gameState.board.push([]);
                for (let j = 0; j < this.gameState.gameDimention[1]; j++) {
                    this.gameState.board[i].push([]);
                    for (let k = 0; k < this.gameState.gameDimention[2]; k++) {
                        this.gameState.board[i][j].push(false);
                    }
                }
            }
        } else { // a board already exists let's use it
            this.gameState = this.deepCopyGameState(gameState);
            if (!safe) { // would idealy need function to check board[0]
                this.gameState.movePlayed = countMove(); //make sure this.gameState.movePlayed is valid
                this.checkWinner();
            }

            function countMove() {
                return countPlayerMove(1) + countPlayerMove(2);
                function countPlayerMove(playerIndex) {
                    var total = 0;
                    gameState.board[playerIndex].forEach((value) => {
                        value.forEach((value) => {
                            if (value) {
                                total++;
                            }
                        })
                    })
                    return total;
                }
            }
        }
    }

    //returns the lower available spot in the column
    dropPosition(column) {
        var returnValue = 5;
        //console.log(column, this.gameState.board[0]);
        this.gameState.board[0][column].every((spot, index) => {
            if (spot) {
                returnValue = index - 1;
                return false;
            }
            return true;
        });
        return returnValue;
    }
    play(isFirstPlayer, columnIndex, safe = false) { // Add the play to the game board and returns the height played

        const gs = this.gameState;
        const height = this.dropPosition(columnIndex);


        if (!safe) {
            if (isFirstPlayer !== gs.isFirstPlayerTurn()) throw Error("Not this player turn");//Error if wrong player tries to play
            if (height < 0) throw Error("Column full"); //Error if the column the player tris to play in is full
        }

        gs.board[0][columnIndex][height] = true;
        gs.board[isFirstPlayer ? 1 : 2][columnIndex][height] = true;
        gs.movePlayed++;
        this.checkWinner();
    }
    //Returns 0 if games continues, 1 if player 1 win, 2 if player 2 win and 3 if draw  
    checkWinner(calculateStreak = false) {
        const board = this.gameState.board;

        function checkPlayer(playerIndex) {
            let caseConcerned = [];

            function checkLine(x, y, pIn) {

                function detectLine(pX, pY, vector, pI = pIn) {
                    function isOutOfBound(x, y) {
                        return x < 0 || y < 0 || x >= 7 || y >= 6;
                    }

                    let count = 0;
                    while (board[pI][pX][pY]) {
                        pX += vector[0];
                        pY += vector[1];
                        count++;
                        if (isOutOfBound(pX, pY)) return count;
                    }
                    return count;
                }

                const possibleVector = [[0, 1], [1, 0], [1, 1], [-1, 1]];

                for (const testVector of possibleVector) {
                    const result = detectLine(x, y, testVector);
                    if (calculateStreak && result > caseConcerned.length) {
                        caseConcerned = new Array(result);
                        for (let i = 0; i < result; i++) {
                            caseConcerned[i] = [x + i * testVector[0], y + i * testVector[1]];
                        }
                    }
                    if (result >= 4) return true;
                }
                return false;
            }

            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 6; j++) {
                    if (checkLine(i, j, playerIndex)) return [true, caseConcerned];
                }
            }

            return [false, caseConcerned];
        }

        for (let i = 1; i < 3; i++) {
            let playerResult = checkPlayer(i);
            if (playerResult[0]) {
                this.gameState.state = i;
                this.gameState.winningStreak = playerResult[1];
                return i; // Player 1 won
            }
        }

        if (this.gameState.movePlayed >= 42) {
            this.gameState.state = 3;
            return 3; // draw
        }
        return 0; // The game continues
    }

    // Create a copy of a game state
    deepCopyGameState(gameStateToCopy = this.gameState) {
        const newBoard = new Array(3);
        for (let i = 0; i < 3; i++) {
            newBoard[i] = new Array(7);
            for (let j = 0; j < 7; j++) {
                newBoard[i][j] = gameStateToCopy.board[i][j].slice();
            }
        }
        return {
            state: gameStateToCopy.state,
            board: newBoard,
            winningStreak: gameStateToCopy.winningStreak.slice(),
            movePlayed: gameStateToCopy.movePlayed,
            gameDimention: gameStateToCopy.gameDimention,
            isFirstPlayerTurn: gameStateToCopy.isFirstPlayerTurn,
            fullColumns: gameStateToCopy.fullColumns
        }

    }
}