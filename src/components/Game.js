import React from "react";
import { Game as C4Engine } from "../C4Engine";

import "./game.css"

import Board from "./Board";

class Game extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            
        }
    }
    
    handleColumnClick(x){

    }

    render(){
        return(
            <div id="game">
                <div className="game-container">
                    <div className="board-container">
                        <Board></Board>
                    </div>
                </div>

            </div>
        )
    }

}

export default Game