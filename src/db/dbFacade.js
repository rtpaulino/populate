const _ = require('lodash');

class DbFacade {

    constructor(options) {
        _.bindAll(this, 'getDefaultOptions', 'getConnection', 'close', 'query',
            'truncate', 'insert');

        this._options = _.merge({}, this.getDefaultOptions(), options);
    }

    getDefaultOptions() {
        return {};
    }

    async getConnection() {
        throw new Error('Not implemented');
    }

    async close(conn) {
        throw new Error('Not implemented');
    }

    async query(conn, sql, params) {
        throw new Error('Not implemented');
    }

    async truncate(conn, tableName) {
        await this.query(conn, `DELETE FROM ${tableName}`);
    }

    async insert(conn, tableName, data) {
        if (_.isArray(data)) {
            return data.map(async d => await this.insert(conn, tableName, d));
        }

        let columns = Object.keys(data);
        let sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${columns.map(c => '?').join(', ')})`;

        return await this.query(conn, sql, columns.map(c => data[c]));
    }

}

module.exports = DbFacade;
