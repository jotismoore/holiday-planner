'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Events - add Event
 */
exports.updateEvents = function(req, res) {
  var userId = req.user._id;
  var newEvent = req.body.newEvent;
  var oldEventId = [];
  if (req.body.oldEventId !== undefined) {
    oldEventId.push(req.body.oldEventId);
  }

  function isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  }

  User.findById(userId, function (err, user) {

    if(!isEmpty(oldEventId)) {
      var chosenEvent;

      for(var i = 0; i < user.events.length; i++) {

        if(oldEventId.indexOf(user.events[i].id) !== -1) {

          if(newEvent !== null) {
            chosenEvent = user.events[i];
            user.events.splice(i, 1);
            chosenEvent.title = newEvent.title;
            chosenEvent.start = newEvent.start;
            chosenEvent.end = newEvent.end;
          }
          else {
            user.events.splice(i, 1);
          }
        }
      }
      if(chosenEvent) {
        user.events.push(chosenEvent);
      }
    }
    else if(newEvent !== null) {
      user.events.push(newEvent);
    }

    user.save(function(err) {
      if (err) return validationError(res, err);
      res.status(200).send('OK');
    });
  });
};

/**
 * Change a users days holiday booked
 */
exports.updateDays = function(req, res) {
  var userId = req.user._id;
  var daysBooked = req.body.daysBooked;

  User.findById(userId, function (err, user) {
    if(daysBooked >= 0) {
      user.daysBooked = user.daysBooked + daysBooked;
    }
    else if(daysBooked < 0){
      user.daysBooked = user.daysBooked - Math.abs(daysBooked);
    }
    user.save(function(err) {
      if (err) return validationError(res, err);
      res.status(200).send('OK');
    });
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
