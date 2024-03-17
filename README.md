# Auth
Authentication Microservice

## Install
1. Install Dependencies
```
$ npm install
```

2. Setup Environment Variables
```
$ cp .env.example .env
```

3. Seed Database
```
$ npm run seed
```

## Start server
Execute the following command:
```
$ npm start
```

## API Documentation
1. Start Server
2. Visit [localhost:3000/api/v1/documentation](http://localhost:3000/api/v1/documentation) for Swagger UI

## SDK Package
[![Node.js Package Publish](https://github.com/VR-web-shop/Auth/actions/workflows/npm-publish-github-packages.yml/badge.svg?branch=sdk-release)](https://github.com/VR-web-shop/Auth/actions/workflows/npm-publish-github-packages.yml)

### Setup
The configuration of the SDK package and deployment of SDK package includes:

* **Rollup.js:** `rollup.config.mjs` is configured to bundle all imported modules in `sdk.js` into a single file called `bundle.js` located at `/dist_sdk`.

* **Package:** `package.json` contains the following configuration:
    
    a. To ensure `bundle.js` can be accessed as `@vr-web-shop/auth` when importing it into another project, the `bundle.js` is specified using the `main` key.

    b. To ensure only files from the directory `/dist_sdk` is included in the package, the directory is specified using the `files` key.
    
    c. The key `publishConfig` has been configured to publish the package with publish access to a registry located at GitHub: [https://npm.pkg.github.com/vr-web-shop](https://npm.pkg.github.com/vr-web-shop); to specify where to publish the package, when executing `npm publish`
    
    d. A script command called `bundle_sdk` has been added that can be used to execute the rollup.js config.

    e. A script command called `deploy_sdk` has been added that be used to run the deploy process.

* **GitHub Action Workflow:** `npm-publish-github-packages.yml` is configured to trigger when a commit is pushed to the branch called `sdk-release`. When it trigger, it executes `npm run bundle_sdk` to ensure `/dist_sdk/bundle.js` is present in the repository and to ensure the latest version is deployed. Finally, the workflow pushes the package to `https://github.com/VR-web-shop/Auth/pkgs/npm/auth` where other developer's can get information about installation.

* **Deploy Script:** `sdk_deploy.sh` is configured to handle the deployment preparation and triggering of the GitHub Workflow. First, it increment the version number of `package.json` to ensure the deployed package version number does not conflict with an earlier version. Second, it commits and pushes the changes to sdk-release (to trigger the workflow) and main.

**SDK file:** `sdk.js` defines the functionality exposed in the package.

### Deploy
Execute the following command:
```
$ npm run deploy_sdk
```



