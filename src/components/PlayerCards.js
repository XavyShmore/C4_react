import React from "react";
import { Row, Card, Col } from "react-bootstrap";

import { ChevronUp, ChevronDown, Robot, PersonCircle, FlagFill, Controller, Cpu } from "react-bootstrap-icons";

class Description extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        }
    }

    toggleCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    collapsed() {
        return (
            <div className="DescriptionText">
                <Card.Text className="DescriptionText">{this.props.text.slice(0, 130)} ...  </Card.Text>
                <ChevronDown className="chevron" onClick={() => this.toggleCollapsed()}></ChevronDown>
            </div>

        )
    }
    expand() {
        return (
            <div className="DescriptionText"><Card.Text>{this.props.text}   </Card.Text>
                <ChevronUp className="chevron" onClick={() => this.toggleCollapsed()}></ChevronUp></div>

        )

    }

    render() {
        return (
            this.state.collapsed ? this.collapsed() : this.expand()
        )
    }
}

function userIcon(isHuman) {
    return isHuman ? <PersonCircle /> : <Robot />;
}
function winIcon(isWinning) {
    <div className={"stateIco " + isWinning ? "winIco" : "loseIco"}>
        <FlagFill></FlagFill>
    </div>
}
function drawIcon() {
    return (
        <div className="stateIco">
            <FlagFill></FlagFill>
        </div>
    )
}
function isPlayingIcon(isHuman) {
    return (
        <span className="stateIco rotateIco">
            {isHuman?<Controller></Controller>:<Cpu/>}
        </span>
    )
}

function stateIcon(state, isPlayer1, isPlaying, isHuman) {
    if (state === 1) {
        return winIcon(isPlayer1);
    } else if (state === 2) {
        return !winIcon(isPlayer1);
    } else if (state === 3) {
        return drawIcon();
    } else if (isPlaying) {
        return isPlayingIcon(isHuman);
    }
}

function PlayerCard(props) {
    return (
        <Col xs={6}>
            <Card text="white" bg={props.index === 0 ? "danger" : "warning"}>
                <Card.Header as="h5">{userIcon(props.playerObject.isHuman)}  {props.playerObject.name} {stateIcon(props.gameState.state, props.index===0?true:false, props.gameState.isFirstPlayerTurn() === (props.index===0?true:false), props.playerObject.isHuman)}</Card.Header>
                <Card.Body>
                    <Card.Subtitle>Description</Card.Subtitle>
                    <Description text={props.playerObject.description}></Description>
                </Card.Body>
            </Card>
        </Col>
    )
}

function PlayerCards(props) {
    return (
        <Row className="player-card">
            <PlayerCard index={0} playerObject={props.players[0]} gameState={props.gameState}/>
            <PlayerCard index={1} playerObject={props.players[1]} gameState={props.gameState}/>
        </Row>
    )
}

export default PlayerCards;