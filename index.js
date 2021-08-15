'use strict';

const swaggerUi = require('swagger-ui-express');
const sqlite3 = require('sqlite3').verbose();

const buildSchemas = require('./src/schemas');
const swaggerDocS = require('./src/swagger.json');

const port = 8010;

const db = new sqlite3.Database(':memory:');


db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocS));


    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});