import React from "react";
import {Menu, Grid, Label, Icon} from "semantic-ui-react";
import {NavLink} from "react-router-dom";

/**
 * The main structure of the layout
 * System Menu
 * @param props
 * @returns {*}
 * @constructor
 */
const UpsDgLayout = props => {
    return (
        <>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Menu vertical fluid>
                            <Menu.Item>
                                <Menu.Header><Icon name={'circle outline'}/> UPS &amp; DG</Menu.Header>
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/ups'}>
                                UPS Monitoring
                            </Menu.Item>
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {props.children}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

export default UpsDgLayout;
