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
            pop:[false, false, false, false, false, false],
            streak: props.streak
        }
    }
    renderCase(y) {

        this.props.streak.forEach((value, index) => {
            if (value[0] === this.state.x && value[1] === y){

                let delay = index * 200;
                setTimeout(()=>{
                    let newPop = this.state.pop.slice();
                    newPop[y] = true;
                    this.setState({
                        pop: newPop
                    });
                }, delay);
            }
        });

        let styleClass = (
            "dropSpot" +
            (this.props.columnGameState[1][y] ? " p1token" : "") +
            (this.props.columnGameState[2][y] ? " p2token" : "") +
            (this.state.highlight && y === this.props.dropSpot ? " highlight" : "") +
            (this.state.pop[y] ? " connect4" : "")
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
                onMouseLeave={() => this.onMouseLeave()}
                onClick={() => this.props.onClick()} >
                {cases}
            </div>
        )
    }
}


function Board(props) {

    let game = new Game(props.gameState);

    let columns = []
    for (let j = 0; j < 7; j++) {

        let i = j;

        let columnGameState = props.gameState.board.map(slice => slice[i]);

        columns.push(
            <Column
                key={i}
                x={i} 
                columnGameState={columnGameState}
                dropSpot={game.dropPosition(i)}
                streak={props.gameState.winningStreak}
                onClick = {() => props.handleColumnClick(i)}
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