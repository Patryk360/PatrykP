"use strict";
const { Router } = require("express");
const app = Router();
module.exports = () => {
    app.get("/words/german", (req, res) => {
        res.render("html/words/german.html", {});
    });
    app.get("/words/german/list", (req, res) => {
        res.render("html/words/germanList.html", {});
    });
    app.get("/words/english", (req, res) => {
        res.render("html/words/english.html", {});
    });
    app.get("/words/english/list", (req, res) => {
        res.render("html/words/englishList.html", {});
    });
    app.get("/words", (req, res) => {
        res.render("html/words/main.html", {});
    });

    return app;
}