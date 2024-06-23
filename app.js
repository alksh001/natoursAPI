const express = require('express');
const morgan = require('morgan')
const route = require('./routes')


const app = express();
app.use(morgan('dev'))
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours',route)


module.exports = app