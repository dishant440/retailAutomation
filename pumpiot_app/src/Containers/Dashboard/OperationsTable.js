import React from 'react';
import {Card, Table, Message, Label, Icon, Header, Loader, Popup, Button} from "semantic-ui-react";
import {AppContext} from "../../Store/context";
import post from "../../functions/post";
import {SHIFTS_TODAY} from "../../Store/actions";
import _ from "lodash";
import {floor} from "../../functions/helpers";
import LatestTrx from "./LatestTrx/LatestTrx";
import {NavLink} from "react-router-dom";

const Rs = '\u20B9';

const OperationsTable = () => {

    const {state, dispatch} = React.useContext(AppContext);
    const [displayMessage, setDisplayMessage] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const {shifts_today, last_trx} = state;

    /**
     * Get today shift
     */
    React.useEffect(() => {

        setLoading(true);

        // Get shifts
        post('/shifts/get-today', {
            shift: "A"
        }).then(res => {

            let orderedRes = _.orderBy(res, ['nozzle'], ['asc']);

            if (res.length > 0) {
                dispatch({
                    type: SHIFTS_TODAY,
                    payload: orderedRes
                });
            } else {
                setDisplayMessage("Today's shift not assigned yet.");
            }
            setLoading(false);
        });

    }, []);

    React.useEffect(() => {

        // loop and add values to avoide data reload from server
        if (shifts_today && last_trx) {
            let updatedShiftToday = shifts_today.map(v => {
                if (v.nozzle === last_trx.dispatcher_id) {
                    v.qty = floor(v.qty + last_trx.qty);
                    v.amt = floor(v.amt + last_trx.amt);
                    return v;
                } else {
                    return v;
                }
            });
            dispatch({
                type: SHIFTS_TODAY,
                payload: updatedShiftToday
            });
        }


    }, [last_trx]);

    const rows = (v, k) => {
        let prevKey = (parseInt(k) - 1);

        return <Table.Row key={k}>
            <Table.Cell>
                {prevKey >= 0 && shifts_today[prevKey].name === v.name ? "" : <Label ribbon>{v.name}</Label>}
            </Table.Cell>
            <Table.Cell>
                <Popup content={<LatestTrx nozzle={v.nozzle}/>} on={'click'} position='bottom left'
                       trigger={<Button size={'tiny'} as={'a'}>{convertNozzleName(v.nozzle)}</Button>}/>
            </Table.Cell>
            <Table.Cell textAlign={'center'}>
                {k === 2 ? <Icon name={'circle thin'} color={'red'}/> : <Icon name={'circle thin'} color={'green'}/>}
            </Table.Cell>
            <Table.Cell>{floor(v.qty)}</Table.Cell>
            <Table.Cell>{floor(v.amt)}</Table.Cell>
            <Table.Cell textAlign={'center'}>
                <NavLink to={'/fuel-adjustment?nz=' + v.nozzle}>
                    {k === 2 ? <Icon name={'exclamation triangle'} color={'yellow'}/> :
                        <Icon name={'check circle'} color={'green'}/>}
                </NavLink>
            </Table.Cell>
        </Table.Row>
    };


    if (displayMessage) {
        return <Card fluid color='purple'>
            <Card.Content>
                <Message color={'warning'}>{displayMessage}</Message>
            </Card.Content>
        </Card>
    }

    return (
        <>
            <Card fluid color='purple'>
                <Card.Content>
                    <Header>Operations <small style={{float: "right"}}>Current Shift: "A"</small></Header>
                </Card.Content>
                <Card.Content>
                    <Loader active={loading}/>
                    <Card.Description style={{margin: "auto 1.5em"}}>
                        <Table celled style={{marginBottom: "1.5em"}}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>DSM</Table.HeaderCell>
                                    <Table.HeaderCell>Pump/Nozzle</Table.HeaderCell>
                                    <Table.HeaderCell>Pump Status</Table.HeaderCell>
                                    <Table.HeaderCell>Sale Qty. (L)</Table.HeaderCell>
                                    <Table.HeaderCell>Sales Amt. ({Rs})</Table.HeaderCell>
                                    <Table.HeaderCell>Pump Test</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {shifts_today && shifts_today.length > 0 && shifts_today.map(rows)}
                            </Table.Body>
                        </Table>
                    </Card.Description>
                </Card.Content>
            </Card>
        </>
    );
}


const convertNozzleName = function (nz) {

    let ret = null;

    switch (nz) {
        case 'pump_1|nozzle_1' :
            ret = 'P1|N1 (P)';
            break;
        case 'pump_1|nozzle_2':
            ret = 'P1|N2 (P)';
            break;
        case 'pump_2|nozzle_1':
            ret = 'P2|N1 (D)';
            break;
        case 'pump_2|nozzle_2':
            ret = 'P2|N2 (D)';
            break;
        case 'pump_3|nozzle_1':
            ret = 'P3|N1 (D)';
            break;
        case 'pump_3|nozzle_2':
            ret = 'P3|N2 (D)';
            break;
        case 'pump_4|nozzle_1':
            ret = 'P4|N1 (A)';
            break;
        case 'pump_4|nozzle_2':
            ret = 'P4|N2 (A)';
            break;
    }

    return ret;

};


export default OperationsTable;