'use strict';

const r = require('rethinkdb');

const getHours = require('date-fns/getHours');
const getMinutes = require('date-fns/getMinutes');
const getSeconds = require('date-fns/getSeconds');
const {timezone} = require('../config');
const _ = require('lodash');
const ReplaceDate = require("../functions/replaceDate");
const {year} = require("../config");

const ShiftsController = () => {

    const getShifts = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            let val = await r.table('shifts')
                .orderBy('id', 'asc')
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };

    const todayEmployeeShifts = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let timestamp = new Date();
            let {body} = req;

            let val = await r.table('shifts')
                .getAll(body.shift, {index: 'shift'})
                .filter(r.row('created_at').date().eq(r.time(year, timestamp.getMonth() + 1, timestamp.getDate(), timezone)))
                .eqJoin(r.row('dsm'), r.table('employees'))
                .zip()
                .merge(function (shift) {
                    let q = r.table('trx').getAll(shift('nozzle'), {index: 'dispatcher_id'}).filter(record => {
                        return record('created_at').date().eq(r.time(year, timestamp.getMonth() + 1, timestamp.getDate(), timezone));
                    });
                    return {
                        amt: q.sum('amt'),
                        qty: q.sum('qty')
                    }
                })
                .orderBy(r.asc('id'))
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };

    const addShift = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let {body} = req;

            let insertData = body.data.map(v => {
                v.created_at = formattedDateTime(new Date(), r);
                return v;
            });

            let val = await r.table('shifts')
                .insert(insertData)
                .run(conn);

            let history = null;
            if (val.inserted > 0) {
                history = await r.table('shift_history')
                    .insert({
                        created_at: formattedDateTime(new Date(), r),
                        ids: val.generated_keys,
                        shift: body.shift,
                        adder: body.adder
                    })
                    .run(conn);
            }

            let stringData = JSON.stringify(history);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error - Error: x302'});
        }
    };

    const updateShift = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let {body} = req;

            let val = await r.table('shifts')
                .get(body.id)
                .update({
                    'updated_at': new Date(),
                    'name': body.name
                })
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error - Error: x303'});
        }
    };

    const deleteShift = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            let startDate = new Date();

            // delete shifts
            await r.table('shifts')
                .orderBy({index: r.desc('created_at')})
                .filter(r.row('created_at').date().eq(r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone)))
                .delete()
                .run(conn);

            // delete trx
            let val = await r.db('rps').table('trx')
                .orderBy({index: r.desc('created_at')})
                .filter(r.row('created_at').date().eq(r.time(year, startDate.getMonth() + 1, startDate.getDate(), timezone)))
                .delete()
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error - Error: x303'});
        }
    };

    const formattedDateTime = (timestamp, r) => {
        return r.time(year, timestamp.getMonth() + 1, timestamp.getDate(), getHours(timestamp), getMinutes(timestamp), getSeconds(timestamp), timezone)
    };

    return {
        getShifts,
        todayEmployeeShifts,
        addShift,
        updateShift,
        deleteShift
    }

};

module.exports = ShiftsController;
