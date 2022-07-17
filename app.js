const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const Joi = require("joi");
const cors = require('cors');
require("dotenv/config");

const app = express();


app.use(cors({
  origin: "http://localhost:3000"
}))


app.use(bodyParser.json());

const tasksRoute = require('./routes/tasks');
app.use('/tasks',tasksRoute);

const usersRoute = require('./routes/users')
app.use('/users',usersRoute);

mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true },() => {
    console.log("Connected to DB");
});

const port = process.env.PORT || 5000;
app.listen(port, (req, res) => {
  console.log(`Listening on port ${port}...`);
});
