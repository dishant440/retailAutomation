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
const SystemLayout = props => {
    return (
        <>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Menu vertical fluid>
                            <Menu.Item>
                                <Menu.Header><Icon name={'circle outline'}/> Employees</Menu.Header>
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/system/employees/get'}>
                                Employees List
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/system/employees/add'}>
                                Add Employees
                            </Menu.Item>
                            <Menu.Item>
                                <Menu.Header><Icon name={'circle outline'}/> System</Menu.Header>
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/system/settings'}>
                                Settings
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

export default SystemLayout;
