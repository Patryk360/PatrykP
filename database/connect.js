"use strict";
const config = require("../configs/databaseConfig.js");
module.exports = {
    connect: async (r) => {
        return new Promise(async (resolve, reject) => {
                const conn = await r.connect({ host: config.database.host, port: config.database.port, db: config.database.db, user: config.database.user, password: config.database.password });
                conn.on("close", () => {
                    console.log("Database connection closed.");
                });
                conn.on("error", (err) => {
                    console.error(err);
                });
                resolve(conn);
        });
    }
}