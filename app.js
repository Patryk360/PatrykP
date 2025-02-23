const start = require("./webpage/backend/main.js");
const { connect } = require("./database/connect.js");
const { setup } = require("./database/createTable.js");
const chalk = require("chalk");
const r = require("rethinkdb");

const run = async () => {
    const conn = await connect(r);
    await setup(conn, r);
    start(conn, r);
}
run();

process.on("unhandledRejection", (err) => console.error(chalk.hex("#ff0000")("Unhandled rejection: ", err)));
process.on("rejectionHandled", (err) => console.error(chalk.hex("#ff0000")("Rejection handled: ", err)));
process.on("uncaughtException", (err) => console.error(chalk.hex("#ff0000")("Uncaught exception: ", err)));