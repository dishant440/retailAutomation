import React from 'react';
import {Card, Statistic, Message, Loader, Header} from "semantic-ui-react";
import {AppContext} from "../../Store/context";
import {groupBy, sum, floor, formatInr} from "../../functions/helpers";

const RecentSalesTable = () => {

    const {state} = React.useContext(AppContext);
    const [data, setData] = React.useState(null);

    const {trx, settings, last_trx, todayprice} = state;

    React.useEffect(() => {

        if (!trx || !todayprice) return;

        let group = groupBy(trx, 'product'); //get group first
        let alpgAmt = sum(group.alpg, 'amt');
        let alpgQty = sum(group.alpg, 'qty');
        let petrolAmt = sum(group.petrol, 'amt');
        let petrolQty = sum(group.petrol, 'qty');
        let dieselAmt = sum(group.diesel, 'amt');
        let dieselQty = sum(group.diesel, 'qty');
        let total = (alpgAmt + petrolAmt + dieselAmt);

        setData({
            petrol: {amt: floor(petrolAmt), qty: floor(petrolQty)},
            diesel: {amt: floor(dieselAmt), qty: floor(dieselQty)},
            alpg: {amt: floor(alpgAmt), qty: floor(alpgQty)},
            total: floor(total)
        });

    }, [trx, todayprice, last_trx]);

    return (
        <Card fluid color='green'>
            <Card.Content>
                <Header>Total Sales Today</Header>
            </Card.Content>
            <Card.Content>
                <Card.Description style={{margin: "auto 1.5em"}}>
                    <Statistic.Group horizontal size={'tiny'}>
                        <Statistic style={{color: settings && settings.petrol_color}}>
                            <Statistic.Value><sup>{data && data.petrol.qty ? data.petrol.qty : 0}L /</sup> ₹{data && data.petrol.amt ? data.petrol.amt : 0}</Statistic.Value>
                            <Statistic.Label>Petrol</Statistic.Label>
                        </Statistic>
                        <Statistic style={{color: settings && settings.diesel_color}}>
                            <Statistic.Value><sup>{data && data.diesel.qty ? data.diesel.qty : 0}L /</sup> ₹{data && data.diesel.amt ? data.diesel.amt : 0}</Statistic.Value>
                            <Statistic.Label>Diesel</Statistic.Label>
                        </Statistic>
                        <Statistic style={{color: settings && settings.alpg_color}}>
                            <Statistic.Value><sup>{data && data.alpg.qty ? data.alpg.qty : 0}L / </sup> ₹{data && data.alpg.amt ? data.alpg.amt : 0}</Statistic.Value>
                            <Statistic.Label>Alpg</Statistic.Label>
                        </Statistic>
                    </Statistic.Group>
                </Card.Description>
            </Card.Content>
            <Card.Content>
                <Statistic style={{color: 'maroon', margin: 'auto 1.5em'}} size={'tiny'}>
                    <Statistic.Value><small>Total: ₹{data && data.total}</small></Statistic.Value>
                </Statistic>
            </Card.Content>
        </Card>
    );
}

export default RecentSalesTable;