/* ============================================================
   Vues : tableau de bord, employeurs, suivi, situation, etc.
   ============================================================ */

function selectedAttr(value, expected) { return String(value) === String(expected) ? ' selected' : ''; }

function optionsFrom(list, selected, placeholder = '') {
  let html = placeholder ? `<option value="">${escapeHtml(placeholder)}</option>` : '';
  list.forEach(item => {
    const value = typeof item === 'object' ? item.value : item;
    const label = typeof item === 'object' ? item.label : item;
    html += `<option value="${escapeAttr(value)}"${selectedAttr(selected, value)}>${escapeHtml(label)}</option>`;
  });
  return html;
}

function employerSelectOptions(selected, placeholder = 'Tous les employeurs') {
  let html = `<option value="">${escapeHtml(placeholder)}</option>`;
  state.employers.forEach(emp => {
    const label = emp.sigle ? `${emp.name} (${emp.sigle})` : emp.name;
    html += `<option value="${escapeAttr(emp.id)}"${selectedAttr(selected, emp.id)}>${escapeHtml(label)}</option>`;
  });
  return html;
}

function monthSelectOptions(selected, placeholder = '', months = monthsList()) {
  return optionsFrom(months.map(m => ({ value: m, label: monthLong(m) })), selected, placeholder);
}

function emptyBlock(iconName, title, text, action = '') {
  return `<div class="empty-state">
    <div class="empty-ico">${ico(iconName)}</div>
    <strong>${escapeHtml(title)}</strong>
    <p>${text}</p>
    ${action}
  </div>`;
}

function matchesEmployer(emp, query) {
  if (!query) return true;
  return [emp.name, emp.sigle, emp.registration, emp.contact].join(' ').toLowerCase().includes(query);
}

function fmtCompact(n) {
  const v = num(n);
  if (v >= 1e9) return (v / 1e9).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' Md';
  if (v >= 1e6) return (v / 1e6).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' M';
  if (v >= 1e3) return Math.round(v / 1e3).toLocaleString('fr-FR') + ' k';
  return fmtNum(v);
}

function truncate(value, max = 70) {
  const s = String(value || '');
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

/* ---------------- Tableau de bord ---------------- */
function viewDashboard() {
  const { stats, months, year } = buildStats();
  const today = effectiveToday();
  const alertDays = Math.max(0, round0(state.settings.alertDays));
  const employerCount = stats.length;
  const totalDue = stats.reduce((sum, s) => sum + s.due, 0);
  const totalCollected = stats.reduce((sum, s) => sum + s.collected, 0);
  const totalPrior = stats.reduce((sum, s) => sum + s.priorBalance, 0);
  const totalBalance = totalDue - totalCollected + totalPrior;
  const debtors = stats.filter(s => s.totalBalance > 0);
  const cumulativeDue = stats.reduce((sum, s) => sum + s.due + s.priorDue, 0);
  const cumulativeCollected = stats.reduce((sum, s) => sum + s.collected + s.priorCollected, 0);
  const rate = cumulativeDue > 0 ? cumulativeCollected / cumulativeDue : 0;

  const breakdown = STATUSES.map(status => {
    const items = stats.filter(s => s.emp.status === status);
    return {
      status,
      count: items.length,
      balance: items.reduce((sum, s) => sum + Math.max(0, s.totalBalance), 0),
      color: STATUS_COLORS[status] || '#64748b'
    };
  });
  const unassigned = stats.filter(s => !STATUSES.includes(s.emp.status));
  if (unassigned.length) {
    breakdown.push({
      status: 'Non renseigné',
      count: unassigned.length,
      balance: unassigned.reduce((sum, s) => sum + Math.max(0, s.totalBalance), 0),
      color: '#64748b'
    });
  }
  const maxStatusCount = Math.max(1, ...breakdown.map(b => b.count));

  const schedules = state.schedules.map(s => ({ item: s, calc: scheduleStats(s) }));
  const overdueSchedules = schedules.filter(x => x.calc.status === 'En retard');
  const upcomingSchedules = schedules.filter(x => {
    if (x.calc.status !== 'À venir' || !x.item.dueDate) return false;
    const d = daysBetween(today, x.item.dueDate);
    return d >= 0 && d <= alertDays;
  });
  const journalWithNext = state.journal.filter(j => j.nextDate);
  const overdueActions = journalWithNext.filter(j => journalAlert(j) === 'En retard');
  const soonActions = journalWithNext.filter(j => journalAlert(j) === 'À faire bientôt');
  const totalAlerts = overdueSchedules.length + upcomingSchedules.length + overdueActions.length + soonActions.length;

  const top5 = debtors
    .filter(s => s.startMonth)
    .sort((a, b) => (b.ageDays || 0) - (a.ageDays || 0))
    .slice(0, 5);

  const series = months.map(m => ({
    month: m,
    due: stats.reduce((sum, s) => sum + s.months[m].dueRetained, 0),
    collected: stats.reduce((sum, s) => sum + s.months[m].collected, 0)
  }));

  return `
    ${totalPrior > 0 ? `<div class="notice carryover" style="margin-bottom:18px">
      ${ico('info')}
      <div><strong>Solde reporté au 1<sup>er</sup> janvier ${year} : ${fmtMoney(totalPrior)}.</strong> Il correspond aux cotisations restées impayées les années précédentes et reste inclus dans le solde restant. Aucune double saisie n’est nécessaire.</div>
    </div>` : ''}

    <div class="kpi-grid">
      <div class="kpi">
        <div class="kpi-top"><span class="kpi-label">Employeurs suivis</span><span class="kpi-icon">${ico('users')}</span></div>
        <div class="kpi-value">${fmtNum(employerCount)}</div>
        <div class="kpi-sub">${debtors.length} ${plural(debtors.length, 'dossier débiteur', 'dossiers débiteurs')}</div>
      </div>
      <div class="kpi k-slate">
        <div class="kpi-top"><span class="kpi-label">Cotisations dues ${year}</span><span class="kpi-icon">${ico('file')}</span></div>
        <div class="kpi-value">${fmtNum(totalDue)}<small>FCFA</small></div>
        <div class="kpi-sub">Sur les ${months.length} mois de l’année ${year}</div>
      </div>
      <div class="kpi k-green">
        <div class="kpi-top"><span class="kpi-label">Total recouvré ${year}</span><span class="kpi-icon">${ico('wallet')}</span></div>
        <div class="kpi-value">${fmtNum(totalCollected)}<small>FCFA</small></div>
        <div class="kpi-sub">Encaissements enregistrés en ${year}</div>
      </div>
      <div class="kpi k-red">
        <div class="kpi-top"><span class="kpi-label">Solde restant total</span><span class="kpi-icon">${ico('alert')}</span></div>
        <div class="kpi-value">${fmtNum(totalBalance)}<small>FCFA</small></div>
        <div class="kpi-sub">${debtors.length} ${plural(debtors.length, 'employeur à recouvrer', 'employeurs à recouvrer')}${totalPrior > 0 ? ' · dont ' + fmtNum(totalPrior) + ' antérieur' : ''}</div>
      </div>
      <div class="kpi k-teal">
        <div class="kpi-top"><span class="kpi-label">Taux de recouvrement</span><span class="kpi-icon">${ico('trending')}</span></div>
        <div class="kpi-value">${fmtPct(rate)}</div>
        <div class="kpi-sub">${cumulativeDue > 0 ? 'Encaissé / dû cumulés (dont antérieur)' : 'Aucun montant dû saisi'}</div>
        <div class="kpi-progress"><span style="width:${Math.min(100, Math.max(0, rate * 100))}%"></span></div>
      </div>
    </div>

    <div class="dash-grid">
      <section class="card col-8">
        <div class="card-head">
          <div>
            <div class="card-title">Cotisations dues et encaissements</div>
            <div class="card-sub">Évolution mensuelle sur ${months.length} mois — année ${year}</div>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot due"></span>Dû</span>
            <span class="legend-item"><span class="legend-dot paid"></span>Encaissé</span>
          </div>
        </div>
        <div class="card-body" style="padding-top:6px">${dashChart(series)}</div>
      </section>

      <section class="card col-4">
        <div class="card-head">
          <div>
            <div class="card-title">Répartition par statut</div>
            <div class="card-sub">${employerCount} employeurs au registre</div>
          </div>
        </div>
        <div class="card-body">
          <div class="status-list">
            ${breakdown.map(b => `
              <div class="status-row">
                <div class="status-name"><span class="dot" style="background:${b.color}"></span>${escapeHtml(b.status)}</div>
                <div class="status-count">${b.count}</div>
                <div class="status-meta">
                  <div class="status-bar"><span style="width:${(b.count / maxStatusCount) * 100}%;background:${b.color}"></span></div>
                  <div class="status-amount">${fmtNum(b.balance)} FCFA</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <section class="card col-6">
        <div class="card-head">
          <div>
            <div class="card-title">Alertes</div>
            <div class="card-sub">Échéances et actions à traiter</div>
          </div>
          ${totalAlerts ? `<span class="badge badge-red">${totalAlerts} alerte${totalAlerts > 1 ? 's' : ''}</span>` : ''}
        </div>
        <div class="card-body">
          ${totalAlerts === 0 ? `
            <div class="alert-empty">
              <strong>Aucune alerte en cours</strong>
              <div style="margin-top:4px">Les prochaines échéances et actions apparaîtront ici.</div>
            </div>` : `
            <div class="alert-list">
              ${overdueSchedules.length ? `
                <a class="alert-row" href="#/schedules">
                  <span class="alert-ico">${ico('calendar')}</span>
                  <span class="alert-text"><strong>Échéances en retard</strong><span>${overdueSchedules.length} ${plural(overdueSchedules.length, 'échéance dépassée', 'échéances dépassées')}</span></span>
                  <span class="alert-value red">${fmtNum(overdueSchedules.reduce((sum, x) => sum + Math.max(0, x.calc.remaining), 0))}</span>
                </a>` : ''}
              ${upcomingSchedules.length ? `
                <a class="alert-row" href="#/schedules">
                  <span class="alert-ico info">${ico('calendar')}</span>
                  <span class="alert-text"><strong>Échéances à venir</strong><span>Dans les ${alertDays} prochains jours</span></span>
                  <span class="alert-value blue">${upcomingSchedules.length}</span>
                </a>` : ''}
              ${overdueActions.length ? `
                <a class="alert-row" href="#/journal">
                  <span class="alert-ico warn">${ico('clock')}</span>
                  <span class="alert-text"><strong>Actions en retard</strong><span>Relances dont la date est dépassée</span></span>
                  <span class="alert-value red">${overdueActions.length}</span>
                </a>` : ''}
              ${soonActions.length ? `
                <a class="alert-row" href="#/journal">
                  <span class="alert-ico info">${ico('clock')}</span>
                  <span class="alert-text"><strong>Actions à faire bientôt</strong><span>Dans les ${alertDays} prochains jours</span></span>
                  <span class="alert-value amber">${soonActions.length}</span>
                </a>` : ''}
            </div>`}
        </div>
      </section>

      <section class="card col-6">
        <div class="card-head">
          <div>
            <div class="card-title">5 dossiers les plus anciens</div>
            <div class="card-sub">Hors dossiers soldés</div>
          </div>
          <a class="btn btn-sm btn-ghost" href="#/employers">Tout voir</a>
        </div>
        <div class="card-body">
          ${top5.length ? `<div class="top-list">
            ${top5.map((s, i) => `
              <div class="top-row" role="button" tabindex="0" data-open-employer="${escapeAttr(s.emp.id)}">
                <span class="top-rank">${i + 1}</span>
                <span class="top-main">
                  <strong>${escapeHtml(s.emp.name)}</strong>
                  <span>${escapeHtml(s.emp.registration)}${s.emp.sigle ? ' · ' + escapeHtml(s.emp.sigle) : ''}</span>
                </span>
                <span class="top-amount">
                  <strong>${fmtNum(s.totalBalance)}</strong>
                  <span>${s.ageDays} j d'ancienneté</span>
                </span>
              </div>`).join('')}
          </div>` : emptyBlock('check', 'Aucun dossier ancien à afficher', 'Les dossiers apparaîtront ici dès qu’un solde impayé sera enregistré.')}
        </div>
      </section>
    </div>`;
}

function dashChart(series) {
  const W = 780;
  const H = 258;
  const padL = 58;
  const padR = 14;
  const padT = 16;
  const padB = 36;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxRaw = Math.max(1, ...series.flatMap(s => [s.due, s.collected]));
  const pow = Math.pow(10, Math.floor(Math.log10(maxRaw || 1)));
  const n = maxRaw / pow;
  const niceStep = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  const maxVal = niceStep * pow;
  const steps = 4;
  const groupW = chartW / series.length;
  const barW = Math.min(14, Math.max(6, groupW * 0.26));
  const hasData = series.some(s => s.due > 0 || s.collected > 0);

  let grid = '';
  for (let i = 0; i <= steps; i++) {
    const value = (maxVal / steps) * i;
    const y = padT + chartH - (chartH * i) / steps;
    grid += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#e9eef6" stroke-width="1"/>`;
    grid += `<text x="${padL - 8}" y="${y + 3}" text-anchor="end" fill="#94a3b8" font-size="9">${fmtCompact(value)}</text>`;
  }

  let bars = '';
  series.forEach((s, i) => {
    const cx = padL + groupW * i + groupW / 2;
    const dueH = (s.due / maxVal) * chartH;
    const paidH = (s.collected / maxVal) * chartH;
    const dueX = cx - barW - 1.5;
    const paidX = cx + 1.5;
    const [y, m] = s.month.split('-').map(Number);
    const label = `${MONTHS_SHORT[m - 1]} ${String(y).slice(2)}`;
    bars += `<g>
      <rect x="${dueX}" y="${padT + chartH - dueH}" width="${barW}" height="${Math.max(0, dueH)}" rx="2.5" fill="#93b4f8">
        <title>${monthLong(s.month)} — Dû : ${fmtMoney(s.due)}</title>
      </rect>
      <rect x="${paidX}" y="${padT + chartH - paidH}" width="${barW}" height="${Math.max(0, paidH)}" rx="2.5" fill="#0f766e">
        <title>${monthLong(s.month)} — Encaissé : ${fmtMoney(s.collected)}</title>
      </rect>
      <text x="${cx}" y="${H - 14}" text-anchor="middle" fill="#7a8aa0" font-size="9">${label}</text>
    </g>`;
  });

  return `<div class="chart-box">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution mensuelle des cotisations dues et des encaissements">
      ${grid}
      <line x1="${padL}" y1="${padT + chartH}" x2="${W - padR}" y2="${padT + chartH}" stroke="#cbd5e1" stroke-width="1"/>
      ${bars}
    </svg>
    ${hasData ? '' : `<div class="chart-empty"><div><strong>Aucun montant saisi pour la période</strong>Saisissez les cotisations dues et les encaissements dans « Suivi mensuel ».</div></div>`}
  </div>`;
}

