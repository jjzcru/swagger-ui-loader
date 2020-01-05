## Installation

### Npm
```console
npm install swagger-ui-loader --save-dev 
```

### Yarn
```console
yarn add swagger-ui-loader --dev 
```

## Usage
Add a run script that executes `swagger-ui-loader`. Your `package.json` should look similar to this. Now just run `npm run swagger`.

```json
{
	"name": "i-am-your-package🤖",
	"scripts": {
		"swagger": "swagger-ui-loader"
	},
	"devDependencies": {
		"swagger-ui-loader": "^0.1.0"
	}
}
```

Be default it will search for `swagger.json`, `swagger.yml` or `swagger.yaml` on the root directory of the project and it will run a server on port `5466`.

You can add a property `swagger` to `package.json` with the following properties:

- `file`: The path on which the file with the swagger data is located.
- `port`: The port on which you want the server to run.

The `package.json` will look like this with those properties.
```json
{
	"name": "i-am-your-package🤖",
	"scripts": {
		"swagger": "swagger-ui-loader"
    },
    "swagger": {
        "file": "./docs/swagger.yml",
        "port": 8888,
    },
	"devDependencies": {
		"swagger-ui-loader": "^0.1.0"
	}
}
```

If you run `npm run swagger` it will search for the `swagger.yml` inside the `docs` directory and the server will run on port `8888`.