"use strict";
const { Router } = require("express");
const app = Router();
module.exports = () => {
    app.get("/snake", (req, res) => {
        res.render("html/fun/snake.html", {});
    });
    return app;
}