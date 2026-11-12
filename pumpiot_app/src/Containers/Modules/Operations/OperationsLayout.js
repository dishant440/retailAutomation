import React from "react";
import {Menu, Grid, Label, Icon, Dropdown} from "semantic-ui-react";
import {NavLink} from "react-router-dom";

/**
 * The main structure of the layout
 * System Menu
 * @param props
 * @returns {*}
 * @constructor
 */
const OperationsLayout = props => {
    return (
        <>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Menu vertical fluid>
                            <Menu.Item>
                                <Menu.Header><Icon name={'circle outline'}/> Fuel Price</Menu.Header>
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/today-fuel'}>
                                Add Today's Fuel Price
                            </Menu.Item>
                            <Menu.Item>
                                <Menu.Header><Icon name={'circle outline'}/> Shift Assignments</Menu.Header>
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/shift/show'}>
                                View Today's Shifts
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/shift/assignment'}>
                                Add Shift
                            </Menu.Item>
                            <Menu.Item>
                                <Menu.Header><Icon name={'circle outline'}/> Decantation</Menu.Header>
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/add-decantation'}>
                                Add New Decantation Record
                            </Menu.Item>
                            <Menu.Item>
                                <Menu.Header><Icon name={'circle outline'}/> Fuel Adjustments</Menu.Header>
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/fuel-adjustment'}>
                                Pump Test
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

export default OperationsLayout;
