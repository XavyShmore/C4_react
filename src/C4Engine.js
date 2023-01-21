export class Game{
    gameState = {
        state: 0, // 0 if games continues, 1 if player 1 win, 2 if player 2 win and 3 if draw
        board:[], //gameboard representation
        winningStreak: [],
        movePlayed: 0, // movePlayed since the begining of the game.
        gameDimention:[3,7,6], // [both player,player 1, player 2], [columns], [rows]
        get playerToPlay (){
            return this.isFirstPlayerTurn()?1:2;
        },
        isFirstPlayerTurn(){
            return this.movePlayed % 2 == 0 ? true:false;
        }
    }
    constructor(gameState = 0, safe = false){ // is safe if gamestate as been produced by the gameEngine
        if(gameState === 0){ //if no board is passed create a new game
            for(var i = 0; i < this.gameState.gameDimention[0]; i++){
                this.gameState.board.push([]);
                for(var j = 0; j < this.gameState.gameDimention[1]; j++){
                    this.gameState.board[i].push([]);
                    for(var k = 0; k < this.gameState.gameDimention[2]; k++){
                        this.gameState.board[i][j].push(false);
                    }
                }
            }
        }else{ // a board already exists let's use it
            this.gameState = deepCopyGameState(gameState);
            if (!safe){ // would idealy need function to check board[0]
                this.gameState.movePlayed = countMove(); //make sure this.gameState.movePlayed is valid
                this.checkWinner();
            }

            function countMove(){
                return countPlayerMove(1)+countPlayerMove(2);
                function countPlayerMove(playerIndex){
                    var total = 0;
                    gameState.board[playerIndex].forEach((value)=>{
                        value.forEach((value)=>{
                            if (value){
                                total ++;
                            }
                        })
                    })
                    return total;
                }
            }
            function deepCopyGameState(gameStateToCopy){
                var newBoard = [];
                for(var i = 0; i < gameStateToCopy.gameDimention[0]; i++){
                    newBoard.push([]);
                    for(var j = 0; j < gameStateToCopy.gameDimention[1]; j++){
                        newBoard[i].push([...gameStateToCopy.board[i][j]]);
                    }
                }
                return {
                    state: gameStateToCopy.state,
                    board: newBoard,
                    winningStreak: [...gameStateToCopy.winningStreak],
                    movePlayed:gameStateToCopy.movePlayed,
                    gameDimention:gameStateToCopy.gameDimention,
                    isFirstPlayerTurn:gameStateToCopy.isFirstPlayerTurn,
                    get playerToPlay (){
                        return this.isFirstPlayerTurn()?1:2;
                    }
                }

            }
        }
    }
    
    //returns the lower available spot in the column
    dropPosition(column){
        var returnValue = 5;
        //console.log(column, this.gameState.board[0]);
        this.gameState.board[0][column].every((spot,index) => {
            if(spot){
                returnValue = index -1;
                return false;
            }
            return true;
        });
        return returnValue;
    }
    play(isFirstPlayer,columnIndex){ // Add the play to the game board and returns the height played
        if(isFirstPlayer != this.gameState.isFirstPlayerTurn()) throw Error("Not this player turn");//Error if wrong player tries to play
        //console.log(columnIndex);
        var height = this.dropPosition(columnIndex);
        if(height < 0) throw Error("Column full"); //Error if the column the player tris to play in is full
        var playerIndex = isFirstPlayer ? 1:2;
        this.gameState.board[0][columnIndex][height] = true;
        this.gameState.board[playerIndex][columnIndex][height] = true;
        this.gameState.movePlayed++;
        this.checkWinner();
        return height;
    }
    //Returns 0 if games continues, 1 if player 1 win, 2 if player 2 win and 3 if draw  
    checkWinner(){
        var board = this.gameState.board;
        function checkPlayer(playerIndex){
            var caseConcerned = [];
            function checkLine(x,y, playerIndex){
                const possibleVector = [[0,1],[1,0],[1,1],[-1,1]];
                function detectLine(pX,pY,vX,vY,count = 0, pI = playerIndex){
                    function isOutOfBound(x,y){
                        if(x<0||y<0) return true;
                        if(x>=board[0].length || y>=board[0][0].length) return true;
                        return false;
                    }
                    if (isOutOfBound(pX,pY)) return count;
                    if(board[pI][pX][pY]){ // 
                        count +=1;
                        return detectLine(pX+vX,pY+vY,vX,vY,count);
                    }
                    return count;
                }
                var weHaveAWinner = false;
                possibleVector.forEach((testVector)=>{
                    var result = detectLine(x,y,testVector[0],testVector[1]);
                    if(result>=4) weHaveAWinner = true;
                    if(result > caseConcerned.length){
                        caseConcerned = [];
                        for (var i = 0; i < result; i++){
                            caseConcerned.push([x+i*testVector[0],y+i*testVector[1]])
                        }
                    }
                });
                return weHaveAWinner;
            }
            for(var j = board[0][0].length - 1; j >= 0; j--){
                for(var i = 0; i < board[0].length; i++){
                    if(checkLine(i,j,playerIndex)) return [true, caseConcerned];
                }
            }
            return [false,caseConcerned];
        }
        var playerResult = checkPlayer(1);
        if (playerResult[0]) {
            this.gameState.state=1;
            this.gameState.winningStreak = playerResult[1];
            return [1,playerResult[1]]; // Player 1 won
        }
        playerResult = checkPlayer(2);
        if (playerResult[0]) {
            this.gameState.state=2;
            this.gameState.winningStreak = playerResult[1];
            return [1,playerResult[1]]; // Player 2 won
        }
        if (this.gameState.movePlayed >= 42){
            this.gameState.state = 3;
            return [3]; // draw
        }
        return [0]; // The game continues
    }
}