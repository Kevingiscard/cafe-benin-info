window.COFFEE_OBSERVATORY = {
  updated: '20 novembre 2026',
  sources: {
    fao: { label: 'FAO', url: 'https://www.fao.org/coffee/fr', tone: 'institutionnelle' },
    faostat: { label: 'FAOSTAT', url: 'https://www.fao.org/faostat/fr/', tone: 'institutionnelle' },
    beninDecree: { label: 'Décret béninois n° 2001-351', url: 'https://sgg.gouv.bj/doc/decret-2001-351/download', tone: 'officielle-historique' },
    faostatQcl: { label: 'FAOSTAT, Production de cultures et produits animaux (QCL), café vert, Bénin, fichier du 31 décembre 2025', url: 'https://www.fao.org/faostat/fr/#data/QCL', tone: 'institutionnelle' },
    africaApi: { label: 'Africa API, relais déclaré de FAOSTAT', url: 'https://africa-api.com/data/benin/coffee', tone: 'secondaire' },
    usda: { label: 'USDA FAS, Coffee: World Markets and Trade (juillet 2026)', url: 'https://apps.fas.usda.gov/psdonline/circulars/2026/07/coffee.pdf', tone: 'institutionnelle' },
    nature: { label: 'Nature Genetics (2024), génome d’Arabica', url: 'https://www.nature.com/articles/s41588-024-01695-w', tone: 'institutionnelle' },
    ico: { label: 'Organisation internationale du Café', url: 'https://www.ico.org/documents/icc-102-10e-rules-statistical-reports-final.pdf', tone: 'institutionnelle' },
    who: { label: 'OMS', url: 'https://www.who.int/tools/elena/interventions/caffeine-pregnancy', tone: 'institutionnelle' }
  },
  beninRecent: [
    { year: 2021, value: 55.00, unit: 't', label: 'café vert', confidence: 'estimation FAO', source: 'faostatQcl' },
    { year: 2022, value: 55.30, unit: 't', label: 'café vert', confidence: 'estimation FAO', source: 'faostatQcl' },
    { year: 2023, value: 55.09, unit: 't', label: 'café vert', confidence: 'estimation FAO', source: 'faostatQcl' },
    { year: 2024, value: 55.13, unit: 't', label: 'café vert', confidence: 'estimation FAO', source: 'faostatQcl' }
  ],
  global: [
    { year: '2024', value: 11.0, unit: 'Mt+', label: 'production mondiale', confidence: 'repère FAO', source: 'fao' },
    { year: '2024/25', value: 10.609, unit: 'Mt', label: 'production mondiale (USDA, juillet 2026)', confidence: 'USDA', source: 'usda' },
    { year: '2025/26', value: 10.730, unit: 'Mt', label: 'production mondiale (USDA, juillet 2026)', confidence: 'USDA', source: 'usda' },
    { year: '2026/27', value: 11.380, unit: 'Mt', label: 'production mondiale prévue (USDA, juillet 2026)', confidence: 'prévision USDA', source: 'usda' }
  ],
  facts: [
    { id: 'world-output', theme: 'monde', title: 'Plus de 11 millions de tonnes', value: '> 11 Mt', text: 'La FAO donne ce repère pour la production mondiale en 2024. Il ne s’agit pas d’une donnée béninoise.', source: 'fao', confidence: 'institutionnelle' },
    { id: 'benin-output', theme: 'benin', title: '55,13 tonnes en 2024 (estimation FAO)', value: '55,13 t', text: 'Valeur de café vert pour le Bénin lue dans le fichier FAOSTAT du 31 décembre 2025 ; la FAO la marque comme valeur estimée (drapeau E), pas comme statistique nationale déclarée. Confirmation auprès de la Direction de la Statistique Agricole encore à faire.', source: 'faostatQcl', confidence: 'estimation' },
    { id: 'arabica-share', theme: 'botanique', title: 'Arabica autour de 60 %', value: '≈ 60 %', text: 'Repère de la publication Nature Genetics (2024) : environ 60 % des produits à base de café dans le monde. La proportion n’est pas une description de la production béninoise.', source: 'nature', confidence: 'institutionnelle' },
    { id: 'pregnancy', theme: 'sante', title: 'Grossesse : surveiller la caféine', value: '> 300 mg/j', text: 'L’OMS recommande de réduire une consommation élevée de caféine pendant la grossesse. Ce n’est pas une recommandation personnalisée.', source: 'who', confidence: 'institutionnelle' }
  ],
  timeline: [
    { year: '1960–1972', title: 'Une culture industrielle prioritaire', text: 'Le décret béninois de 2001 cite 10 000 tonnes exportées sur 5 000 ha pour cette période historique.', tag: 'Bénin · historique', source: 'beninDecree' },
    { year: '1972–1993', title: 'Un fort recul documenté', text: 'Le même texte cite un passage de 5 000 à 600 ha et une production moyenne d’environ 150 tonnes/an. La méthode statistique n’est pas détaillée.', tag: 'Bénin · historique', source: 'beninDecree' },
    { year: '2021–2024', title: 'Une série récente à vérifier', text: 'FAOSTAT donne environ 55 tonnes de café vert par an (55,00 ; 55,30 ; 55,09 ; 55,13), toutes marquées comme valeurs estimées par la FAO. Ce n’est pas une mesure nationale annuelle ; la confirmation par la statistique béninoise reste à faire.', tag: 'Bénin · FAOSTAT estimé', source: 'faostatQcl' },
    { year: '2024', title: 'Un marché mondial de grande ampleur', text: 'La FAO situe la production mondiale au-dessus de 11 millions de tonnes.', tag: 'Monde · FAO', source: 'fao' },
    { year: '2024/25–2026/27', title: 'Campagnes commerciales et prévision', text: 'Le bulletin USDA de juillet 2026 donne 176,816 millions de sacs de 60 kg en 2024/25, 178,83 en 2025/26 et 189,667 prévus en 2026/27. Ces années sont des campagnes commerciales, pas des années civiles, et les éditions du bulletin se révisent.', tag: 'Monde · prévision', source: 'usda' }
  ],
  evidence: [
    { key: 'institutionnelle', label: 'Institutionnelle', detail: 'Organisation publique ou internationale avec périmètre explicite.' },
    { key: 'officielle-historique', label: 'Officielle historique', detail: 'Document public ancien, utile pour l’histoire mais pas automatiquement pour aujourd’hui.' },
    { key: 'secondaire', label: 'Secondaire à confirmer', detail: 'Relais ou miroir de données : utile comme piste, à contrôler dans la source primaire.' },
    { key: 'estimation', label: 'Estimation', detail: 'Valeur estimée ou arrondie, à ne pas confondre avec une mesure exhaustive.' }
  ]
};
