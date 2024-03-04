const express = require('express');
const route = express.Router();

route.use('/', require('./userRoute'));
route.use('/', require('./profileRoute'));
route.use('/', require('./postRoute'));

module.exports = route;