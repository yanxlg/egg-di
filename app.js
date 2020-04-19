'use strict';
const Factory = require('./lib').Factory;

module.exports = app => {
  console.log('init egg-di');
  new Factory(app);
};
