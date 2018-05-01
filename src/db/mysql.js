const DbFacade = require('./dbFacade');

const {promisify} = require('util');

const mysql = require('mysql');

class MySQL extends DbFacade {

    constructor(options) {
        super(options);
    }

    getDefaultOptions() {
        return {
            host: process.env.MYSQL_HOST || '127.0.0.1',
            port: process.env.MYSQL_PORT || 3306,
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'mysql',
            database: process.env.MYSQL_DATABASE || 'root'
        };
    }

    async getConnection() {
        let conn = mysql.createConnection({
            host     : this._options.host,
            port     : this._options.port,
            user     : this._options.user,
            password : this._options.password,
            database : this._options.database
        });

        let connect = promisify(conn.connect).bind(conn);
        await connect();
        return conn;
    }

    async close(conn) {
        let end = promisify(conn.end).bind(conn);
        return await end();
    }

    async query(conn, sql, params) {
        let query = promisify(conn.query).bind(conn);
        return await query(sql, params);
    }
}

module.exports = MySQL;
