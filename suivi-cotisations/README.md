# Suivi du recouvrement des cotisations impayées

Application web locale qui reprend le classeur `suivi_cotisations_impayees opti.xlsx`.
Aucune installation, aucun serveur : le fichier `index.html` s'ouvre dans le navigateur et
les données sont enregistrées automatiquement sur ce poste.

## Ouvrir l'application

- Double-cliquez sur `index.html`, ou sur `Ouvrir l'application.bat`.
- Utilisez de préférence Chrome, Edge ou Firefox, y compris hors connexion.
- Le registre initial contient les **71 employeurs** du classeur. Les montants sont à saisir.

## Modules

| Module | Rôle |
| --- | --- |
| Tableau de bord | Indicateurs, taux de recouvrement, alertes, 5 dossiers les plus anciens |
| Employeurs | Registre, recherche, fiche détaillée imprimable, courriers de recouvrement, ajout / modification / suppression |
| Suivi mensuel | Dû global, encaissements et effectif modifiable mois par mois, synthèse annuelle avec effectif moyen et cumulée, import CSV. La touche Entrée passe à la ligne suivante dans la même colonne |
| Situation mensuelle | Qui a déclaré, payé en partie, pas payé ou non déclaré, mois par mois |
| Détail assurés | Traçabilité facultative par assuré, avec calcul automatique des cotisations |
| Journal | Appels, courriers, visites, engagements et prochaine action |
| Échéanciers | Échéances négociées, paiements, retards |
| Paramètres | Règles de calcul, année de suivi, date de référence, qualité des données, sauvegarde / restauration |

## Suivi pluriannuel

- Le suivi est organisé par **année civile** (janvier → décembre). Choisissez l'année dans la
  barre supérieure ou dans Paramètres → Suivi annuel.
- Les années précédentes sont conservées : revenir à une année affiche ses données sans les modifier.
- Le **solde impayé au 31 décembre** est automatiquement reporté au 1<sup>er</sup> janvier suivant
  comme **solde antérieur**. Il s'ajoute au solde de l'année affichée pour donner le **solde cumulé**.
- Ne saisissez donc pas ce report dans le dû de janvier : il serait compté deux fois. Un encaissement
  reçu pour un impayé antérieur peut être saisi dans l'année en cours (il réduit alors le solde cumulé)
  ou dans l'année d'origine.
- « Préparer N+1 » (Paramètres) bascule simplement l'affichage sur l'année suivante ; aucune donnée
  n'est effacée.

## Effectifs

- La fiche employeur contient un **effectif de référence**.
- Dans **Suivi mensuel → Saisie par mois**, la colonne **Effectif** est modifiable pour chaque organisme et chaque mois. Une valeur saisie remplace l'effectif de référence pour ce mois uniquement ; effacez la cellule pour revenir à la référence (la valeur grisée indique que la référence est utilisée).
- La valeur `0` est acceptée : elle signifie qu'aucun salarié n'est déclaré pour ce mois.
- L'onglet **Synthèse 12 mois** affiche l'**effectif moyen** de chaque employeur, la ligne **Effectif total** mois par mois, et l'effectif total moyen de l'année.
- L'effectif suit donc les variations saisonnières sans modifier la fiche employeur.

## Règles de calcul

- **Dû retenu** d'un mois = total du détail des assurés s'il existe pour ce mois, sinon dû global saisi.
- **Solde annuel** = dû retenu de l'année − encaissé de l'année.
- **Solde antérieur** = cumul des soldes de tous les mois antérieurs au 1<sup>er</sup> janvier.
- **Solde cumulé** = solde antérieur + solde annuel.
- **Taux de recouvrement** = encaissé cumulé (année + antérieur) ÷ dû cumulé, pour rester cohérent
  lorsqu'un paiement de l'année apure une dette antérieure.
- **Situation** : déclaré et payé, partiellement payé, non payé, ou non déclaré.
- **Ancienneté** : nombre de jours depuis le premier mois dont le solde est positif, toutes années confondues. Aucune ancienneté n'est affichée lorsque le solde cumulé est nul ou négatif (dossier soldé ou en crédit).
- **Détail assuré** : salaire mensuel = indice × valeur indiciaire ÷ 12 ;
  part employé 7 %, part employeur 20 % (total 27 %). Ces valeurs sont modifiables dans Paramètres.
  Les deux parts sont arrondies séparément au franc : le total peut différer de 1 FCFA du calcul direct de 27 %.
