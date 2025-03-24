const db = require('../database');

beforeAll(async () => {
    // Create items table if it doesn't exist
    await new Promise((resolve, reject) => {
        db.run(`
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
});

afterEach(async () => {
    // Clean up test data after each test
    await new Promise((resolve, reject) => {
        db.run('DELETE FROM items', (err) => {
            if (err) reject(err);
            resolve();
        });
    });
});

afterAll(async () => {
    // Close database connection
    await new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) reject(err);
            resolve();
        });
    });
});