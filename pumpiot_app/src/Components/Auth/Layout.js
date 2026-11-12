import React from "react";
import {Container} from "semantic-ui-react";

/**
 * The main structure of the layout
 * @param props
 * @returns {*}
 * @constructor
 */
const AuthLayout = props => {
    return (
        <Container className="App">
            {props.children}
        </Container>
    );
};

export default AuthLayout;
