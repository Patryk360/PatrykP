"use strict";
const { Router } = require("express");
const app = Router();
module.exports = (conn, r) => {
    app.get("/profile", async (req, res) => {
        const user = await r.table("Users").getAll(req.cookies.token, { index: "token" }).coerceTo("array").run(conn);
        console.log(user);
        res.render("html/dashboard/profile.html", { token: req.cookies.token, data: user[0] });
    });
    app.get("/profile/edit", async (req, res) => {
        const user = await r.table("Users").getAll(req.cookies.token, { index: "token" }).coerceTo("array").run(conn);
        console.log(user);
        res.render("html/dashboard/editprofile.html", { token: req.cookies.token, data: user[0] });
    });
    return app;
}