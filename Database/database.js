// Database.js — fully SQLite for Savella

const path = require('path')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')

// SQLite database file (inside Database folder)
const dbFile = path.resolve(__dirname, 'database.sqlite')
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '')

// Open SQLite database
const dbPromise = open({
    filename: dbFile,
    driver: sqlite3.Database
})

console.log('✅ SQLite database initialized at', dbFile)

// Utility functions
async function run(query, params = []) {
    return (await dbPromise).run(query, params)
}

async function get(query, params = []) {
    return (await dbPromise).get(query, params)
}

async function all(query, params = []) {
    return (await dbPromise).all(query, params)
}

// Initialize tables if not exist
async function initTables() {
    await run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        isSudo INTEGER DEFAULT 0
    )`)

    await run(`CREATE TABLE IF NOT EXISTS banned (
        id TEXT PRIMARY KEY
    )`)

    await run(`CREATE TABLE IF NOT EXISTS global_settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )`)

    console.log('✅ SQLite tables ready')
}

// Run table initialization immediately
initTables()

// Export
module.exports = {
    db: dbPromise,
    run,
    get,
    all
    }
