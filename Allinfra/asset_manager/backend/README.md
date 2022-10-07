## Prerequisites

1. Install ```NodeJS```.
2. Install  ```npm```.
3. Install ```mongodb```.

## Running the app

1. Create a *mongodb* database
2. Go to ```/asset_manager/backend/ormconfig.json``` and change the *user*, *password*, *host*, *database name* according to what you have on you system.
3. Open the mongodb database with the following command: ```mongod --dbpath [path_to_db_directory] --logpath [path_to_log_file]```. 
   * example: ```mongod --dbpath data --logpath logs/mongo.log```.
4. Now you can go to ```/asset_manager/backend``` and run ```npm install```.
5. Now that API should be ready to use. Run ```npm run start:dev``` .
6. Go to ```http://localhost:3001/api``` to check the API description.

## Stay in touch

- Author - [Alex Barbu](https://www.linkedin.com/in/alexbarbu/)

## License

Nest is [MIT licensed](LICENSE).