/* ---------------- Employeurs ---------------- */
function filteredEmployerStats(stats) {
  const query = ui.employerSearch.trim().toLowerCase();
  let list = stats.filter(s => matchesEmployer(s.emp, query));
  if (ui.employerStatus) list = list.filter(s => s.emp.status === ui.employerStatus);
  const sort = ui.employerSort;
  list.sort((a, b) => {
    if (sort === 'balance') return b.totalBalance - a.totalBalance;
    if (sort === 'age') return (b.ageDays || -1) - (a.ageDays || -1);
    if (sort === 'registration') return a.emp.registration.localeCompare(b.emp.registration, 'fr', { numeric: true });
    return a.emp.name.localeCompare(b.emp.name, 'fr');
  });
  return list;
}

function viewEmployers() {
  const { stats, year } = buildStats();
  const list = filteredEmployerStats(stats);
  const debtors = stats.filter(s => s.totalBalance > 0).length;
  const totalBalance = stats.reduce((sum, s) => sum + Math.max(0, s.totalBalance), 0);
  const totalPrior = stats.reduce((sum, s) => sum + s.priorBalance, 0);

  return `
    <div class="page-actions">
      <div class="search-box">
        ${ico('search')}
        <input type="search" id="employer-search" placeholder="Rechercher un employeur, un n°…" value="${escapeAttr(ui.employerSearch)}" autocomplete="off" aria-label="Rechercher un employeur">
      </div>
      <select class="select" id="employer-status-filter" aria-label="Filtrer par statut">
        ${optionsFrom(STATUSES, ui.employerStatus, 'Tous les statuts')}
      </select>
      <select class="select" id="employer-sort" aria-label="Trier">
        ${optionsFrom([
          { value: 'name', label: 'Trier par nom' },
          { value: 'registration', label: 'Trier par n°' },
          { value: 'balance', label: 'Solde décroissant' },
          { value: 'age', label: 'Ancienneté décroissante' }
        ], ui.employerSort)}
      </select>
      <span class="spacer"></span>
      <span class="result-count" id="employer-count"><strong>${list.length}</strong> / ${stats.length} employeurs</span>
      <button class="btn btn-sm" id="export-employers">${ico('download')} CSV</button>
      <button class="btn btn-sm btn-primary" id="add-employer">${ico('plus')} Ajouter</button>
    </div>

    <div class="summary-strip" style="border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;margin-bottom:18px;box-shadow:var(--shadow)">
      <div class="summary-item"><span>Employeurs débiteurs</span><strong class="red">${debtors}</strong></div>
      <div class="summary-item"><span>Solde restant total</span><strong class="red">${fmtNum(totalBalance)} FCFA</strong></div>
      <div class="summary-item"><span>Dont solde antérieur</span><strong>${fmtNum(totalPrior)} FCFA</strong></div>
      <div class="summary-item"><span>Statut le plus fréquent</span><strong>${escapeHtml(mostFrequentStatus(stats))}</strong></div>
      <div class="summary-item"><span>Effectif déclaré cumulé</span><strong>${fmtNum(stats.reduce((sum, s) => sum + num(s.emp.effectif), 0))}</strong></div>
    </div>

    <section class="card">
      <div class="table-wrap">
        <table class="data-table" id="employers-table">
          <thead>
            <tr>
              <th class="sticky-col">Employeur</th>
              <th>N° d'immatriculation</th>
              <th class="num">Effectif</th>
              <th>Période impayée</th>
              <th class="num">Dû ${year}</th>
              <th class="num">Recouvré ${year}</th>
              <th class="num">Solde total</th>
              <th>Statut</th>
              <th class="num">Ancienneté</th>
              <th>Dernière action</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody id="employers-tbody">
            ${employersRowsHtml(list)}
          </tbody>
        </table>
      </div>
    </section>`;
}

function mostFrequentStatus(stats) {
  if (!stats.length) return '—';
  const counts = {};
  stats.forEach(s => { counts[s.emp.status] = (counts[s.emp.status] || 0) + 1; });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || '—';
}

function employersRowsHtml(list) {
  if (!list.length) {
    return `<tr><td colspan="11">${emptyBlock('search', 'Aucun employeur trouvé', 'Modifiez la recherche ou le filtre de statut.', '<button class="btn btn-primary btn-sm" data-add-employer>Ajouter un employeur</button>')}</td></tr>`;
  }
  return list.map(s => {
    const period = s.startMonth ? `${monthShort(s.startMonth)} → ${monthShort(s.endMonth || s.startMonth)}` : '—';
    const balanceClass = s.totalBalance > 0 ? 'text-red' : s.totalBalance < 0 ? 'text-green' : 'muted';
    return `<tr>
      <td class="sticky-col">
        <a class="employer-link" role="button" tabindex="0" data-open-employer="${escapeAttr(s.emp.id)}">
          <span class="employer-name">
            <strong>${escapeHtml(s.emp.name)}</strong>
            <span>${escapeHtml(s.emp.sigle || '—')}${s.emp.contact ? ' · ' + escapeHtml(s.emp.contact) : ''}</span>
          </span>
        </a>
      </td>
      <td class="nowrap"><span class="strong">${escapeHtml(s.emp.registration)}</span></td>
      <td class="num">${fmtNum(s.emp.effectif)}</td>
      <td class="nowrap">${period}</td>
      <td class="num">${fmtNum(s.due)}</td>
      <td class="num">${fmtNum(s.collected)}</td>
      <td class="num ${balanceClass}"><strong>${fmtNum(s.totalBalance)}</strong>${s.priorBalance ? `<span class="sub">dont ${fmtNum(s.priorBalance)} ant.</span>` : ''}</td>
      <td>${statusBadge(s.emp.status)}</td>
      <td class="num">${s.ageDays == null ? '<span class="muted">—</span>' : s.ageDays + ' j'}</td>
      <td class="nowrap">${s.lastAction ? fmtDate(s.lastAction) : '<span class="muted">—</span>'}</td>
      <td class="col-actions">
        <span class="row-actions">
          <button class="icon-btn" title="Voir la fiche" aria-label="Voir la fiche de ${escapeAttr(s.emp.name)}" data-open-employer="${escapeAttr(s.emp.id)}">${ico('eye')}</button>
          <button class="icon-btn" title="Modifier" aria-label="Modifier ${escapeAttr(s.emp.name)}" data-edit-employer="${escapeAttr(s.emp.id)}">${ico('edit')}</button>
          <button class="icon-btn danger" title="Supprimer" aria-label="Supprimer ${escapeAttr(s.emp.name)}" data-delete-employer="${escapeAttr(s.emp.id)}">${ico('trash')}</button>
        </span>
      </td>
    </tr>`;
  }).join('');
}

