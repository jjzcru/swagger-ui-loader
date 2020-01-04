const open = require('open');
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = 3000
 
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, async () => {
    try {
        console.log(`Swagger UI Server listening on port ${port}!`)
        await open(`http://localhost:${port}`);
    } catch(e) {
        console.error(e);
    }
})