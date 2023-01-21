

//virtual
class basicPlayer {
    constructor(){
        this.name = "Basic Player"
        this.needUserInput = false; // if true play() need the column
        this.callON = "click"; //click or play
    }
    
    //for automated play
    //returns between 0 and 6 for the column the players wants to play
    play(gameState, fullColumns){
        throw new Error("play is not defined for this player");
    }

    //for user input
    //returns the column's index the player want to play in 
    onUserInput(column, fullColumns){
        throw new Error("onUserInput is not defined for this player");
    }
}

export class randomPlayer extends basicPlayer{
    constructor(automaticPlay = true){
        super();
        this.name = "Random Player"
        this.callON = automaticPlay ? "play": "click";
    }

    play(gameState, fullColumns){

        if (fullColumns.length >= 7){
            throw new Error("Impossible to play because all the columns are full");
        }
        
        let validNumberFound = false;

        let numberFound;
        while (!validNumberFound){
            numberFound = Math.floor(Math.random())
            if (!fullColumns.includes(numberFound)){
                // the number is valid and we can exit the loop
                validNumberFound = true;
            }
        }

        return numberFound;
    }

    onUserInput(column, fullColumns){
        this.play("not needed", fullColumns);
    }
}

export class humanPlayer extends basicPlayer{
    constructor(name = "Human Player"){
        super();
        this.name = name;
        this.needUserInput = true;
    }

    onUserInput(column, fullColumns){
        if (!fullColumns.includes(column)){
            return column;
        }else{
            throw new Error("Impossible to play because all the columns are full");
        }
    }
}