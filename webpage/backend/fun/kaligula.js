"use strict";
const { Router, raw } = require("express");
const app = Router();
const { domain } = require("../../../configs/dashboardConfig.js");
module.exports = () => {
    app.get("/kaligula", async (req, res) => {
        const response = await fetch(`${domain}/kaligula/madrosci.txt`);
        const rawText = await response.text();

        const array = rawText.split(';').map(item => item.trim()).filter(item => item.length > 0);
        const randomIndex = Math.floor(Math.random() * array.length);
        res.render("html/fun/kaligula.html", { token: req.cookies.token, lol: array[randomIndex] });
    });

    return app;
}