# Let's Camel Tours

Site web officiel de **Let's Camel Tours** — agence de circuits et d'excursions dans le désert (balades à dos de chameau, activités, riads, souks et découvertes locales).

🌐 En ligne : [letscameltours.com](https://letscameltours.com)

## Aperçu

Site statique en HTML, CSS et JavaScript, sans étape de build. Le changement de langue se fait côté client via des attributs `data-en` / `data-fr` / `data-es` / `data-de` sur les éléments de contenu.

**Langues prises en charge :** Anglais (EN), Français (FR), Espagnol (ES), Allemand (DE).

## Structure des pages

| Fichier | Description |
|---|---|
| `index.html` | Page d'accueil |
| `about-us.html` | À propos de l'agence |
| `tours.html` | Vue d'ensemble des circuits |
| `tour-1.html` … `tour-4.html` | Pages détaillées des circuits |
| `activities.html` | Activités proposées |
| `excursions.html` | Excursions |
| `blog-1.html` … `blog-3.html` | Articles de blog |
| `lets-camel-landing.html` | Page d'atterrissage (landing) |

Les images (`.jpg`, `.png`) et les logos sont à la racine du projet.

## Développement local

Le site est entièrement statique : aucune installation n'est nécessaire.

- Ouvrez simplement `index.html` dans un navigateur, **ou**
- Servez le dossier avec un serveur local, par exemple :

```bash
python -m http.server 8000
```

Puis ouvrez http://localhost:8000 dans votre navigateur.

## Déploiement

Le site est déployé via **GitHub Pages** sur le domaine personnalisé défini dans le fichier `CNAME` (`letscameltours.com`). Toute modification fusionnée dans la branche `main` est publiée automatiquement.
