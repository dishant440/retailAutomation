'use strict';

const r = require('rethinkdb');
const fuelType = ['petrol', 'diesel', 'autolpg'];

const getHours = require('date-fns/getHours');
const getMinutes = require('date-fns/getMinutes');
const getSeconds = require('date-fns/getSeconds');
const ReplaceDate = require("../functions/replaceDate");
const {year} = require("../config");
const {timezone} = require('../config');

const TrxController = () => {

    const addTrx = async (req, res) => {
        try {
            let conn = req.app.get('rethinkdb.conn');

            const {body} = req;

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


    const getTodayTrx = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let timestamp = new Date();
            let cursor = await r.db('rps').table('trx')
                .filter(r.row('created_at').date().eq(r.time(year, timestamp.getMonth() + 1, timestamp.getDate(), timezone)))
                .orderBy(r.desc('created_at'))
                .run(conn);

            let val = await cursor.toArray();

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (e) {
            console.error(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };

    const getTrxHistory = async (req, res) => {
        try {

            const {body} = req;

            let conn = req.app.get('rethinkdb.conn');

            let val = await r.table('trx')
                .between(formattedDateTime(new Date(body.startDate), r), formattedDateTime(new Date(body.endDate), r), {index: 'created_at'})
                .group(r.row('created_at').day(), 'product')
                .sum('amt')
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };


    const getTotalFuelByFuelType = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            let val = await r.table('trx')
                .filter((today) => {
                    return today("created_at").date().eq(formattedDateTime(new Date(), r))
                })
                .group('type')
                .sum('ltr')
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };


    const getTotalFuelConsumption = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            // get last stock_tt value
            let stockTt = await r.table('stock_tt')
                .orderBy({index: r.desc('created_at')})
                .limit(1)
                .nth(0)
                .run(conn);

            let val = await r.table('trx')
                .between(formattedNotFixedDateTime(new Date(stockTt.created_at), r), formattedNotFixedDateTime(new Date(), r), {index: 'created_at'})
                .group('product')
                .sum('qty')
                .run(conn);

            let stringData = JSON.stringify(val);

            console.log(stringData);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };

    const recentTrxByNozzle = async (req, res) => {
        try {

            const {body} = req;
            let timestamp = new Date();

            let conn = req.app.get('rethinkdb.conn');

            let cursor = await r.table('trx')
                .getAll(body.dispatcher_id, {index: 'dispatcher_id'})
                .filter(r.row('created_at').date().eq(r.time(year, timestamp.getMonth() + 1, timestamp.getDate(), timezone)))
                .limit(5)
                .orderBy(r.desc('created_at'))
                .run(conn);

            let val = await cursor.toArray();

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };

    const formattedDateTime = (timestamp, r) => {
        let time = r.time(year, timestamp.getMonth() + 1, timestamp.getDate(), getHours(timestamp), getMinutes(timestamp), getSeconds(timestamp), timezone);
        console.log(time);
        return time;
    };

    const formattedNotFixedDateTime = (timestamp, r) => {
        let time = r.time(timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate(), getHours(timestamp), getMinutes(timestamp), getSeconds(timestamp), timezone);
        console.log(time);
        return time;
    };

    return {
        addTrx,
        getTodayTrx,
        getTrxHistory,
        getTotalFuelByFuelType,
        getTotalFuelConsumption,
        recentTrxByNozzle
    }
};

module.exports = TrxController;