"use strict";
const { Router } = require("express");
const bcrypt = require("bcrypt");
const app = Router();
module.exports = (conn, r) => {
    app.get("/login", async (req, res) => {
        res.render("html/dashboard/auth.html", { token: req.cookies.token });
    });
    app.post("/login/submit", async (req, res) => {
        const token = await r.uuid().run(conn);
        const tokenExpired = Date.now() + 1000;
        const { username, password } = req.body;
        
        const user = await r.table("Users").getAll(username, { index: "username" }).coerceTo("array").run(conn);
        console.log(user);
        if (user.length === 0) return res.redirect("/login?l=error");
        if (!user[0].verified) return res.redirect("/login?l=error");
        const compare = await bcrypt.compare(password, user[0].password);
        if (!compare) return res.redirect("/login?l=error");
        await r.table("Users").get(user[0].id).update({ token, tokenExpired }).run(conn);
        res.cookie("token", token);
        res.redirect("/?l=success");
    });
    app.get("/logout", async (req, res) => {
        const token = req.cookies.token;
        if (!token) return res.redirect("/");
        await r.table("Users").getAll(token, { index: "token" }).update({ token: false, tokenExpired: false }).run(conn);
        res.clearCookie("token");
        res.redirect("/");
    });
    return app;
}