/* ---------------- Suivi mensuel ---------------- */
function viewMonthly() {
  const months = monthsList();
  if (!months.includes(ui.monthlyMonth)) ui.monthlyMonth = months.includes(currentMonthKey()) ? currentMonthKey() : months[0];
  const month = ui.monthlyMonth;
  const isEntry = ui.monthlyMode === 'entry';

  return `
    <div class="page-actions">
      <div class="tabs" role="tablist">
        <button class="tab ${isEntry ? 'active' : ''}" data-monthly-mode="entry">Saisie par mois</button>
        <button class="tab ${!isEntry ? 'active' : ''}" data-monthly-mode="synthesis">Synthèse 12 mois</button>
      </div>
      ${isEntry ? `<select class="select" id="monthly-month" aria-label="Mois à saisir">${monthSelectOptions(month)}</select>` : ''}
      <div class="search-box">
        ${ico('search')}
        <input type="search" id="monthly-search" placeholder="Rechercher un employeur…" value="${escapeAttr(ui.monthlySearch)}" autocomplete="off" aria-label="Rechercher un employeur dans le suivi mensuel">
      </div>
      <span class="spacer"></span>
      <button class="btn btn-sm" id="import-monthly" title="Importer un fichier CSV de suivi mensuel">${ico('upload')} Importer</button>
      <button class="btn btn-sm btn-ghost" id="monthly-import-model" title="Télécharger un modèle CSV vide">Modèle</button>
      <button class="btn btn-sm" id="export-monthly">${ico('download')} CSV</button>
      <input type="file" id="monthly-import-file" accept=".csv,text/csv" hidden>
    </div>
    ${isEntry ? monthlyEntryCard(month) : monthlySynthesisCard(months)}
    <div class="notice" style="margin-top:16px">
      ${ico('info')}
      <div><strong>Règle de calcul :</strong> le « dû retenu » d’un mois prend le total du détail des assurés s’il existe pour cet employeur et ce mois ; sinon, il utilise le dû global saisi. Le solde mensuel = dû retenu − encaissé.</div>
    </div>`;
}

function monthlyEntryCard(month) {
  const { stats } = buildStats();
  const query = ui.monthlySearch.trim().toLowerCase();
  const list = stats.filter(s => matchesEmployer(s.emp, query));
  const totals = stats.reduce((acc, s) => {
    const ms = s.months[month];
    acc.due += ms.dueRetained;
    acc.collected += ms.collected;
    acc.detail += ms.detailTotal;
    acc.balance += ms.balance;
    acc.effectif += ms.effectif;
    return acc;
  }, { due: 0, collected: 0, detail: 0, balance: 0, effectif: 0 });
  const totalPrior = stats.reduce((sum, s) => sum + s.priorBalance, 0);

  return `<section class="card">
    <div class="summary-strip">
      <div class="summary-item"><span>Effectif — ${monthLong(month)}</span><strong id="monthly-sum-effectif">${fmtNum(totals.effectif)}</strong></div>
      <div class="summary-item"><span>Dû retenu — ${monthLong(month)}</span><strong id="monthly-sum-due">${fmtNum(totals.due)} FCFA</strong></div>
      <div class="summary-item"><span>Encaissé — ${monthLong(month)}</span><strong class="green" id="monthly-sum-collected">${fmtNum(totals.collected)} FCFA</strong></div>
      <div class="summary-item"><span>Solde du mois</span><strong id="monthly-sum-balance" class="${totals.balance > 0 ? 'red' : 'green'}">${fmtNum(totals.balance)} FCFA</strong></div>
      <div class="summary-item"><span>Dû issu du détail</span><strong id="monthly-sum-detail">${fmtNum(totals.detail)} FCFA</strong></div>
      <div class="summary-item"><span>Solde antérieur au 1<sup>er</sup> janv.</span><strong>${fmtNum(totalPrior)} FCFA</strong></div>
    </div>
    <div class="toolbar">
      <span class="result-count" id="monthly-count"><strong>${list.length}</strong> / ${stats.length} employeurs</span>
      <span class="spacer"></span>
      <span class="small muted">Saisie enregistrée automatiquement à chaque modification.</span>
    </div>
    <div class="table-wrap">
      <table class="data-table monthly-table">
        <thead>
          <tr>
            <th class="sticky-col">Employeur</th>
            <th class="num" title="Effectif du mois, modifiable pour chaque organisme">Effectif</th>
            <th class="num">Dû global saisi</th>
            <th class="num">Encaissé</th>
            <th class="num">Dû détail (auto)</th>
            <th class="num">Dû retenu</th>
            <th class="num">Solde du mois</th>
          </tr>
        </thead>
        <tbody id="monthly-tbody">
          ${monthlyRowsHtml(list, month)}
        </tbody>
        <tfoot>
          <tr>
            <td class="sticky-col">TOTAL — ${escapeHtml(monthLong(month))}</td>
            <td class="num" id="monthly-total-effectif">${fmtNum(totals.effectif)}</td>
            <td class="num"></td>
            <td class="num" id="monthly-total-collected">${fmtNum(totals.collected)}</td>
            <td class="num" id="monthly-total-detail">${fmtNum(totals.detail)}</td>
            <td class="num" id="monthly-total-due">${fmtNum(totals.due)}</td>
            <td class="num ${totals.balance > 0 ? 'text-red' : 'text-green'}" id="monthly-total-balance">${fmtNum(totals.balance)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>`;
}

function monthlyRowsHtml(list, month) {
  if (!list.length) {
    return `<tr><td colspan="7">${emptyBlock('search', 'Aucun employeur trouvé', 'Modifiez votre recherche.')}</td></tr>`;
  }
  return list.map(s => {
    const ms = s.months[month];
    const balanceClass = ms.balance > 0 ? 'text-red' : ms.balance < 0 ? 'text-green' : 'muted';
    return `<tr data-monthly-row="${escapeAttr(s.emp.id)}">
      <td class="sticky-col">
        <span class="employer-name">
          <strong>${escapeHtml(s.emp.name)}</strong>
          <span>${escapeHtml(s.emp.registration)}${s.emp.sigle ? ' · ' + escapeHtml(s.emp.sigle) : ''}</span>
        </span>
      </td>
      <td class="num">
        <input class="cell-input effectif-input${ms.effectifInherited ? ' inherited-effectif' : ''}" type="number" min="0" step="1" inputmode="numeric"
          data-monthly-emp="${escapeAttr(s.emp.id)}" data-monthly-field="effectif"
          value="${ms.effectif}"
          title="${ms.effectifInherited ? 'Effectif de référence — modifiez pour ce mois' : 'Effectif saisi pour ce mois'}"
          aria-label="Effectif de ${escapeAttr(s.emp.name)} pour ${escapeAttr(monthLong(month))}">
      </td>
      <td class="num">
        <input class="cell-input" type="number" min="0" step="1" inputmode="numeric"
          data-monthly-emp="${escapeAttr(s.emp.id)}" data-monthly-field="dueGlobal"
          value="${ms.dueGlobal ? ms.dueGlobal : ''}" placeholder="${ms.hasDetail ? 'détail' : '0'}"
          ${ms.hasDetail ? 'disabled title="Le détail des assurés est utilisé pour ce mois."' : 'title="Montant global dû pour ce mois"'}
          aria-label="Montant global dû de ${escapeAttr(s.emp.name)} pour ${escapeAttr(monthLong(month))}">
      </td>
      <td class="num">
        <input class="cell-input" type="number" min="0" step="1" inputmode="numeric"
          data-monthly-emp="${escapeAttr(s.emp.id)}" data-monthly-field="collected"
          value="${ms.collected ? ms.collected : ''}" placeholder="0"
          title="Montant encaissé pour ce mois"
          aria-label="Montant encaissé de ${escapeAttr(s.emp.name)} pour ${escapeAttr(monthLong(month))}">
      </td>
      <td class="num">
        ${ms.hasDetail
          ? `<span class="auto-value">${fmtNum(ms.detailTotal)}</span><span class="detail-flag">${ico('link')} détail · ${ms.detailCount}</span>`
          : '<span class="muted">—</span>'}
      </td>
      <td class="num" data-cell="dueRetained"><strong>${fmtNum(ms.dueRetained)}</strong></td>
      <td class="num ${balanceClass}" data-cell="balance"><strong>${fmtNum(ms.balance)}</strong></td>
    </tr>`;
  }).join('');
}

