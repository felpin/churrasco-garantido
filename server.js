require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const router = require('./routes/router');

const mongooseOptions = {
  keepAlive: true,
  useMongoClient: true,
};

mongoose.connect(process.env.DB_CONNECTION_STRING, mongooseOptions);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'There was an error connecting to the database:'));
db.once('open', whenDatabaseConnectionOpens);

function whenDatabaseConnectionOpens() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());
  app.use('/', router);

  const httpsOptions = {
    cert: fs.readFileSync(process.env.SERVER_SSL_CRT),
    key: fs.readFileSync(process.env.SERVER_SSL_KEY),
  };

  const PORT = process.env.SERVER_PORT || 3000;

  https
    .createServer(httpsOptions, app)
    .listen(PORT, () => {
      console.log(`***** LISTENING ON PORT ${PORT} *****`);
    });
}
