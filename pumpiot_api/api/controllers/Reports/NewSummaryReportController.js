'use strict';

const r = require('rethinkdb');
const ReplaceDate = require("../../functions/replaceDate");
const {year} = require("../../config");
const {timezone} = require('../../config');

const NewSummaryReportController = () => {

    const filterDate = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let {body} = req;
            let {startDate, endDate} = body;
            startDate = new Date(startDate);
            endDate = new Date(endDate);

            // other filters
            // fuel = [], cash = bool, credit = bool, fleet = bool, loyalty = bool

            let cursor = await r.table("new_summary_date")
                .orderBy({index: 'created_at'})
                .between(
                    r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone),
                    r.time(year, endDate.getMonth() + 1, endDate.getDate(), 23, 0, 0, timezone),
                    {index: "created_at", leftBound: 'closed'}
                ).filter((doc) => {
                    if(body.fuel && body.fuel.length > 0) {
                        return r.expr(body.fuel).contains(doc('product'))
                    } else { return ""; }
                })
                .run(conn);

            let arr = await cursor.toArray();

            // let data = await buildData(arr);

            let stringData = JSON.stringify(arr);

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
            // fuel = [], shift = [], cash = bool, credit = bool, fleet = bool, loyalty = bool

            let cursor = await r.table("new_summary_shift")
                .orderBy({index: r.desc('created_at')})
                .between(
                    r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone),
                    r.time(year, endDate.getMonth() + 1, endDate.getDate(), 23, 0, 0, timezone),
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
                .run(conn);

            let arr = await cursor.toArray();

            // let data = await buildData(arr, true);

            let stringData = JSON.stringify(arr);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };

    return {
        filterDate,
        filterShift
    }

};

module.exports = NewSummaryReportController;
