import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import fs from 'node:fs';

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

test('le thème est amorcé avant rendu et possède un contrôle accessible', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  assert.match(html, /localStorage\.getItem\('cb-theme'\)/);
  assert.match(html, /id="theme-toggle"/);
  assert.match(app, /function setupTheme\(\)/);
  assert.match(app, /aria-pressed/);
});

test('la recherche se branche sur le dictionnaire enrichi même si le corpus est déjà initialisé', () => {
  const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const dictionary = fs.readFileSync(new URL('../dictionary-v4.js', import.meta.url), 'utf8');
  assert.match(app, /cafeb:dictionary-ready/);
  assert.match(app, /Array\.isArray\(window\.cafeBeninDictionary\)/);
  assert.match(dictionary, /cafeBeninDictionary/);
});

test('la direction typographique utilise une famille sans sérif cohérente et versionne sa feuille de thème', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const theme = fs.readFileSync(new URL('../theme.css', import.meta.url), 'utf8');
  assert.match(theme, /--font-display: "DM Sans"/);
  assert.match(html, /theme\.css\?v=3/);
  assert.doesNotMatch(html, /Cormorant\+Garamond/);
});
