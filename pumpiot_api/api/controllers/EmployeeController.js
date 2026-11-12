'use strict';

const r = require('rethinkdb');
const ReplaceDate = require("../functions/replaceDate");

const EmployeeController = () => {

    const getEmployees = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');

            let val = await r.table('employees').orderBy('id', 'asc')
                .run(conn);

            return res.status(200).json(val);

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };

    const addEmployee = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let {body} = req;

            let val = await r.table('employees')
                .insert({
                    'created_at': new Date(),
                    'updated_at': new Date(),
                    'id': body.id,
                    'name': body.name,
                    'sex': body.sex || "male",
                    'phone': body.phone || "9898989898",
                })
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error - Error: x302'});
        }
    };

    const updateEmployee = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let {body} = req;

            let val = await r.table('employees')
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

    const deleteEmployee = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let {body} = req;
            let val = await r.table('employees')
                .get(body.id)
                .delete()
                .run(conn);

            let stringData = JSON.stringify(val);

            return res.status(200).json(JSON.parse(ReplaceDate(stringData)));

        } catch (err) {
            console.log(err);
            return res.status(500).json({error: 'Internal server error - Error: x303'});
        }
    };

    return {
        getEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee
    }

};

module.exports = EmployeeController;
