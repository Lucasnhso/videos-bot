require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const postsServices = require('./src/modules/posts/services');
const prismaClient = require('./src/database/prismaClient');
const GptClient = require('./src/providers/gpt/client');
const logger = require('./src/utils/logger');
const port = 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(port, async () => {
  logger.info(`Server started on port ${port}`);

  const publishes = [
    // new Date().setHours(11, 58),
    // new Date().setHours(14, 58),
    // new Date().setHours(16, 58),
    // new Date().setHours(18, 58),
    new Date('2024-07-02 14:58:00')
  ];

  // for(const publishAt of publishes) {
  //   await postsServices.create(['youtube'], new Date(publishAt))
  // }
})

module.exports = app;
