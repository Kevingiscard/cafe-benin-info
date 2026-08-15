import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const recommendationHandler = require('../api/ai.js');
const chatHandler = require('../api/chat.js');

function responseMock() {
  return {
    statusCode: 200,
    headers: {},
    payload: null,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.payload = value;
      return this;
    },
    end() {
      return this;
    }
  };
}

test('la recommandation IA répond explicitement quand aucun moteur n’est configuré', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  const res = responseMock();
  await recommendationHandler({ method: 'POST', headers: {}, body: { mood: 'calme', preferences: [] } }, res);
  assert.equal(res.statusCode, 503);
  assert.match(res.payload.error, /Aucun moteur IA/);
  if (originalKey) process.env.GEMINI_API_KEY = originalKey;
});

test('CaféBot répond explicitement quand aucun moteur n’est configuré', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  const res = responseMock();
  await chatHandler({ method: 'POST', headers: {}, body: { messages: [{ role: 'user', content: 'Bonjour CaféBot' }] } }, res);
  assert.equal(res.statusCode, 503);
  assert.match(res.payload.reply, /temporairement indisponible/);
  if (originalKey) process.env.GEMINI_API_KEY = originalKey;
});

test('les routes IA refusent les méthodes non prévues', async () => {
  const res = responseMock();
  await chatHandler({ method: 'GET', headers: {}, body: {} }, res);
  assert.equal(res.statusCode, 405);
});
