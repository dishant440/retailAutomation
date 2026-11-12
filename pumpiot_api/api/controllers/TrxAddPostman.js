const r = require('rethinkdb');

const getHours = require('date-fns/getHours');
const getMinutes = require('date-fns/getMinutes');
const getSeconds = require('date-fns/getSeconds');
const ReplaceDate = require("../functions/replaceDate");
const {year} = require("../config");
const {timezone} = require('../config');

const TrxAddPostman = () => {

    const addTrxPostman = async (req, res) => {

        const fuelType = ['petrol', 'diesel', 'autolpg'];
        const shift = ['A', 'B', 'C'];
        const mop = ['cash', 'fleet', 'credit'];
        const dispatcher = ['pump_1|nozzle_1', 'pump_1|nozzle_2', 'pump_2|nozzle_1', 'pump_2|nozzle_2', 'pump_3|nozzle_1', 'pump_3|nozzle_2', 'pump_4|nozzle_1', 'pump_4|nozzle_2'];

        const randomArrVal = (arr) => {
            return arr[Math.floor(Math.random() * arr.length)];
        };

        let randomQty = parseFloat((Math.random() * (10.00 - 1.00) + 0.314).toFixed(2));
        let randomProduct = randomArrVal(fuelType);

        const addTrxBody = {
            date: new Date(),
            product: randomProduct === "autolpg" ? "alpg" : randomProduct,
            qty: randomQty,
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

        try {
            let conn = req.app.get('rethinkdb.conn');

            //const fuelController = ;
            let timeStamp = new Date();

            let cursor = await r.table('today_fuel')
                .filter((today) => {
                    return today("date").date().eq(r.time(
                        year,
                        timeStamp.getMonth() + 1,
                        timeStamp.getDate(),
                        timezone
                    ))
                })
                .run(conn);

            let todayFuel = await cursor.toArray();

            const body = {
                ...addTrxBody,
                amt: (randomQty * parseFloat(todayFuel[0][randomProduct])),
                price: parseFloat(todayFuel[0][randomProduct]),
            };

            let timestamp = new Date(body.date);
            body.created_at = r.time(year, timestamp.getMonth() + 1, timestamp.getDate(), getHours(timestamp), getMinutes(timestamp), getSeconds(timestamp), timezone);

            delete body.date;

            let val = await r.table('trx')
                .insert(body)
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };

    return {
        addTrxPostman,
    };
};

module.exports = TrxAddPostman;