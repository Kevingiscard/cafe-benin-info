import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const localAssistant = require('../local-assistant.js');

test('l’assistant local explique les procédés sans réseau', () => {
  const response = localAssistant.answer('Quelle est la différence entre un café naturel et un café lavé ?');
  assert.equal(response.source, 'local');
  assert.match(response.reply, /café naturel/i);
  assert.equal(response.links[0].href, '#processus');
});

test('l’assistant local propose un conseil de préparation sans API', () => {
  const response = localAssistant.recommend('Je veux un café doux et calme', ['filtre']);
  assert.match(response, /filtre/i);
});
