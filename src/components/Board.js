import { Game } from "../C4Engine"
import React from "react";

class Column extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            x: props.x,
            columnGameState: props.columnGameState,

            dropSpot: props.dropSpot,
            highlight: false,
            streak: props.streak
        }
    }
    renderCase(y) {
        let styleClass = (
            "dropSpot" +
            (this.state.columnGameState[1][y] ? " p1token" : "") +
            (this.state.columnGameState[2][y] ? " p2token" : "") +
            (this.state.highlight && y == this.state.dropSpot ? " highlight" : "") +
            (this.state.streak.includes(y) ? " connect4" : "")
        )
        return (<div className={styleClass} key={y} ></div>)
    }
    onMouseEnter(){
        this.setState({ highlight: true })
    }
    onMouseLeave(){
        this.setState({ highlight: false })
    }

    render() {

        //Generate Cases
        let cases = []
        for (let i = 0; i < 6; i++) {
            cases.push(
                this.renderCase(i)
            )
        }

        return (
            <div
                className="stackColumn"
                onMouseEnter={() => this.onMouseEnter()}
                onMouseLeave={() => this.onMouseLeave()}>
                {cases}
            </div>
        )
    }
}


function Board(props) {

    let game = new Game(props.gameState)

    let columns = []
    for (var i = 0; i < 7; i++) {

        let columnGameState = game.gameState.board.map(slice => slice[i]);
        console.log("ok");

        columns.push(
            <Column
                key={i}
                x={i} 
                columnGameState={columnGameState}
                dropSpot={game.dropPosition(i)}
                streak={[]}
                 />
        )
    }

    return (
        <div className="board">
            {columns}
        </div>
    )
}

export default Board