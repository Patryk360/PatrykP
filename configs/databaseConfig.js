require("dotenv").config({ quiet: true });
module.exports = {
    database: {
        host: "130.61.95.106",
        port: 28015,
        db: "PatrykP_dev",
        user: "admin",
        password: process.env.PASSWORD,
    }
}