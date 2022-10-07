# UBIO BACKEND TASK

### Introduction

The API is not really production-ready, but I consider it a good PoC and with just a few tweaks it could be production-ready.

### What else I'd improve?

1. Catch more granular errors.
2. Write more unit tests for both happy/unhappy paths. I didn't test individual methods and classes due to time constraints.
3. Add comments on all methods to describe what they do and how to work with them.
4. Improve Typescript annotations.

### Usage

#### Prerequisites

1. NodeJS v17
2. MongoDB

#### Steps to run the API

1. Go to main directory
2. Run `npm ci`
3. Run `npm run server` (it will run 3 scripts in parallel: `build:dev`, `start:dev` and `task`) 
   * `build:dev` - compiles & tracks for changes to .ts files
   * `start:dev` - start the server in development mode
   * `task` - runs the script that continuously removes instances that passed the expiration time set under an environment variable called `INSTANCE_EXPIRATION_DATE_SEC`.
4. Test the endpoints as described here https://github.com/ubio/technical-challenges/tree/main/backend#endpoints
