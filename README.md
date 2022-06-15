# Urbanature

Ceci est un prototype en cours de développement

<!-- [Vous pouvez le tester ici](https://totoshampoin.github.io/urbanature/) -->

## Ajouter des données

- Les données doivent être sous la forme de tableau d'objets, en un fichier JSON
- Si besoin de réorganiser ou simplifier la structure du JSON, utiliser [JSON Mapper](https://totoshampoin.github.io/JsonMapper/)
  - [Comment s'en servir (en Anglais)](https://github.com/TotoShampoin/JsonMapper)
- Utiliser [Data Splitter](https://totoshampoin.github.io/DataSplitter/) pour diviser le fichier JSON d'après une des colonnes
  - [Comment s'en servir (en Anglais)](https://github.com/TotoShampoin/DataSplitter)
- Décompresser le .zip obtenu et mettre le contenu dans un nouveau dossier dans `database/json`
- Modifier le fichier `database/json/table.json` pour fournir à l'application les informations nécessaires à l'intégration de ces nouvelles données
  - S'aider des données déjà présentes dans ledit fichier
    - name: Le nom de la nouvelle table de données
    - path: Le nom du dossier contenant celle-ci
    - key_path: Le champ `Key split factor` (dans DataSplitter)
    - name_path: Le champ `Key bame` (dans DataSplitter)
    - category: La catégorie où va cette table
    - color: Couleur des zones géographiques, s'il y en a
- Dans le dossier déposé dans `database/json`, ajouter les fichiers suivants
  - `marker.svg`: L'icône du marqueur sur la carte (s'il y en a dans cette table)
  - `template.html`: La structuration du cadran d'informations concernant chaque ligne de cette table
    - S'inspirer des autres `template.html`
- Ajouter l'intégralité des nouveaux fichiers dans la table des caches, dans le fichier `cache/db.js`
  - S'aider du fichier `cachelist-maker.py` situé à la racine; le résultat se situe dans `cachelist.js` à la racine
  - Ne pas oublier de mettre à jour la variable `PRECACHE` en mettant la date et heure de mise à jour

Github met généralement un certain temps avant de valider les mises à jour sur la page.
