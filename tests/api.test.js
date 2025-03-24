const request = require('supertest');
const express = require('express');
const app = require('../index');

describe('Inventory API Tests', () => {
    const testItem = {
        name: 'Test Item',
        quantity: 10,
        price: 99.99
    };

    test('POST /api/items - should create a new item', async () => {
        const response = await request(app)
            .post('/api/items')
            .send(testItem);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(testItem.name);
        expect(response.body.quantity).toBe(testItem.quantity);
        expect(response.body.price).toBe(testItem.price);
    });

    test('GET /api/items - should return all items', async () => {
        const response = await request(app)
            .get('/api/items');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});