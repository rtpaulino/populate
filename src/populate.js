const _ = require('lodash');
const fs = require('fs');

const {promisify} = require('util');

const readFile = promisify(fs.readFile);

const readJson = async function (filename) {
    let content = await readFile(filename, { encoding: 'utf-8' });
    return JSON.parse(content);
}

class Populate {

    constructor(options) {
        _.bindAll(this, 'populate', 'fromFile', 'cleanup', '_cleanup', 'exec',
            'execFile');

        this._options = _.pick(options, 'db', 'dbOptions');

        let Db = require(`./db/${options.db}`);
        this._db = new Db(options.dbOptions);
    }

    async _cleanup(conn, data) {
        for (let i = data.length - 1; i >= 0; i--) {
            await this._db.truncate(conn, data[i].table);
        }
    }

    async fromFile(filename) {
        return await this.populate(await readJson(filename));
    }

    async populate(data) {
        let conn = await this._db.getConnection();

        try {
            await this._cleanup(conn, data);

            for (let d of data) {
                this._db.insert(conn, d.table, d.data);
            }
        } finally {
            await this._db.close(conn);
        }

        return async () => {
            this.cleanup(data);
        };
    }

    async cleanup(data) {
        let conn = await this._db.getConnection();
        try {
            await this._cleanup(conn, data);
        } finally {
            await this._db.close(conn);
        }
    }

    async execFile(sqlFile) {
        return await this.exec(await readFile(sqlFile, { encoding: 'utf8' }));
    }
    async exec(sql) {
        let conn = await this._db.getConnection();
        try {
            let statements = sql.split(';\n').map(s => s.trim()).filter(s => s);
            for (let sql of statements) {
                await this._db.query(conn, sql);
            }
        } finally {
            await this._db.close(conn);
        }
    }

}

module.exports = Populate;
