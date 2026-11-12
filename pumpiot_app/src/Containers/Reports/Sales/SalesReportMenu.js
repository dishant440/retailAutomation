import React from "react";
import {Button} from "semantic-ui-react";
import {NavLink} from "react-router-dom";

/**
 * The main structure of the layout
 * System Menu
 * @returns {*}
 * @constructor
 */
const SalesReportMenu = () => {
    return (
        <>
            <Button.Group size='medium'>
                <Button as={NavLink} to={'/reports/sales/date'}>Date</Button>
                <Button.Or/>
                <Button as={NavLink} to={'/reports/sales/shift'}>Shift</Button>
            </Button.Group>
        </>
    );
};

export default SalesReportMenu;
