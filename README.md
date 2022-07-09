# GitHub Triager

## System prerequisites

* [Node.js](https://nodejs.org/en/) - v.16 is currently in use (check `.nvmrc` for the current version)
    * (optional) [nvm](https://github.com/nvm-sh/nvm) - you can use `nvm` to automatically pick-up the Node version you
      need
    * (optional) to setup `nvm` to automatically use the version specified in `.nvmrc`, follow
      this [guide](https://github.com/nvm-sh/nvm#deeper-shell-integration)
* [yarn](https://classic.yarnpkg.com/en/) - tested with 1.22.19

## Setup

### `yarn`

* Simply run `yarn` to install/update dependencies defined in package.json.

## Code health related scripts

### `yarn lint`

* Rewrites all processed files in place accordingly to Prettier formatting settings, checks if all files are formatted,
  automatically fixes eslint problems, and finally invokes TypeScript compiler.

## Run

Please provide the environment variables required for application to operate by using the `.env` file or passing them via CLI.  
See example in [`.env-example`](./.env-example).

### `yarn triage`

* Executes the `index.ts` script.
