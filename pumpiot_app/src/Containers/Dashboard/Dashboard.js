import React, {useContext} from "react";

import {Grid, Container, Header, Card} from "semantic-ui-react";
import {AppContext} from "../../Store/context";
import RecentSalesTable from "./RecentSalesTable";
import InventoryGraph from "./InventoryGraph";
import SalesChart from "./SalesChart";
import OperationsTable from "./OperationsTable";

import {PRICETODAY} from "../../Store/actions";
import get from "../../functions/get";
import {useToasts} from "react-toast-notifications";


/**
 * Dashboard that shows when the use is on / route
 * @returns {*}
 * @constructor
 */
const Dashboard = () => {

    const {state, dispatch} = useContext(AppContext);
    const {addToast} = useToasts();

    React.useEffect(() => {
        (async () => {
            const todayFuel = await get('/today-fuel');
            if (Object.keys(todayFuel).length > 0) {
                await dispatch({
                    type: PRICETODAY,
                    payload: todayFuel
                });
                await addToast("Fuel Price loaded.", {appearance: 'success', autoDismiss: true})
            } else {
                await addToast("Fuel Price not set.", {appearance: 'error', autoDismiss: true}); // today's price is not set in the server
            }
        })();
    }, [state.reload, state[PRICETODAY]]);

    return (
        <>
            <Container fluid style={{margin: "auto 1em"}}>
                <Grid.Column width={16}>
                    <Grid>
                        <Grid.Column width={4}>
                            <RecentSalesTable/>
                            <InventoryGraph/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <SalesChart/>
                            <OperationsTable/>

                            <Grid>
                                <Grid.Column width={8}>
                                    <Card fluid color='yellow'>
                                        <Card.Content>
                                            <Header
                                                style={{display: 'inline', marginRight: '15px'}}>Notifications</Header>
                                        </Card.Content>
                                        <Card.Content>
                                            <Grid divided>
                                                <Grid.Column width={8}>
                                                    <p>MS arriving on: 01/12/{new Date().getFullYear().toString()}</p>
                                                </Grid.Column>
                                                <Grid.Column width={8}>
                                                    <p>MEC due on: 05/12/{new Date().getFullYear().toString()}</p>
                                                </Grid.Column>
                                            </Grid>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <Card fluid color='yellow'>
                                        <Card.Content>
                                            <Header style={{display: 'inline', marginRight: '15px'}}>Today Fuel</Header>
                                        </Card.Content>
                                        <Card.Content>
                                            <Grid divided>
                                                <Grid.Column width={6}>
                                                    <p>Petrol: {state && state.todayprice && state.todayprice.petrol ? state.todayprice.petrol : ''}</p>
                                                </Grid.Column>
                                                <Grid.Column width={6}>
                                                    <p>Diesel: {state && state.todayprice && state.todayprice.diesel ? state.todayprice.diesel : ''}</p>
                                                </Grid.Column>
                                                <Grid.Column width={4}>
                                                    <p>ALPG: {state && state.todayprice && state.todayprice.autolpg ? state.todayprice.autolpg : ''}</p>
                                                </Grid.Column>
                                            </Grid>
                                        </Card.Content>
                                    </Card>
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                    </Grid>
                </Grid.Column>
            </Container>
        </>
    );
};

export default Dashboard;
