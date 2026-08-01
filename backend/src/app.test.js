import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from './app.js';

describe('Propel backend API', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/api/health').expect(200);

    expect(response.body.ok).toBe(true);
    expect(response.body.service).toBe('propel-backend');
  });

  it('validates required proposal fields', async () => {
    const response = await request(app).post('/api/proposals').send({}).expect(400);

    expect(response.body.error).toMatch(/userEmail/);
  });

  it('creates and returns a proposal', async () => {
    const payload = {
      userEmail: 'agency@example.com',
      businessName: 'Propel Studio',
      clientName: 'Acme',
      generatedContent: 'A concise proposal body.',
    };

    const createResponse = await request(app).post('/api/proposals').send(payload).expect(201);
    expect(createResponse.body.proposal).toMatchObject(payload);

    const listResponse = await request(app)
      .get('/api/proposals')
      .query({ userEmail: payload.userEmail })
      .expect(200);

    expect(listResponse.body.proposals[0]).toMatchObject(payload);
  });
});
