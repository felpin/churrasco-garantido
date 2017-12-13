require('dotenv').config();

const express = require('express');
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');

const mongooseOptions = {
  keepAlive: true,
  useMongoClient: true,
};

mongoose.connect(process.env.DB_CONNECTION_STRING, mongooseOptions);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'There was an error connecting to the database:'));
db.once('open', whenDatabaseConnectionOpens);

function whenDatabaseConnectionOpens() {
  const app = express();

  const httpsOptions = {
    cert: fs.readFileSync(process.env.SERVER_SSL_CRT),
    key: fs.readFileSync(process.env.SERVER_SSL_KEY),
  };

  const PORT = process.env.PORT || 3000;

  https
    .createServer(httpsOptions, app)
    .listen(PORT, () => {
      console.log(`***** LISTENING ON PORT ${PORT} *****`);
    });
}
