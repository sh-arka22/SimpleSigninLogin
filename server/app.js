const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const UserRoutes = require('./routes/users');
const morgan = require('morgan');
const user = require('./models/users');
/****************************************************** DB CONNECTION ***************************************************** */
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});
const dbUI = "mongodb://127.0.0.1:27017/Rough";
mongoose.connect(dbUI).then(() => {
    console.log("connection succesfull");
}).catch((err)=>{
    console.log("connectin failed");
});
/************************************************************* BODY PARSER ************************************************** */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
/******************************************** APIS ***************************************************************************/
app.use('/user', UserRoutes); // i am the user
module.exports = app;