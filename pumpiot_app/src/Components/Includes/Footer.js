import React from "react";
import {Segment} from "semantic-ui-react";
import {AppContext} from "../../Store/context";
import moment from 'moment';

/**
 * Footer
 * @returns {*}
 * @constructor
 */
const Footer = () => {
    const {state} = React.useContext(AppContext);
    const price = state.todayprice;
    if(!price){
        return <></>;
    }
    return (
        <>
            <Segment inverted secondary textAlign={'center'} size={'small'} className={'sticky-footer'}>
                Fuel Price Date: {moment(price.date).format('YYYY/MM/DD   HH:mm')}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Status: Successful
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; HSD: {price && price.petrol}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; MS: {price && price.diesel}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ALPG: {price && price.autolpg}
            </Segment>
        </>
    );
};

export default Footer;
