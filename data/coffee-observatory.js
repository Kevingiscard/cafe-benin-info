window.COFFEE_OBSERVATORY = {
  updated: '3 novembre 2026',
  sources: {
    fao: { label: 'FAO', url: 'https://www.fao.org/coffee/fr', tone: 'institutionnelle' },
    faostat: { label: 'FAOSTAT', url: 'https://www.fao.org/faostat/fr/', tone: 'institutionnelle' },
    beninDecree: { label: 'Décret béninois n° 2001-351', url: 'https://sgg.gouv.bj/doc/decret-2001-351/download', tone: 'officielle-historique' },
    africaApi: { label: 'Africa API, relais déclaré de FAOSTAT', url: 'https://africa-api.com/data/benin/coffee', tone: 'secondaire' },
    usda: { label: 'USDA FAS', url: 'https://www.fas.usda.gov/data/production/0711100', tone: 'institutionnelle' },
    ico: { label: 'Organisation internationale du Café', url: 'https://www.ico.org/documents/icc-102-10e-rules-statistical-reports-final.pdf', tone: 'institutionnelle' },
    who: { label: 'OMS', url: 'https://www.who.int/tools/elena/interventions/caffeine-pregnancy', tone: 'institutionnelle' }
  },
  beninRecent: [
    { year: 2021, value: 55.00, unit: 't', label: 'café vert', confidence: 'à confirmer', source: 'africaApi' },
    { year: 2022, value: 55.30, unit: 't', label: 'café vert', confidence: 'à confirmer', source: 'africaApi' },
    { year: 2023, value: 55.09, unit: 't', label: 'café vert', confidence: 'à confirmer', source: 'africaApi' },
    { year: 2024, value: 55.13, unit: 't', label: 'café vert', confidence: 'à confirmer', source: 'africaApi' }
  ],
  global: [
    { year: '2024', value: 11.0, unit: 'Mt+', label: 'production mondiale', confidence: 'repère FAO', source: 'fao' },
    { year: '2024/25', value: 10.4913, unit: 'Mt', label: 'production mondiale prévue', confidence: 'prévision USDA', source: 'usda' },
    { year: '2025/26', value: 10.7298, unit: 'Mt', label: 'production mondiale prévue', confidence: 'prévision USDA', source: 'usda' }
  ],
  facts: [
    { id: 'world-output', theme: 'monde', title: 'Plus de 11 millions de tonnes', value: '> 11 Mt', text: 'La FAO donne ce repère pour la production mondiale en 2024. Il ne s’agit pas d’une donnée béninoise.', source: 'fao', confidence: 'institutionnelle' },
    { id: 'benin-output', theme: 'benin', title: '55,13 tonnes affichées pour 2024', value: '55,13 t', text: 'Série de café vert reprise par un relais secondaire déclarant utiliser FAOSTAT. À confirmer par une extraction FAOSTAT archivée.', source: 'africaApi', confidence: 'secondaire' },
    { id: 'arabica-share', theme: 'botanique', title: 'Arabica autour de 60 %', value: '≈ 60 %', text: 'Repère mondial publié par la FAO. La proportion n’est pas une description de la production béninoise.', source: 'fao', confidence: 'institutionnelle' },
    { id: 'pregnancy', theme: 'sante', title: 'Grossesse : surveiller la caféine', value: '> 300 mg/j', text: 'L’OMS recommande de réduire une consommation élevée de caféine pendant la grossesse. Ce n’est pas une recommandation personnalisée.', source: 'who', confidence: 'institutionnelle' }
  ],
  timeline: [
    { year: '1960–1972', title: 'Une culture industrielle prioritaire', text: 'Le décret béninois de 2001 cite 10 000 tonnes exportées sur 5 000 ha pour cette période historique.', tag: 'Bénin · historique', source: 'beninDecree' },
    { year: '1972–1993', title: 'Un fort recul documenté', text: 'Le même texte cite un passage de 5 000 à 600 ha et une production moyenne d’environ 150 tonnes/an. La méthode statistique n’est pas détaillée.', tag: 'Bénin · historique', source: 'beninDecree' },
    { year: '2021–2024', title: 'Une série récente à vérifier', text: 'Un relais secondaire affiche environ 55 tonnes de café vert par an. La série est affichée comme « à confirmer », jamais comme une vérité définitive.', tag: 'Bénin · secondaire', source: 'africaApi' },
    { year: '2024', title: 'Un marché mondial de grande ampleur', text: 'La FAO situe la production mondiale au-dessus de 11 millions de tonnes et l’Arabica autour de 60 %.', tag: 'Monde · FAO', source: 'fao' },
    { year: '2024/25–2025/26', title: 'Des prévisions en année commerciale', text: 'L’USDA prévoit 174,855 puis 178,83 millions de sacs de 60 kg. Ces années ne sont pas des années civiles.', tag: 'Monde · prévision', source: 'usda' }
  ],
  evidence: [
    { key: 'institutionnelle', label: 'Institutionnelle', detail: 'Organisation publique ou internationale avec périmètre explicite.' },
    { key: 'officielle-historique', label: 'Officielle historique', detail: 'Document public ancien, utile pour l’histoire mais pas automatiquement pour aujourd’hui.' },
    { key: 'secondaire', label: 'Secondaire à confirmer', detail: 'Relais ou miroir de données : utile comme piste, à contrôler dans la source primaire.' },
    { key: 'estimation', label: 'Estimation', detail: 'Valeur estimée ou arrondie, à ne pas confondre avec une mesure exhaustive.' }
  ]
};
