/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    role: 'admin',
    name: 'Jotis Moore',
    email: 'jotis@jotis.com',
    password: 'jotis',
    events: [
      {
        title: 'Jotis Holiday',
        start: 'Mon Jan 18 2016 00:00:00 GMT+0000 (GMT)',
        end: 'Thu Jan 27 2016 00:00:00 GMT+0000 (GMT)',
        className: ["Jotis Holiday"],
        id: 1448284280084,
        stick: true,
        allDay : true,
        editable: false
      },
      {
        title: 'Jotis Day Off',
        start: 'Fri Nov 20 2015 00:00:00 GMT+0000 (GMT)',
        end: 'Sat Nov 21 2015 00:00:00 GMT+0000 (GMT)',
        className: ["Jotis Day Off"],
        id: 1448284280085,
        stick: true,
        allDay : true,
        editable: false
      }
    ],
    daysBooked: 10
  }, {
    provider: 'local',
    name: 'Matt Wyatt',
    email: 'matt@matt.com',
    password: 'matt',
    events: [
      {
        title: 'Matt Holiday',
        start: 'Fri Nov 27 2015 00:00:00 GMT+0000 (GMT)',
        end: 'Wed Dec 01 2015 00:00:00 GMT+0000 (GMT)',
        className: ["Matt Holiday"],
        id: 1448284280086,
        stick: true,
        allDay : true,
        editable: false
      }
    ],
    daysBooked: 4
  }, {
    provider: 'local',
    name: 'Magdalena Mosakowska',
    email: 'magdalena@magdalena.com',
    password: 'magdalena',
    events: [
      {
        title: 'Magdalena Holiday',
        start: 'Mon Dec 21 2015 00:00:00 GMT+0000 (GMT)',
        end: 'Tue Jan 05 2016 00:00:00 GMT+0000 (GMT)',
        className: ["Magdalena Holiday"],
        id: 1448284280087,
        stick: true,
        allDay : true,
        editable: false
      }
    ],
    daysBooked: 15
    }, {
    provider: 'local',
    name: 'Edem Vormawah',
    email: 'edem@edem.com',
    password: 'edem',
    events: [
      {
        title: 'Edem Holiday',
        start: 'Wed Dec 30 2015 00:00:00 GMT+0000 (GMT)',
        end: 'Thu Jan 14 2016 00:00:00 GMT+0000 (GMT)',
        className: ["Edem Holiday"],
        id: 1448284280088,
        stick: true,
        allDay : true,
        editable: false
      }
    ],
    daysBooked: 15
    }, function() {
      console.log('finished populating users');
    }
  );
});
