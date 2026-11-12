'use strict';

const r = require('rethinkdb');
const csv = require('csvtojson');
const csvFilePath = __dirname + './../../../_Other_documents/data';

const getHours = require('date-fns/getHours');
const getMinutes = require('date-fns/getMinutes');
const getSeconds = require('date-fns/getSeconds');
const {timezone} = require('../config');
const _ = require('lodash');
const {year} = require("../config");

const ImportController = () => {

    // new summary date & shift
    const importFromCsv = async (req, res) => {

        // return;

        try {

            const dateArray = await csv().fromFile(csvFilePath + "/20-11/day_new_summary.csv");
            const shiftArray = await csv().fromFile(csvFilePath + "/20-11/shift_new_summary.csv");

            let conn = req.app.get('rethinkdb.conn');

            // delete previous records
            await r.table('new_summary_date').delete().run(conn);
            await r.table('new_summary_shift').delete().run(conn);

            // Prepare and insert
            let dateToInsert = await dateArray.map((v) => {
                return {
                    created_at: formattedDateTime(new Date(v.date), r),
                    date: v.date,
                    product: v.product,
                    amt: parseInt(v.amt),
                    qty: parseInt(v.qty),
                    tot_open: parseInt(v.tot_open),
                    tot_close: parseInt(v.tot_close),
                    no_of_trx: parseInt(v.no_of_trx),
                    cash: parseInt(v.cash),
                    credit: parseInt(v.credit),
                    loyalty: parseInt(v.loyalty),
                    fleet: parseInt(v.fleet),
                    avg_sales: parseInt(v.avg_sales),
                    ust_open: parseInt(v.ust_open),
                    ust_close: parseInt(v.ust_close)
                };
            });

            let shiftToInsert = await shiftArray.map((v) => {
                return {
                    created_at: formattedDateTime(new Date(v.date), r),
                    date: v.date,
                    product: v.product,
                    shift_id: v.shift_id,
                    amt: parseInt(v.amt),
                    qty: parseInt(v.qty),
                    tot_open: parseInt(v.tot_open),
                    tot_close: parseInt(v.tot_close),
                    no_of_trx: parseInt(v.no_of_trx),
                    cash: parseInt(v.cash),
                    credit: parseInt(v.credit),
                    loyalty: parseInt(v.loyalty),
                    fleet: parseInt(v.fleet),
                    avg_sales: parseInt(v.avg_sales)
                };
            });

            await r.table('new_summary_date').insert(dateToInsert).run(conn);
            await r.table('new_summary_shift').insert(shiftToInsert).run(conn);

            return res.status(200).json({
                dateToInsert,
                shiftToInsert
            });

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };


    // For importing Price /data/6-10/oil.csv

    // const importFromCsv = async (req, res) => {
    //
    //     return;
    //
    //     try {
    //
    //         const arr = await csv().fromFile(csvFilePath + "/price_list_final.csv");
    //
    //         const grouped = _.map(_.groupBy(arr, 'date'), clist => clist.map(rec => {
    //             if(rec.product === 'ALPG'){
    //                 rec.autolpg_a = rec.automatic === 'Yes';
    //                 rec.autolpg = parseFloat(rec.price);
    //             }
    //             if(rec.product === 'HSD'){
    //                 rec.diesel_a = rec.automatic === 'Yes';
    //                 rec.diesel = parseFloat(rec.price);
    //             }
    //             if(rec.product === 'MS'){
    //                 rec.petrol_a = rec.automatic === 'Yes';
    //                 rec.petrol = parseFloat(rec.price);
    //             }
    //             rec = _.omit(rec, 'product');
    //             rec = _.omit(rec, 'price');
    //             rec = _.omit(rec, 'trx_id');
    //
    //             rec.automatic = rec.automatic === 'Yes';
    //             rec.date = formattedDateTime(new Date(rec.date + " " + rec.time), r);
    //             return rec;
    //         }));
    //
    //         const dataToInsert = grouped.map(v => {
    //             return v.reduce(function(result, current) {
    //                 return Object.assign(result, current);
    //             }, {});
    //         });
    //
    //         let conn = req.app.get('rethinkdb.conn');
    //
    //         await r.table('today_fuel').insert(dataToInsert).run(conn);
    //
    //         return res.status(200).json(dataToInsert);
    //
    //     } catch (err) {
    //         console.log("x301 error", err);
    //         return res.status(500).json({error: err});
    //     }
    // };


    // not required
    // const importFromCsv = async (req, res) => {
    //
    //     //return;
    //
    //     try {
    //
    //         await r.table('lube_grn').delete();
    //
    //         const mergedFuleArray = await csv().fromFile(csvFilePath + "/lube_grn.csv");
    //
    //         let conn = req.app.get('rethinkdb.conn');
    //
    //         let dataToInsert = await mergedFuleArray.map((v) => {
    //             return {
    //                 id: v.id,
    //                 created_at: formattedDateTime(new Date(v.date), r),
    //                 date: v.date,
    //                 lube_type: v.lube_type,
    //                 refill_quantity: parseFloat(v.refill_quantity)
    //             };
    //         });
    //
    //         await r.table('lube_grn').insert(dataToInsert).run(conn);
    //
    //         return res.status(200).json(dataToInsert);
    //
    //     } catch (err) {
    //         console.log("x301 error", err);
    //         return res.status(500).json({error: err});
    //     }
    // };


    // For importing /data/6-10/oil.csv

    // const importFromCsv = async (req, res) => {
    //
    //     return;
    //
    //     try {
    //
    //
    //         const mergedFuleArray = await csv().fromFile(csvFilePath + "/lube_sales.csv");
    //
    //         let conn = req.app.get('rethinkdb.conn');
    //         await r.table('oil').delete().run(conn);
    //
    //         let dataToInsert = await mergedFuleArray.map((v) => {
    //             return {
    //                 created_at: formattedDateTime(new Date(v.date), r),
    //                 date: v.date,
    //                 opening_stock: parseFloat(v.opening),
    //                 closing_stock: parseInt(v.closing),
    //                 qty_delivered: parseFloat(v.sale_qty),
    //                 product: v.type_formatted,
    //                 refill_type: parseInt(v.refill_type !== '' ? v.refill_type : 0),
    //                 refill_qty: parseInt(v.refill_qty !== '' ? v.refill_qty : 0),
    //             };
    //         });
    //
    //         await r.table('oil').insert(dataToInsert).run(conn);
    //
    //         return res.status(200).json(dataToInsert);
    //
    //     } catch (err) {
    //         console.log("x301 error", err);
    //         return res.status(500).json({error: err});
    //     }
    // };


    // For importing for importing petrol.csv, diesel.csv and alpg.csv from /data/06-10 directory

    // const importFromCsv = async (req, res) => {
    //
    //     return;
    //
    //     try {
    //
    //         const mergedFuleArray = await csv().fromFile(csvFilePath + "/combined_stock.csv");
    //
    //         let conn = req.app.get('rethinkdb.conn');
    //
    //         let dataToInsert = await mergedFuleArray.map((v, k) => {
    //             if(parseInt(v.net_sales) !== 0) {
    //                 return {
    //                     id: k,
    //                     product: v.product,
    //                     created_at: formattedDateTime(new Date(v.date), r),
    //                     opening_qty: parseFloat(v.qty),
    //                     opening_amt: parseFloat(v.amt),
    //                     atg_reading: parseFloat(v.atg_reading), // = opening_stock
    //                     mop: v.mop,
    //                     pumpTest: parseFloat(v.pump_test),
    //                     ownUse: parseFloat(v.own_use),
    //                     tt_filled: parseFloat(v.tt_filled),
    //                     net_sales: parseFloat(v.net_sales),
    //                     opening_stock: parseFloat(v.opening_stock),
    //                     closing_stock: parseFloat(v.closing_stock),
    //                     closing_qty: parseFloat(v.closing_qty),
    //                     closing_amt: parseFloat(v.closing_amt),
    //                 };
    //             }
    //         });
    //
    //         // await dataToInsert.sort((a, b) => a.id - b.id);
    //         dataToInsert = await dataToInsert.filter(v => v);
    //
    //         //await r.table('stock').delete();
    //         let inserted = await r.table('stock').insert(dataToInsert).run(conn);
    //
    //         return res.status(200).json(inserted);
    //
    //     } catch (err) {
    //         console.log("x301 error", err);
    //         return res.status(500).json({error: err});
    //     }
    // };


    // for importing petroltt.csv from /data directory

    // const importFromCsv = async (req, res) => {
    //
    //     return;
    //
    //     try {
    //
    //         const mergedFuleArray = await csv().fromFile(csvFilePath + "/petroltt.csv");
    //
    //         let conn = req.app.get('rethinkdb.conn');
    //
    //         let returnVal = await mergedFuleArray.map((v) => {
    //             let i = {
    //                 invoice_no: parseInt(v.invoice_no),
    //                 registraition_no: v.registraition_no,
    //                 transporter_name: v.transporter_name,
    //                 transporter_Code: v.transporter_Code,
    //                 invoice_date: new Date(v.invoice_date),
    //                 arrival_at: formattedDateTime(new Date(v.arrival_at), r),
    //                 decantation_started: formattedDateTime(new Date(v.decantation_started), r),
    //                 decantation_completed: formattedDateTime(new Date(v.decantation_completed), r),
    //                 released_time: formattedDateTime(new Date(v.released_time), r),
    //                 delay_interruption_from: v.delay_interruption_from,
    //                 delay_interruption_to: v.delay_interruption_to,
    //                 time_lost: v.time_lost,
    //                 delay_reason: v.delay_reason,
    //                 created_at: formattedDateTime(new Date(v.arrival_at), r),
    //             };
    //             return r.table('stock_tt').insert(i).run(conn);
    //         });
    //
    //         return res.status(200).json(returnVal);
    //
    //     } catch (err) {
    //         console.log("x301 error", err);
    //         return res.status(500).json({error: err});
    //     }
    // };


    // for importing newmaster.csv file from /data/29-9 directory

    // const importFromCsv = async (req, res) => {
    //     try {
    //         //return; //safety!!
    //
    //
    //         const mergedFuleArray = await csv().fromFile(csvFilePath + "/combined_final.csv");
    //
    //         let conn = req.app.get('rethinkdb.conn');
    //
    //         let returnVal = await mergedFuleArray.map((v) => {
    //             let timestamp = new Date(v.date + " " + v.time);
    //             let i = {
    //                 product: v.product,
    //                 qty: parseFloat(v.qty),
    //                 trx_type: v.trx_type,
    //                 amt: parseFloat(v.amt),
    //                 dispatcher_id: v.dispatcher_id,
    //                 atg_reading: parseFloat(v.atg_reading),
    //                 mop: v.mop,
    //                 shift_id: v.shift_id,
    //                 pumpTest: parseFloat(v.pump_test),
    //                 ownUse: parseFloat(v.own_use),
    //                 tt_filled: parseFloat(v.tt_filled),
    //                 date: v.date,
    //                 time: v.time,
    //                 created_at: r.time(timestamp.getFullYear(), timestamp.getMonth() + 1, timestamp.getDate(), getHours(timestamp), getMinutes(timestamp), getSeconds(timestamp), timezone)
    //             };
    //             return r.table('trx').insert(i).run(conn);
    //         });
    //
    //         return res.status(200).json(returnVal);
    //
    //     } catch (err) {
    //         console.log("x301 error", err);
    //         return res.status(500).json({error: err});
    //     }
    // };


    const formattedDateTime = (timestamp, r) => {
        return r.time(year, timestamp.getMonth() + 1, timestamp.getDate(), getHours(timestamp), getMinutes(timestamp), getSeconds(timestamp), timezone)
    };


    return {
        importFromCsv
    }

};

module.exports = ImportController;
