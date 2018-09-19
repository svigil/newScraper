// Require set up
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// Require mongoose
var logger = require("morgan");

var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Set up port for the server
var PORT = process.env.PORT || 3000;

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/week18Populater", { useNewUrlParser: true });

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// set up the routes
var router = require("./routes/routes.js");
app.use("/", router);

// Start the server
app.listen(PORT, function () {
    console.log("Listening on port " + PORT)
});