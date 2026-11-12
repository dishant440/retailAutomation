'use strict';

const r = require('rethinkdb');

const getHours = require('date-fns/getHours');
const getMinutes = require('date-fns/getMinutes');
const getSeconds = require('date-fns/getSeconds');
const ReplaceDate = require("../functions/replaceDate");
const {year} = require("../config");
const {timezone} = require('../config');

const FuelController = () => {

    const getTodayFuel = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            let timestamp = {};

            if(req.query.date){
                timestamp = new Date(req.query.date)
            } else {
                timestamp = new Date();
            }

            let cursor = await r.table('today_fuel')
                .filter((today) => {
                    return today("date").date().eq(r.time(
                        year,
                        timestamp.getMonth() + 1,
                        timestamp.getDate(),
                        timezone
                    ))
                })
                .run(conn);

            let val = await cursor.toArray();

            if(val.length > 0){
                let stringData = JSON.stringify(val[0]);
                return res.status(200).json(JSON.parse(ReplaceDate(stringData)));
            } else {
                return res.status(200).json({});
            }

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };

    const addTodayFuel = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            let val = await r.table('today_fuel')
                .insert({
                    'date': formattedDateTime(new Date(), r),
                    'petrol': req.body.petrol,
                    'diesel': req.body.diesel,
                    'autolpg': req.body.autolpg,
                })
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };


    const updateTodayFuel = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            let val = await r.table('today_fuel')
                .get(req.body.record)
                .update({
                    'petrol': req.body.petrol,
                    'diesel': req.body.diesel,
                    'autolpg': req.body.autolpg,
                })
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };

    const formattedDateTime = (timestamp, r) => {
        return r.time(year, timestamp.getMonth() + 1, timestamp.getDate(), getHours(timestamp), getMinutes(timestamp), getSeconds(timestamp), timezone)
    };

    return {
        getTodayFuel,
        addTodayFuel,
        updateTodayFuel
    }

};

module.exports = FuelController;
