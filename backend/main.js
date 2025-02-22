"use strict";
const path = require("path");
const express = require("express");
const http = require("http");
const app = express();
app.use(require("cookie-parser")());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("helmet")({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    dnsPrefetchControl: false,
    expectCt: false,
    frameguard: false,
    hidePoweredBy: false,
    hsts: false,
    ieNoOpen: false,
    noSniff: false,
    originAgentCluster: false,
    permittedCrossDomainPolicies: false,
    referrerPolicy: false,
    xssFilter: false
}));
app.use(require("compression")());
const server = http.createServer(app);

module.exports = () => {
    app.engine(".html", require("ejs").__express);
    app.set("views", path.join(__dirname, "../frontend"));
    app.set("view engine", "html");

    app.get("/", (req, res) => {
        res.render("html/main.html", {});
    });
    app.get("/offers", (req, res) => {
        res.render("html/offers.html", {});
    });

    app.use("/", require("./learn/words.js")());
    app.use("/", require("./portfolio/cv.js")());

    app.use("/api", require("./api/stripe.js")());
    app.use("/wordsjson", express.static(path.join(__dirname, "../resources/words")));
    app.use("/images", express.static(path.join(__dirname, "../resources/images")));
    app.use("/bootstrap/css", express.static(path.join(__dirname, "../resources/bootstrap-5.3.2-dist/css")));
    app.use("/bootstrap/js", express.static(path.join(__dirname, "../resources/bootstrap-5.3.2-dist/js")));
    app.use("/css", express.static(path.join(__dirname, "../frontend/css")));
    app.use("/js", express.static(path.join(__dirname, "../frontend/js")));
    app.use("/jquery", express.static(path.join(__dirname, "../resources/jquery-3.6.0")));
    app.use("/particles", express.static(path.join(__dirname, "../resources/particles.js-2.0")));

    app.use((req, res) => {
        res.status(404).render("html/httpStatus/404.html", {
            err: {
                code: "Nie znaleziono strony '" + req.url + "' Strona nie istnieje lub tymczasowo nie działa :/"
            }
        });
    });

    app.use((error, req, res) => {
        res.status(500).render("html/httpStatus/500.html", {
            err: {
                url: req.url,
                code: error
            }
        });
    });

    const listener = server.listen(process.env.PORT || 8080, () => {
        console.log("Panel uruchomiony na porcie " + listener.address().port);
    });
}