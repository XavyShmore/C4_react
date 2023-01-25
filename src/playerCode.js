import { Game } from "./C4Engine";

//virtual
class basicPlayer {
    constructor() {
        this.name = "Basic Player"
        this.needUserInput = false; // if true play() need the column
        this.callON = "click"; //click or play
    }

    //for automated play
    //returns between 0 and 6 for the column the players wants to play
    play(gameState) {
        throw new Error("play is not defined for this player");
    }

    //for user input
    //returns the column's index the player want to play in 
    onUserInput(column, gameState) {
        return this.play(gameState);
    }
}

export class randomPlayer extends basicPlayer {
    constructor(wait = true) {
        super();
        this.name = "Random Player"
        this.callON = !wait ? "play" : "click";
    }

    play(gameState) {

        if (gameState.fullColumns().length >= 7) {
            throw new Error("Impossible to play because all the columns are full");
        }

        let validNumberFound = false;

        let numberFound;
        while (!validNumberFound) {
            numberFound = Math.floor(Math.random() * 7);
            if (!(gameState.fullColumns().includes(numberFound))) {
                // the number is valid and we can exit the loop
                validNumberFound = true;
            }
        }

        return numberFound;
    }

}

export class humanPlayer extends basicPlayer {
    constructor(name = "Human Player") {
        super();
        this.name = name;
        this.needUserInput = true;
    }

    onUserInput(column, gameState) {
        if (!gameState.fullColumns().includes(column)) {
            return column;
        } else {
            throw new Error("Impossible to play because all the columns are full");
        }
    }
}

export class minMaxPlayer extends basicPlayer {
    constructor(wait = true) {
        super();
        this.name = "Min Max Player";
        this.callON = !wait ? "play" : "click";

        this.lookup = new Map();
    }

    play(gameState) {
        var lookup = this.lookup
        var minMaxCall = 0;

        //player 1 maximise, player 2 minimize
        function minMax(gameState, isMaximising, maxDepth = 4, depth = 0, randomize = false) {
            minMaxCall++;

            let result = [];

            //return array [isGameFinished, score] score = 1 if player 1 wins, -1 if player 2 wins, 0 if draw 
            function evaluation(status) {
                //game is not finished
                if (status === 0) {
                    return [false, 0];
                } else if (status === 1) {
                    return [true, 1];
                } else if (status === 2) {
                    return [true, -1];
                } else {
                    return [true, 0];
                }
            }

            //checks wich collumns are not yeat full and returns an array with there index, this function also check if this situation as already been seen if so only ask to play the best move
            function moveToCheck(gameState) {

                const possibleIndexTocheck = [0, 1, 2, 3, 4, 5, 6];
                const columnfull = gameState.fullColumns();

                return possibleIndexTocheck.filter(value=>{
                    return !columnfull.includes(value);
                });
            }

            for (const i of moveToCheck(gameState)) {
                const engine = new Game(gameState, true);

                engine.play(isMaximising, i, true);

                const evalu = evaluation(engine.gameState.state);

                //if game is not finished call minmax recusively to get score up to maxDepth
                if (!evalu[0]) {
                    //if max depth reached add a 0 in the score for the move
                    if (depth >= maxDepth) {
                        result.push([0, i, false, depth]);
                    }
                    //else call minmax recusively to get score
                    else {

                        //check if minMax has already been called on this state
                        const lookupStr = engine.gameState.board.toString()

                        const lookupResult = lookup.get(lookupStr);

                        if (lookupResult === undefined || (!lookupResult[2] && depth !== lookupResult[3])) {

                            let minMaxResult = minMax(engine.gameState, !isMaximising, maxDepth, depth + 1);

                            minMaxResult[1] = i;

                            if (minMaxResult[0] !== 0) {
                                lookup.set(lookupStr, minMaxResult);
                            }

                            result.push(minMaxResult);
                        } else {
                            let minMaxResult = lookupResult;
                            minMaxResult[1] = i;
                            result.push(minMaxResult);
                        }
                    }
                }
                //else the game is finnished, if active player winning, return winning move, else push result 
                else {
                    //if active player is winning return (basic pruning)
                    if (evalu[1] === (isMaximising ? 1 : -1)) {
                        return [evalu[1] / (depth + 1), i, true, depth]; // ez win wont find better move
                    }

                    //else it is a draw or a defeat, push result
                    else {
                        result.push([evalu[1] / (depth + 1), i, true, depth]);
                    }
                }
            }

            let max = [result[0]];
            let min = [result[0]];

            for (let i = 1; i < result.length; i++) {
                let score = result[i];
                if (score[0] > max[0][0]) {
                    max = [score];
                } else if (score[0] === max[0][0]) {
                    max.push(score)
                }

                if (score[0] < min[0][0]) {
                    min = [score];
                } else if (score[0] === min[0][0]) {
                    min.push(score)
                }
            }
            if (depth === 0) {
                console.log(result);
            }

            let arrayToReturn = isMaximising ? max : min;

            let indexToReturn = 0;

            if (randomize === true) {
                indexToReturn = Math.floor(Math.random() * arrayToReturn.length);
            }

            return arrayToReturn[indexToReturn];
        }

        console.profile("qwe");
        var toReturn = minMax(gameState, gameState.isFirstPlayerTurn(), 6, 0, false)[1];
        console.profileEnd("qwe");

        console.log(`Min Max call ${minMaxCall}`);
        return toReturn;
    }
}