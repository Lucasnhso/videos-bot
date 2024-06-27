require('dotenv').config();
const express = require('express');
const cors = require('cors');
const youtubeScrapper = require('./src/modules/youtube/scrapper');
const routes = require('./src/routes');
const port = 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(port, async () => {
  console.log(`Server started on port ${port}`);

  // await youtubeScrapper.execute('uploadVideo');
})

module.exports = app;
