const express = require('express');
const router = express.Router();
const choreTrackerUserController = require('../db/controllers').chores_tracker_user;
const authHelpers = require('../auth/_helpers');

const passport = require('../auth/passport-local');

router.post('/register', authHelpers.loginRedirect, (req, res, next)  => {
  return choreTrackerUserController.create(req, res)
  .then((response) => {
    passport.authenticate('local', (err, user, info) => {
      if (user) { handleResponse(res, 200, 'success'); }
    })(req, res, next);
  })
  .catch((err) => { handleResponse(res, 500, 'error'); });
});

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { handleResponse(res, 500, 'error'); }
    if (!user) { handleResponse(res, 404, 'User not found'); }
    if (user) {
      req.logIn(user, function (err) {
        if (err) { handleResponse(res, 500, 'error'); }
        handleResponse(res, 200, 'success');
      });
    }
  })(req, res, next);
});

router.get('/logout', authHelpers.loginRequired, (req, res, next) => {
  req.logout();
  handleResponse(res, 200, 'success');
});

router.get('/user', authHelpers.loginRequired, (req, res, next)  => {
  handleResponse(res, 200, 'success');
});

module.exports = router;