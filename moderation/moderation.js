(() => {
  'use strict';
  const t = document.getElementById('t'), m = document.getElementById('m'), l = document.getElementById('l');
  const call = body => fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());
  async function load() {
    m.textContent = 'Chargement…'; l.textContent = '';
    const r = await call({ action: 'mod_list', token: t.value }).catch(() => null);
    if (!r || r.error) { m.textContent = r && r.error === 'auth' ? 'Code incorrect.' : r && r.error === 'disabled' ? 'Modération non activée.' : 'Indisponible pour le moment.'; return; }
    m.textContent = r.items.length ? r.items.length + ' élément(s) en attente.' : 'Rien en attente.';
    r.items.forEach(it => {
      const d = document.createElement('div'); d.className = 'item';
      const k = document.createElement('div'); k.className = 'k'; k.textContent = (it.kind === 'review' ? 'AVIS' : 'SIGNALEMENT') + ' · ' + it.page + ' · ' + it.at + (it.name ? ' · ' + it.name : '');
      const p = document.createElement('p'); p.textContent = it.text;
      d.append(k, p);
      const act = (label, decision) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.addEventListener('click', async () => { b.disabled = true; const x = await call({ action: 'mod_decide', token: t.value, id: it.id, decision }).catch(() => null); if (x && x.ok) { d.remove(); const n = l.children.length; m.textContent = n ? n + ' élément(s) en attente.' : 'Rien en attente.'; } else { b.disabled = false; m.textContent = 'Action impossible.'; } }); d.appendChild(b); };
      if (it.kind === 'review') act('Approuver et publier', 'approve');
      act(it.kind === 'review' ? 'Refuser' : 'Marquer comme traité', 'reject');
      l.appendChild(d);
    });
  }
  document.getElementById('go').addEventListener('click', load);
})();
