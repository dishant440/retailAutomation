import React, {useContext} from "react";

import {Grid, Segment, Header, Button, Message} from "semantic-ui-react";
import {useHistory} from "react-router-dom";
import {Form} from "formsy-semantic-ui-react";

/**
 * Login that shows when the use is on / route
 * @returns {*}
 * @constructor
 */
const Login = () => {

    let history = useHistory();
    const [displayMessage, setDisplayMessage] = React.useState(false);

    const login = (formData) => {
        console.log(formData)
        if(formData.username === 'admin' && formData.password === 'admin123') {
            history.push("/home");
        } else {
            setDisplayMessage('Your username and password is incorrect.');
        }
    };

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Log-in to your account
                </Header>
                <Form size='large' onSubmit={login}>
                    <Segment stacked>
                        <Form.Input name={'username'} fluid icon='user' iconPosition='left' placeholder='Username' />
                        <Form.Input
                            name={'password'}
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                        />

                        {displayMessage && <Message color={'red'}>{displayMessage}</Message>}

                        <Button color='teal' fluid size='large' type={'submit'}>
                            Login
                        </Button>
                    </Segment>
                </Form>
            </Grid.Column>
        </Grid>
    );
};

export default Login;
