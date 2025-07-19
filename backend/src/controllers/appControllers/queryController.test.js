const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Query = require('../../models/appModels/Query');

// Use a test database
const MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/idurar_test';

describe('Query API', () => {
  let server;
  let createdQueryId;
  let createdNoteId;

  beforeAll(async () => {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    server = app.listen(4001);
  });

  afterAll(async () => {
    await Query.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });

  test('should create a new query', async () => {
    const res = await request(server)
      .post('/api/queries')
      .send({ title: 'Test Query', description: 'Test Description' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Query');
    createdQueryId = res.body._id;
  });

  test('should list queries with pagination', async () => {
    const res = await request(server).get('/api/queries?page=1&limit=10');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  test('should get a query by ID', async () => {
    const res = await request(server).get(`/api/queries/${createdQueryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdQueryId);
  });

  test('should update a query', async () => {
    const res = await request(server)
      .put(`/api/queries/${createdQueryId}`)
      .send({ status: 'in_progress', resolution: 'Working on it' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('in_progress');
    expect(res.body.resolution).toBe('Working on it');
  });

  test('should add a note to a query', async () => {
    const res = await request(server)
      .post(`/api/queries/${createdQueryId}/notes`)
      .send({ text: 'This is a note', author: 'Tester' });
    expect(res.statusCode).toBe(201);
    expect(res.body.text).toBe('This is a note');
    createdNoteId = res.body._id;
  });

  test('should delete a note from a query', async () => {
    const res = await request(server)
      .delete(`/api/queries/${createdQueryId}/notes/${createdNoteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Note deleted');
  });
}); 