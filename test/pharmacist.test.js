// Import necessary modules and mock data
const request = require('supertest');
const app = require('../src/app'); // Your app entry point
const db = require('../src/models'); // Your database models

// Mock the Pharmacist model methods to prevent real DB calls
jest.mock('../src/models', () => {
    const originalModule = jest.requireActual('../src/models');

    return {
        ...originalModule,
        Pharmacist: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        }
    };
});

describe('/api/v1/pharmacist', () => {
    const mockPharmacist = {
        pharmacist_id: 1,
        password: 'hashed_password',
        email: 'pharmacist@example.com',
        first_name: 'John',
        last_name: 'Doe',
        mobile: '1234567890',
        address_1: '123 Main St',
        address_2: 'Suite 100',
        postal_code: '12345',
        longitude: 0,
        latitude: 0,
        status: 'Active',
        updated_user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
    };

    beforeEach(() => {
        // Set up mock return values for findAll
        db.Pharmacist.findAll.mockResolvedValue([mockPharmacist]);
    });

    afterEach(() => {
        // Reset mocks after each test
        jest.clearAllMocks();
    });

    // Test GET /api/v1/pharmacist - List Pharmacists
    test('GET /api/v1/pharmacist - should retrieve pharmacists successfully', async () => {
        const response = await request(app).get('/api/v1/pharmacist');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    // Test POST /api/v1/pharmacist - Create Pharmacist
    test('POST /api/v1/pharmacist - should create a new pharmacist', async () => {
        const newPharmacist = {
            password: 'plain_password',
            email: 'new_pharmacist@example.com',
            first_name: 'Jane',
            last_name: 'Doe',
            mobile: '0987654321',
            address_1: '456 Elm St',
            address_2: '',
            postal_code: '54321',
            longitude: 0,
            latitude: 0,
            status: 'Active',
            updated_user_id: 1,
        };

        // Mock the create method to return the created pharmacist
        db.Pharmacist.create.mockResolvedValue({ ...newPharmacist, pharmacist_id: 2 });

        const response = await request(app)
            .post('/api/v1/pharmacist')
            .send(newPharmacist)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(201); // Created status
        expect(response.body.status).toBe('success');
        expect(response.body.data.email).toBe('new_pharmacist@example.com');
        expect(response.body.data.first_name).toBe('Jane');
    });

    // Test PUT /api/v1/pharmacist/{id} - Update Pharmacist
    test('PUT /api/v1/pharmacist/1 - should update an existing pharmacist', async () => {
        const updatedPharmacist = {
            email: 'updated_pharmacist@example.com',
            first_name: 'John Updated',
            last_name: 'Doe',
            mobile: '1234567890',
            address_1: '123 Main St',
            address_2: 'Suite 200',
            postal_code: '12345',
            longitude: 0,
            latitude: 0,
            status: 'Active',
            updated_user_id: 1,
        };

        // Mock the findByPk method to return an existing pharmacist
        db.Pharmacist.findByPk.mockResolvedValue(mockPharmacist);
        
        // Mock the update method
        db.Pharmacist.update.mockResolvedValue([1]); // 1 indicates one record was updated

        const response = await request(app)
            .put('/api/v1/pharmacist/1')
            .send(updatedPharmacist)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(200); // OK status
        expect(response.body.status).toBe('success');
        expect(response.body.data.first_name).toBe('John Updated');
    });

    // Test GET /api/v1/pharmacist/{id} - Pharmacist Detail
    test('GET /api/v1/pharmacist/1 - should retrieve pharmacist details successfully', async () => {
        db.Pharmacist.findByPk.mockResolvedValue(mockPharmacist);

        const response = await request(app).get('/api/v1/pharmacist/1');

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data.first_name).toBe('John');
    });

    // Test Error Handling for Create Pharmacist
    test('POST /api/v1/pharmacist - should return error if create fails', async () => {
        db.Pharmacist.create.mockRejectedValue(new Error('Create failed'));

        const newPharmacist = {
            email: 'error_pharmacist@example.com',
        };

        const response = await request(app)
            .post('/api/v1/pharmacist')
            .send(newPharmacist)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(500);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Internal Server Error');
    });

    // Test Error Handling for Update Pharmacist
    test('PUT /api/v1/pharmacist/1 - should return error if update fails', async () => {
        db.Pharmacist.findByPk.mockResolvedValue(null); // Simulate pharmacist not found

        const response = await request(app).put('/api/v1/pharmacist/1').send({});

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Pharmacist not found');
    });
});
