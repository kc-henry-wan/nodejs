// Import necessary modules and mock data
const request = require('supertest');
const app = require('../src/app'); // Your app entry point
const db = require('../src/models'); // Your database models

// Mock the Job model methods to prevent real DB calls
jest.mock('../src/models', () => {
    const originalModule = jest.requireActual('../src/models');

    return {
        ...originalModule,
        Job: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
        }
    };
});

describe('/api/v1/job', () => {
    beforeEach(() => {
        // Set up mock return values for findAll
        db.Job.findAll.mockResolvedValue([
            {
                job_id: 1,
                job_ref: 'JOB123',
                description: 'Test job',
                pharmacist_id: 1,
                pharmacy_group_id: 1,
                pharmacy_branch_id: 1,
                job_date: new Date(),
                job_start_time: '09:00',
                job_end_time: '17:00',
                hourly_rate: 50.0,
                total_work_hour: 8.0,
                total_paid: 400.0,
                lunch_arrangement: 'Yes',
                parking_option: 'Street',
                rate_per_mile: 0.5,
                status_code: 'A',
                status: 'Open',
                deleted: false,
            }
        ]);
    });

    afterEach(() => {
        // Reset mocks after each test
        jest.clearAllMocks();
    });

    // Test GET /api/v1/job
    test('GET /api/v1/job - should retrieve jobs successfully', async () => {
        const response = await request(app).get('/api/v1/job');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    // Test POST /api/v1/job - Create Job
    test('POST /api/v1/job - should create a new job', async () => {
        const newJob = {
            job_ref: 'JOB456',
            description: 'New test job',
            pharmacist_id: 1,
            pharmacy_group_id: 1,
            pharmacy_branch_id: 1,
            job_date: new Date(),
            job_start_time: '10:00',
            job_end_time: '18:00',
            hourly_rate: 60.0,
            total_work_hour: 8.0,
            total_paid: 480.0,
            lunch_arrangement: 'Yes',
            parking_option: 'Street',
            rate_per_mile: 0.5,
            status_code: 'A',
            status: 'Open',
            updated_user_id: 1
        };

        // Mock the create method to return the created job
        db.Job.create.mockResolvedValue(newJob);

        const response = await request(app)
            .post('/api/v1/job')
            .send(newJob)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(201); // Created status
        expect(response.body.status).toBe('success');
        expect(response.body.data.job_ref).toBe('JOB456');
        expect(response.body.data.description).toBe('New test job');
    });

    // Test PUT /api/v1/job/{id} - Update Job
    test('PUT /api/v1/job/1 - should update an existing job', async () => {
        const updatedJob = {
            job_ref: 'JOB123',
            description: 'Updated test job',
            pharmacist_id: 1,
            pharmacy_group_id: 1,
            pharmacy_branch_id: 1,
            job_date: new Date(),
            job_start_time: '09:00',
            job_end_time: '17:00',
            hourly_rate: 50.0,
            total_work_hour: 8.0,
            total_paid: 400.0,
            lunch_arrangement: 'Yes',
            parking_option: 'Street',
            rate_per_mile: 0.5,
            status_code: 'A',
            status: 'Open',
            updated_user_id: 1
        };

        // Mock the findByPk method to return an existing job
        db.Job.findByPk.mockResolvedValue(updatedJob);
        
        // Mock the update method
        db.Job.update.mockResolvedValue([1]); // 1 indicates one record was updated

        const response = await request(app)
            .put('/api/v1/job/1')
            .send(updatedJob)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(200); // OK status
        expect(response.body.status).toBe('success');
        expect(response.body.data.description).toBe('Updated test job');
    });

    // Test Error Handling for Create Job
    test('POST /api/v1/job - should return error if create fails', async () => {
        db.Job.create.mockRejectedValue(new Error('Create failed'));

        const newJob = {
            job_ref: 'JOB456',
            description: 'New test job',
        };

        const response = await request(app)
            .post('/api/v1/job')
            .send(newJob)
            .set('Accept', 'application/json');

        expect(response.statusCode).toBe(500);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Internal Server Error');
    });

    // Test Error Handling for Update Job
    test('PUT /api/v1/job/1 - should return error if update fails', async () => {
        db.Job.findByPk.mockResolvedValue(null); // Simulate job not found

        const response = await request(app).put('/api/v1/job/1').send({});

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Job not found');
    });
});
