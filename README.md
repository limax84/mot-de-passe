# Mot de passe — le jeu

PWA responsive inspirée du jeu télévisé « Mot de passe » (France 2) : faites
deviner le mot mystère à votre partenaire en donnant des indices d'un seul mot,
sur un seul téléphone.

![Aperçu](public/icons/icon-192.png)

## Modes de jeu

- **Le Duel** — deux équipes s'affrontent en manches chronométrées (30/45/60 s,
  1 à 3 manches par équipe). Jusqu'à 5 mots par manche, 1 point par mot trouvé.
- **La Finale** — choisissez votre mise (500 / 1 000 / 1 500 €) puis faites
  deviner 5 mots en 90 secondes avec 3 indices maximum par mot. 5/5 : mise
  doublée (jusqu'à 3 000 €), 3 ou 4 : mise remportée, sinon tout est perdu.

## Base de mots

≈ 950 mots français calibrés en trois niveaux (`src/data/words.ts`) :

| Niveau | Contenu |
|---|---|
| Facile | vocabulaire courant et concret |
| Moyen | vocabulaire abstrait, « comme à la télé » |
| Difficile | vocabulaire rare, précis ou littéraire |

Un mode « Mélange » pioche dans les trois niveaux. Les mots déjà joués ne
reviennent pas durant la même partie.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4 — thème bleu nuit inspiré du plateau TV
- PWA : `manifest.webmanifest`, service worker hors ligne (`public/sw.js`),
  icônes générées par `npm run icons`
- Sons de plateau générés en WebAudio (aucun asset audio)
- Tests e2e [Playwright](https://playwright.dev) (desktop + mobile)

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

## Tester

```bash
npm run build
npm test           # lance les e2e sur http://localhost:3100
```

## Production

```bash
npm run build && npm start
```

L'application s'installe sur l'écran d'accueil (Ajouter à l'écran d'accueil)
et reste jouable hors ligne après la première visite.
