'use strict';

const r = require('rethinkdb');

class SocketController {

    static trxConnection(conn) {
        return r.table('trx').changes()
            .run(conn);
    }

}

module.exports = SocketController;
