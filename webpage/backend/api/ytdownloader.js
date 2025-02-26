"use strict";
require("dotenv").config();
const fs = require('fs');
const path = require('path');
const ytdl = require('@distube/ytdl-core');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const { Router } = require("express");
const app = Router();

module.exports = (conn, r) => {
    app.post('/ytdownloader', async (req, res) => {

    });

    app.get('/ytdownloader/:id', async (req, res) => {
        res.send('ytdownloader');
    });

    return app;
}