function monthlySynthesisCard(months) {
  const { stats, year } = buildStats();
  const query = ui.monthlySearch.trim().toLowerCase();
  const list = stats.filter(s => matchesEmployer(s.emp, query));
  const totalsByMonth = {};
  months.forEach(m => {
    totalsByMonth[m] = stats.reduce((sum, s) => sum + s.months[m].balance, 0);
  });
  const totalsByMonthEffectif = {};
  months.forEach(m => {
    totalsByMonthEffectif[m] = stats.reduce((sum, s) => sum + s.months[m].effectif, 0);
  });
  const averageEffectif = Math.round(months.reduce((sum, m) => sum + totalsByMonthEffectif[m], 0) / months.length);
  const grand = stats.reduce((acc, s) => {
    acc.due += s.due;
    acc.collected += s.collected;
    acc.balance += s.balance;
    acc.prior += s.priorBalance;
    acc.total += s.totalBalance;
    return acc;
  }, { due: 0, collected: 0, balance: 0, prior: 0, total: 0 });

  return `<section class="card">
    <div class="card-head">
      <div>
        <div class="card-title">Synthèse des soldes mensuels</div>
        <div class="card-sub">Solde de chaque employeur, mois par mois (dû retenu − encaissé) — année ${year}</div>
      </div>
      <span class="result-count" id="monthly-synthesis-count"><strong>${list.length}</strong> / ${stats.length}</span>
    </div>
    <div class="card-body" style="padding-top:14px;padding-bottom:0">
      <div class="notice" style="margin-bottom:12px">
        ${ico('info')}
        <div>Un solde positif (en rouge) signifie qu’il reste des cotisations à recouvrer pour le mois. La colonne « Antérieur » reprend le solde impayé au 1<sup>er</sup> janvier ; « Solde cumulé » additionne ce report et l’année ${year}. La colonne « Effectif moyen » et la ligne « Effectif total » suivent la variation des effectifs saisie mois par mois. Survolez une cellule pour voir le dû et l’encaissé.</div>
      </div>
    </div>
    <div class="table-wrap tall">
      <table class="data-table matrix-table">
        <thead>
          <tr>
            <th class="sticky-col">Employeur</th>
            <th class="effectif-col">Effectif moyen</th>
            ${months.map(m => `<th class="month-col">${monthShort(m)}</th>`).join('')}
            <th class="month-col total-col">Dû ${year}</th>
            <th class="month-col total-col">Encaissé ${year}</th>
            <th class="month-col total-col">Solde annuel</th>
            <th class="month-col total-col">Antérieur</th>
            <th class="month-col total-col">Solde cumulé</th>
          </tr>
        </thead>
        <tbody id="monthly-synthesis-tbody">
          ${monthlySynthesisRowsHtml(list, months)}
        </tbody>
        <tfoot>
          <tr>
            <td class="sticky-col">TOTAL GÉNÉRAL</td>
            <td class="matrix-cell effectif-col">${fmtNum(averageEffectif)}</td>
            ${months.map(m => `<td class="matrix-cell ${totalsByMonth[m] > 0 ? 'pos' : totalsByMonth[m] < 0 ? 'neg' : 'zero'}">${totalsByMonth[m] ? fmtNum(totalsByMonth[m]) : '–'}</td>`).join('')}
            <td class="matrix-cell total-col">${fmtNum(grand.due)}</td>
            <td class="matrix-cell total-col">${fmtNum(grand.collected)}</td>
            <td class="matrix-cell total-col ${grand.balance > 0 ? 'pos' : grand.balance < 0 ? 'neg' : 'zero'}">${fmtNum(grand.balance)}</td>
            <td class="matrix-cell total-col ${grand.prior > 0 ? 'pos' : grand.prior < 0 ? 'neg' : 'zero'}">${fmtNum(grand.prior)}</td>
            <td class="matrix-cell total-col ${grand.total > 0 ? 'pos' : grand.total < 0 ? 'neg' : 'zero'}">${fmtNum(grand.total)}</td>
          </tr>
          <tr class="effectif-total-row">
            <td class="sticky-col">EFFECTIF TOTAL</td>
            <td class="matrix-cell effectif-col">—</td>
            ${months.map(m => `<td class="matrix-cell effectif-cell">${fmtNum(totalsByMonthEffectif[m])}</td>`).join('')}
            <td class="matrix-cell total-col" colspan="5">Effectif total par mois</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </section>`;
}

function monthlySynthesisRowsHtml(list, months) {
  if (!list.length) {
    return `<tr><td colspan="${months.length + 7}">${emptyBlock('search', 'Aucun employeur trouvé', 'Modifiez votre recherche.')}</td></tr>`;
  }
  return list.map(s => {
    const cells = months.map(m => {
      const ms = s.months[m];
      const cls = ms.balance > 0 ? 'pos' : ms.balance < 0 ? 'neg' : 'zero';
      const value = ms.balance ? fmtNum(ms.balance) : '–';
      const title = `${monthLong(m)} — Dû : ${fmtMoney(ms.dueRetained)} · Encaissé : ${fmtMoney(ms.collected)}`;
      return `<td class="matrix-cell ${cls}" title="${escapeAttr(title)}">${value}</td>`;
    }).join('');
    const annualCls = s.balance > 0 ? 'pos' : s.balance < 0 ? 'neg' : 'zero';
    const priorCls = s.priorBalance > 0 ? 'pos' : s.priorBalance < 0 ? 'neg' : 'zero';
    const cumulCls = s.totalBalance > 0 ? 'pos' : s.totalBalance < 0 ? 'neg' : 'zero';
    return `<tr>
      <td class="sticky-col">
        <span class="employer-name">
          <strong>${escapeHtml(s.emp.name)}</strong>
          <span>${escapeHtml(s.emp.registration)}</span>
        </span>
      </td>
      <td class="matrix-cell effectif-col" title="Effectif moyen sur la période">${fmtNum(s.effectifAverage)}</td>
      ${cells}
      <td class="matrix-cell total-col">${fmtNum(s.due)}</td>
      <td class="matrix-cell total-col">${fmtNum(s.collected)}</td>
      <td class="matrix-cell total-col ${annualCls}">${fmtNum(s.balance)}</td>
      <td class="matrix-cell total-col ${priorCls}" title="Solde impayé au 1er janvier">${fmtNum(s.priorBalance)}</td>
      <td class="matrix-cell total-col ${cumulCls}">${fmtNum(s.totalBalance)}</td>
    </tr>`;
  }).join('');
}

/* ---------------- Situation mensuelle ---------------- */
function viewSituation() {
  const months = monthsList();
  if (!months.includes(ui.situationMonth)) ui.situationMonth = months.includes(currentMonthKey()) ? currentMonthKey() : months[0];
  const month = ui.situationMonth;
  const { stats, year } = buildStats();
  const query = ui.situationSearch.trim().toLowerCase();
  const list = stats.filter(s => matchesEmployer(s.emp, query));

  const summaryDefs = [
    { key: 'P', label: 'Déclaré et payé', badge: 'badge-green' },
    { key: 'PP', label: 'Déclaré, partiellement payé', badge: 'badge-amber' },
    { key: 'NP', label: 'Déclaré, non payé', badge: 'badge-red' },
    { key: 'ND', label: 'Non déclaré', badge: 'badge-slate' }
  ];
  const summary = summaryDefs.map(def => {
    const items = stats.filter(s => situationFor(s.months[month]).key === def.key);
    return {
      ...def,
      count: items.length,
      due: items.reduce((sum, s) => sum + s.months[month].dueRetained, 0),
      collected: items.reduce((sum, s) => sum + s.months[month].collected, 0),
      balance: items.reduce((sum, s) => sum + s.months[month].balance, 0)
    };
  });
  const totals = summary.reduce((acc, x) => {
    acc.count += x.count; acc.due += x.due; acc.collected += x.collected; acc.balance += x.balance;
    return acc;
  }, { count: 0, due: 0, collected: 0, balance: 0 });

  return `
    <div class="page-actions">
      <select class="select" id="situation-month" aria-label="Mois à consulter">${monthSelectOptions(month)}</select>
      <div class="search-box">
        ${ico('search')}
        <input type="search" id="situation-search" placeholder="Rechercher un employeur…" value="${escapeAttr(ui.situationSearch)}" autocomplete="off" aria-label="Rechercher un employeur dans la situation mensuelle">
      </div>
      <span class="spacer"></span>
      <button class="btn btn-sm" id="export-situation">${ico('download')} CSV</button>
    </div>

    <section class="card" style="margin-bottom:18px">
      <div class="card-head">
        <div>
          <div class="card-title">Situation du mois — ${monthLong(month)}</div>
          <div class="card-sub">Déclaré = montant dû retenu supérieur à 0 pour ce mois</div>
        </div>
        <span class="badge badge-blue">${stats.length} organismes</span>
      </div>
      <div class="card-body" style="padding-top:12px">
        <div class="table-wrap tall" style="max-height:none">
          <table class="data-table" style="min-width:640px">
            <thead>
              <tr><th>Situation</th><th class="num">Organismes</th><th class="num">Dû (FCFA)</th><th class="num">Encaissé (FCFA)</th><th class="num">Solde (FCFA)</th></tr>
            </thead>
            <tbody>
              ${summary.map(x => `<tr>
                <td><span class="badge ${x.badge}"><span class="bdot"></span>${escapeHtml(x.label)}</span></td>
                <td class="num">${x.count}</td>
                <td class="num">${fmtNum(x.due)}</td>
                <td class="num">${fmtNum(x.collected)}</td>
                <td class="num ${x.balance > 0 ? 'text-red' : x.balance < 0 ? 'text-green' : 'muted'}">${fmtNum(x.balance)}</td>
              </tr>`).join('')}
              <tr style="background:#f8fafc">
                <td class="strong">Total</td>
                <td class="num strong">${totals.count}</td>
                <td class="num strong">${fmtNum(totals.due)}</td>
                <td class="num strong">${fmtNum(totals.collected)}</td>
                <td class="num strong ${totals.balance > 0 ? 'text-red' : totals.balance < 0 ? 'text-green' : ''}">${fmtNum(totals.balance)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="card" style="margin-bottom:18px">
      <div class="card-head">
        <div>
          <div class="card-title">Détail par organisme — ${monthLong(month)}</div>
          <div class="card-sub">Qui a déclaré, payé, partiellement payé ou non déclaré</div>
        </div>
        <span class="result-count" id="situation-count"><strong>${list.length}</strong> / ${stats.length}</span>
      </div>
      <div class="table-wrap tall" style="max-height:none">
        <table class="data-table" style="min-width:820px">
          <thead>
            <tr>
              <th class="sticky-col">Organisme</th>
              <th>N° d'immatriculation</th>
              <th class="num">Dû (FCFA)</th>
              <th class="num">Encaissé (FCFA)</th>
              <th class="num">Solde (FCFA)</th>
              <th>Situation</th>
            </tr>
          </thead>
          <tbody id="situation-tbody">
            ${situationRowsHtml(list, month)}
          </tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <div class="card-head">
        <div>
          <div class="card-title">Situation de chaque organisme sur les 12 mois de ${year}</div>
          <div class="card-sub">P = payé · PP = partiellement payé · NP = non payé · – = non déclaré</div>
        </div>
        <div class="legend-chips" style="padding:0">
          <span><span class="chip chip-p">P</span> Payé</span>
          <span><span class="chip chip-pp">PP</span> Partiel</span>
          <span><span class="chip chip-np">NP</span> Non payé</span>
          <span><span class="chip chip-none">–</span> Non déclaré</span>
        </div>
      </div>
      <div class="table-wrap tall">
        <table class="data-table matrix-table" style="min-width:1060px">
          <thead>
            <tr>
              <th class="sticky-col">Organisme</th>
              ${months.map(m => `<th class="month-col" style="${m === month ? 'color:var(--primary);background:#e8efff' : ''}">${monthShort(m)}</th>`).join('')}
            </tr>
          </thead>
          <tbody id="situation-matrix-tbody">
            ${situationMatrixRowsHtml(list, months)}
          </tbody>
        </table>
      </div>
    </section>`;
}

