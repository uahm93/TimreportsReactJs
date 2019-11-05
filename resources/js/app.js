require("./bootstrap");

import React, { Component } from "react";
import ReactDOM from "react-dom";
import Header from "./components/Elementos/Header";
import Container from "@material-ui/core/Container";

class App extends Component {
    render() {
        return (
            <Container fixed>
                <Header />
            </Container>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"));
