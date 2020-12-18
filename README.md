# Solo React Project

This is the backend for the Solo React project.

## Getting started

1. Clone this repository
2. Install dependencies (`npm install`)
3. Create a **.env** file based on the example with proper settings for your
   development environment
4. Setup your PostgreSQL user, password and database and make sure it matches your **.env** file with CREATEDB privileges

5. Run
   * `npm run db:create`
   * `npm run db:migrate`
   * `npm run db:seed:all`
   * `npm start`

## Deploy to Heroku

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line)
2. Run `$ heroku login`
3. Run `$ heroku apps:create <name of app>`
4. Run `$ heroku addons:create heroku-postgresql`
5. Run `$ heroku config:set NODE_ENV=production`
6. Run `$ heroku container:push web`
7. Run `$ heroku container:release web`
8. Connect to the heroku shell and prepare your database

```bash
  $ heroku run bash
  $ npx sequelize-cli db:migrate
  $ npx sequelize-cli db:seed:all
```

(You can interact with your database this way as youd like, but beware that `db:drop` should not be run in the heroku environment)

## How to drop the heroku database and recreate it.

```bash
$ heroku pg:reset
```
