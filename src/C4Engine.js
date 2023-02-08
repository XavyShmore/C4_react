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

            for (let i = 0; i < 7; i++) {
                if (this.board[0][i][0]) {
                    fullColumnsLst.push(i);
                }
            }

            return fullColumnsLst;
        }
    }

    moveHistory = []

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

        for (let i = 5; i>=0; i--){
            if(!this.gameState.board[0][column][i]){
                return i;
            }
        }
        return -1;

        /*
        let returnValue = 5;
        this.gameState.board[0][column].every((spot, index) => {
            if (spot) {
                returnValue = index - 1;
                return false;
            }
            return true;
        });
        return returnValue;*/
    }

    play(isFirstPlayer, columnIndex, safe = false) { // Add the play to the game board and returns the height played

        const height = this.dropPosition(columnIndex);

        if (!safe) {
            if (isFirstPlayer !== this.gameState.isFirstPlayerTurn()) throw Error("Not this player turn");//Error if wrong player tries to play
            if (height < 0) throw Error("Column full"); //Error if the column the player tris to play in is full
        }

        const playerIndex = isFirstPlayer ? 1 : 2;

        this.gameState.board[0][columnIndex][height] = true;
        this.gameState.board[playerIndex][columnIndex][height] = true;
        this.gameState.movePlayed++;
        this.moveHistory.push(columnIndex);
        this.checkWinner();
    }
    //Returns 0 if games continues, 1 if player 1 win, 2 if player 2 win and 3 if draw  
    checkWinner(calculateStreak = false) {
        const board = this.gameState.board;

        function checkPlayer(playerIndex) {
            let caseConcerned = [];

            function checkLine(x, y, pIn) {

                function detectLine(pX, pY, vector, pI = pIn) {

                    let count = 0;
                    while (board[pI][pX][pY]) {
                        pX += vector[0];
                        pY += vector[1];
                        count++;
                        if (pX < 0 || pX >= 7 || pY >= 6) return count;
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
            const playerResult = checkPlayer(i);
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

    undo() {
        const lastmove = this.moveHistory.pop();

        //verify there is a valid last move
        if (lastmove === undefined) {
            throw Error("No moves recorded yet")
        }

        //decrement the move count
        this.gameState.movePlayed--;

        //reset the board
        const rowIndex = this.dropPosition(lastmove) + 1;
        for (let i = 0; i < 3; i++) {
            this.gameState.board[i][lastmove][rowIndex] = false;
        }

        //reset endgame stats in case the game was finished 
        this.gameState.state = 0;
        this.gameState.winningStreak = [];
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