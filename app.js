const fs = require('fs');
const open = require('open');
const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const port = getPort();
const swaggerFile = getTargetFile();

const swaggerDocument = require(swaggerFile); 
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, async () => {
    try {
        getTargetFile() 
        console.log(`Swagger UI Server listening on port ${port}`)
        // await open(`http://localhost:${port}`);
    } catch(e) {
        console.error(e);
    }
});

function getPort() {
    if(fs.existsSync('./package.json')) {
        const pkg = require('./package.json');
        if(!!pkg.swagger && !!pkg.swagger.port) {
            return parseInt(pkg.swagger.port);
        }
    }

    return 5466;
}

function getTargetFile() {
    let filePath = getFileFromPkg();
    if(!!filePath && fs.existsSync(filePath)) {
        return filePath;
    }

    throw new Error(`Swagger configuration file '${filePath}' do not exist`)
}

function getFileFromPkg() {
    if(fs.existsSync('./package.json')) {
        const pkg = require('./package.json');
        if(!!pkg.swagger && !!pkg.swagger.file) {
            return pkg.swagger.file;
        }
    }
    return './swagger.json';
}