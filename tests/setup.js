const express = require('express');
const app = express();
const db = require('../database');

// Middleware for parsing JSON bodies
app.use(express.json());

// GET /api/items - Get all items
app.get('/api/items', (req, res) => {
    db.all('SELECT * FROM items', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET /api/items/:id - Get a single item
app.get('/api/items/:id', (req, res) => {
    db.get('SELECT * FROM items WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(row);
    });
});

// POST /api/items - Create a new item
app.post('/api/items', (req, res) => {
    const { name, quantity, price } = req.body;
    
    // Basic validation
    if (!name || !quantity || !price) {
        return res.status(400).json({ message: 'Please provide name, quantity and price' });
    }

    const sql = 'INSERT INTO items (name, quantity, price) VALUES (?, ?, ?)';
    db.run(sql, [name, parseInt(quantity), parseFloat(price)], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        db.get('SELECT * FROM items WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json(row);
        });
    });
});

// PUT /api/items/:id - Update an item
app.put('/api/items/:id', (req, res) => {
    const { name, quantity, price } = req.body;
    const updates = [];
    const values = [];
    
    if (name) {
        updates.push('name = ?');
        values.push(name);
    }
    if (quantity) {
        updates.push('quantity = ?');
        values.push(parseInt(quantity));
    }
    if (price) {
        updates.push('price = ?');
        values.push(parseFloat(price));
    }
    
    if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }
    
    updates.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(req.params.id);
    
    const sql = `UPDATE items SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(sql, values, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        db.get('SELECT * FROM items WHERE id = ?', [req.params.id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(row);
        });
    });
});

// DELETE /api/items/:id - Delete an item
app.delete('/api/items/:id', (req, res) => {
    db.run('DELETE FROM items WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(204).send();
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;