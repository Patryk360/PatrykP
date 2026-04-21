"use strict";
const { Router, raw } = require("express");
const app = Router();
const { domain } = require("../../../configs/dashboardConfig.js");
module.exports = () => {
    app.get("/kaligula", async (req, res) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        };
        const response = await fetch(`${domain}/kaligula/madrosci.txt`, options);
        const rawText = await response.text();

        const array = rawText.split(';').map(item => item.trim()).filter(item => item.length > 0);
        const randomIndex = Math.floor(Math.random() * array.length);
        res.render("html/fun/kaligula.html", { token: req.cookies.token, lol: array[randomIndex] });
    });

    return app;
}
