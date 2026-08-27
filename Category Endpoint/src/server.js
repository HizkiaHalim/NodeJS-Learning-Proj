require("dotenv").config();
const express = require('express');

const app = express();
const port = 3000;

const categoriesRoute = require('./routes/categoriesRoute');

app.use(express.json());
app.use('/categories', categoriesRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
