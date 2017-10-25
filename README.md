# Gaia Migrate Demo
## Gaia Migrate will be a client library for adding migration scripts to your Gaia NoSQL stores

## NOTE:
I'm still building this. As of now, the module folder is simply in the `src` directory.
The guts of the library live in [src/gaia-migrate/index.js](src/gaia-migrate/index.js) for now.

## Installing and running the App
To install modules, run `yarn install`.
To start the application, run `yarn start`.

## The Basic Idea of Gaia Migrate
* Creates a gaia-migrate.json file in your gaia storage that contains a `lastUpdated` MS timestamp.
* There is a `migrations` folder in your app that holds individual migration files named `migration_{{ MS TIMESTAMP}}.js`.
* In those migration files is a function that allows you to define how data models have changed in your application.
* Import all the migration files into an index file in `migrations/` so they are all accessible via one object. For example: `import * as migrations from './migrations'`.
* Import your migrations and `gaiaMigrate` into a root component of your app.
* Perform `gaiaMigrate.checkForUpdates(migrations)` in `componentWillMount()`, after confirming the user is signed in with Blockstack.
* Gaia Migrate will filter for migrations that were added since `lastUpdated`'s value.
* It then runs each of the migration files on whichever files of data were affected.

More information to come!
