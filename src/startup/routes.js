const express = require('express');
const health = require('../routes/health');
const index = require('../routes/index');
const error = require('./../middleware/error');
const receiveformcore = require('../routes/receivefromcore');


module.exports = (app) => {
  app.use(express.json());
  app.use('/health', health);
  app.use('/' , index );
  app.use('/api' , receiveformcore );
  //.. add other routes here
  //..
  app.use(error);
}