function situationRowsHtml(list, month) {
  if (!list.length) {
    return `<tr><td colspan="6">${emptyBlock('search', 'Aucun organisme trouvé', 'Modifiez votre recherche.')}</td></tr>`;
  }
  return list.map(s => {
    const ms = s.months[month];
    const sit = situationFor(ms);
    return `<tr>
      <td class="sticky-col">
        <span class="employer-name">
          <strong>${escapeHtml(s.emp.name)}</strong>
          <span>${escapeHtml(s.emp.sigle || '—')}</span>
        </span>
      </td>
      <td class="nowrap">${escapeHtml(s.emp.registration)}</td>
      <td class="num">${fmtNum(ms.dueRetained)}</td>
      <td class="num">${fmtNum(ms.collected)}</td>
      <td class="num ${ms.balance > 0 ? 'text-red' : ms.balance < 0 ? 'text-green' : 'muted'}">${fmtNum(ms.balance)}</td>
      <td>${situationBadge(sit)}</td>
    </tr>`;
  }).join('');
}

function situationMatrixRowsHtml(list, months) {
  if (!list.length) {
    return `<tr><td colspan="${months.length + 1}">${emptyBlock('search', 'Aucun organisme trouvé', 'Modifiez votre recherche.')}</td></tr>`;
  }
  return list.map(s => {
    const cells = months.map(m => {
      const ms = s.months[m];
      const sit = situationFor(ms);
      const title = `${monthLong(m)} — Dû : ${fmtMoney(ms.dueRetained)} · Encaissé : ${fmtMoney(ms.collected)}`;
      return `<td style="text-align:center" title="${escapeAttr(title)}">${situationBadge(sit, true)}</td>`;
    }).join('');
    return `<tr>
      <td class="sticky-col">
        <span class="employer-name">
          <strong>${escapeHtml(s.emp.name)}</strong>
          <span>${escapeHtml(s.emp.registration)}</span>
        </span>
      </td>
      ${cells}
    </tr>`;
  }).join('');
}

/* ---------------- Détail assurés ---------------- */
function filteredInsured() {
  const query = ui.insuredSearch.trim().toLowerCase();
  const year = normalizeYear(ui.year);
  return state.insured.filter(row => {
    if (normalizeMonth(row.month).slice(0, 4) !== year) return false;
    if (ui.insuredEmployer && row.employerId !== ui.insuredEmployer) return false;
    if (ui.insuredMonth && normalizeMonth(row.month) !== ui.insuredMonth) return false;
    if (!query) return true;
    const emp = getEmployer(row.employerId);
    return [row.matricule, row.name, emp ? emp.name : '', emp ? emp.registration : ''].join(' ').toLowerCase().includes(query);
  }).sort((a, b) => {
    if (a.month !== b.month) return b.month.localeCompare(a.month);
    const ea = getEmployer(a.employerId);
    const eb = getEmployer(b.employerId);
    const na = (ea ? ea.name : '') + '|' + a.name;
    const nb = (eb ? eb.name : '') + '|' + b.name;
    return na.localeCompare(nb, 'fr');
  });
}

function viewInsured() {
  const months = monthsList();
  if (ui.insuredMonth && !months.includes(ui.insuredMonth)) ui.insuredMonth = '';
  const list = filteredInsured();
  const visible = list.slice(0, ui.insuredLimit);
  const remaining = list.length - visible.length;
  const totals = list.reduce((acc, row) => {
    const calc = computeInsuredRow(row);
    acc.salary += calc.salary;
    acc.employee += calc.employee;
    acc.employer += calc.employer;
    acc.total += calc.total;
    return acc;
  }, { salary: 0, employee: 0, employer: 0, total: 0 });

  return `
    <div class="page-actions">
      <select class="select" id="insured-employer-filter" aria-label="Filtrer par employeur">${employerSelectOptions(ui.insuredEmployer)}</select>
      <select class="select" id="insured-month-filter" aria-label="Filtrer par mois">${monthSelectOptions(ui.insuredMonth, 'Tous les mois')}</select>
      <div class="search-box">
        ${ico('search')}
        <input type="search" id="insured-search" placeholder="Nom, matricule, employeur…" value="${escapeAttr(ui.insuredSearch)}" autocomplete="off" aria-label="Rechercher un assuré">
      </div>
      <span class="spacer"></span>
      <button class="btn btn-sm" id="export-insured">${ico('download')} CSV</button>
      <button class="btn btn-sm btn-primary" id="add-insured">${ico('plus')} Ajouter un assuré</button>
    </div>

    <div class="notice">
      ${ico('info')}
      <div><strong>Calcul automatique :</strong> salaire mensuel = indice × ${fmtNum(state.settings.valeurIndiciaire)} ÷ 12 · part employé ${fmtPct(state.settings.rateEmployee)} · part employeur ${fmtPct(state.settings.rateEmployer)} · total ${fmtPct(num(state.settings.rateEmployee) + num(state.settings.rateEmployer))}.</div>
    </div>

    <div class="summary-strip" style="border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;margin-bottom:18px;box-shadow:var(--shadow)">
      <div class="summary-item"><span>Année affichée</span><strong>${normalizeYear(ui.year)}</strong></div>
      <div class="summary-item"><span>Lignes affichées</span><strong>${fmtNum(visible.length)}${remaining > 0 ? ' / ' + fmtNum(list.length) : ''}</strong></div>
      <div class="summary-item"><span>Salaires mensuels</span><strong>${fmtNum(totals.salary)} FCFA</strong></div>
      <div class="summary-item"><span>Part employé</span><strong>${fmtNum(totals.employee)} FCFA</strong></div>
      <div class="summary-item"><span>Part employeur</span><strong>${fmtNum(totals.employer)} FCFA</strong></div>
      <div class="summary-item"><span>Cotisations totales</span><strong class="green">${fmtNum(totals.total)} FCFA</strong></div>
    </div>

    <section class="card">
      <div class="table-wrap tall">
        <table class="data-table" style="min-width:1080px">
          <thead>
            <tr>
              <th>Employeur</th>
              <th>Mois</th>
              <th>N° assuré</th>
              <th>Nom et prénoms</th>
              <th class="num">Indice</th>
              <th class="num">Salaire</th>
              <th class="num">Part employé</th>
              <th class="num">Part employeur</th>
              <th class="num">Total</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody id="insured-tbody">
            ${insuredRowsHtml(visible)}
          </tbody>
        </table>
      </div>
      ${remaining > 0 ? `<div class="load-more">
        <span>${fmtNum(remaining)} ligne(s) supplémentaire(s). Les totaux ci-dessus portent sur toutes les lignes filtrées.</span>
        <button class="btn btn-sm" type="button" id="insured-show-more">Afficher ${fmtNum(Math.min(500, remaining))} lignes de plus</button>
      </div>` : ''}
    </section>`;
}

function insuredRowsHtml(list) {
  if (!list.length) {
    return `<tr><td colspan="10">${emptyBlock('users', 'Aucun assuré enregistré pour ' + normalizeYear(ui.year), 'Le détail des assurés est facultatif : saisissez simplement le dû global dans le suivi mensuel, ou ajoutez ici les assurés d’un mois pour plus de traçabilité.', '<button class="btn btn-primary btn-sm" id="add-insured-empty">Ajouter un assuré</button>')}</td></tr>`;
  }
  return list.map(row => {
    const emp = getEmployer(row.employerId);
    const calc = computeInsuredRow(row);
    return `<tr>
      <td>
        <span class="employer-name">
          <strong>${escapeHtml(emp ? emp.name : '—')}</strong>
          <span>${escapeHtml(emp ? emp.registration : '')}</span>
        </span>
      </td>
      <td class="nowrap">${monthLong(row.month)}</td>
      <td class="nowrap">${escapeHtml(row.matricule || '—')}</td>
      <td>${escapeHtml(row.name)}</td>
      <td class="num">${fmtNum(row.indice)}</td>
      <td class="num">${fmtNum(calc.salary)}</td>
      <td class="num">${fmtNum(calc.employee)}</td>
      <td class="num">${fmtNum(calc.employer)}</td>
      <td class="num strong">${fmtNum(calc.total)}</td>
      <td class="col-actions">
        <span class="row-actions">
          <button class="icon-btn" title="Modifier" aria-label="Modifier l’assuré ${escapeAttr(row.name)}" data-edit-insured="${escapeAttr(row.id)}">${ico('edit')}</button>
          <button class="icon-btn danger" title="Supprimer" aria-label="Supprimer l’assuré ${escapeAttr(row.name)}" data-delete-insured="${escapeAttr(row.id)}">${ico('trash')}</button>
        </span>
      </td>
    </tr>`;
  }).join('');
}

/* ---------------- Journal ---------------- */
function filteredJournal() {
  let list = state.journal.slice();
  if (ui.journalEmployer) list = list.filter(j => j.employerId === ui.journalEmployer);
  if (ui.journalType) list = list.filter(j => j.type === ui.journalType);
  if (ui.journalAlert) list = list.filter(j => journalAlert(j) === ui.journalAlert);
  list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return list;
}

