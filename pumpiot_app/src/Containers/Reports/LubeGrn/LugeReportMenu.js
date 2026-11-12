import React from "react";
import {Button} from "semantic-ui-react";
import {NavLink} from "react-router-dom";

/**
 * The main structure of the layout
 * System Menu
 * @returns {*}
 * @constructor
 */
const LugeReportMenu = () => {
    return (
        <>
            <Button.Group size='medium'>
                <Button as={NavLink} to={'/reports/stock/lubestock'}>Lube Stock</Button>
                <Button.Or/>
                <Button as={NavLink} to={'/reports/stock/lubegrn'}>Lube GRN</Button>
            </Button.Group>
        </>
    );
};

export default LugeReportMenu;
