import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('POST /validate-card', () => {
  it('returns 200 with valid:true and brand for a valid, well-formed card', async () => {
    const res = await request(app)
      .post('/validate-card')
      .send({ cardNumber: '4111 1111 1111 1111' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ valid: true, brand: 'visa' });
  });

  it('returns 200 with valid:false and brand:null for a well-formed but failing card', async () => {
    const res = await request(app)
      .post('/validate-card')
      .send({ cardNumber: '4111111111111112' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ valid: false, brand: null });
  });

  it('accepts dash-separated input', async () => {
    const res = await request(app)
      .post('/validate-card')
      .send({ cardNumber: '4111-1111-1111-1111' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ valid: true, brand: 'visa' });
  });

  it('returns 400 when cardNumber is missing', async () => {
    const res = await request(app).post('/validate-card').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when cardNumber is not a string', async () => {
    const res = await request(app)
      .post('/validate-card')
      .send({ cardNumber: 4111111111111111 });

    expect(res.status).toBe(400);
  });

  it('returns 400 when cardNumber contains letters', async () => {
    const res = await request(app)
      .post('/validate-card')
      .send({ cardNumber: '4111-1111-ABCD-1111' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when cardNumber is an empty string', async () => {
    const res = await request(app)
      .post('/validate-card')
      .send({ cardNumber: '' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for malformed JSON in the request body', async () => {
    const res = await request(app)
      .post('/validate-card')
      .set('Content-Type', 'application/json')
      .send('{ this is not valid json');

    expect(res.status).toBe(400);
  });
});
