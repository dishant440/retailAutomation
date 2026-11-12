import React from "react";
import {Button} from "semantic-ui-react";
import {NavLink} from "react-router-dom";

/**
 * The main structure of the layout
 * System Menu
 * @returns {*}
 * @constructor
 */
const StockReportMenu = () => {
    return (
        <>
            <Button.Group size='medium'>
                <Button as={NavLink} to={'/reports/stock/date'}>Fuel</Button>
                <Button.Or/>
                <Button as={NavLink} to={'/reports/stock/lube'}>Lube</Button>
            </Button.Group>
        </>
    );
};

export default StockReportMenu;
