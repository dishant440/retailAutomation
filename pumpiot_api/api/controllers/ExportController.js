const fs = require('fs');
const r = require('rethinkdb');

const ExportController = () => {

    const exportToFile = async (req, res) => {
        try {

            let conn = req.app.get('rethinkdb.conn');
            let file = __dirname + '/../stock.json';

            const cursor = await r.table('stock').run(conn);
            const data = cursor.toArray();

            await fs.writeFile(file, data, function (err) {

                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });

            return res.status(200).json("File saved");

        } catch (err) {
            console.log("x301 error", err);
            return res.status(500).json({error: err});
        }
    };

    return {
        exportToFile
    }

};

module.exports = ExportController;