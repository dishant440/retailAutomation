import React from "react";
import {Button} from "semantic-ui-react";
import {NavLink} from "react-router-dom";

/**
 * The main structure of the layout
 * System Menu
 * @returns {*}
 * @constructor
 */
const NewSummaryReportMenu = () => {
    return (
        <>
            <Button.Group size='medium'>
                <Button as={NavLink} to={'/reports/summary/new/date'}>Date</Button>
                <Button.Or/>
                <Button as={NavLink} to={'/reports/summary/new/shift'}>Shift</Button>
            </Button.Group>
        </>
    );
};

export default NewSummaryReportMenu;
