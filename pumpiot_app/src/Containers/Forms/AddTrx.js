import React from 'react';
import {Button, Card, Form, Message} from 'semantic-ui-react'
import {config} from './../../config';
import {AppContext} from "../../Store/context";
import {PRICETODAY, RELOAD, TRX} from "../../Store/actions";
import post from "../../functions/post";

const AddTrx = () => {

    const {state, dispatch} = React.useContext(AppContext);

    const dispatcher = ["pump_1|nozzle_1", "pump_1|nozzle_2", "pump_2|nozzle_1","pump_2|nozzle_2", "pump_3|nozzle_1", "pump_3|nozzle_2", "pump_4|nozzle_1", "pump_4|nozzle_2"];
    const mop = ["cash", "fleet", "credit"];
    const product = ["petrol", "diesel", "autolpg"];
    const shift = ["A", "B", "C"];

    state.todayprice && console.log(state.todayprice);

    const save = async (e) => {
        try {

            let randomQty = parseFloat((Math.random() * (10.00 - 1.00) + 0.314).toFixed(2));
            let randomProduct = randomArrVal(product);
            let body = {
                date: new Date(),
                product: randomProduct === "autolpg" ? "alpg" : randomProduct,
                qty: randomQty,
                amt: (randomQty * parseFloat(state.todayprice[randomProduct])),
                price: parseFloat(state.todayprice[randomProduct]),
                atg_reading: parseFloat((Math.random() * (8000.00 - 1532.00) + 2.314).toFixed(2)), //random number
                totalizer: parseFloat((Math.random() * (34000.00 - 20100.00) + 1.24).toFixed(2)), //random number
                trx_type: "sales",
                dispatcher_id: randomArrVal(dispatcher),
                employee_id: "123abc",
                discount: 0,
                mop: randomArrVal(mop),
                vehicle_no: "gj 06 ck 7997",
                mobile_no: "8020998691",
                dsm_name: "jayesh",
                shift_id: randomArrVal(shift),
                pumpTest: 0,
                ownUse: 0
            };

            console.log(body);
            const rawResponse = await post("/trx", body);
            console.log("Response", rawResponse);

            await dispatch({
                type: TRX,
                payload: [...state.trx, body]
            });

            await dispatch({
                type: RELOAD,
                payload: new Date().getMilliseconds()
            });

        } catch (e) {
            console.error(e)
        }
    };


    return <Card fluid>
        <Card.Content>
            <Card.Header>Add Random Dummy Entry</Card.Header>
            <Card.Description>
                {state && state.todayprice && <Form onSubmit={save}>
                    <Button type='submit' primary>Add Test Records</Button>
                </Form>}
                {state && !state.todayprice && <Message>Today Price not set</Message>}
            </Card.Description>
        </Card.Content>
    </Card>
};

const randomArrVal = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

export default AddTrx;