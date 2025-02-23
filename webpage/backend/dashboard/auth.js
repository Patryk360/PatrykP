"use strict";
const { Router } = require("express");
const app = Router();
module.exports = () => {
    app.get('/login', async (req, res) => {
        res.render("html/dashboard/auth.html", {});
    });
    app.post("/login/submit", (req, res) => {
        res.send(req.body);
    });
    app.get('/logout', async (req, res) => {
        res.render("html/dashboard/auth.html", {});
    });
    return app;
}