"use strict";
require("dotenv").config();
const { domain } = require("../../../configs/dashboardConfig.js");
const bcrypt = require("bcrypt");
const FormData = require("form-data");
const Mailgun = require("mailgun.js");
const { Router } = require("express");
const app = Router();
module.exports = (conn, r) => {
    app.get('/register', async (req, res) => {
        res.render("html/dashboard/register.html", {});
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
            password: hash,
            verified: false
        };

        const test = await bcrypt.compare(password, hash);
        console.log(test);

        console.log(user);

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

    app.get('/unregister', async (req, res) => {
        res.render("html/dashboard/register.html", {});
    });

    app.get('/verify', async (req, res) => {
        const { id } = req.query;
        console.log(id);
        res.redirect("/?v=success");
    });
    return app;
}