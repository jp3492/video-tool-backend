const bodyParser = require("body-parser");
const express = require('express')
const router = require("./router")
const mongoose = require("mongoose")
// Create a new express application instance
const app = express();
const config = require("./config")

mongoose.connect(config.mongoUri)

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorzation, authorization")
  next()
})

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

router(app)

app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});

module.exports