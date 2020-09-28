const express = require('express');
const router = express.Router();

// In development, the frontend and backend servers are separate so we need to
// have a route to add the CSRF token cookie to the frontend only in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/token', function (req, res) {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.json({
      message: 'success'
    });
  });
}


module.exports = router;