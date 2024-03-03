const express = require('express');
const route = express.Router();

route.use('/', require('./userRoute'));

module.exports = route;