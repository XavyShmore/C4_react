import React from "react";
import { Game as C4Engine } from "../C4Engine";
import {humanPlayer, randomPlayer, minMaxPlayer} from "../playerCode";

import "./game.css"

import Board from "./Board";

class Game extends React.Component{
    constructor(props){
        super(props);

        let engine = new C4Engine();

        this.state = {
            players: [new humanPlayer(), new minMaxPlayer(true)],
            gameState: engine.gameState
        }
    }

    play(column){

        // if the game is done dont allow players to play
        if(this.state.gameState.state !== 0){
            return;
        }

        let engine = new C4Engine(this.state.gameState);

        engine.play(engine.gameState.isFirstPlayerTurn(), column);
        engine.checkWinner(true);

        this.setState({
            gameState: engine.deepCopyGameState()
        });
    }
    
    handleColumnClick(column){

        // if the game is done dont allow players to play
        if(this.state.gameState.state !== 0){
            return;
        }

        let playerIndex = this.state.gameState.isFirstPlayerTurn()?0:1;

        let columnToPlay;
        
        if (this.state.players[playerIndex].callON === "click"){
            if(this.state.players[playerIndex].needUserInput){
                columnToPlay = this.state.players[playerIndex].onUserInput(column, this.state.gameState);
            }else{
                columnToPlay = this.state.players[playerIndex].play(this.state.gameState);
            }
        }

        this.play(columnToPlay);
    }

    render(){
        return(
            <div id="game">
                <div className="game-container">
                    <div className="board-container">
                        <Board gameState={this.state.gameState} handleColumnClick={(i) => this.handleColumnClick(i)} />
                    </div>
                </div>

            </div>
        )
    }

}

export default Game