import { Game } from "./C4Engine";

//virtual
class basicPlayer {
    constructor(){
        this.name = "Basic Player"
        this.needUserInput = false; // if true play() need the column
        this.callON = "click"; //click or play
    }
    
    //for automated play
    //returns between 0 and 6 for the column the players wants to play
    play(gameState){
        throw new Error("play is not defined for this player");
    }

    //for user input
    //returns the column's index the player want to play in 
    onUserInput(column, gameState){
        return this.play(gameState);
    }
}

export class randomPlayer extends basicPlayer{
    constructor(wait = true){
        super();
        this.name = "Random Player"
        this.callON = !wait ? "play": "click";
    }

    play(gameState){

        if (gameState.fullColumns().length >= 7){
            throw new Error("Impossible to play because all the columns are full");
        }
        
        let validNumberFound = false;

        let numberFound;
        while (!validNumberFound){
            numberFound = Math.floor(Math.random()*7);
            if (!(gameState.fullColumns().includes(numberFound))){
                // the number is valid and we can exit the loop
                validNumberFound = true;
            }
        }

        return numberFound;
    }

}

export class humanPlayer extends basicPlayer{
    constructor(name = "Human Player"){
        super();
        this.name = name;
        this.needUserInput = true;
    }

    onUserInput(column, gameState){
        if (!gameState.fullColumns().includes(column)){
            return column;
        }else{
            throw new Error("Impossible to play because all the columns are full");
        }
    }
}

export class minMaxPlayer extends basicPlayer{
    constructor(wait = true){
        super();
        this.name = "Min Max Player";
        this.callON = !wait ? "play": "click";
    }

    play(gameState){

        var minMaxCall = 0;

        //player 1 maximise, player 2 minimize
        function minMax(gameState, isMaximising, maxDepth = 4,depth = 0){

            minMaxCall++;
            
            let result = [];
            for (let i = 0; i < 7; i++){
                let engine = new Game(gameState);
                try {
                    engine.play(isMaximising, i);
                } catch (error) {
                    continue;
                }

                let evalu = evaluation(engine.gameState);

                //if game is not finished call minmax recusively to get score up to maxDepth
                if(!evalu[0]){
                    //if max depth reached add a 0 in the score for the move
                    if (depth >= maxDepth){
                        result.push([0, i])
                    }
                    //else call minmax recusively to get score
                    else{
                        result.push([minMax(engine.gameState, !isMaximising, maxDepth, depth + 1)[0], i]);
                    }
                }
                //else the game is finnished, if active player winning, return winning move, else push result 
                else{
                    //if active player is winning return (basic pruning)
                    if(evalu[1] === (isMaximising?1:-1)){
                        return [evalu[1], i] // ez win wont find better move
                    }

                    //else it is a draw or a defeat, push result
                    else{
                        result.push(evalu[1], i);
                    }
                }
            }

            let max = result[0];
            let min = result[0];

            for (let i = 1; i < result.length; i++){
                let score = result[i]
                if (score[0] > max[0]){
                    max = score;
                }else if (score[0] < min[0]){
                    min = score;
                }
            }
            if (depth === 0){
                console.log(result);
            }

            return isMaximising? max:min;
        }

        //return array [isGameFinished, score] score = 1 if player 1 wins, -1 if player 2 wins, 0 if draw 
        function evaluation(gameState){
            let status = gameState.state;

            //game is not finished
            if (status === 0){
                return [false, 0];
            } else if (status === 1){
                return [true, 1];
            } else if (status === 2){
                return [true, -1]
            } else{
                return[true, 0]
            }
        }

        var toReturn = minMax(gameState, gameState.isFirstPlayerTurn(), 5)[1];

        console.log(`Min Max call ${minMaxCall}`);
        return toReturn;
    }


}