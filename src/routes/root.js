const express = require('express');
const route = express.Router();
const path = require('path');

route.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

route.use('/', require('./userRoute'));
route.use('/', require('./profileRoute'));
route.use('/', require('./postRoute'));
route.use('/', require('./commentRoute'));
route.use('/', require('./friendshipRoute'));

module.exports = route;