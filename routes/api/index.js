const router = require('express').Router();

// Whenever you create a file in the /routes/api folder, add a string 
// corresponding to the name of the file to this array.
// Then this file will automatically add that file from this folder to the api
// routes.
const routes = ['users', 'session', 'csrf'];

for (let route of routes) {
  router.use(`/${route}`, require(`./${route}`));
}

module.exports = router;