- Les **alertes** couvrent les échéances et actions à venir (30 jours par défaut) et les retards.

## Impression et PDF

- Le bouton **Imprimer** de la barre supérieure imprime la vue affichée (tableau de bord, registre, suivi mensuel…).
- Depuis une **fiche employeur**, le bouton **Imprimer / PDF** n'imprime que la fiche, sans les menus ni les boutons.
- Dans la fenêtre d'impression du navigateur, choisissez « Enregistrer au format PDF » pour obtenir un fichier PDF.
- Les tableaux mensuels et la situation mensuelle s'impriment en **paysage** sur les navigateurs compatibles.
- Les courriers disposent de leur propre bouton d'impression et s'impriment seuls, sans l'interface.

## Import du suivi mensuel (CSV)

Dans **Suivi mensuel → Importer**, chargez un fichier CSV pour renseigner plusieurs employeurs et plusieurs mois en une fois.

- Colonnes reconnues : **N° immatriculation**, **Mois**, **Dû global**, **Encaissé**. La colonne **Effectif** est optionnelle et remplace l'effectif du mois concerné. Le séparateur peut être `;`, `,` ou une tabulation.
- Le mois accepte `2026-01`, `01/2026`, `202601`, `31/12/2025` ou `janvier 2026`.
- Les montants acceptent les espaces, la virgule décimale et le suffixe FCFA (`1 000 000,50`).
- Une cellule de montant vide laisse la valeur existante inchangée. Saisissez `0` pour remettre un montant à zéro.
- Avant l'import, un aperçu liste les lignes valides, les créations, les mises à jour, les doublons et les erreurs. Les lignes en erreur sont ignorées ; rien n'est écrit avant la confirmation.
- Le bouton **Modèle** télécharge un CSV vide avec les bonnes colonnes.
- Si un mois possède un **détail des assurés**, le dû global importé n'est pas retenu pour ce mois (le détail reste prioritaire) ; l'encaissement est bien enregistré. L'aperçu le signale.
- Depuis Excel : « Fichier → Enregistrer sous → CSV UTF-8 » pour conserver les accents. L'import direct des fichiers `.xlsx` n'est pas pris en charge.

## Courriers de recouvrement

- Fiche employeur → **Courrier** génère une **relance amiable** ou une **mise en demeure** préremplie avec l'employeur, la période impayée et le solde cumulé.
- Le texte est librement modifiable dans la fenêtre, puis peut être copié ou imprimé / enregistré en PDF.
- Le courrier n'est proposé que si le solde cumulé est positif. Vérifiez les délais et les mentions légales avant envoi.

## Qualité des données

**Paramètres → Qualité des données** recense les dossiers à compléter : contacts absents, contacts sans e-mail, raisons sociales en majuscules et statuts à vérifier.

- **Statut suggéré** : « Échéancier en cours » si une échéance n'est pas payée, « Soldé » si le solde cumulé est nul ou négatif, sinon « À relancer ». Le bouton « Appliquer » remplace le statut manuel.
- **Normalisation des noms** : les raisons sociales en majuscules peuvent être converties en casse normale. Un aperçu est affiché avant application ; les sigles de 4 lettres ou moins, les références avec chiffres et les noms à un seul mot sont conservés.
- Les contacts et les e-mails ne sont jamais inventés : ils restent à compléter manuellement.

## Apparence

- Le bouton **Thème** de la barre supérieure propose trois présentations : **Bleu et blanc** (par défaut), **Gris et jaune**, **Rouge et gris**.
- Le choix s'applique immédiatement à toute l'interface et reste mémorisé sur cet ordinateur, dans le navigateur utilisé.
- Le thème ne modifie que les couleurs : aucune donnée, aucun calcul et aucun export ne changent.

## Accessibilité

