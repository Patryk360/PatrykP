"use strict";
const { Router } = require("express");
const app = Router();
module.exports = () => {
    app.get("/cv", async (req, res) => {
        res.render("html/portfolio/cv.html", {});
    });

    return app;
}