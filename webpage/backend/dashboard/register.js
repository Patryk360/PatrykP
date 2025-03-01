"use strict";
require("dotenv").config();
const { domain } = require("../../../configs/dashboardConfig.js");
const bcrypt = require("bcrypt");
const FormData = require("form-data");
const Mailgun = require("mailgun.js");
const { Router } = require("express");
const app = Router();
module.exports = (conn, r) => {
    app.get("/register", async (req, res) => {
        res.render("html/dashboard/register.html", { token: req.cookies.token });
    });

    app.post("/register/submit", async (req, res) => {
        const { username, email, password, confirmPassword } = req.body;

        console.log(req.body);

        if (password !== confirmPassword || password.length < 8) {
            return res.redirect("/register?r=error");
        }

        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({
            username: "api",
            key: process.env.MAILGUN_API_KEY,
            url: "https://api.eu.mailgun.net"
        });

        const id = await r.uuid().run(conn);
        const hash = await bcrypt.hash(password, 10);
        const user = {
            id,
            username,
            email,
            token: false,
            tokenExpired: false,
            password: hash,
            verified: false
        };

        const userExists = await r.table("Users").getAll([username, email], { index: "user" }).coerceTo("array").run(conn);

        if (userExists.length > 0) return res.redirect("/register?r=userExists");

        console.log(user);

        await r.table("Users").insert(user).run(conn);

        try {
            await mg.messages.create("patrykp.pl", {
                from: "PatrykP <noreply@patrykp.pl>",
                to: [`${username} <${email}>`],
                subject: "Zweryfikuj email",
                text: `Kliknij link aby zweryfikować email:\n${domain}/verify?id=${id}`,
            });
          } catch (error) {
            console.error(error);
          }

        res.redirect("/?r=success");
    });

    app.get("/unregister", async (req, res) => {
        if (!req.cookies.token) return res.redirect("/login");
        res.render("html/dashboard/unregister.html", { token: req.cookies.token });
    });

    app.post("/unregister/submit", async (req, res) => {
        if (!req.cookies.token) return res.redirect("/login");
        await r.table("Users").getAll(req.cookies.token, { index: "token" }).delete().run(conn);

        res.clearCookie("token");
        res.redirect("/?ur=success");
    });

    app.get("/verify", async (req, res) => {
        const { id } = req.query;
        console.log(id);

        await r.table("Users").get(id).update({ verified: true }).run(conn);
        res.redirect("/?v=success");
    });
    return app;
}