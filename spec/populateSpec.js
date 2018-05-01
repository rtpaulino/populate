const path = require('path');
const Populate = require('../src/populate');

describe('Populate', function () {

    it('All In One Test with MySQL', $(async function () {
        let populate = new Populate({
            db: 'mysql'
        });

        await populate.execFile(path.join(__dirname, 'support', 'schema.sql'));

        // test that table is empty

        let cleanup = await populate.fromFile(path.join(__dirname, 'support', 'data.json'));

        // test that table has correct data

        await cleanup();

        // test that table is empty again
    }));

});

function $(runAsync) {
    return done => {
        runAsync().then(done, e => { done.fail(e); });
    };
}
