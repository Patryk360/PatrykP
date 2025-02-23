"use strict";
const { Router } = require("express");
const app = Router();
module.exports = () => {
    app.get('/register', async (req, res) => {
        res.render("html/dashboard/register.html", {});
    });
    app.post("/register/submit", (req, res) => {
        res.send(req.body);
    });
    app.get('/unregister', async (req, res) => {
        res.render("html/dashboard/register.html", {});
    });
    return app;
}