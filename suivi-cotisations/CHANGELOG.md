# Journal des versions

## 1.2.0 — 9 novembre 2026

### Effectifs mensuels

- Colonne **Effectif** modifiable pour chaque employeur et chaque mois, avec retour automatique à l'effectif de référence de la fiche lorsque la cellule est effacée.
- Effectif **0** accepté pour signaler une absence de salarié sur un mois.
- Synthèse 12 mois : colonne **Effectif moyen** par employeur, ligne **Effectif total** mois par mois et effectif total moyen de l'année.
- Totaux d'effectif dans la saisie mensuelle et dans les exports CSV.
- Import CSV : colonne **Effectif** optionnelle, sans écraser les autres valeurs du mois.
- Conservation des effectifs mensuels dans les sauvegardes JSON et lors des imports.

### Apparence

- Bouton **Thème** dans la barre supérieure avec trois présentations : **Bleu et blanc**, **Gris et jaune**, **Rouge et gris**.
- Choix mémorisé sur le poste, appliqué dès l'ouverture de l'application.

### Tests

- Nouveaux contrôles automatiques sur les effectifs mensuels, l'effectif moyen et les thèmes.

## 1.1.0 — 9 novembre 2026

### Fiabilité et données

- Validation du schéma des fichiers JSON importés (employeurs, suivi mensuel, paramètres) avec messages explicites.
- Version de données (`dataVersion`) et migration automatique des anciennes sauvegardes.
- Sauvegardes automatiques locales : les 5 dernières copies créées avant un import, une réinitialisation ou une restauration sont conservées et peuvent être restaurées depuis les Paramètres.
- Téléchargement automatique de l'état précédent si une sauvegarde locale ne peut pas être enregistrée.
- Réinitialisation protégée par la saisie de « EFFACER », avec export JSON proposé.
- Détection du quota de stockage : alerte à 80 % et bannière persistante si l'enregistrement échoue.

### Ergonomie

- Colonne **Effectif** ajoutée dans le tableau de saisie du suivi mensuel.
- Recherche différée (250 ms) et rafraîchissement limité aux lignes concernées.
- Affichage progressif du détail des assurés par tranches de 500 lignes, avec totaux calculés sur toutes les lignes filtrées.
- Fil d'Ariane dans la fiche employeur et libellés vocaux enrichis sur les champs de recherche et les montants mensuels.
- Raccourcis clavier : Ctrl+K (recherche), Ctrl+S (export JSON), G puis D / G puis E (navigation).
- Impression isolée de la fiche et des courriers, paysage pour les tableaux mensuels.

### Qualité et transparence

- Notice sur le stockage en clair et les précautions à prendre.
- Version visible dans la barre latérale et dans les Paramètres.
- Page `tests.html` de contrôles autonomes.
- Message explicite si un fichier de l'application est manquant au démarrage.

## 1.0.0 — version initiale

- Reprise du classeur des 71 employeurs.
- Suivi mensuel, situation, assurés, journal, échéanciers.
- Suivi pluriannuel avec report automatique du solde antérieur.
- Import / export CSV et JSON, impression et courriers de recouvrement.
