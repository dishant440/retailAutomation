'use strict';

const r = require('rethinkdb');

const getHours = require('date-fns/getHours');
const getMinutes = require('date-fns/getMinutes');
const getSeconds = require('date-fns/getSeconds');
const ReplaceDate = require("../functions/replaceDate");
const {timezone} = require('../config');

const FavController = () => {

    const getFavs = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            let cursor = await r.table('fav')
                .filter(r.row("user").eq(parseInt(req.query.user)))
                .limit(1)
                .run(conn);

            let val = await cursor.toArray();

            if (val.length > 0) {
                let stringData = JSON.stringify(val[0]);
                return res.status(200).json(JSON.parse(ReplaceDate(stringData)));
            } else {
                return res.status(200).json([]);
            }

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };

    const addFavs = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            console.log(req.body)

            let val = await r.table('fav')
                .insert(req.body)
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };


    const updateFav = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            let val = await r.table('fav')
                .get(req.body.id)
                .update(req.body)
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };

    const formattedDateTime = (timestamp, r) => {
        return r.time(timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate(), getHours(timestamp), getMinutes(timestamp), getSeconds(timestamp), timezone)
    };

    return {
        getFavs,
        addFavs,
        updateFav
    }

};

module.exports = FavController;
