# Solo React Project

This is the backend for the Solo React project.

## Getting started

1. Clone this repository
2. Install dependencies (`npm install`)
3. Create a **.env** file based on the example with proper settings for your
   development environment
4. Setup your PostgreSQL user, password and database and make sure it matches 
   your **.env** file with CREATEDB privileges

5. Run
   * `npm run db:create`
   * `npm run db:migrate`
   * `npm run db:seed:all`
   * `npm start`

## Deploy to Heroku

1. Create a new project
2. Under Resources click "Find more add-ons" and add the add on called "Heroku 
   Postgres"
3. Install the [Heroku CLI]
4. Run `$ heroku login`
5. Add Heroku as a remote to this git repo `$ heroku git:remote -a <project_name>`
6. Push the project to Heroku `$ git push heroku master`
7. Connect to the Heroku shell and prepare your database

   ```bash
      $ heroku run bash
      $ sequelize-cli db:migrate
      $ sequelize-cli db:seed:all
   ```

   (You can interact with your database this way as you'd like, but beware that 
   `db:drop` should not be run in the Heroku environment. If you want to drop 
   and create the database, you need to remove and add back the "Heroku 
   Postgres" add-on.)

8. Add environment variables on the Heroku environment using the Heroku 
   dashboard. [Setting Heroku Config Vars]

[Heroku CLI]: https://devcenter.heroku.com/articles/heroku-command-line
[Setting Heroku Config Variables]: https://devcenter.heroku.com/articles/config-vars