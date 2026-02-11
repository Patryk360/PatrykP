"use strict";
require("dotenv").config({ quiet: true });
const { domain } = require("../../../configs/dashboardConfig.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { Router } = require("express");

const app = Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

module.exports = (conn, r) => {

    app.get("/register", async (req, res) => {
        res.render("html/dashboard/register.html", {
            token: req.cookies.token
        });
    });

    app.post("/register/submit", async (req, res) => {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword || password.length < 8) {
            return res.redirect("/register?r=error");
        }

        const id = await r.uuid().run(conn);
        const hash = await bcrypt.hash(password, 10);

        const user = {
            id,
            username,
            email,
            accountCreate: Date.now(),
            avatar: false,
            token: false,
            tokenExpired: false,
            password: hash,
            verified: false
        };

        const userExists = await r.table("Users").getAll([username, email], { index: "user" }).coerceTo("array").run(conn);

        if (userExists.length > 0) return res.redirect("/register?r=userExists");

        await r.table("Users").insert(user).run(conn);

        try {
            await transporter.sendMail({
                from: `"PatrykP" <${process.env.MAIL_USER}>`,
                to: email,
                subject: "Zweryfikuj email",
                text: `Kliknij link aby zweryfikować email:\n${domain}/verify?id=${id}`,
                html: `
                    <h2>Weryfikacja email</h2>
                    <p>Kliknij link poniżej aby zweryfikować konto:</p>
                    <a href="${domain}/verify?id=${id}">
                        ${domain}/verify?id=${id}
                    </a>
                `
            });

            console.log("Mail wysłany przez Gmail SMTP");
        } catch (error) {
            console.error("Błąd wysyłki maila:", error);
        }

        res.redirect("/?r=success");
    });

    app.get("/unregister", async (req, res) => {
        if (!req.cookies.token) {
            return res.redirect("/login");
        }

        res.render("html/dashboard/unregister.html", {
            token: req.cookies.token
        });
    });

    app.post("/unregister/submit", async (req, res) => {
        if (!req.cookies.token) {
            return res.redirect("/login");
        }

        await r.table("Users").getAll(req.cookies.token, { index: "token" }).delete().run(conn);

        res.clearCookie("token");
        res.redirect("/?ur=success");
    });

    app.get("/verify", async (req, res) => {
        const { id } = req.query;

        if (!id) return res.redirect("/");

        await r.table("Users").get(id).update({ verified: true }).run(conn);

        res.redirect("/?v=success");
    });

    return app;
};