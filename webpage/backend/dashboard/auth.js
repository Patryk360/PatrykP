"use strict";
const { Router } = require("express");
const app = Router();
module.exports = (conn, r) => {
    app.get('/login', async (req, res) => {
        res.render("html/dashboard/auth.html", {});
    });
    app.post("/login/submit", (req, res) => {
        console.log(req.body);
        res.redirect("/?l=success");
    });
    app.get('/logout', async (req, res) => {
        res.render("html/dashboard/auth.html", {});
    });
    return app;
}