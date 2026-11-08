# Principes publics vérifiés pour la passe design 2026

Les références publiques consultées sont des guides et dépôts d’exemples, pas des dépendances intégrées au site.

## Principes retenus

Les guidelines Web Interface Guidelines de Vercel insistent sur des contrôles utilisables au clavier, des focus visibles, des zones tactiles d’au moins 44 px sur mobile, des champs de saisie d’au moins 16 px sur mobile, des états vides et d’erreur conçus, des liens profonds pour les filtres, des animations compositor-friendly et le respect de `prefers-reduced-motion`.

Elles recommandent aussi de ne pas utiliser `transition: all`, de donner une alternative clavier aux gestes, d’utiliser les éléments HTML natifs avant ARIA, de conserver les URL comme état partageable et de prévoir des dimensions explicites pour les images.

Le dépôt public `anthropics/skills` présente le format Agent Skills et des exemples de compétences spécialisées. Le dépôt public `vercel-labs/agent-skills` regroupe notamment des skills de revue d’interface, de rédaction, de performance et de transitions. Ces ressources servent ici de grille de qualité : elles ne sont pas copiées dans le dépôt Café Bénin et aucun code tiers n’est exécuté.

## Application à Café Bénin

La deuxième passe ajoute des filtres d’atlas partageables par URL, des états de focus et de touch plus robustes, un affichage adapté aux écrans mobiles, des micro-interactions réversibles, des légendes explicites pour les illustrations générées et une vérification visuelle aux largeurs desktop et mobile.

## Sources

- [1]: https://github.com/vercel-labs/web-interface-guidelines "Web Interface Guidelines — Vercel Labs"
- [2]: https://github.com/vercel-labs/agent-skills "Agent Skills — Vercel Labs"
- [3]: https://github.com/anthropics/skills "Agent Skills — Anthropic"
- [4]: https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/web-design-guidelines/SKILL.md "Web Design Guidelines Skill — Vercel Labs"
