/* ============================================================
   Contrôles automatiques — à ouvrir via tests.html
   Ne lit ni ne modifie les données enregistrées dans l'application.
   ============================================================ */

(function () {
  const results = [];
  let passed = 0;

  function assert(condition, message) {
    if (!condition) throw new Error(message || 'Condition fausse');
  }

  function eq(actual, expected, label) {
    if (actual !== expected) {
      throw new Error(`${label || 'Valeur'} : attendu « ${expected} », obtenu « ${actual} »`);
    }
  }

  function assertThrows(fn, label) {
    let thrown = false;
    try { fn(); } catch (e) { thrown = true; }
    assert(thrown, label || 'Une erreur était attendue');
  }

  function freshState() {
    state = seedState();
    state.settings.todayOverride = '2026-06-15';
    return state;
  }

  function test(name, fn) {
    try {
      fn();
      results.push({ name, ok: true });
      passed += 1;
    } catch (e) {
      results.push({ name, ok: false, message: e && e.message ? e.message : String(e) });
    }
  }

  /* ---------- Données initiales ---------- */
  test('Le registre initial contient 71 employeurs', () => {
    const seeded = seedState();
    eq(seeded.employers.length, 71, 'Nombre d’employeurs');
    eq(new Set(seeded.employers.map(e => e.id)).size, 71, 'Identifiants uniques');
    eq(seeded.dataVersion, DATA_VERSION, 'Version de données');
    assert(Array.isArray(seeded.insured), 'Tableau des assurés présent');
    assert(Array.isArray(seeded.journal), 'Journal présent');
    assert(Array.isArray(seeded.schedules), 'Échéanciers présents');
  });

  /* ---------- Dates ---------- */
  test('Calculs de dates', () => {
    eq(daysBetween('2026-01-01', '2026-01-31'), 30, 'Jours de janvier');
    eq(addDaysISO('2026-02-27', 2), '2026-03-01', 'Ajout de jours');
    eq(addMonths('2026-12', 1), '2027-01', 'Passage d’année');
    eq(monthLong('2026-03'), 'mars 2026', 'Mois long');
    eq(fmtDate('2026-11-09'), '09/11/2026', 'Date courte');
  });

  /* ---------- Calculs des assurés ---------- */
  test('Calcul des cotisations d’un assuré', () => {
    freshState();
    state.settings.valeurIndiciaire = 12000;
    state.settings.rateEmployee = 0.07;
    state.settings.rateEmployer = 0.20;
    const calc = computeInsuredRow({ indice: 100 });
    eq(calc.salary, 100000, 'Salaire');
    eq(calc.employee, 7000, 'Part employé');
    eq(calc.employer, 20000, 'Part employeur');
    eq(calc.total, 27000, 'Total');
  });

  test('Le détail des assurés prime sur le dû global', () => {
    freshState();
    state.settings.valeurIndiciaire = 12000;
    const emp = state.employers[0];
    state.monthly = { [emp.id]: { '2026-01': { dueGlobal: 500000, collected: 100000 } } };
    state.insured = [{ id: 'i1', employerId: emp.id, month: '2026-01', indice: 100 }];
    const entry = monthStats(emp.id, '2026-01', buildInsuredIndex());
    eq(entry.hasDetail, true, 'Détail présent');
    eq(entry.dueRetained, 27000, 'Dû retenu');
    eq(entry.balance, -73000, 'Solde du mois');
  });

  test('Synthèse annuelle d’un employeur', () => {
    freshState();
    const emp = state.employers[0];
    state.monthly = {
      [emp.id]: {
        '2026-01': { dueGlobal: 100000, collected: 40000 },
        '2026-02': { dueGlobal: 50000, collected: 50000 }
      }
    };
    const stat = employerStats(emp, new Map(), monthsList('2026'));
    eq(stat.due, 150000, 'Dû annuel');
    eq(stat.collected, 90000, 'Encaissé annuel');
    eq(stat.balance, 60000, 'Solde annuel');
    eq(stat.totalBalance, 60000, 'Solde cumulé');
    eq(stat.startMonth, '2026-01', 'Premier mois impayé');
    eq(stat.endMonth, '2026-01', 'Dernier mois impayé');
  });

  test('Effectif mensuel : référence et remplacement', () => {
    freshState();
    const emp = state.employers[0];
    emp.effectif = 42;
    state.monthly = {};
    const inherited = monthlyEffectifInfo(emp.id, '2026-01');
    eq(inherited.value, 42, 'Effectif hérité de la fiche');
    eq(inherited.inherited, true, 'Héritage signalé');
    state.monthly[emp.id] = { '2026-01': { effectif: 0 } };
    const zero = monthlyEffectifInfo(emp.id, '2026-01');
    eq(zero.value, 0, 'Effectif zéro conservé');
    eq(zero.inherited, false, 'Remplacement signalé');
    state.monthly[emp.id]['2026-01'].effectif = 55;
    const ms = monthStats(emp.id, '2026-01', new Map());
    eq(ms.effectif, 55, 'Effectif mensuel retenu');
    eq(ms.effectifInherited, false, 'Valeur saisie pour le mois');
  });

  test('Effectif moyen et bornes annuelles', () => {
    freshState();
    const emp = state.employers[0];
    const year = '2026';
    const months = monthsList(year);
    const monthly = {};
    months.forEach((m, i) => { monthly[m] = { dueGlobal: 1000, effectif: i === 0 ? 10 : 20 }; });
    state.monthly = { [emp.id]: monthly };
    const stat = employerStats(emp, new Map(), months);
    eq(stat.effectifStart, 10, 'Effectif de début');
    eq(stat.effectifEnd, 20, 'Effectif de fin');
    eq(stat.effectifAverage, 19, 'Effectif moyen arrondi');
  });

  /* ---------- Échéanciers et journal ---------- */
  test('Statuts des échéanciers', () => {
    freshState();
    eq(scheduleStats({ amount: 1000, paidAmount: 1000, dueDate: '2020-01-01' }).status, 'Payée', 'Échéance soldée');
    const late = scheduleStats({ amount: 1000, paidAmount: 200, dueDate: '2026-06-01' });
    eq(late.status, 'En retard', 'Échéance en retard');
    eq(late.remaining, 800, 'Reste à payer');
    eq(late.lateDays, 14, 'Jours de retard');
    eq(scheduleStats({ amount: 1000, paidAmount: 0, dueDate: '2026-12-01' }).status, 'À venir', 'Échéance à venir');
  });

  test('Alertes du journal', () => {
    freshState();
    eq(journalAlert({ nextDate: '2026-06-01' }), 'En retard', 'Action en retard');
    eq(journalAlert({ nextDate: '2026-06-30' }), 'À faire bientôt', 'Action proche');
    eq(journalAlert({ nextDate: '2026-12-01' }), 'À venir', 'Action lointaine');
    eq(journalAlert({}), '', 'Sans date');
  });

  /* ---------- Import et migration ---------- */
  test('Validation des fichiers importés', () => {
    eq(validateImport(seedState()), true, 'Fichier complet accepté');
    assertThrows(() => validateImport(null), 'Fichier vide refusé');
    assertThrows(() => validateImport([]), 'Tableau racine refusé');
    assertThrows(() => validateImport({ employers: [], monthly: {} }), 'Paramètres manquants refusés');
    assertThrows(() => validateImport({ employers: 'x', monthly: {}, settings: {} }), 'Employeurs invalides refusés');
    assertThrows(() => normalizeImportedState({ employers: [], monthly: {}, settings: {} }), 'Fichier sans employeur refusé');
  });

  test('Migration des anciennes données', () => {
    const legacy = { version: 1, employers: [], monthly: {}, meta: {} };
    const migrated = migrateState(legacy);
    eq(migrated.dataVersion, DATA_VERSION, 'Version mise à jour');
    assert(Array.isArray(migrated.insured), 'Assurés ajoutés');
    assert(Array.isArray(migrated.journal), 'Journal ajouté');
    assert(Array.isArray(migrated.schedules), 'Échéanciers ajoutés');
    assert(migrated.settings && typeof migrated.settings === 'object', 'Paramètres ajoutés');
  });

  test('Normalisation d’une sauvegarde complète', () => {
    const normalized = normalizeImportedState(seedState());
    eq(normalized.employers.length, 71, 'Employeurs conservés');
    eq(normalized.dataVersion, DATA_VERSION, 'Version des données');
    eq(normalized.version, APP_VERSION, 'Version de l’application');
  });

  test('Import : effectif mensuel conservé', () => {
    const raw = seedState();
    const emp = raw.employers[0];
    raw.monthly = { [emp.id]: { '2026-03': { dueGlobal: 5000, collected: 1000, effectif: 33 } } };
    const normalized = normalizeImportedState(raw);
    eq(normalized.monthly[emp.id]['2026-03'].effectif, 33, 'Effectif du mois importé');
  });

  test('Thèmes de couleurs disponibles', () => {
    eq(THEMES.length, 3, 'Trois thèmes');
    eq(normalizeTheme('amber'), 'amber', 'Thème gris et jaune accepté');
    eq(normalizeTheme('red'), 'red', 'Thème rouge et gris accepté');
    eq(normalizeTheme('inconnu'), '', 'Thème inconnu ramené au bleu');
  });

  /* ---------- Sauvegardes et affichage ---------- */
  test('Affichage des sauvegardes', () => {
    eq(formatBytes(2048), '2 Ko', 'Taille en Ko');
    assert(formatBytes(1572864).includes('Mo'), 'Taille en Mo');
    assert(backupDateLabel({ createdAt: '2026-11-09T10:00:00' }).includes('09/11/2026'), 'Date lisible');
    eq(backupDateLabel({}), 'Date inconnue', 'Date absente');
    eq(BACKUP_REASON_LABELS.import, 'Avant import', 'Libellé d’import');
  });

  window.__TEST_RESULTS__ = results;

  function render() {
    const root = document.getElementById('test-results');
    const summary = document.getElementById('test-summary');
    if (!root || !summary) return;
    const failed = results.length - passed;
    summary.textContent = failed === 0
      ? `${passed} tests réussis`
      : `${passed} réussis · ${failed} échoué${failed > 1 ? 's' : ''}`;
    summary.className = 'summary ' + (failed ? 'bad' : 'good');
    root.innerHTML = '';
    results.forEach(result => {
      const li = document.createElement('li');
      li.className = result.ok ? 'ok' : 'ko';
      const status = document.createElement('strong');
      status.textContent = result.ok ? 'OK' : 'ÉCHEC';
      const name = document.createElement('span');
      name.textContent = result.name;
      li.append(status, name);
      if (!result.ok) {
        const detail = document.createElement('p');
        detail.textContent = result.message;
        li.append(detail);
      }
      root.append(li);
    });
    document.title = failed ? `Tests — ${failed} échec(s)` : `Tests — ${passed} réussis`;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
