var Article = require("../models/article.js");
var Note = require("../models/notes.js");
var request = require("request");
var express = require("express");
var router = express.Router();
var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

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
    request("https://www.thehackernews.com/", function (error, response, html) {
        var $ = cheerio.load(html);
        $("a.story-link").each(function (i, element) {

            var headline = $(element)
                .children()
                .children()
                .children("img")
                .attr("alt");
            var url = $(element)
                .attr("href");

            var article = new Article({
                headline: headline,
                saved: false,
                url: url
            });
            article.save();
        });
        res.redirect("index");
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

router.put("/api/saved/:id", function (req, res) {
    var thisId = req.params.id;
    Article.findOneAndUpdate({ _id: thisId }, { $set: { saved: false } }, function (err, Article) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.json(Article);
        }
    });
});

router.get("/saved/:id", function (req, res) {
    Article.findOne({ _id: req.params.id })
        .populate("notes")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.post("/saved/:id", function (req, res) {
    Note.create(req.body)
        .then(function (dbNote) {
            return Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

module.exports = router;