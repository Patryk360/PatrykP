"use strict";
module.exports.setup = async (conn, r) => {
    const tableList = await r.tableList().run(conn);
    const tableArray = [
        { name: "Users", primaryKey: "id", index: [
            { name: "user", array: [r.row("username"), r.row("email")], multi: true },
            { name: "username", multi: false },
            { name: "token", multi: false },
        ]
    },
        { name: "Data", primaryKey: "id", index: false }
    ];
    if (tableList.length < tableArray.length) console.log("Creating a table in the database...");
    for (const table of tableArray) {
        const tableIS = tableList.find(a => a === table.name);
        if (!tableIS) {
            await r.tableCreate(table.name, {primaryKey: table.primaryKey}).run(conn);
            console.log(`Table: ${table.name} is created!`);
        }
        if (table.index) {
            for (const index of table.index) {
                const indexList = await r.table(table.name).indexList().run(conn);
                const indexIS = indexList.find(a => a === index.name);
                if (!indexIS) {
                    if (index.multi) {
                        await r.table(table.name).indexCreate(index.name, index.array).run(conn);
                        await r.table(table.name).indexWait().run(conn);
                    } else if (!index.multi) {
                        await r.table(table.name).indexCreate(index.name).run(conn);
                        await r.table(table.name).indexWait().run(conn);
                    }
                }
            }
        }
    }
    if (tableList.length < tableArray.length) console.log("The tables are created!");
}