- Les liens de dossier et les actions se manipulent au clavier : **Entrée** ou **Espace** ouvre la fiche, **Échap** ferme la fenêtre.
- Les boutons icônes disposent d'un libellé vocal, et les animations sont réduites si le système demande moins de mouvement.
- Raccourcis : **Ctrl+K** (ou Cmd+K) ouvre la recherche d'employeurs, **Ctrl+S** exporte une sauvegarde JSON, **G puis D** va au tableau de bord, **G puis E** va aux employeurs.

## Sauvegarde des données

- Enregistrement automatique dans le navigateur (`localStorage`) : rien n'est écrit dans un fichier
  tant que vous n'exportez pas.
- Les données sont liées au navigateur et au profil utilisateur. Une fenêtre de navigation privée
  perd les données à la fermeture.
- **Exportez régulièrement une sauvegarde JSON** avec le bouton « Exporter » ou depuis Paramètres.
- Pour restaurer : Paramètres → « Importer une sauvegarde ».
- Chaque module propose aussi un export **CSV** (séparateur `;`, UTF-8) lisible dans Excel.
- Le stockage du navigateur est limité (environ 5 Mo). À partir de 80 % d'utilisation, une bannière
  vous invite à exporter. Si l'enregistrement échoue faute de place, elle reste affichée et précise
  que les dernières modifications ne sont pas sauvegardées.
- Un import JSON vide, sans employeur valide ou illisible est refusé ; les entrées incomplètes sont
  ignorées au lieu de bloquer l'application.
- Chaque sauvegarde porte une **version de données** ; les anciennes sauvegardes sont migrées
  automatiquement à l'ouverture.
- **Sauvegardes automatiques** : l'application conserve les **5 dernières** copies locales, créées
  avant chaque import ou réinitialisation. Elles sont listées dans Paramètres → Sauvegarde et données,
  avec les boutons **Restaurer** et **Supprimer**. Si l'espace manque, le JSON de l'état précédent est
  téléchargé avant l'import.
- **Données en clair** : le registre est stocké sans chiffrement dans le navigateur. Toute personne
  utilisant la session Windows peut le consulter. Verrouillez la session et protégez le disque
  (mot de passe, chiffrement BitLocker). Pour un transfert, exportez un JSON et rangez-le dans un
  dossier protégé.
- La réinitialisation demande de saisir **EFFACER** et propose de télécharger une sauvegarde JSON
  avant d'effacer les données.
- Si un fichier du dossier `assets` est manquant, un message explicite s'affiche au lieu d'une page vide.
- « Réinitialiser » efface toutes les saisies et remet le registre initial des 71 employeurs.

## Version et tests

- Version affichée en bas de la barre latérale et dans Paramètres → Contenu de la base locale.
- L'historique des versions se trouve dans `CHANGELOG.md`.
- La page `tests.html` vérifie sans installation les données initiales, les dates, les calculs,
  les effectifs mensuels, les thèmes, la validation des imports et la migration. Ouvrez-la dans le
  navigateur : chaque test s'affiche en vert ou en rouge. Elle ne lit ni ne modifie vos données enregistrées.

## Limites

- Le suivi affiche une année civile à la fois ; les autres années restent enregistrées et accessibles.
- L'import du suivi mensuel accepte le **CSV** ; les classeurs `.xlsx` doivent d'abord être enregistrés en CSV UTF-8.
- Le report est calculé automatiquement, sans écriture comptable : l'application ne ventile pas un
  paiement entre plusieurs années. Saisissez le paiement dans l'année à laquelle il se rattache.
- Capacité confortable : une centaine d'employeurs et plusieurs milliers de lignes d'assurés.
- Les données restent sur le poste. Pour les partager ou changer d'ordinateur, utilisez
  l'export / import JSON.
- Application mono-utilisateur : pas de synchronisation entre plusieurs postes.

## Fichiers

- `index.html` : point d'entrée de l'application.
- `assets/styles.css` : mise en forme et adaptation mobile.
- `assets/data.js` : registre initial des 71 employeurs.
- `assets/core.js` : état, stockage local, calculs, export / import.
- `assets/views.js` : rendu des différents modules.
- `assets/app.js` : navigation, formulaires et interactions.
- `tests.html` et `assets/tests.js` : contrôles automatiques à ouvrir dans le navigateur.
- `CHANGELOG.md` : historique des versions.
- `Ouvrir l'application.bat` : raccourci d'ouverture sous Windows.
