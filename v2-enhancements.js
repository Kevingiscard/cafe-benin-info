/* Café Bénin V2 — progressive enhancement layer
 * Keeps the existing site intact while adding search, favorites, reading tools,
 * accessibility improvements and a premium mobile UX.
 */
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const css = `
    :root{--cb-red:#b91c1c;--cb-red-2:#dc2626;--cb-cream:#f4eee6;--cb-coffee:#3b2418}
    body.cb-v2{--cb-shadow:0 20px 60px rgba(0,0,0,.35)}
    .cb-v2-search{position:fixed;inset:0;z-index:10000;background:rgba(3,3,3,.78);backdrop-filter:blur(14px);display:none;align-items:flex-start;justify-content:center;padding:8vh 16px}
    .cb-v2-search.open{display:flex}
    .cb-search-panel{width:min(760px,100%);background:#0c0c0c;border:1px solid rgba(255,255,255,.12);box-shadow:var(--cb-shadow);border-radius:18px;overflow:hidden}
    .cb-search-top{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.08)}
    .cb-search-top input{flex:1;background:transparent;border:0;outline:0;color:#fff;font-size:16px}
    .cb-search-results{max-height:62vh;overflow:auto;padding:8px}
    .cb-result{display:block;padding:14px;border-radius:12px;color:#fff;text-decoration:none}
    .cb-result:hover,.cb-result:focus{background:rgba(185,28,28,.12);outline:none}
    .cb-result small{display:block;color:#737373;text-transform:uppercase;letter-spacing:.12em;font-size:9px;margin-bottom:5px}
    .cb-result span{display:block;color:#a3a3a3;font-size:12px;margin-top:4px;line-height:1.5}
    .cb-search-empty{padding:28px;color:#737373;text-align:center;font-size:13px}
    .cb-search-trigger{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#a3a3a3;padding:8px 11px;border-radius:10px;font-size:11px;cursor:pointer}
    .cb-search-trigger:hover{color:#fff;border-color:rgba(185,28,28,.55)}
    .cb-float{position:fixed;right:18px;bottom:18px;z-index:90;display:flex;flex-direction:column;gap:8px}
    .cb-float button{width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.12);background:#111;color:#fff;cursor:pointer;box-shadow:0 8px 25px rgba(0,0,0,.25)}
    .cb-float button:hover{border-color:var(--cb-red);transform:translateY(-2px)}
    .cb-reading .reveal{opacity:1!important;transform:none!important}
    .cb-reading .br-img{filter:none!important;opacity:1!important;transform:none!important}
    .cb-reading main,.cb-reading section{scroll-margin-top:90px}
    .cb-progress{position:fixed;top:0;left:0;height:2px;width:0;background:var(--cb-red-2);z-index:10001;transition:width .1s linear}
    .cb-fav-active{color:#f59e0b!important;border-color:#f59e0b!important}
    @media(max-width:768px){
      .cb-v2-search{padding:3vh 10px}
      .cb-search-panel{border-radius:14px}
      .cb-search-results{max-height:72vh}
      .cb-float{right:12px;bottom:12px}
      .cb-search-trigger .cb-kbd{display:none}
    }
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}.reveal{opacity:1!important;transform:none!important}.br-img{opacity:1!important;filter:none!important;transform:none!important}}
  `;
  const style = document.createElement('style');
  style.id = 'cafe-benin-v2-style';
  style.textContent = css;
  document.head.appendChild(style);
  document.body.classList.add('cb-v2');

  // Reading progress.
  const progress = document.createElement('div');
  progress.className = 'cb-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, window.scrollY / max * 100) : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  // Search overlay built from existing page content; no duplicated database required.
  const search = document.createElement('div');
  search.className = 'cb-v2-search';
  search.setAttribute('aria-hidden','true');
  search.innerHTML = `<div class="cb-search-panel" role="dialog" aria-modal="true" aria-label="Recherche Café Bénin">
    <div class="cb-search-top"><span aria-hidden="true">⌕</span><input id="cb-search-input" type="search" autocomplete="off" placeholder="Rechercher dans l'encyclopédie…"><button id="cb-search-close" type="button" aria-label="Fermer">×</button></div>
    <div id="cb-search-results" class="cb-search-results"></div>
  </div>`;
  document.body.appendChild(search);

  const input = $('#cb-search-input');
  const results = $('#cb-search-results');
  const closeSearch = () => { search.classList.remove('open'); search.setAttribute('aria-hidden','true'); };
  const openSearch = () => { search.classList.add('open'); search.setAttribute('aria-hidden','false'); setTimeout(()=>input.focus(),30); renderResults(''); };

  const buildIndex = () => {
    const items = [];
    $$('section[id]').forEach(section => {
      const heading = $('h1,h2,h3', section);
      if (!heading) return;
      const title = heading.textContent.replace(/\s+/g,' ').trim();
      const text = section.textContent.replace(/\s+/g,' ').trim();
      if (title) items.push({title, id:section.id, text:text.slice(0,240), type:'Section'});
    });
    $$('#dictionnaire h4').forEach(el => {
      const card = el.closest('div');
      const text = card ? card.textContent.replace(/\s+/g,' ').trim() : el.textContent.trim();
      items.push({title:el.textContent.trim(), id:'dictionnaire', text:text.slice(0,220), type:'Dictionnaire'});
    });
    return items;
  };

  let index = buildIndex();
  const renderResults = query => {
    const q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '<div class="cb-search-empty">Recherchez une section, un terme ou un sujet du café.</div>';
      return;
    }
    const terms = q.split(/\s+/).filter(Boolean);
    const ranked = index.map(item => {
      const hay = `${item.title} ${item.text}`.toLowerCase();
      const score = terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0);
      return {...item,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,12);
    if (!ranked.length) { results.innerHTML='<div class="cb-search-empty">Aucun résultat. Essayez « Robusta », « santé », « terroir » ou « recette ».</div>'; return; }
    results.innerHTML = ranked.map(item => `<a class="cb-result" href="#${item.id}"><small>${escapeHTML(item.type)}</small><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.text.slice(0,180))}${item.text.length>180?'…':''}</span></a>`).join('');
  };
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  input.addEventListener('input',()=>renderResults(input.value));
  $('#cb-search-close').addEventListener('click',closeSearch);
  search.addEventListener('click',e=>{if(e.target===search)closeSearch();});
  search.addEventListener('click',e=>{if(e.target.closest('.cb-result')) closeSearch();});

  // Add a compact search trigger to the existing desktop navbar.
  const nav = $('#navbar');
  if (nav && !$('#cb-search-trigger')) {
    const trigger = document.createElement('button');
    trigger.id='cb-search-trigger'; trigger.type='button'; trigger.className='cb-search-trigger';
    trigger.innerHTML='<span>⌕</span><span>Rechercher</span><span class="cb-kbd">Ctrl K</span>';
    trigger.addEventListener('click',openSearch);
    const actions = nav.lastElementChild;
    if (actions) actions.prepend(trigger);
  }

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='k') { e.preventDefault(); openSearch(); }
    if (e.key==='Escape') closeSearch();
  });

  // Favorites stored locally. Exposes window.CafeBeninFavorites for future UI.
  const FAVORITES_KEY='cafe-benin:favorites:v2';
  const getFavs=()=>{try{return JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]')}catch{return[]}};
  const setFavs=f=>localStorage.setItem(FAVORITES_KEY,JSON.stringify(f));
  window.CafeBeninFavorites={
    all:getFavs,
    has:id=>getFavs().includes(id),
    toggle:id=>{const f=getFavs();const i=f.indexOf(id);if(i>=0)f.splice(i,1);else f.push(id);setFavs(f);return !i>=0;}
  };

  // Add accessible back-to-top + reading mode.
  const float=document.createElement('div'); float.className='cb-float';
  float.innerHTML='<button id="cb-reading" type="button" title="Mode lecture" aria-label="Activer le mode lecture">Aa</button><button id="cb-top" type="button" title="Retour en haut" aria-label="Retour en haut">↑</button>';
  document.body.appendChild(float);
  $('#cb-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  $('#cb-reading').addEventListener('click',()=>{document.body.classList.toggle('cb-reading');$('#cb-reading').classList.toggle('cb-fav-active',document.body.classList.contains('cb-reading'));});

  // Fix body scroll lock for the existing mobile menu.
  const mobileMenu=$('#mmenu');
  const lock=()=>{document.body.style.overflow='hidden';};
  const unlock=()=>{if(!mobileMenu || !mobileMenu.classList.contains('open')) document.body.style.overflow='';};
  $('#menu-toggle')?.addEventListener('click',lock);
  $('#menu-close')?.addEventListener('click',unlock);
  mobileMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',unlock));

  // Refresh the search index after late content has loaded.
  setTimeout(()=>{index=buildIndex();},1500);
})();
