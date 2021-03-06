#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const open = require('open');
const express = require('express');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

const rootProjectPath = path.join(__dirname, '..', '..');

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
        console.log('Swagger UI Server listening on port \x1b[36m%s\x1b[0m', `${port}`);
        await open(`http://localhost:${port}`);
    } catch(e) {
        throwError(e.message);
    }
});

function getPort() {
    const pkgPath = path.join(rootProjectPath, './package.json');
    if(fs.existsSync(pkgPath)) {
        const pkg = require(pkgPath);
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
                throwError(`File extension '${ext}' is not valid`);
        }

        throwError(`Swagger configuration file '${filePath}' do not exist`);
    }

    // I search for 'swagger.yml', 'swagger.yaml' or 'swagger.json' as default value
    const defaultPath = getDefaultPath();
    if(!!defaultPath) {
        return defaultPath;
    }

    // If no file is found it throw an error
    throwError(`Swagger configuration file 'swagger.json', 'swagger.yml' or 'swagger.yaml' not found`);
}

function getFileFromPkg() {
    const pkgPath = path.join(rootProjectPath, './package.json');
    if(fs.existsSync(pkgPath)) {
        const pkg = require(pkgPath);
        if(!!pkg.swagger && !!pkg.swagger.file) {
            return path.join(rootProjectPath, pkg.swagger.file);
        }
    }
    return null;
}

function getDefaultPath() {
    const defaultFiles = [
        path.join(rootProjectPath, './swagger.json'), 
        path.join(rootProjectPath, './swagger.yml'), 
        path.join(rootProjectPath, './swagger.yaml'), 
    ];
    for(const file of defaultFiles) {
        if(fs.existsSync(file)) {
            const ext = path.extname(file);
            return {
                file: file,
                ext: ext
            }
        }
    }

    return null;
}

function throwError(message) {
    console.log('\x1b[31m%s\x1b[0m', message);
    process.exit(1);
}