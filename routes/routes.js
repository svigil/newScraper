var Article = require("../models/article.js");
var Note = require("../models/notes.js");
var request = require("request");
var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NewScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected")
});

router.get("/", function (req, res) {
    // Save an empty result object
    var result = {};

    // Add the text and href of every link, and save them as properties of the result object
    result.title = $(this)
      .children()
      .children()
      .children("img")
      .attr("alt");
    result.link = $(this)
      .attr("href");

    // Create a new Article using the `result` object built from scraping
    db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });
  });

router.get("/index", function (req, res) {
    Article.find({ saved: false }, function (err, Article) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.render("index", { Article: Article });
        }
    });
});

router.get("/saved", function (req, res) {
    Article.find({ saved: true }, function (err, Article) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.render("saved", { Article: Article });
        }
    });
});

router.put("/api/index/:id", function (req, res) {
    var thisId = req.params.id;
    Article.findOneAndUpdate({ _id: thisId }, { $set: { saved: true } }, function (err, Article) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.json(Article);
        }
    });
});



module.exports = router;