function viewJournal() {
  const list = filteredJournal();
  const all = state.journal;
  const overdue = all.filter(j => journalAlert(j) === 'En retard').length;
  const soon = all.filter(j => journalAlert(j) === 'À faire bientôt').length;
  const upcoming = all.filter(j => journalAlert(j) === 'À venir').length;

  return `
    <div class="page-actions">
      <select class="select" id="journal-employer-filter" aria-label="Filtrer par employeur">${employerSelectOptions(ui.journalEmployer)}</select>
      <select class="select" id="journal-type-filter" aria-label="Filtrer par type">${optionsFrom(ACTION_TYPES, ui.journalType, 'Tous les types')}</select>
      <select class="select" id="journal-alert-filter" aria-label="Filtrer par alerte">
        ${optionsFrom(['En retard', 'À faire bientôt', 'À venir'], ui.journalAlert, 'Toutes les alertes')}
      </select>
      <span class="spacer"></span>
      <button class="btn btn-sm" id="export-journal">${ico('download')} CSV</button>
      <button class="btn btn-sm btn-primary" id="add-journal">${ico('plus')} Nouvelle action</button>
    </div>

    <div class="summary-strip" style="border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;margin-bottom:18px;box-shadow:var(--shadow)">
      <div class="summary-item"><span>Actions enregistrées</span><strong>${all.length}</strong></div>
      <div class="summary-item"><span>En retard</span><strong class="red">${overdue}</strong></div>
      <div class="summary-item"><span>À faire bientôt</span><strong class="amber">${soon}</strong></div>
      <div class="summary-item"><span>À venir</span><strong>${upcoming}</strong></div>
    </div>

    <section class="card">
      <div class="table-wrap tall">
        <table class="data-table" style="min-width:1080px">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employeur</th>
              <th>Type</th>
              <th>Interlocuteur</th>
              <th>Résultat / engagement</th>
              <th>Prochaine action</th>
              <th>Agent</th>
              <th>Alerte</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody id="journal-tbody">
            ${journalRowsHtml(list)}
          </tbody>
        </table>
      </div>
    </section>`;
}

function journalRowsHtml(list) {
  if (!list.length) {
    return `<tr><td colspan="9">${emptyBlock('file', 'Aucune action enregistrée', 'Consignez ici chaque appel, courrier, visite ou engagement pris avec un employeur.', '<button class="btn btn-primary btn-sm" id="add-journal-empty">Enregistrer une action</button>')}</td></tr>`;
  }
  return list.map(j => {
    const emp = getEmployer(j.employerId);
    const alert = journalAlert(j);
    return `<tr>
      <td class="nowrap">${fmtDate(j.date)}</td>
      <td>
        <span class="employer-name">
          <strong>${escapeHtml(emp ? emp.name : '—')}</strong>
          <span>${escapeHtml(emp ? emp.registration : '')}</span>
        </span>
      </td>
      <td><span class="badge badge-blue">${escapeHtml(j.type)}</span></td>
      <td>${j.contact ? escapeHtml(j.contact) : '<span class="muted">—</span>'}</td>
      <td title="${escapeAttr(j.result)}">${j.result ? escapeHtml(truncate(j.result, 80)) : '<span class="muted">—</span>'}</td>
      <td>
        ${j.nextAction ? escapeHtml(truncate(j.nextAction, 60)) : '<span class="muted">—</span>'}
        ${j.nextDate ? `<span class="sub">${fmtDate(j.nextDate)}</span>` : ''}
      </td>
      <td>${j.agent ? escapeHtml(j.agent) : '<span class="muted">—</span>'}</td>
      <td>${alertBadge(alert)}</td>
      <td class="col-actions">
        <span class="row-actions">
          <button class="icon-btn" title="Modifier" aria-label="Modifier l’action du ${escapeAttr(fmtDate(j.date))}" data-edit-journal="${escapeAttr(j.id)}">${ico('edit')}</button>
          <button class="icon-btn danger" title="Supprimer" aria-label="Supprimer l’action du ${escapeAttr(fmtDate(j.date))}" data-delete-journal="${escapeAttr(j.id)}">${ico('trash')}</button>
        </span>
      </td>
    </tr>`;
  }).join('');
}

/* ---------------- Échéanciers ---------------- */
function filteredSchedules() {
  let list = state.schedules.slice();
  if (ui.scheduleEmployer) list = list.filter(s => s.employerId === ui.scheduleEmployer);
  if (ui.scheduleStatus) list = list.filter(s => scheduleStats(s).status === ui.scheduleStatus);
  list.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  return list;
}

function viewSchedules() {
  const list = filteredSchedules();
  const all = state.schedules.map(s => ({ item: s, calc: scheduleStats(s) }));
  const totals = all.reduce((acc, x) => {
    acc.amount += x.calc.amount;
    acc.paid += x.calc.paid;
    acc.remaining += Math.max(0, x.calc.remaining);
    if (x.calc.status === 'En retard') {
      acc.lateCount += 1;
      acc.lateAmount += Math.max(0, x.calc.remaining);
    }
    return acc;
  }, { amount: 0, paid: 0, remaining: 0, lateCount: 0, lateAmount: 0 });

  return `
    <div class="page-actions">
      <select class="select" id="schedule-employer-filter" aria-label="Filtrer par employeur">${employerSelectOptions(ui.scheduleEmployer)}</select>
      <select class="select" id="schedule-status-filter" aria-label="Filtrer par statut">
        ${optionsFrom(['Payée', 'En retard', 'À venir'], ui.scheduleStatus, 'Tous les statuts')}
      </select>
      <span class="spacer"></span>
      <button class="btn btn-sm" id="export-schedules">${ico('download')} CSV</button>
      <button class="btn btn-sm btn-primary" id="add-schedule">${ico('plus')} Nouvelle échéance</button>
    </div>

    <div class="summary-strip" style="border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;margin-bottom:18px;box-shadow:var(--shadow)">
      <div class="summary-item"><span>Montant prévu</span><strong>${fmtNum(totals.amount)} FCFA</strong></div>
      <div class="summary-item"><span>Montant payé</span><strong class="green">${fmtNum(totals.paid)} FCFA</strong></div>
      <div class="summary-item"><span>Reste à payer</span><strong class="red">${fmtNum(totals.remaining)} FCFA</strong></div>
      <div class="summary-item"><span>Échéances en retard</span><strong class="red">${totals.lateCount} · ${fmtNum(totals.lateAmount)} FCFA</strong></div>
    </div>

    <section class="card">
      <div class="table-wrap tall">
        <table class="data-table" style="min-width:1040px">
          <thead>
            <tr>
              <th>Employeur</th>
              <th>N° échéance</th>
              <th>Date prévue</th>
              <th class="num">Montant prévu</th>
              <th>Date de paiement</th>
              <th class="num">Montant payé</th>
              <th class="num">Reste à payer</th>
              <th>Statut</th>
              <th class="num">Jours de retard</th>
              <th class="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody id="schedules-tbody">
            ${scheduleRowsHtml(list)}
          </tbody>
        </table>
      </div>
    </section>`;
}

function scheduleRowsHtml(list) {
  if (!list.length) {
    return `<tr><td colspan="10">${emptyBlock('calendar', 'Aucun échéancier enregistré', 'Ajoutez les échéances négociées avec un employeur pour suivre les paiements attendus.', '<button class="btn btn-primary btn-sm" id="add-schedule-empty">Créer un échéancier</button>')}</td></tr>`;
  }
  return list.map(item => {
    const emp = getEmployer(item.employerId);
    const calc = scheduleStats(item);
    return `<tr>
      <td>
        <span class="employer-name">
          <strong>${escapeHtml(emp ? emp.name : '—')}</strong>
          <span>${escapeHtml(emp ? emp.registration : '')}</span>
        </span>
      </td>
      <td class="nowrap">${item.number ? escapeHtml(item.number) : '<span class="muted">—</span>'}</td>
      <td class="nowrap">${fmtDate(item.dueDate)}</td>
      <td class="num">${fmtNum(calc.amount)}</td>
      <td class="nowrap">${item.paidDate ? fmtDate(item.paidDate) : '<span class="muted">—</span>'}</td>
      <td class="num">${fmtNum(calc.paid)}</td>
      <td class="num ${calc.remaining > 0 ? 'text-red' : 'muted'}">${fmtNum(calc.remaining)}</td>
      <td>${scheduleBadge(calc.status)}</td>
      <td class="num">${calc.lateDays ? calc.lateDays + ' j' : '<span class="muted">—</span>'}</td>
      <td class="col-actions">
        <span class="row-actions">
          ${calc.status !== 'Payée' ? `<button class="icon-btn" title="Marquer comme payée" aria-label="Marquer l’échéance du ${escapeAttr(fmtDate(item.dueDate))} comme payée" data-pay-schedule="${escapeAttr(item.id)}">${ico('check')}</button>` : ''}
          <button class="icon-btn" title="Modifier" aria-label="Modifier l’échéance du ${escapeAttr(fmtDate(item.dueDate))}" data-edit-schedule="${escapeAttr(item.id)}">${ico('edit')}</button>
          <button class="icon-btn danger" title="Supprimer" aria-label="Supprimer l’échéance du ${escapeAttr(fmtDate(item.dueDate))}" data-delete-schedule="${escapeAttr(item.id)}">${ico('trash')}</button>
        </span>
      </td>
    </tr>`;
  }).join('');
}

