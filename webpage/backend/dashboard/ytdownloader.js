"use strict";
require("dotenv").config({ quiet: true });
const { Router } = require("express");
const app = Router();

module.exports = (conn, r) => {
    app.get('/ytdownloader', async (req, res) => {
        res.send('ytdownloader');
    });
    return app;
}