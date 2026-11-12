'use strict';

const r = require('rethinkdb');
const table = "trx";
const {timezone, dateTimeFormat} = require('../../config');
const moment = require('moment');
const _ = require('lodash');
const ReplaceDate = require("../../functions/replaceDate");
const {year} = require("../../config");

const SalesReportController = () => {

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
                .orderBy({index: r.desc('created_at')})
                .between(
                    r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone),
                    r.time(year, endDate.getMonth() + 1, endDate.getDate(), 23, 59, 59, timezone),
                    {index: "created_at", leftBound: 'closed'}
                ).filter((doc) => {
                    if(body.fuel && body.fuel.length > 0) {
                        return r.expr(body.fuel).contains(doc('product'))
                    } else { return ""; }
                })
                .filter((doc) => {
                    if(body.shift && body.shift.length > 0) {
                        return r.expr(body.shift).contains(doc('shift_id'))
                    } else { return ""; }
                })
                .filter((doc) => {
                    if(body.mop && body.mop.length > 0) {
                        return r.expr(body.mop).contains(doc('mop'))
                    } else { return ""; }
                })
                .filter((doc) => {
                    if(body.pump_test) {
                        return doc('pumpTest').ne(0);
                    } else { return ""; }
                })
                .filter((doc) => {
                    if(body.own_use) {
                        return doc('ownUse').ne(0);
                    } else { return ""; }
                }).run(conn);

            let arr = await cursor.toArray();

            let data = await formatData(arr);

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
            let {startDate, endDate, shiftId} = body;
            startDate = new Date(startDate);
            endDate = new Date(endDate);

            let cursor = await r.table(table)
                .orderBy({index: r.desc('created_at')})
                .between(
                    r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone),
                    r.time(year, endDate.getMonth() + 1, endDate.getDate(), 23, 59, 59, timezone),
                    {index: "created_at", leftBound: 'closed'}
                ).filter(r.row("shift_id").eq(shiftId)).run(conn);

            let arr = await cursor.toArray();

            let data = await formatData(arr);

            let stringData = JSON.stringify(data);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };

    const formatData = (arr) => {

        let sellingPrice = {
            alpg: 40,
            petrol: 70,
            diesel: 80
        };

        return arr.map(v => {
            return {
                date: moment(v.created_at).format(dateTimeFormat),
                id: v.id.split("-")[0],
                shift_id: v.shift_id,
                atg_reading: v.atg_reading,
                product: v.product === 'alpg' ? 'ALPG' : _.capitalize(v.product),
                pumpTest: v.pumpTest,
                ownUse: v.ownUse,
                ownUseAmt: round(v.ownUse * 80),
                netSalesQty: v.qty,
                sellingPrice: sellingPrice[v.product],
                totalSales: v.amt,
                mop: _.capitalize(v.mop),
                dispatcher_id: v.dispatcher_id
            };
        });
    }

    const round = (num) => {
        return Math.round(parseFloat(num) * 100) / 100;
    };

    return {
        filterDate,
        filterShift
    }

};

module.exports = SalesReportController;
