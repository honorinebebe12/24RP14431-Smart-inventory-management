const db = require('./database');

// Sample inventory items
const dummyItems = [
    { name: 'Laptop', quantity: 25, price: 999.99 },
    { name: 'Smartphone', quantity: 50, price: 599.99 },
    { name: 'Headphones', quantity: 100, price: 79.99 },
    { name: 'Tablet', quantity: 30, price: 399.99 },
    { name: 'Smart Watch', quantity: 45, price: 199.99 },
    { name: 'Wireless Mouse', quantity: 75, price: 29.99 },
    { name: 'USB-C Cable', quantity: 200, price: 9.99 },
    { name: 'Power Bank', quantity: 60, price: 49.99 },
    { name: 'Keyboard', quantity: 40, price: 89.99 },
    { name: 'Monitor', quantity: 20, price: 299.99 }
];

// Insert dummy data
const insertDummyData = () => {
    const insertSQL = 'INSERT INTO items (name, quantity, price) VALUES (?, ?, ?)';
    
    dummyItems.forEach(item => {
        db.run(insertSQL, [item.name, item.quantity, item.price], (err) => {
            if (err) {
                console.error('Error inserting dummy data:', err.message);
            } else {
                console.log(`Inserted item: ${item.name}`);
            }
        });
    });
};

// Execute the insertion
insertDummyData();

// Close the database connection after a delay to ensure all insertions complete
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}, 1000);