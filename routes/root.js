const express = require('express');
const route = express.Router();

route.use('/', require('./userRoute'));
route.use('/', require('./profileRoute'));

module.exports = route;