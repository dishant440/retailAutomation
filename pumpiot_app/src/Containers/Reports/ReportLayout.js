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
const ReportLayout = props => {
    return (
        <>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Menu vertical fluid>
                            <Menu.Item>
                                <Menu.Header><Icon name={'circle outline'}/> Reports</Menu.Header>
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/reports/summary/date'}>
                                Summary
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/reports/sales/date'}>
                                Sales
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/reports/stock/date'}>
                                Stock
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/reports/stock/lubestock'}>
                                Lube GRN
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/reports/device-list'}>
                                Device List
                            </Menu.Item>
                            <Menu.Item as={NavLink} to={'/reports/summary/new/date'}>
                                New Summary
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

export default ReportLayout;
