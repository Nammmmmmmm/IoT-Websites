const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const RouterPath= require('./router');
const initializeBroker = require('./broker');


const app = express();

const port = 7000;

initializeBroker();

app.use(bodyParser());
app.use(cors());
app.use("/", RouterPath);
app.use("/data_sensor", RouterPath);
app.use("/data_device", RouterPath);
app.use("/search_device", RouterPath);
app.use("/search_attribute", RouterPath);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
