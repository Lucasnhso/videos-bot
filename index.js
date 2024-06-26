require('dotenv').config();
const express = require('express');
const cors = require('cors');
const videosServices = require('./src/modules/videos/services')
const port = 3333;

const app = express();

app.use(express.json());
app.use(cors());

app.post('/video', async (req, res) => {
  const { url, cutlabsId } = req.body;  
  await videosServices.create({ url, cutlabsId });

  res.status(202);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
