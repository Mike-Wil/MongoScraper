// var request = require("request");
// var cheerio = require("cheerio");
var db = require("../models");
module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("index")
    })
};