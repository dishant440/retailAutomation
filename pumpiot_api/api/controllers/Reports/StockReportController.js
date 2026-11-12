'use strict';

const r = require('rethinkdb');
const {timezone} = require('../../config');
const _ = require('lodash');
const ReplaceDate = require("../../functions/replaceDate");
const {year} = require("../../config");

const StockReportController = () => {

    const filterDate = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let {body} = req;
            let {startDate, endDate} = body;
            startDate = new Date(startDate);
            endDate = new Date(endDate);

            let cursor = await r.table('stock')
                .orderBy({index: r.desc('created_at')})
                .between(
                    r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone),
                    r.time(year, endDate.getMonth() + 1, endDate.getDate(), timezone),
                    {index: "created_at", leftBound: 'closed'}
                ).filter((doc) => {
                    if(body.lube && body.lube.length > 0) {
                        return r.expr(body.lube).contains(doc('product'))
                    } else { return ""; }
                }).run(conn);

            let arr = await cursor.toArray();

            arr = arr.map( (v, k) => {
                arr[k].total_dispensed = round((v.opening_stock - v.closing_stock) + v.tt_filled);
                arr[k].product = _.capitalize(v.product);
                return arr[k];
            });

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

            let cursor = await r.table('oil')
                .orderBy({index: r.asc('created_at')})
                .between(
                    r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone),
                    r.time(year, endDate.getMonth() + 1, endDate.getDate(), timezone),
                    {index: "created_at", leftBound: 'closed'}
                ).filter((doc) => {
                    if(body.lube && body.lube.length > 0) {
                        return r.expr(body.lube).contains(doc('product'))
                    } else { return ""; }
                }).run(conn);

            let arr = await cursor.toArray();

            return res.status(200).json(arr);

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };

    const filterLubegrn = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let {body} = req;
            let {startDate, endDate} = body;
            startDate = new Date(startDate);
            endDate = new Date(endDate);

            let cursor = await r.table('oil')
                .orderBy({index: r.asc('created_at')})
                .between(
                    r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone),
                    r.time(year, endDate.getMonth() + 1, endDate.getDate(), timezone),
                    {index: "created_at", leftBound: 'closed'}
                ).filter((doc) => {
                    return doc('refill_qty').ne(0);
                }).filter((doc) => {
                    if(body.lube && body.lube.length > 0) {
                        return r.expr(body.lube).contains(doc('product'))
                    } else { return ""; }
                }).run(conn);

            let arr = await cursor.toArray();

            return res.status(200).json(arr);

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };

    const round = (num) => {
        return Math.round(parseFloat(num) * 100) / 100;
    };

    return {
        filterDate,
        filterShift,
        filterLubegrn
    }

};

module.exports = StockReportController;
