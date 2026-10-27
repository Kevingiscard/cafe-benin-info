(() => {
  'use strict';
  const records = [["repere-national","Références nationales","Données publiques et documents datés à rechercher auprès des organismes compétents. Le site ne publie ici aucun chiffre de production non vérifié."],["observations","Observations de terrain","Pour documenter une activité locale, il faut une date, un lieu confirmé, le rôle de la personne interrogée et son accord de citation."],["statistiques","Séries statistiques","Comparer des données exige une définition, une période, une unité, une méthode et une source. Une case vide signifie « non documenté ici », pas « zéro »."]];
  const output = document.getElementById('research-result');
  document.querySelectorAll('[data-research]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-research]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const record = records.find(item => item[0] === button.dataset.research);
    if (!record) return;
    const heading = document.createElement('h3'); heading.textContent = record[1];
    const paragraph = document.createElement('p'); paragraph.textContent = record[2];
    output.replaceChildren(heading, paragraph);
  }));
})();