"use strict";
const { Router } = require("express");
const app = Router();
module.exports = (conn, r) => {
    app.get('/register', async (req, res) => {
        res.render("html/dashboard/register.html", {});
    });
    app.post("/register/submit", (req, res) => {
        console.log(req.body);
        res.redirect("/?r=success");
    });
    app.get('/unregister', async (req, res) => {
        res.render("html/dashboard/register.html", {});
    });
    return app;
}