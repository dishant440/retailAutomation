'use strict';

const r = require('rethinkdb');
const ReplaceDate = require("../functions/replaceDate");

const SettingsController = () => {

    const getSettings = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            let val = await r.table('settings').get('data').run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };

    const addOrUpdate = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            const {body} = req;

            // Get previous values
            let current = await r.table('settings').get('data').run(conn);

            console.log("current", current);
            console.log("body", body);
            let val;

            if (!current) {
                val = await r.table('settings')
                    .insert({id: 'data', ...body})
                    .run(conn);
            } else {
                let toUpdate = {...current, ...body};
                val = await r.table('settings')
                    .get('data')
                    .update(toUpdate)
                    .run(conn);
            }

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error'});
        }
    };

    return {
        getSettings,
        addOrUpdate
    }

};

module.exports = SettingsController;
