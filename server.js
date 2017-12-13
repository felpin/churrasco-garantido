require('dotenv').config();

const express = require('express');
const fs = require('fs');
const https = require('https');

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
