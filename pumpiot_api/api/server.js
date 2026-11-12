// Package
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cfenv = require('cfenv');
const express = require('express');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');
const r = require('rethinkdb');

// Modules
const publicRoutes = require('./routes');
const config = require('./config');
const DatabaseController = require('./controllers/databaseController');
const SocketController = require('./controllers/SocketController');

// Configurations
const appEnv = cfenv.getAppEnv();
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// adding Helmet to enhance your API's security
app.use(helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
}));

// enabling CORS for all requests
app.use(cors({
    credentials: true,
    origin: [
        "*",
        "http://localhost:5000",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5001",
        "http://localhost:28015",
        "http://localhost:80"
    ]
}));

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// set body parser for form data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


const mappedOpenRoutes = mapRoutes(publicRoutes, 'controllers/');
app.use('/api', mappedOpenRoutes);


const databaseController = new DatabaseController();

(function (app) {
    r.connect(config.rethinkdb, (err, conn) => {
        if (err) {
            console.log('Could not open a connection to initialize the database: ' + err.message);
        } else {
            console.log('Database Connected.');

            // set connection name
            app.set('rethinkdb.conn', conn);

            // Create table if not exist
            databaseController.createDatabase(conn, config.rethinkdb.db)
                .then(() => {
                    databaseController.createTable(conn, 'today_fuel');
                    databaseController.createTable(conn, 'employees');
                    databaseController.createTable(conn, 'shifts');
                    databaseController.createTable(conn, 'shift_history');
                    databaseController.createTable(conn, 'trx');
                    databaseController.createTable(conn, 'stock_tt');
                    databaseController.createTable(conn, 'settings');
                    databaseController.createTable(conn, 'oil');
                    databaseController.createTable(conn, 'stock');
                    databaseController.createTable(conn, 'fav');
                    databaseController.createTable(conn, 'new_summary_date');
                    databaseController.createTable(conn, 'new_summary_shift');
                })
                .catch((err) => {
                    console.log('Error creating database and/or table: ' + err);
                });

            // Establish Socket connection
            SocketController.trxConnection(conn)
                .then((cursor) => {
                    io.sockets.on('connection', function (socket) {
                        cursor.each(function (err, row) {
                            if (err) throw err;
                            io.sockets.emit('trx', row);
                        });
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    });
})(app);


// get the app environment from Cloud Foundry
const port = process.env.PORT || (appEnv.isLocal ? 5001 : appEnv.port);
const hostname = appEnv.isLocal ? '0.0.0.0' : appEnv.bind;

http.listen(port, hostname, () => {
    console.log(`Server started on ${hostname}:${port}.`)
});
