var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");
var db = require("../models");


module.exports = function (app) {

    // A GET route for scraping the bloody-disgusting website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with request
        axios.get("https://bloody-disgusting.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            // Now, we grab every h2 within an article tag, and do the following:
            $("div.mvp-blog-story-text").each(function (i, element) {
                // Save an empty result object
                var result = {};
                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).children("a").children("h2").text();
                result.summary = $(this).children("a").children("p").text();
                result.link = $(this).children("a").attr("href");
                    results.image = $(this).parent("div.mvp-blog-story-in").parent("div.mvp-blog-story-out")
                    .children("a").children("div.mvp-blog-story-img").children("img")
                    .attr("src");
                console.log(result);
                // Create a new Article using the `result` object built from scraping
                db.Article.findOne({ title: result.title }).then(function (dbArticle) {
                    if (dbArticle) {
                        console.log("Already exists");
                    } else {

                        db.Article.create(result).then(function (dbArticle) {
                            // View the added result in the console
                            console.log(dbArticle);
                        })
                        .catch(function (err) {
                            // If an error occurred, send it to the client
                            return res.json(err);
                        });
                    }
                });
            // If we were able to successfully scrape and save an Article, send a message to the client
                res.send("Scrape Complete");
            });
        });
    });
        //GET route to get all articles
        app.get("/article", function (req, res) {
            // TODO: Finish the route so it grabs all of the articles
            db.Article.find({}).then(function (dbArticle) {
                res.json(dbArticle)
            });
        });
    
        //DELETE route to delete all articles
        app.delete("/article", function (req, res) {
            db.Article.deleteMany({}, function (error, found) {
                if (error) {
                    console.log(error);
                }
                else {
                    res.json(found);
                }
            });
        });
        //GET route to get article based on id
        app.get("/article/:id", function (req, res) {
            db.Article.findOne({ _id: req.params.id }).populate('note').then(function (dbArticle) {
                res.json(dbArticle);
            }).catch(function (err) {
                res.json(err);
            });
        });
    
        //POST route to saving note on specific article
        // Route for saving/updating an Article's associated Note
        app.post("/article/:id", function (req, res) {
    
            db.Note.create(req.body)
                .then(function (dbNote) {
                    // If a Book was created successfully, find one library (there's only one) and push the new Book's _id to the Library's `books` array
                    // { new: true } tells the query that we want it to return the updated Library -- it returns the original by default
                    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
                })
                .then(function (dbArticle) {
                    // If the Library was updated successfully, send it back to the client
                    res.json(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurs, send it back to the client
                    res.json(err);
                });
        });
    
        //DELETE route to delete note
        app.delete("/article/:id", function (req, res) {
            var articleId = req.body.articleId;
    
            db.Note.deleteOne({ _id: req.params.id })
                .then(function (result) {
                    return db.Article.findOneAndUpdate({ _id: articleId }, { $pull: { note: req.params.id } }, { new: true });
                }).then(function (deleted) {
                    res.json(deleted);
                }).catch(function (error) {
                    res.json(error);
                });
        });
    
}