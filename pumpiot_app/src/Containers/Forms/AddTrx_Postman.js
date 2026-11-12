import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Message} from 'semantic-ui-react'
import {config} from '../../config';
import {AppContext} from "../../Store/context";
import {PRICETODAY, RELOAD, TRX} from "../../Store/actions";
import post from "../../functions/post";
import get from "../../functions/get";
import {Header, Icon} from 'semantic-ui-react'

const AddTrxPostman = () => {

    const dispatcher = ["pump_1|nozzle_1", "pump_1|nozzle_2", "pump_2|nozzle_1", "pump_2|nozzle_2", "pump_3|nozzle_1", "pump_3|nozzle_2", "pump_4|nozzle_1", "pump_4|nozzle_2"];
    const mop = ["cash", "fleet", "credit"];
    const product = ["petrol", "diesel", "autolpg"];
    const shift = ["A", "B", "C"];

    const save = async (e) => {
        try {
            const todayFuel = await get('/today-fuel');

            if (!todayFuel) setFuelPrice("Fuel price could not be loaded");

            let randomQty = parseFloat((Math.random() * (10.00 - 1.00) + 0.314).toFixed(2));
            let randomProduct = randomArrVal(product);
            let body = {
                date: new Date(),
                product: randomProduct === "autolpg" ? "alpg" : randomProduct,
                qty: randomQty,
                amt: (randomQty * parseFloat(todayFuel[randomProduct])),
                price: parseFloat(todayFuel[randomProduct]),
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

            const rawResponse = await fetch(config.api_url + "/trx", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-Trigger': 'CORS'
                },
                body: JSON.stringify(body)
            });

            return rawResponse.json();

        } catch (e) {
            console.error(e)
        }
    };

    const [loading, setLoader] = useState(false)
    const [fuelPrice, setFuelPrice] = useState(null)

    useEffect(() => {
        save().then(r => setLoader(r))
    }, []);

    if (loading && !fuelPrice) {
        return "Data Added";
    }

    return fuelPrice ? fuelPrice : 'Data could not be added';

};

const randomArrVal = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

export default AddTrxPostman;