const express = require('express');
const videosServices = require('./modules/videos/services')

const routes = new express.Router();

routes.post('/video', async (req, res) => {
  const { url, cutlabsId } = req.body;  
  await videosServices.create({ url, cutlabsId });

  res.status(202);
});

module.exports = routes;
