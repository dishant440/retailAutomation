import React from 'react';
import {Button, Card, Form, Header, Input, Label, Message} from 'semantic-ui-react'
import {config} from '../../../config';
import {AppContext} from "../../../Store/context";
import OperationsLayout from "./OperationsLayout";
import {PRICETODAY, RELOAD} from "../../../Store/actions";
import get from "../../../functions/get";
import {useToasts} from "react-toast-notifications";
import DatePicker from "react-datepicker";
import moment from "moment";

const AddTodayFuel = props => {

    const {state, dispatch} = React.useContext(AppContext);
    const [fuel, setFuel] = React.useState({
        petrol: null,
        diesel: null,
        autolpg: null
    });
    const [startDate, setStartDate] = React.useState(new Date());
    const [loading, setLoading] = React.useState(false);
    const [displayMessage, setDisplayMessage] = React.useState(false);
    const {addToast} = useToasts();

    React.useEffect(() => {
        (async () => {
            await setLoading(true);

            const date = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();
            const todayFuel = await get('/today-fuel?date=' + date);

            if (Object.keys(todayFuel).length > 0) {
                await dispatch({
                    type: PRICETODAY,
                    payload: todayFuel
                });

                setFuel({
                    petrol: todayFuel.petrol,
                    diesel: todayFuel.diesel,
                    autolpg: todayFuel.autolpg,
                });

                await addToast("Showing fuel price of " + moment(date).format('YYYY/MM/DD'), {
                    appearance: 'success',
                    autoDismiss: true
                });
                await setLoading(false);
            } else {
                await addToast("No fuel price available for that date.", {appearance: 'error', autoDismiss: true}); // today's price is not set in the server
                await setLoading(false);
            }
        })();
    }, [startDate]);


    const save = async (e) => {
        try {

            if (fuel.petrol === null || fuel.diesel === null || fuel.autolpg === null) {
                return setDisplayMessage({
                    type: 'red',
                    message: 'Please add all the input fields'
                })
            }

            let postData = fuel;
            if (state.todayprice!= null) {

                postData.record = state.todayprice.id;
                await fetch(config.api_url + "/today-fuel/update", {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-Trigger': 'CORS'
                    },
                    body: JSON.stringify(postData)
                });

                await addToast("Fuel Price updated manually.", {appearance: 'success', autoDismiss: true});

                await dispatch({
                    type: RELOAD,
                    payload: Math.random()
                });
            } else {

                await fetch(config.api_url + "/today-fuel", {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-Trigger': 'CORS'
                    },
                    body: JSON.stringify(postData)
                });

                await addToast("Fuel Price updated manually.", {appearance: 'success', autoDismiss: true});

                await dispatch({
                    type: RELOAD,
                    payload: Math.random()
                });
            }


        } catch (e) {
            console.error(e)
        }
    };

    const addForm = () => {
        return <Card fluid>
            <Card.Content>
                <Card.Header>Fuel Price Management</Card.Header>
                <Card.Description>
                    <Form onSubmit={save} loading={loading}>
                        <Form.Field>
                            <label>Petrol Price</label>
                            <input placeholder='Petrol Price' name={'petrol'} type={'number'} step={"00.01"}
                                   value={fuel.petrol}
                                   readOnly={state && state.todayprice && state.todayprice.automatic}
                                   onChange={e => setFuel({...fuel, petrol: e.target.value})}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Diesel Price</label>
                            <input placeholder='Diesel Price' name={'diesel'} type={'number'} step={"00.01"}
                                   value={fuel.diesel}
                                   readOnly={state && state.todayprice && state.todayprice.automatic}
                                   onChange={e => setFuel({...fuel, diesel: e.target.value})}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Auto LPG Price</label>
                            <input placeholder='Auto LPG Price' name={'autolpg'} type={'number'} step={"00.01"}
                                   value={fuel.autolpg}
                                   readOnly={state && state.todayprice && state.todayprice.automatic}
                                   onChange={e => setFuel({...fuel, autolpg: e.target.value})}/>
                        </Form.Field>
                        <Button type='submit' color={'green'}>Submit</Button>
                    </Form>
                    {displayMessage.message && <Message color={displayMessage.color}>{displayMessage.message}</Message>}
                </Card.Description>
            </Card.Content>
        </Card>
    };

    let dateSelect = () => {
        return <Card fluid>
            <Card.Content>
                <Card.Description>
                    <Form.Group inline>
                        <label>Select Date: </label>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            dateFormat={'dd/MM/yyyy'}
                            customInput={<Input icon={'calendar alternate'}/>}
                        />
                    </Form.Group>
                </Card.Description>
            </Card.Content>
        </Card>
    };

    return <OperationsLayout>
        <Header as={'h5'}>
            {dateSelect()}
        </Header>
        {addForm()}
    </OperationsLayout>


};

export default AddTodayFuel;