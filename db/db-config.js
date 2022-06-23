const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/PenthouseDB",{useNewUrlParser: true});
const connection = mongoose.connection;
connection.once("open",() => console.log("Successfully connected DB"));
connection.on("error",(error) => console.error(error));



module.exports = connection;