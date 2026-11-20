// Veille hebdomadaire gratuite : repère les nouvelles éditions des sources suivies.
// Lecture seule : ne modifie aucun contenu du site et n'utilise aucun secret.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const report = [];
// Bulletin USDA FAS « Coffee: World Markets and Trade » : l'adresse stable sert toujours l'édition en cours.
// On lit la première page du PDF et on compare l'édition affichée à celle citée par le site.
const citedEdition = 'July 2026';
const usdaUrl = 'https://apps.fas.usda.gov/psdonline/circulars/2026/07/coffee.pdf';
try {
  const response = await fetch(usdaUrl, { redirect: 'follow', headers: { 'user-agent': 'CafeBeninSourceWatch/1.0' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  fs.writeFileSync('usda.pdf', Buffer.from(await response.arrayBuffer()));
  const text = execFileSync('pdftotext', ['-f', '1', '-l', '1', '-layout', 'usda.pdf', '-'], { encoding: 'utf8' });
  const edition = (text.match(/(January|February|March|April|May|June|July|August|September|October|November|December) 20\d\d/) || [])[0];
  if (!edition) report.push('Édition du bulletin USDA illisible : à vérifier à la main.');
  else if (edition !== citedEdition) report.push(`Le bulletin USDA affiche maintenant l’édition ${edition} (le site cite ${citedEdition}). À relire avant de mettre à jour les tableaux Afrique et l’observatoire : ${usdaUrl}`);
} catch (error) {
  report.push(`Bulletin USDA non vérifiable (${error.message}) : ${usdaUrl}`);
}

fs.writeFileSync(process.env.REPORT_PATH || 'source-watch.md', report.length ? report.map(r => `- ${r}`).join('\n') + '\n' : '');
console.log(report.length ? report.join('\n') : 'Aucune nouveauté détectée sur les sources suivies.');