/* ---------------- Paramètres ---------------- */
function viewSettings() {
  const settings = state.settings;
  const autoToday = !settings.todayOverride;
  const totalRate = num(settings.rateEmployee) + num(settings.rateEmployer);
  const { stats, year } = buildStats();
  const totalPrior = stats.reduce((sum, s) => sum + s.priorBalance, 0);
  const priorDebtors = stats.filter(s => s.priorBalance > 0).length;
  const nextYear = String(Number(year) + 1);
  const monthlyEntries = Object.values(state.monthly).reduce((sum, months) => {
    return sum + Object.values(months).filter(v => num(v.dueGlobal) > 0 || num(v.collected) > 0).length;
  }, 0);
  const employersNoContact = state.employers.filter(e => !String(e.contact || '').trim());
  const employersNoEmail = state.employers.filter(e => String(e.contact || '').trim() && !/[^\s@]+@[^\s@]+\.[^\s@]+/.test(e.contact));
  const employersUpper = state.employers.filter(e => /[A-ZÀ-Ý]/.test(e.name) && e.name === e.name.toUpperCase());
  const normalizableNames = state.employers.filter(e => normalizeEmployerName(e.name) !== e.name);
  const statusSuggestions = stats.filter(s => {
    const suggested = suggestedStatusFor(s);
    return suggested && suggested !== s.emp.status;
  });
  const qualityEmployerIds = new Set();
  employersNoContact.forEach(e => qualityEmployerIds.add(e.id));
  employersNoEmail.forEach(e => qualityEmployerIds.add(e.id));
  employersUpper.forEach(e => qualityEmployerIds.add(e.id));
  statusSuggestions.forEach(s => qualityEmployerIds.add(s.emp.id));
  const qualityPoints = qualityEmployerIds.size;
  const storageSize = (() => {
    try { return Math.round(new Blob([JSON.stringify(state)]).size / 1024); } catch (e) { return 0; }
  })();
  const backups = listLocalBackups();
  const backupsBytes = backups.reduce((sum, item) => sum + item.bytes, 0);

  return `
    <div class="settings-grid">
      <section class="card">
        <div class="card-head">
          <div>
            <div class="card-title">Paramètres de calcul</div>
            <div class="card-sub">Ces valeurs alimentent les calculs de toute l’application</div>
          </div>
        </div>
        <div class="card-body">
          <form id="settings-form" autocomplete="off">
            <div class="form-grid">
              <div class="form-field">
                <label for="set-alert-days">Alerte « à faire bientôt » (jours)</label>
                <input class="input" type="number" id="set-alert-days" min="0" step="1" value="${num(settings.alertDays)}">
                <span class="help">Une action ou échéance est signalée à partir de ce nombre de jours avant la date prévue.</span>
              </div>
              <div class="form-field full">
                <label for="set-today">Date du jour pour les calculs</label>
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
                  <input class="input" type="date" id="set-today" value="${escapeAttr(effectiveToday())}" ${autoToday ? 'disabled' : ''} style="max-width:190px">
                  <label style="display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:600;color:var(--muted);cursor:pointer">
                    <input type="checkbox" id="set-today-auto" ${autoToday ? 'checked' : ''}> Utiliser la date du système
                  </label>
                </div>
                <span class="help">Décochez pour simuler une autre date (utile pour tester les alertes et l’ancienneté).</span>
              </div>
              <div class="form-field">
                <label for="set-valeur">Valeur indiciaire (FCFA, annuelle)</label>
                <input class="input" type="number" id="set-valeur" min="0" step="0.01" value="${settings.valeurIndiciaire}">
                <span class="help">Salaire mensuel = indice × valeur indiciaire ÷ 12.</span>
              </div>
              <div class="form-field">
                <label for="set-rate-total">Taux de cotisation totale</label>
                <div class="input-suffix">
                  <input class="input" type="text" id="set-rate-total" value="${fmtPct(totalRate)}" disabled>
                  <span>calculé</span>
                </div>
                <span class="help">Part employé + part employeur.</span>
              </div>
              <div class="form-field">
                <label for="set-rate-employee">Taux — part employé</label>
                <div class="input-suffix">
                  <input class="input" type="number" id="set-rate-employee" min="0" max="100" step="0.1" value="${(num(settings.rateEmployee) * 100).toFixed(2)}">
                  <span>%</span>
                </div>
              </div>
              <div class="form-field">
                <label for="set-rate-employer">Taux — part employeur</label>
                <div class="input-suffix">
                  <input class="input" type="number" id="set-rate-employer" min="0" max="100" step="0.1" value="${(num(settings.rateEmployer) * 100).toFixed(2)}">
                  <span>%</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button class="btn" type="button" id="reset-settings-defaults">${ico('refresh')} Valeurs du classeur</button>
              <button class="btn btn-primary" type="submit">${ico('check')} Enregistrer les paramètres</button>
            </div>
          </form>
        </div>
      </section>

      <div class="settings-stack">
        <section class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Suivi annuel</div>
              <div class="card-sub">Année civile, de janvier à décembre</div>
            </div>
            <span class="badge badge-blue">${year}</span>
          </div>
          <div class="card-body">
            <div class="year-switch">
              <select class="select" id="set-year" aria-label="Année de suivi">${optionsFrom(availableYears(), year)}</select>
              <button class="btn btn-primary" type="button" id="start-next-year">${ico('calendar')} Préparer ${nextYear}</button>
            </div>
            <div class="carry-box">
              <span>Solde reporté au 1<sup>er</sup> janv. ${year}</span>
              <strong class="${totalPrior > 0 ? 'red' : ''}">${fmtMoney(totalPrior)}</strong>
            </div>
            <p class="year-help">${priorDebtors ? `${priorDebtors} ${plural(priorDebtors, 'employeur conserve', 'employeurs conservent')} un solde antérieur. ` : ''}Le solde impayé au 31 décembre est automatiquement repris comme solde antérieur de l’année suivante et reste inclus dans le solde total. Ne ressaisissez pas ce report dans le dû de janvier.</p>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Qualité des données</div>
              <div class="card-sub">Contrôles du registre des ${state.employers.length} employeurs</div>
            </div>
            <span class="badge ${qualityPoints ? 'badge-amber' : 'badge-green'}"><span class="bdot"></span>${qualityPoints ? qualityPoints + ' dossier' + (qualityPoints > 1 ? 's' : '') : 'À jour'}</span>
          </div>
          <div class="card-body">
            <div class="quality-list">
              <div class="quality-row">
                <div><strong>${employersNoContact.length} sans contact</strong><span>Téléphone ou e-mail à compléter.</span></div>
                <button class="btn btn-sm btn-ghost" type="button" data-quality-list="no-contact">Voir</button>
              </div>
              <div class="quality-row">
                <div><strong>${employersNoEmail.length} contacts sans e-mail</strong><span>Utile pour les relances écrites.</span></div>
                <button class="btn btn-sm btn-ghost" type="button" data-quality-list="no-email">Voir</button>
              </div>
              <div class="quality-row">
                <div><strong>${employersUpper.length} noms en majuscules</strong><span>${normalizableNames.length} peuvent être normalisés sans toucher aux sigles.</span></div>
                <div class="qm-actions">
                  <button class="btn btn-sm btn-ghost" type="button" data-quality-list="uppercase">Voir</button>
                  ${normalizableNames.length ? '<button class="btn btn-sm" type="button" id="normalize-names-settings">Normaliser</button>' : ''}
                </div>
              </div>
              <div class="quality-row">
                <div><strong>${statusSuggestions.length} statuts à vérifier</strong><span>D’après le solde cumulé et les échéanciers.</span></div>
                <button class="btn btn-sm btn-ghost" type="button" data-quality-list="suggested">Voir</button>
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Sauvegarde et données</div>
              <div class="card-sub">Les données sont stockées dans ce navigateur</div>
            </div>
          </div>
          <div class="card-body">
            <div class="data-actions">
              <button class="data-action" id="export-json">
                <span class="da-ico">${ico('download')}</span>
                <span><strong>Exporter une sauvegarde complète (JSON)</strong><span>Employeurs, suivi mensuel, assurés, journal et échéanciers.</span></span>
              </button>
              <button class="data-action" id="import-json">
                <span class="da-ico">${ico('upload')}</span>
                <span><strong>Importer une sauvegarde</strong><span>Remplace les données actuelles après confirmation.</span></span>
              </button>
              <input type="file" id="import-file" accept="application/json,.json" hidden>
              <button class="data-action" id="export-all-csv">
                <span class="da-ico">${ico('file')}</span>
                <span><strong>Exporter le registre des employeurs (CSV)</strong><span>Compatible Excel (séparateur point-virgule).</span></span>
              </button>
              <button class="data-action" id="reset-data">
                <span class="da-ico danger">${ico('refresh')}</span>
                <span><strong>Réinitialiser l’application</strong><span>Recharge les 71 employeurs du classeur et efface toute saisie.</span></span>
              </button>
            </div>

            <div class="backup-block">
              <div class="backup-head">
                <div>
                  <strong>Sauvegardes automatiques</strong>
                  <span>Créées avant chaque import ou réinitialisation · ${BACKUP_KEEP} conservées</span>
                </div>
                <button class="btn btn-sm" type="button" id="create-backup">${ico('plus')} Créer maintenant</button>
              </div>
              ${backups.length ? `<ul class="backup-list">
                ${backups.map(item => `
                  <li class="backup-row">
                    <div class="backup-info">
                      <strong>${escapeHtml(backupDateLabel(item))}</strong>
                      <span>${item.employerCount != null ? `${item.employerCount} employeurs · ` : ''}${formatBytes(item.bytes)}${item.reason ? ' · ' + escapeHtml(BACKUP_REASON_LABELS[item.reason] || item.reason) : ''}</span>
                    </div>
                    <div class="backup-actions">
                      <button class="btn btn-sm" type="button" data-restore-backup="${escapeAttr(item.key)}">Restaurer</button>
                      <button class="btn btn-sm btn-ghost" type="button" data-delete-backup="${escapeAttr(item.key)}" aria-label="Supprimer la sauvegarde du ${escapeAttr(backupDateLabel(item))}">${ico('trash')}</button>
                    </div>
                  </li>`).join('')}
              </ul>` : `<p class="backup-empty">Aucune sauvegarde automatique. Elle est créée avant chaque import ; vous pouvez aussi en créer une maintenant.</p>`}
              <div class="backup-total">${backups.length} / ${BACKUP_KEEP} sauvegardes · ${formatBytes(backupsBytes)}</div>
            </div>

            <div class="notice" style="margin-top:14px">${ico('info')}<div><strong>Données en clair.</strong> Le registre est enregistré sans chiffrement dans le stockage de ce navigateur : toute personne utilisant cette session Windows peut le consulter. Verrouillez votre session et protégez l’ordinateur (mot de passe, chiffrement du disque). Pour un transfert sûr, exportez un JSON et conservez-le dans un dossier protégé.</div></div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div>
              <div class="card-title">Contenu de la base locale</div>
              <div class="card-sub">${storageAvailable ? 'Sauvegarde locale active' : 'Stockage local indisponible'}</div>
            </div>
            <span class="badge ${storageAvailable ? 'badge-green' : 'badge-red'}"><span class="bdot"></span>${storageAvailable ? 'Local' : 'Hors ligne'}</span>
          </div>
          <div class="card-body">
            <div class="stats-list">
              <div><span>Version</span><strong>${APP_RELEASE}</strong></div>
              <div><span>Employeurs</span><strong>${state.employers.length}</strong></div>
              <div><span>Mois saisis (toutes années)</span><strong>${monthlyEntries}</strong></div>
              <div><span>Lignes assurés</span><strong>${state.insured.length}</strong></div>
              <div><span>Actions au journal</span><strong>${state.journal.length}</strong></div>
              <div><span>Échéances</span><strong>${state.schedules.length}</strong></div>
              <div><span>Taille des données</span><strong>${storageSize} Ko</strong></div>
            </div>
            ${storageAvailable ? '' : `<div class="notice danger" style="margin:14px 0 0">${ico('alert')}<div>Le navigateur bloque le stockage local (souvent en mode navigation privée). Exportez régulièrement vos données.</div></div>`}
          </div>
        </section>
      </div>
    </div>

    <section class="card" style="margin-top:18px">
      <div class="card-head">
        <div>
          <div class="card-title">Mode d’emploi</div>
          <div class="card-sub">Reprise du fonctionnement du classeur Excel</div>
        </div>
      </div>
      <div class="card-body">
        <div class="help-list">
          <div class="help-step"><div><strong>Employeurs</strong><p>Un employeur par ligne. Renseignez le n° d’immatriculation, la raison sociale, le sigle, le contact, l’effectif et le statut. Le dû, le recouvré, le solde et l’ancienneté sont calculés automatiquement.</p></div></div>
          <div class="help-step"><div><strong>Année de suivi</strong><p>Le suivi est organisé par année civile, de janvier à décembre. Choisissez l’année dans la barre supérieure ou ici. Les années précédentes restent accessibles et le solde impayé au 31 décembre est reporté automatiquement comme solde antérieur : il n’y a rien à ressaisir.</p></div></div>
          <div class="help-step"><div><strong>Suivi mensuel</strong><p>Saisissez le dû global et l’encaissé de chaque mois de l’année affichée. Le « dû retenu » utilise le détail des assurés s’il existe pour le mois, sinon le montant global. La synthèse 12 mois donne le solde mensuel, le solde antérieur et le solde cumulé.</p></div></div>
          <div class="help-step"><div><strong>Détail assurés (facultatif)</strong><p>Une ligne par assuré et par mois. Pour un mois donné, détaillez tous les assurés ou aucun. Pour un grand employeur, saisissez simplement le montant global dans le suivi mensuel.</p></div></div>
          <div class="help-step"><div><strong>Situation mensuelle</strong><p>Choisissez un mois pour voir quels organismes ont déclaré et payé, payé en partie, pas payé, ou n’ont pas déclaré. Le tableau des 12 mois résume chaque organisme.</p></div></div>
          <div class="help-step"><div><strong>Journal</strong><p>Consignez chaque appel, courrier, email, visite ou réunion. Renseignez la date de la prochaine action pour déclencher les alertes ; effacez-la une fois l’action réalisée.</p></div></div>
          <div class="help-step"><div><strong>Échéanciers</strong><p>Une ligne par échéance négociée. Renseignez la date et le montant payés à réception du paiement : le reste, le statut et les jours de retard sont calculés.</p></div></div>
          <div class="help-step"><div><strong>Sauvegarde</strong><p>Les données restent dans ce navigateur. Exportez régulièrement une sauvegarde JSON et conservez-la : elle permet de retrouver toutes les données ou de les transférer sur un autre poste.</p></div></div>
        </div>
      </div>
    </section>`;
}

