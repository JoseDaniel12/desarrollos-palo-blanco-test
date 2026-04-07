require('dotenv').config();
const mysqlConnection = require('./database/mySqlConnection');

// IMPORTS
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('../src/routes/index.routes');

// VARIABLES
const corsOptions = { origin: true, optionSuccessStatus: 200 };

// APLICACION
const app = express();

// MIDLEWARES
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// RUTAS
app.get('/', async (_, res) => {
    return res.status(200).json({ msg: 'Desarrollos Palo Blanco - José Alvarado.' });
});

app.use('/', routes);

module.exports = app;