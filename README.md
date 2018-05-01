# Populate

With **Populate** you will be able to easily populate your databases before tests.

## Supported Databases

- MySQL

## HOW-TO

```
$ npm install --save-dev node_populate
```

On your test file (I'll be using Jasmine for this example):

```
const Populate = require('populate');

const populate = new Populate({
    db: 'mysql',
    dbOptions: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'mysql',
        database: 'your_db'
    }
});


describe('My Test', function () {

    beforeAll(function (done) {
        // Load database schema
        populate.execFile('schema.sql')
            .then(done)
            .catch(done.fail);
    });

    it('some test', function (done) {

        populate.populate([
            {
                table: 'test_table',
                data: [
                    { id: 1, name: 'test 1' },
                    { id: 2, name: 'test 2' }
                ]
            }
        ]).then(cleanup => {

            // data has been populated.
            // you can write your tests here.

            return cleanup(); // truncate tables used
        }).then(done).catch(done.fail);

    });

});
```