/* ---------------- Fiche employeur ---------------- */
function employerFicheHtml(employerId, originLabel = '') {
  const { stats, year } = buildStats();
  const s = stats.find(x => x.emp.id === employerId);
  if (!s) return '';
  const months = monthsList();
  const activeMonths = months.filter(m => {
    const ms = s.months[m];
    return ms.dueRetained > 0 || ms.collected > 0 || ms.hasDetail;
  });
  const schedules = state.schedules
    .filter(x => x.employerId === employerId)
    .map(x => ({ item: x, calc: scheduleStats(x) }))
    .sort((a, b) => (a.item.dueDate || '').localeCompare(b.item.dueDate || ''));
  const insuredRows = state.insured.filter(r => r.employerId === employerId && normalizeMonth(r.month).slice(0, 4) === year);
  const insuredTotal = insuredRows.reduce((sum, r) => sum + computeInsuredRow(r).total, 0);
  const recentActions = s.actions.slice(0, 4);
  const period = s.startMonth ? `${monthShort(s.startMonth)} → ${monthShort(s.endMonth || s.startMonth)}` : '—';
  const showPrior = s.priorDue > 0 || s.priorCollected > 0;
  const suggested = suggestedStatusFor(s);
  const showSuggested = !!suggested && suggested !== s.emp.status;

  return `
    <div class="print-only fiche-print-head">
      <div class="fph-brand">Recouvrement · Cotisations sociales</div>
      <div class="fph-meta">Fiche employeur · Année ${escapeHtml(year)} · Édité le ${escapeHtml(new Date().toLocaleDateString('fr-FR'))} · Date de référence : ${escapeHtml(fmtDate(effectiveToday()))}</div>
    </div>
    ${originLabel ? `<div class="fiche-breadcrumb">${escapeHtml(originLabel)} <span>›</span> Fiche employeur</div>` : ''}
    <div class="fiche-head">
      <div class="fiche-avatar">${escapeHtml(initials(s.emp.name))}</div>
      <div class="fiche-title">
        <h2>${escapeHtml(s.emp.name)}</h2>
        <p>${escapeHtml(s.emp.registration)}${s.emp.sigle ? ' · ' + escapeHtml(s.emp.sigle) : ''}</p>
      </div>
      <div>${statusBadge(s.emp.status)}</div>
    </div>
    <div class="fiche-stats">
      <div class="fiche-stat"><span>Cotisations dues ${year}</span><strong>${fmtNum(s.due)}</strong></div>
      <div class="fiche-stat"><span>Recouvré ${year}</span><strong class="green">${fmtNum(s.collected)}</strong></div>
      <div class="fiche-stat"><span>Solde total</span><strong class="${s.totalBalance > 0 ? 'red' : 'green'}">${fmtNum(s.totalBalance)}</strong>${s.priorBalance ? `<small>dont ${fmtNum(s.priorBalance)} antérieur</small>` : ''}</div>
      <div class="fiche-stat"><span>Ancienneté</span><strong>${s.ageDays == null ? '—' : s.ageDays + ' j'}</strong></div>
    </div>
    <div class="fiche-section">
      <h3>Informations</h3>
      <div class="fiche-info">
        <div><span>Contact :</span><strong>${s.emp.contact ? escapeHtml(s.emp.contact) : '—'}</strong></div>
        <div><span>Effectif déclaré :</span><strong>${fmtNum(s.emp.effectif)}</strong></div>
        <div><span>Période impayée :</span><strong>${period}</strong></div>
        <div><span>Solde antérieur :</span><strong>${fmtMoney(s.priorBalance)}</strong></div>
        <div><span>Dernière action :</span><strong>${s.lastAction ? fmtDate(s.lastAction) : '—'}</strong></div>
        ${showSuggested ? `<div><span>Statut suggéré :</span><strong>${escapeHtml(suggested)} <button class="link-btn" type="button" id="fiche-apply-status">Appliquer</button></strong></div>` : ''}
      </div>
    </div>
    <div class="fiche-section">
      <h3>Mouvements mensuels — ${year}</h3>
      ${activeMonths.length || showPrior ? `<table class="mini-table">
        <thead><tr><th>Mois</th><th>Dû retenu</th><th>Encaissé</th><th>Solde</th></tr></thead>
        <tbody>
          ${showPrior ? `<tr class="prior-row"><td>Antérieur au 1<sup>er</sup> janv.</td><td>${fmtNum(s.priorDue)}</td><td>${fmtNum(s.priorCollected)}</td><td class="${s.priorBalance > 0 ? 'red' : ''}">${fmtNum(s.priorBalance)}</td></tr>` : ''}
          ${activeMonths.map(m => {
            const ms = s.months[m];
            return `<tr><td>${monthShort(m)}</td><td>${fmtNum(ms.dueRetained)}</td><td>${fmtNum(ms.collected)}</td><td class="${ms.balance > 0 ? 'red' : ''}">${fmtNum(ms.balance)}</td></tr>`;
          }).join('')}
        </tbody>
      </table>` : `<div class="fiche-empty">Aucun mouvement enregistré sur l’année ${year}.</div>`}
    </div>
    <div class="fiche-section">
      <h3>Actions récentes</h3>
      ${recentActions.length ? `<div class="fiche-list">
        ${recentActions.map(j => `<div class="fiche-list-row">
          <span class="badge badge-blue">${escapeHtml(j.type)}</span>
          <span class="fl-main"><strong>${escapeHtml(truncate(j.result || j.nextAction || '—', 70))}</strong><span>${fmtDate(j.date)}${j.agent ? ' · ' + escapeHtml(j.agent) : ''}</span></span>
          <span class="fl-value">${alertBadge(journalAlert(j))}</span>
        </div>`).join('')}
      </div>` : `<div class="fiche-empty">Aucune action enregistrée pour cet employeur.</div>`}
    </div>
    <div class="fiche-section">
      <h3>Échéanciers</h3>
      ${schedules.length ? `<div class="fiche-list">
        ${schedules.slice(0, 5).map(x => `<div class="fiche-list-row">
          <span class="fl-main"><strong>${x.item.number ? escapeHtml(x.item.number) : 'Échéance'} — ${fmtDate(x.item.dueDate)}</strong><span>Prévu : ${fmtMoney(x.calc.amount)} · Payé : ${fmtMoney(x.calc.paid)}</span></span>
          <span class="fl-value">${scheduleBadge(x.calc.status)}</span>
        </div>`).join('')}
      </div>` : `<div class="fiche-empty">Aucun échéancier pour cet employeur.</div>`}
    </div>
    <div class="fiche-section">
      <h3>Détail des assurés — ${year}</h3>
      ${insuredRows.length ? `<div class="fiche-info">
        <div><span>Lignes :</span><strong>${insuredRows.length}</strong></div>
        <div><span>Cotisations totales :</span><strong>${fmtMoney(insuredTotal)}</strong></div>
      </div>` : `<div class="fiche-empty">Aucun assuré détaillé pour ${year}. Le dû global du suivi mensuel est utilisé.</div>`}
    </div>`;
}
