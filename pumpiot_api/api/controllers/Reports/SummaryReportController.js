'use strict';

const r = require('rethinkdb');
const {year} = require("../../config");
const table = "trx";
const {timezone} = require('../../config');
const ReplaceDate = require('../../functions/replaceDate');

const SummaryReportController = () => {

    const filterDate = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let {body} = req;
            let {startDate, endDate} = body;
            startDate = new Date(startDate);
            endDate = new Date(endDate);

            // other filters
            // fuel = [], shift = [], pump_test = "", own_use = ""

            let cursor = await r.table(table)
                .orderBy({index: 'created_at'})
                .between(
                    r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone),
                    r.time(year, endDate.getMonth() + 1, endDate.getDate(), 23, 0, 0, timezone),
                    {index: "created_at", leftBound: 'closed'}
                ).filter((doc) => {
                    if (body.fuel && body.fuel.length > 0) {
                        return r.expr(body.fuel).contains(doc('product'))
                    } else {
                        return "";
                    }
                })
                .filter((doc) => {
                    if (body.shift && body.shift.length > 0) {
                        return r.expr(body.shift).contains(doc('shift_id'))
                    } else {
                        return "";
                    }
                })
                .filter((doc) => {
                    if (body.pump_test) {
                        return doc('pumpTest').ne(0);
                    } else {
                        return "";
                    }
                })
                .filter((doc) => {
                    if (body.own_use) {
                        return doc('ownUse').ne(0);
                    } else {
                        return "";
                    }
                })
                .group(r.row('created_at').date())
                .run(conn);

            let arr = await cursor.toArray();

            let data = await buildData(arr);

            let stringData = JSON.stringify(data);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };

    const filterShift = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let {body} = req;
            let {startDate, endDate} = body;
            startDate = new Date(startDate);
            endDate = new Date(endDate);

            // other filters
            // fuel = [], shift = [], pump_test = "", own_use = ""

            let cursor = await r.table(table)
                .orderBy({index: r.desc('created_at')})
                .between(
                    r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone),
                    r.time(year, endDate.getMonth() + 1, endDate.getDate(), 23, 0, 0, timezone),
                    {index: "created_at", leftBound: 'closed'}
                ).filter((doc) => {
                    if (body.fuel && body.fuel.length > 0) {
                        return r.expr(body.fuel).contains(doc('product'))
                    } else {
                        return "";
                    }
                })
                .filter((doc) => {
                    if (body.shift && body.shift.length > 0) {
                        return r.expr(body.shift).contains(doc('shift_id'))
                    } else {
                        return "";
                    }
                })
                .filter((doc) => {
                    if (body.pump_test) {
                        return doc('pumpTest').ne(0);
                    } else {
                        return "";
                    }
                })
                .filter((doc) => {
                    if (body.own_use) {
                        return doc('ownUse').ne(0);
                    } else {
                        return "";
                    }
                })
                .group(r.row('created_at').date(), r.row('shift_id'))
                .run(conn);

            let arr = await cursor.toArray();

            let data = await buildData(arr, true);

            let stringData = JSON.stringify(data);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };

    const buildData = (arr, multiple = false) => {
        return arr.map(v => {
            // Get total of all the sales amount
            let totalSales = sum(v.reduction, 'amt');
            let totalSalesQty = sum(v.reduction, 'qty');

            // totalizer reading of the last entry
            let atg_reading = v.reduction[v.reduction.length - 1].atg_reading || 0;

            // total of different type of fuel
            let dieselArr = v.reduction.filter(p => p.product === 'diesel');
            let dieselTotal = sum(dieselArr, "amt");
            let dieselTotalQty = sum(dieselArr, "qty");
            let dieselPumpTest = sum(dieselArr, "pumpTest");
            let dieselTrxCount = dieselArr.length;

            let petrolArr = v.reduction.filter(p => p.product === 'petrol');
            let petrolTotal = sum(petrolArr, "amt");
            let petrolTotalQty = sum(petrolArr, "qty");
            let petrolPumpTest = sum(petrolArr, "pumpTest");
            let petrolTrxCount = petrolArr.length;

            let alpgArr = v.reduction.filter(p => p.product === 'alpg');
            let alpgTotal = sum(alpgArr, "amt");
            let alpgTotalQty = sum(alpgArr, "qty");
            let alpgTrxCount = alpgArr.length;

            let pumpTest = sum(v.reduction, "pumpTest");
            let ownUse = sum(v.reduction, "ownUse");

            return {
                date: multiple ? v.group[0] : v.group,
                shift_id: multiple ? v.group[1] : v.shift_id,
                totalSales: round(totalSales),
                totalSalesQty: round(totalSalesQty + ownUse), // total sales add ownUse as well.
                atg_reading: round(parseFloat(atg_reading)),

                petrolTotal: round(petrolTotal),
                petrolTotalQty: round(petrolTotalQty),
                petrolTrxCount: petrolTrxCount,

                dieselTotal: round(dieselTotal),
                dieselTotalQty: round(dieselTotalQty),
                dieselTrxCount: dieselTrxCount,

                alpgTotal: round(alpgTotal),
                alpgTotalQty: round(alpgTotalQty),
                alpgTrxCount: alpgTrxCount,

                petrolPumpTest: petrolPumpTest,
                dieselPumpTest: dieselPumpTest,

                pumpTest: pumpTest,
                ownUse: ownUse,
                ownUseAmt: round(ownUse * 80)
            }
        });
    };

    /**
     * total
     * @param arrayOfObject
     * @param key
     * @returns {*}
     */
    const sum = (arrayOfObject, key) => {
        return arrayOfObject.reduce((a, b) => a + (parseFloat(b[key]) || 0), 0);
    };

    const formattedDateTime = (timestamp, r) => {
        return r.time(timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate(), timezone)
    };

    const round = (num) => {
        return Math.round(parseFloat(num) * 100) / 100;
    };

    return {
        filterDate,
        filterShift
    }

};

module.exports = SummaryReportController;
