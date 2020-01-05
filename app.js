const fs = require('fs');
const path = require('path');

const open = require('open');
const express = require('express');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const port = getPort();
const swaggerFile = getTargetFile();

let swaggerDocument;
switch(swaggerFile.ext) {
    case '.yaml':
    case '.yml':
        swaggerDocument = YAML.load(swaggerFile.file); 
        break;
    default:
        swaggerDocument = require(swaggerFile.file); 
}

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, async () => {
    try {
        getTargetFile() 
        console.log(`Swagger UI Server listening on port ${port}`)
        await open(`http://localhost:${port}`);
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

    // The file is set in the configuration file
    if(!!filePath && fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        switch(ext) {
            case '.yml':
            case '.yaml':
            case '.json':
                return {
                    file: filePath,
                    ext: ext
                }
            default: 
            throw new Error(`File extension '${ext}' is not valid`);
        }
    }

    // I search for 'swagger.yml', 'swagger.yaml' or 'swagger.json' as default value

    throw new Error(`Swagger configuration file '${filePath}' do not exist`)
}

function getFileFromPkg() {
    if(fs.existsSync('./package.json')) {
        const pkg = require('./package.json');
        if(!!pkg.swagger && !!pkg.swagger.file) {
            return pkg.swagger.file;
        }
    }
    return null;
}