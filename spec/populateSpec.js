const path = require('path');
const Populate = require('../src/populate');

const MySQL = require('../src/db/mysql');

describe('Populate', function () {

    it('All In One Test with MySQL', $(async function () {
        let populate = new Populate({
            db: 'mysql'
        });

        let cleanup, results;

        let mysql = new MySQL();

        let conn = await mysql.getConnection();
        try {

            await populate.execFile(path.join(__dirname, 'support', 'schema.sql'));

            results = await mysql.query(conn, 'SELECT * FROM test');
            expect(results.length).toBe(0);

            cleanup = await populate.fromFile(path.join(__dirname, 'support', 'data.json'));

            results = await mysql.query(conn, 'SELECT * FROM test ORDER BY id');
            expect(JSON.parse(JSON.stringify(results))).toEqual([
                { id: 1, description: 'test 1' },
                { id: 2, description: 'test 2' }
            ]);

        } finally {
            if (cleanup) {
                await cleanup();

                results = await mysql.query(conn, 'SELECT * FROM test');
                expect(results.length).toBe(0);
            }
            await mysql.close(conn);
        }

        // test that table is empty again
    }));

});

function $(runAsync) {
    return done => {
        runAsync().then(done, e => { done.fail(e); });
    };
}
