require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const postsServices = require('./src/modules/posts/services');
const port = 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(port, async () => {
  console.log(`Server started on port ${port}`);

  // await postsServices.create(['youtube'])
})

module.exports = app;
