"use strict";
const { Router } = require("express");
const app = Router();
module.exports = () => {
    const players = new Map();
    app.get("/snake", (req, res) => {
        const rawArray = [...players];
        res.render("html/fun/snake.html", { rawArray });
    });

    app.post("/snake/update", (req, res) => {
        const { username, score } = req.body;

        if (!username) return res.status(400).json({ error: "Brak nazwy użytkownika" });

        players.set(username, {
            score: score,
            lastUpdate: new Date()
        });

        res.json({ message: "Wynik zapisany", totalPlayers: players.size });
    });

    app.get("/snake/players", (req, res) => {
        const playerList = Array.from(players.entries()).map(([name, data]) => ({
            username: name,
            ...data
        }));
        
        res.json(playerList);
    });

    return app;
}