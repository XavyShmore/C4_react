import { Navbar, Container } from "react-bootstrap"


function navbar(props){
    return (
        <Navbar>
            <Container>
                <Navbar.Brand>Connect 4</Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default navbar;