/* ============================================================
   Noyau : constantes, état, stockage, calculs, utilitaires UI
   ============================================================ */

const APP_VERSION = 2;
const APP_RELEASE = '1.2.0';
const DATA_VERSION = 4;
const STORAGE_KEY = 'suivi-cotisations-impayees-v1';

const STATUSES = [
  'À relancer',
  'Mise en demeure envoyée',
  'Échéancier en cours',
  'Contentieux',
  'Soldé'
];

const ACTION_TYPES = [
  'Appel',
  'Courrier',
  'Email',
  'Visite',
  'Réunion',
  'Mise en demeure',
  'Relance téléphonique',
  'Autre'
];

const MONTHS_LONG = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

const STATUS_COLORS = {
  'À relancer': '#b45309',
  'Mise en demeure envoyée': '#c2410c',
  'Échéancier en cours': '#1d4ed8',
  'Contentieux': '#b91c1c',
  'Soldé': '#15803d'
};

const THEMES = [
  { id: '', label: 'Bleu et blanc', description: 'Thème clair et sobre, accents bleus' },
  { id: 'amber', label: 'Gris et jaune', description: 'Fond gris chaud, accents jaunes' },
  { id: 'red', label: 'Rouge et gris', description: 'Accents rouges sur fond gris' }
];
const THEME_STORAGE_KEY = 'suivi-cotisations-theme-v1';

const STATUS_BADGE_CLASS = {
  'À relancer': 'badge-amber',
  'Mise en demeure envoyée': 'badge-orange',
  'Échéancier en cours': 'badge-blue',
  'Contentieux': 'badge-red',
  'Soldé': 'badge-green'
};

const ICONS = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  upload: '<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  alert: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v4M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<path d="M8 2v4M16 2v4M3.5 9h17M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  wallet: '<path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 9h18"/><path d="M16 13h2"/>',
  trending: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>',
  printer: '<path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H13a2 2 0 0 1 0-4h4a4 4 0 0 0 4-4c0-3.3-4-6-9-6Z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>'
};

const ui = {
  route: 'dashboard',
  year: '',
  employerSearch: '',
  employerStatus: '',
  employerSort: 'name',
  monthlyMode: 'entry',
  monthlyMonth: '',
  monthlySearch: '',
  situationMonth: '',
  situationSearch: '',
  insuredEmployer: '',
  insuredMonth: '',
  insuredSearch: '',
  insuredLimit: 500,
  journalEmployer: '',
  journalType: '',
  journalAlert: '',
  scheduleEmployer: '',
  scheduleStatus: '',
  ficheEmployerId: null
};

let state = null;
let storageAvailable = true;
let lastSavedAt = null;

const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;
const STORAGE_WARN_RATIO = 0.8;
let storageBytes = 0;
let storageFull = false;

const BACKUP_PREFIX = STORAGE_KEY + '-backup-';
const BACKUP_KEEP = 5;
const BACKUP_MAX_BYTES = 2 * 1024 * 1024;
const BACKUP_REASON_LABELS = {
  import: 'Avant import',
  reset: 'Avant réinitialisation',
  restore: 'Avant restauration',
  manual: 'Manuelle'
};

/* ---------- Utilitaires de base ---------- */
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) { return escapeHtml(value); }

function ico(name, cls = '') {
  return `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

function normalizeTheme(value) {
  return THEMES.some(t => t.id === value) ? value : '';
}

function loadTheme() {
  try {
    return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY) || '');
  } catch (e) {
    return '';
  }
}

function applyTheme(themeId, options = {}) {
  const theme = normalizeTheme(themeId);
  if (theme) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch (e) { /* stockage indisponible */ }
  const meta = THEMES.find(t => t.id === theme) || THEMES[0];
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.title = 'Thème : ' + meta.label;
  if (options.toast) toast('Thème appliqué : ' + meta.label + '.');
}

function uid(prefix = 'id') {
  return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

function pad2(n) { return String(n).padStart(2, '0'); }

function num(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (value == null) return 0;
  let s = String(value).trim().replace(/\s/g, '').replace(',', '.');
  if (s === '') return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function round0(n) { return Math.round(num(n)); }

function fmtNum(n) {
  return num(n).toLocaleString('fr-FR', { maximumFractionDigits: 0 });
}

function fmtMoney(n) {
  return fmtNum(n) + ' FCFA';
}

function fmtPct(ratio) {
  const p = num(ratio) * 100;
  const rounded = Math.round(p * 10) / 10;
  return rounded.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' %';
}

function plural(n, one, many) { return n > 1 ? many : one; }

/* ---------- Dates ---------- */
function isoDate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function todayISO() { return isoDate(new Date()); }

function effectiveToday() {
  const override = state && state.settings ? state.settings.todayOverride : '';
  return override || todayISO();
}

function dateParts(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m) return null;
  return { y: +m[1], m: +m[2], d: +m[3] };
}

function daysBetween(fromISO, toISO) {
  const a = dateParts(fromISO);
  const b = dateParts(toISO);
  if (!a || !b) return 0;
  const utcA = Date.UTC(a.y, a.m - 1, a.d);
  const utcB = Date.UTC(b.y, b.m - 1, b.d);
  return Math.round((utcB - utcA) / 86400000);
}

function fmtDate(iso) {
  const p = dateParts(iso);
  if (!p) return '—';
  return `${pad2(p.d)}/${pad2(p.m)}/${p.y}`;
}

function fmtDateLong(iso) {
  const p = dateParts(iso);
  if (!p) return '—';
  return `${p.d} ${MONTHS_LONG[p.m - 1]} ${p.y}`;
}

function fmtDateShort(iso) {
  const p = dateParts(iso);
  if (!p) return '—';
  return `${pad2(p.d)}/${pad2(p.m)}/${String(p.y).slice(2)}`;
}

function addDaysISO(iso, days) {
  const p = dateParts(iso);
  if (!p) return iso;
  const d = new Date(p.y, p.m - 1, p.d + days);
  return isoDate(d);
}

function currentMonthKey() { return todayISO().slice(0, 7); }

function normalizeMonth(value) {
  const s = String(value || '').trim();
  const m = /^(\d{4})-(\d{2})/.exec(s);
  if (!m) return '2026-01';
  const month = Math.min(12, Math.max(1, +m[2]));
  return `${m[1]}-${pad2(month)}`;
}

function monthStartISO(monthKey) { return normalizeMonth(monthKey) + '-01'; }

function addMonths(monthKey, delta) {
  const [y, m] = normalizeMonth(monthKey).split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

function monthLong(monthKey) {
  const [y, m] = normalizeMonth(monthKey).split('-').map(Number);
  return `${MONTHS_LONG[m - 1]} ${y}`;
}

function monthShort(monthKey) {
  const [y, m] = normalizeMonth(monthKey).split('-').map(Number);
  return `${MONTHS_SHORT[m - 1]} ${String(y).slice(2)}`;
}

function currentYear() { return Number(todayISO().slice(0, 4)); }

function normalizeYear(value) {
  const y = round0(value);
  return y >= 2000 && y <= 2100 ? String(y) : String(currentYear());
}

function monthsList(year = ui.year) {
  const y = normalizeYear(year);
  const list = [];
  for (let i = 1; i <= 12; i++) list.push(`${y}-${pad2(i)}`);
  return list;
}

function monthInPeriod(monthKey) {
  return monthsList().includes(normalizeMonth(monthKey));
}

function defaultViewYear() {
  const saved = state && state.meta ? Number(state.meta.viewYear) : 0;
  if (saved >= 2000 && saved <= 2100) return String(saved);
  return String(currentYear());
}

function availableYears() {
  const years = new Set([String(currentYear()), normalizeYear(ui.year)]);
  Object.keys(state.monthly).forEach(empId => {
    Object.keys(state.monthly[empId] || {}).forEach(m => years.add(normalizeMonth(m).slice(0, 4)));
  });
  state.insured.forEach(row => years.add(normalizeMonth(row.month).slice(0, 4)));
  state.journal.forEach(row => { if (row.date) years.add(row.date.slice(0, 4)); });
  state.schedules.forEach(row => { if (row.dueDate) years.add(row.dueDate.slice(0, 4)); });
  const max = Math.max(...Array.from(years).map(Number));
  years.add(String(max + 1));
  return Array.from(years).map(Number).sort((a, b) => a - b).map(String);
}

function setYear(value, options = {}) {
  const year = normalizeYear(value);
  ui.year = year;
  state.meta = state.meta || {};
  state.meta.viewYear = Number(year);
  saveState();
  resetMonthSelections();
  renderCurrentView();
  if (options.toast) toast(options.toast);
}

/* ---------- Initialisation de l'état ---------- */
function defaultSettings() {
  return {
    alertDays: 30,
    valeurIndiciaire: 1272.7,
    rateEmployee: 0.07,
    rateEmployer: 0.20,
    todayOverride: ''
  };
}

function seedState() {
  const now = new Date().toISOString();
  return {
    version: APP_VERSION,
    dataVersion: DATA_VERSION,
    settings: defaultSettings(),
    employers: SEED_EMPLOYERS.map(e => ({
      id: e.id,
      registration: String(e.registration || ''),
      name: String(e.name || ''),
      sigle: String(e.sigle || ''),
      contact: String(e.contact || ''),
      effectif: num(e.effectif),
      status: STATUSES.includes(e.status) ? e.status : 'À relancer'
    })),
    monthly: {},
    insured: [],
    journal: [],
    schedules: [],
    meta: {
      createdAt: now,
      updatedAt: now,
      viewYear: currentYear(),
      seededFrom: 'suivi_cotisations_impayees opti.xlsx'
    }
  };
}

function validateImport(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Format invalide : le fichier ne contient pas un objet JSON.');
  }
  if (!Array.isArray(data.employers)) {
    throw new Error('Champ « employers » manquant ou invalide.');
  }
  if (!data.monthly || typeof data.monthly !== 'object' || Array.isArray(data.monthly)) {
    throw new Error('Champ « monthly » manquant ou invalide.');
  }
  if (!data.settings || typeof data.settings !== 'object' || Array.isArray(data.settings)) {
    throw new Error('Champ « settings » manquant ou invalide.');
  }
  if (data.employers.length > 5000) throw new Error('Trop d’employeurs dans le fichier.');
  return true;
}

function migrateState(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
  const version = Number(data.dataVersion) || (Number(data.version) >= 2 ? 2 : 1);
  if (version < 2) {
    if (!data.meta || typeof data.meta !== 'object') data.meta = {};
    if (!data.meta.viewYear) data.meta.viewYear = currentYear();
  }
  if (version < 3) {
    if (!Array.isArray(data.insured)) data.insured = [];
    if (!Array.isArray(data.journal)) data.journal = [];
    if (!Array.isArray(data.schedules)) data.schedules = [];
    if (!data.settings || typeof data.settings !== 'object' || Array.isArray(data.settings)) data.settings = {};
  }
  data.dataVersion = DATA_VERSION;
  return data;
}

function normalizeImportedState(raw) {
  const data = migrateState(raw);
  validateImport(data);

  const rawSettings = data.settings && typeof data.settings === 'object' && !Array.isArray(data.settings)
    ? data.settings
    : {};
  const settings = Object.assign(defaultSettings(), rawSettings);
  delete settings.firstMonth;
  settings.alertDays = Math.max(0, round0(settings.alertDays));
  settings.valeurIndiciaire = Math.max(0, num(settings.valeurIndiciaire));
  settings.rateEmployee = Math.max(0, Math.min(1, num(settings.rateEmployee)));
  settings.rateEmployer = Math.max(0, Math.min(1, num(settings.rateEmployer)));
  settings.todayOverride = /^\d{4}-\d{2}-\d{2}$/.test(String(settings.todayOverride || '')) ? String(settings.todayOverride) : '';

  const employers = data.employers.map((item, i) => {
    const e = item && typeof item === 'object' ? item : {};
    return {
      id: String(e.id || `emp-${pad2(i + 1)}`),
      registration: String(e.registration || '').trim(),
      name: String(e.name || '').trim(),
      sigle: String(e.sigle || '').trim(),
      contact: String(e.contact || '').trim(),
      effectif: Math.max(0, round0(e.effectif)),
      status: STATUSES.includes(e.status) ? e.status : 'À relancer'
    };
  }).filter(e => e.registration || e.name);
  if (!employers.length) throw new Error('Aucun employeur valide dans le fichier.');

  const employerIds = new Set(employers.map(e => e.id));
  const monthly = {};
  if (data.monthly && typeof data.monthly === 'object' && !Array.isArray(data.monthly)) {
    Object.keys(data.monthly).forEach(empId => {
      if (!employerIds.has(empId)) return;
      const months = data.monthly[empId];
      if (!months || typeof months !== 'object') return;
      monthly[empId] = {};
      Object.keys(months).forEach(m => {
        const key = normalizeMonth(m);
        const entry = months[m] && typeof months[m] === 'object' ? months[m] : {};
        const normalized = {
          dueGlobal: Math.max(0, num(entry.dueGlobal)),
          collected: Math.max(0, num(entry.collected))
        };
        if (entry.effectif !== undefined && entry.effectif !== null && entry.effectif !== '') {
          normalized.effectif = Math.max(0, round0(entry.effectif));
        }
        monthly[empId][key] = normalized;
      });
    });
  }

  const insured = (Array.isArray(data.insured) ? data.insured : []).map((item, i) => {
    const r = item && typeof item === 'object' ? item : {};
    return {
      id: String(r.id || `ass-${Date.now().toString(36)}-${i}`),
      employerId: String(r.employerId || ''),
      month: normalizeMonth(r.month),
      matricule: String(r.matricule || '').trim(),
      name: String(r.name || '').trim(),
      indice: Math.max(0, num(r.indice))
    };
  }).filter(r => employerIds.has(r.employerId) && r.name);

  const journal = (Array.isArray(data.journal) ? data.journal : []).map((item, i) => {
    const r = item && typeof item === 'object' ? item : {};
    return {
      id: String(r.id || `act-${Date.now().toString(36)}-${i}`),
      employerId: String(r.employerId || ''),
      date: /^\d{4}-\d{2}-\d{2}$/.test(String(r.date || '')) ? String(r.date) : '',
      type: String(r.type || 'Appel'),
      contact: String(r.contact || '').trim(),
      result: String(r.result || '').trim(),
      nextAction: String(r.nextAction || '').trim(),
      nextDate: /^\d{4}-\d{2}-\d{2}$/.test(String(r.nextDate || '')) ? String(r.nextDate) : '',
      agent: String(r.agent || '').trim()
    };
  }).filter(r => employerIds.has(r.employerId) && r.date);

  const schedules = (Array.isArray(data.schedules) ? data.schedules : []).map((item, i) => {
    const r = item && typeof item === 'object' ? item : {};
    return {
      id: String(r.id || `ech-${Date.now().toString(36)}-${i}`),
      employerId: String(r.employerId || ''),
      number: String(r.number || '').trim(),
      dueDate: /^\d{4}-\d{2}-\d{2}$/.test(String(r.dueDate || '')) ? String(r.dueDate) : '',
      amount: Math.max(0, num(r.amount)),
      paidDate: /^\d{4}-\d{2}-\d{2}$/.test(String(r.paidDate || '')) ? String(r.paidDate) : '',
      paidAmount: Math.max(0, num(r.paidAmount))
    };
  }).filter(r => employerIds.has(r.employerId) && r.dueDate);

  const now = new Date().toISOString();
  return {
    version: APP_VERSION,
    dataVersion: DATA_VERSION,
    settings,
    employers,
    monthly,
    insured,
    journal,
    schedules,
    meta: {
      createdAt: data.meta && data.meta.createdAt ? data.meta.createdAt : now,
      updatedAt: now,
      viewYear: data.meta && Number(data.meta.viewYear) >= 2000 && Number(data.meta.viewYear) <= 2100
        ? Number(data.meta.viewYear)
        : currentYear(),
      seededFrom: data.meta && data.meta.seededFrom ? data.meta.seededFrom : ''
    }
  };
}

function loadState() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    storageAvailable = false;
  }
  if (!raw) return seedState();
  try {
    return normalizeImportedState(JSON.parse(raw));
  } catch (e) {
    console.warn('Sauvegarde locale illisible, réinitialisation.', e);
    return seedState();
  }
}

let pendingSaveTimer = null;

function isQuotaError(error) {
  return !!error && (
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    error.code === 22 ||
    error.code === 1014
  );
}

function saveState(options = {}) {
  if (!state) return;
  if (pendingSaveTimer) {
    clearTimeout(pendingSaveTimer);
    pendingSaveTimer = null;
  }
  invalidateStatsCache();
  const now = new Date();
  state.meta = state.meta || {};
  state.meta.updatedAt = now.toISOString();
  const json = JSON.stringify(state);
  storageBytes = (json.length + STORAGE_KEY.length) * 2;
  try {
    localStorage.setItem(STORAGE_KEY, json);
    storageAvailable = true;
    storageFull = false;
    lastSavedAt = now;
  } catch (e) {
    if (isQuotaError(e)) storageFull = true;
    else storageAvailable = false;
    console.warn('Impossible d’enregistrer localement.', e);
  }
  updateStorageStatus();
  updateStorageAlert();
  if (options.toast) toast(options.toast);
}

function saveStateSoon(delay = 300) {
  if (!state) return;
  invalidateStatsCache();
  if (pendingSaveTimer) clearTimeout(pendingSaveTimer);
  pendingSaveTimer = setTimeout(() => {
    pendingSaveTimer = null;
    saveState();
  }, delay);
}

function flushPendingSave() {
  if (!pendingSaveTimer) return;
  clearTimeout(pendingSaveTimer);
  pendingSaveTimer = null;
  saveState();
}

function updateStorageStatus() {
  const dot = $('#storage-dot');
  const label = $('#storage-label');
  const time = $('#storage-time');
  if (!dot || !label || !time) return;
  const ratio = storageBytes / STORAGE_LIMIT_BYTES;
  dot.classList.toggle('off', !storageAvailable || storageFull);
  dot.classList.toggle('warn', storageAvailable && !storageFull && ratio >= STORAGE_WARN_RATIO);
  if (storageFull) {
    label.textContent = 'Stockage plein';
    time.textContent = 'Exportez vos données';
    return;
  }
  if (!storageAvailable) {
    label.textContent = 'Stockage indisponible';
    time.textContent = 'Exportez vos données';
    return;
  }
  if (ratio >= STORAGE_WARN_RATIO) {
    label.textContent = 'Stockage presque plein';
    time.textContent = Math.round(ratio * 100) + ' % utilisés';
    return;
  }
  label.textContent = 'Sauvegarde locale active';
  if (lastSavedAt) {
    time.textContent = 'Enregistré à ' + lastSavedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } else {
    const updated = state && state.meta && state.meta.updatedAt ? new Date(state.meta.updatedAt) : null;
    time.textContent = updated ? 'Enregistré à ' + updated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '—';
  }
}

function updateStorageAlert() {
  const box = $('#storage-alert');
  if (!box) return;
  const title = $('#storage-alert-title');
  const message = $('#storage-alert-message');
  const ratio = storageBytes / STORAGE_LIMIT_BYTES;
  if (storageFull) {
    box.hidden = false;
    box.classList.add('danger');
    title.textContent = 'Stockage plein — enregistrement impossible';
    message.textContent = 'Les dernières modifications ne sont pas enregistrées. Exportez une sauvegarde JSON immédiatement.';
    return;
  }
  if (ratio >= STORAGE_WARN_RATIO) {
    box.hidden = false;
    box.classList.remove('danger');
    title.textContent = 'Stockage local presque plein';
    message.textContent = Math.round(ratio * 100) + ' % utilisés. Exportez une sauvegarde et supprimez les anciennes données inutiles.';
    return;
  }
  box.hidden = true;
  box.classList.remove('danger');
}

function formatBytes(bytes) {
  const value = num(bytes);
  if (value >= 1024 * 1024) return (value / (1024 * 1024)).toFixed(1).replace('.', ',') + ' Mo';
  return Math.max(0, Math.round(value / 1024)) + ' Ko';
}

function backupTimeId(date = new Date()) {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}-${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}-${String(date.getMilliseconds()).padStart(3, '0')}`;
}

function listLocalBackups() {
  const items = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(BACKUP_PREFIX)) continue;
      const raw = localStorage.getItem(key);
      let payload = null;
      try { payload = JSON.parse(raw || ''); } catch (e) { payload = null; }
      items.push({
        key,
        bytes: raw ? raw.length * 2 : 0,
        createdAt: payload && payload.createdAt ? String(payload.createdAt) : '',
        reason: payload && payload.reason ? String(payload.reason) : '',
        employerCount: payload && Number.isFinite(payload.employerCount) ? payload.employerCount : null
      });
    }
  } catch (e) {
    return [];
  }
  return items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function removeLocalBackup(key) {
  if (!key || !String(key).startsWith(BACKUP_PREFIX)) return;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Suppression de sauvegarde impossible.', e);
  }
}

function createLocalBackup(reason = 'import') {
  if (!state || !Array.isArray(state.employers)) return null;
  const createdAt = new Date().toISOString();
  const payload = {
    kind: 'suivi-cotisations-backup',
    createdAt,
    reason,
    employerCount: state.employers.length,
    data: JSON.parse(JSON.stringify(state))
  };
  const json = JSON.stringify(payload);
  const bytes = (json.length + BACKUP_PREFIX.length + 16) * 2;
  if (bytes > BACKUP_MAX_BYTES) return null;
  const key = BACKUP_PREFIX + backupTimeId(new Date());

  const dropOldest = () => {
    const list = listLocalBackups();
    if (!list.length) return false;
    removeLocalBackup(list[list.length - 1].key);
    return true;
  };

  while (listLocalBackups().length >= BACKUP_KEEP) {
    if (!dropOldest()) break;
  }
  let total = listLocalBackups().reduce((sum, item) => sum + item.bytes, 0);
  while (total + bytes > BACKUP_MAX_BYTES && dropOldest()) {
    total = listLocalBackups().reduce((sum, item) => sum + item.bytes, 0);
  }

  try {
    localStorage.setItem(key, json);
  } catch (e) {
    if (!isQuotaError(e)) {
      console.warn('Sauvegarde automatique impossible.', e);
      return null;
    }
    listLocalBackups().forEach(item => removeLocalBackup(item.key));
    try {
      localStorage.setItem(key, json);
    } catch (err) {
      console.warn('Sauvegarde automatique impossible : espace insuffisant.', err);
      return null;
    }
  }
  return listLocalBackups().find(item => item.key === key) || null;
}

function readLocalBackup(key) {
  if (!key || !String(key).startsWith(BACKUP_PREFIX)) throw new Error('Sauvegarde inconnue.');
  const raw = localStorage.getItem(key);
  if (!raw) throw new Error('Cette sauvegarde n’existe plus.');
  let payload = null;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    throw new Error('Cette sauvegarde est illisible.');
  }
  return normalizeImportedState(payload && payload.data ? payload.data : payload);
}

function backupDateLabel(item) {
  if (!item || !item.createdAt) return 'Date inconnue';
  const date = new Date(item.createdAt);
  if (isNaN(date.getTime())) return 'Date inconnue';
  return `${fmtDate(item.createdAt.slice(0, 10))} à ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/* ---------- Accès aux données ---------- */
function getEmployer(employerId) {
  return state.employers.find(e => e.id === employerId) || null;
}

function employerDisplay(emp) {
  if (!emp) return 'Employeur supprimé';
  return emp.sigle && emp.sigle !== emp.name ? emp.sigle : emp.name;
}

function monthlyEntry(employerId, monthKey, create = false) {
  const key = normalizeMonth(monthKey);
  if (!state.monthly[employerId]) {
    if (!create) return { dueGlobal: 0, collected: 0 };
    state.monthly[employerId] = {};
  }
  if (!state.monthly[employerId][key]) {
    if (!create) return { dueGlobal: 0, collected: 0 };
    state.monthly[employerId][key] = { dueGlobal: 0, collected: 0 };
  }
  return state.monthly[employerId][key];
}

function monthlyEffectifInfo(employerId, monthKey) {
  const key = normalizeMonth(monthKey);
  const entry = state.monthly[employerId] && state.monthly[employerId][key];
  const emp = getEmployer(employerId);
  const base = emp ? Math.max(0, round0(emp.effectif)) : 0;
  const overridden = !!(entry && entry.effectif !== undefined && entry.effectif !== null && entry.effectif !== '');
  return {
    value: overridden ? Math.max(0, round0(entry.effectif)) : base,
    base,
    overridden,
    inherited: !overridden
  };
}

function computeInsuredRow(row) {
  const indice = num(row.indice);
  const salary = round0(indice * num(state.settings.valeurIndiciaire) / 12);
  const employee = round0(salary * num(state.settings.rateEmployee));
  const employer = round0(salary * num(state.settings.rateEmployer));
  return { salary, employee, employer, total: employee + employer };
}

function buildInsuredIndex() {
  const index = new Map();
  state.insured.forEach(row => {
    const key = row.employerId + '|' + normalizeMonth(row.month);
    const calc = computeInsuredRow(row);
    const current = index.get(key) || { total: 0, count: 0 };
    current.total += calc.total;
    current.count += 1;
    index.set(key, current);
  });
  return index;
}

function monthStats(employerId, monthKey, index) {
  const key = normalizeMonth(monthKey);
  const entry = monthlyEntry(employerId, key, false);
  const detail = index.get(employerId + '|' + key);
  const hasDetail = !!detail && detail.count > 0;
  const dueGlobal = num(entry.dueGlobal);
  const collected = num(entry.collected);
  const detailTotal = detail ? detail.total : 0;
  const dueRetained = hasDetail ? detailTotal : dueGlobal;
  const effectif = monthlyEffectifInfo(employerId, key);
  return {
    month: key,
    dueGlobal,
    collected,
    detailTotal,
    detailCount: detail ? detail.count : 0,
    hasDetail,
    dueRetained,
    balance: dueRetained - collected,
    effectif: effectif.value,
    effectifInherited: effectif.inherited
  };
}

function employerStats(emp, index, months, priorKeys = [], actions = []) {
  const yearStart = months[0];
  let due = 0;
  let collected = 0;
  const byMonth = {};
  months.forEach(m => {
    const s = monthStats(emp.id, m, index);
    byMonth[m] = s;
    due += s.dueRetained;
    collected += s.collected;
  });

  let priorDue = 0;
  let priorCollected = 0;
  let priorBalance = 0;
  let firstUnpaid = null;
  let lastUnpaid = null;
  priorKeys.forEach(m => {
    if (m >= yearStart) return;
    const s = monthStats(emp.id, m, index);
    priorDue += s.dueRetained;
    priorCollected += s.collected;
    priorBalance += s.balance;
    if (s.balance > 0) {
      if (!firstUnpaid) firstUnpaid = m;
      lastUnpaid = m;
    }
  });

  const unpaidAnnual = months.filter(m => byMonth[m].balance > 0);
  const balance = due - collected;
  const totalBalance = priorBalance + balance;
  const settled = totalBalance <= 0;
  const startMonth = settled ? null : (firstUnpaid || (unpaidAnnual.length ? unpaidAnnual[0] : null));
  const endMonth = settled ? null : (unpaidAnnual.length ? unpaidAnnual[unpaidAnnual.length - 1] : lastUnpaid);
  const ageDays = startMonth ? Math.max(0, daysBetween(monthStartISO(startMonth), effectiveToday())) : null;
  const lastAction = actions.length ? actions[0].date : null;
  const effectifAverage = months.length
    ? Math.round(months.reduce((sum, m) => sum + byMonth[m].effectif, 0) / months.length)
    : 0;
  const effectifStart = months.length ? byMonth[months[0]].effectif : 0;
  const effectifEnd = months.length ? byMonth[months[months.length - 1]].effectif : 0;

  return {
    emp,
    months: byMonth,
    due,
    collected,
    balance,
    priorDue,
    priorCollected,
    priorBalance,
    totalBalance,
    startMonth,
    endMonth,
    ageDays,
    lastAction,
    actions,
    effectifAverage,
    effectifStart,
    effectifEnd
  };
}

let statsCache = null;

function invalidateStatsCache() {
  statsCache = null;
}

function buildStats() {
  const cacheKey = normalizeYear(ui.year) + '|' + effectiveToday();
  if (statsCache && statsCache.key === cacheKey) return statsCache.value;

  const index = buildInsuredIndex();
  const months = monthsList();

  const monthKeysByEmployer = new Map();
  Object.keys(state.monthly).forEach(employerId => {
    monthKeysByEmployer.set(employerId, Object.keys(state.monthly[employerId] || {}).map(normalizeMonth));
  });
  state.insured.forEach(row => {
    const keys = monthKeysByEmployer.get(row.employerId) || [];
    const month = normalizeMonth(row.month);
    if (!keys.includes(month)) keys.push(month);
    monthKeysByEmployer.set(row.employerId, keys);
  });
  monthKeysByEmployer.forEach(keys => keys.sort());

  const journalByEmployer = new Map();
  state.journal.forEach(row => {
    if (!row.date) return;
    const list = journalByEmployer.get(row.employerId) || [];
    list.push(row);
    journalByEmployer.set(row.employerId, list);
  });
  journalByEmployer.forEach(list => list.sort((a, b) => b.date.localeCompare(a.date)));

  const stats = state.employers.map(emp => employerStats(
    emp,
    index,
    months,
    monthKeysByEmployer.get(emp.id) || [],
    journalByEmployer.get(emp.id) || []
  ));
  const value = { stats, index, months, year: months[0].slice(0, 4) };
  statsCache = { key: cacheKey, value };
  return value;
}

function scheduleStats(schedule) {
  const today = effectiveToday();
  const amount = num(schedule.amount);
  const paid = num(schedule.paidAmount);
  const remaining = amount - paid;
  let status;
  if (amount > 0 && paid >= amount) status = 'Payée';
  else if (schedule.dueDate && schedule.dueDate < today) status = 'En retard';
  else status = 'À venir';
  const lateDays = status === 'En retard' ? Math.max(0, daysBetween(schedule.dueDate, today)) : 0;
  return { amount, paid, remaining, status, lateDays };
}

function journalAlert(item) {
  if (!item.nextDate) return '';
  const today = effectiveToday();
  const diff = daysBetween(today, item.nextDate);
  const threshold = Math.max(0, num(state.settings.alertDays));
  if (diff < 0) return 'En retard';
  if (diff <= threshold) return 'À faire bientôt';
  return 'À venir';
}

function situationFor(stats) {
  if (stats.dueRetained <= 0) {
    return { key: 'ND', label: 'Non déclaré', chip: '–', badge: 'badge-slate' };
  }
  if (stats.collected >= stats.dueRetained) {
    return { key: 'P', label: 'Déclaré et payé', chip: 'P', badge: 'badge-green' };
  }
  if (stats.collected > 0) {
    return { key: 'PP', label: 'Déclaré, partiellement payé', chip: 'PP', badge: 'badge-amber' };
  }
  return { key: 'NP', label: 'Déclaré, non payé', chip: 'NP', badge: 'badge-red' };
}

function statusBadge(status) {
  const cls = STATUS_BADGE_CLASS[status] || 'badge-slate';
  return `<span class="badge ${cls}"><span class="bdot"></span>${escapeHtml(status)}</span>`;
}

function suggestedStatusFor(stat) {
  if (!stat) return '';
  const activeSchedule = state.schedules.some(x => x.employerId === stat.emp.id && scheduleStats(x).status !== 'Payée');
  if (activeSchedule) return 'Échéancier en cours';
  if (stat.due > 0 || stat.collected > 0) return stat.totalBalance <= 0 ? 'Soldé' : 'À relancer';
  return '';
}

function suggestedStatus(employerId) {
  return suggestedStatusFor(buildStats().stats.find(x => x.emp.id === employerId));
}

const NAME_CONNECTORS = new Set(['de', 'du', 'des', 'la', 'le', 'les', 'et', 'd', 'l']);
const NAME_ACCENTS = {
  assemblee: 'Assemblée', defense: 'Défense', hotel: 'Hôtel', lome: 'Lomé',
  universite: 'Université', unite: 'Unité', fond: 'Fonds', togo: 'Togo', kara: 'Kara',
  education: 'Éducation', securite: 'Sécurité', sante: 'Santé'
};
const NAME_SPECIAL_CASES = {
  'CROIX ROUGE TOGO': 'Croix-Rouge Togo',
  'SOS-VILLAGES ENFANTS': "SOS Villages d'Enfants"
};
const NAME_ACRONYMS_4 = new Set(['gfa', 'salt', 'hisp', 'wca']);

function normalizeEmployerName(value) {
  const raw = String(value || '').trim().replace(/\s+/g, ' ');
  if (!raw || !raw.includes(' ')) return raw;
  if (NAME_SPECIAL_CASES[raw]) return NAME_SPECIAL_CASES[raw];
  return raw.split(' ').map((token, index) => {
    if (!/[A-ZÀ-Ý]/.test(token) || token !== token.toUpperCase()) return token;
    const lower = token.toLocaleLowerCase('fr-FR');
    if (index > 0 && NAME_CONNECTORS.has(lower)) return lower;
    if (NAME_ACCENTS[lower]) return NAME_ACCENTS[lower];
    if (token.length <= 3 || NAME_ACRONYMS_4.has(lower) || /[0-9\/()]/.test(token) || token.includes('-')) return token;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(' ');
}

function situationBadge(situation, compact = false) {
  if (compact) {
    const chipCls = situation.key === 'P' ? 'chip-p' : situation.key === 'PP' ? 'chip-pp' : situation.key === 'NP' ? 'chip-np' : 'chip-none';
    return `<span class="chip ${chipCls}" title="${escapeAttr(situation.label)}">${situation.chip}</span>`;
  }
  return `<span class="badge ${situation.badge}"><span class="bdot"></span>${escapeHtml(situation.label)}</span>`;
}

function alertBadge(alert) {
  if (alert === 'En retard') return '<span class="badge badge-red"><span class="bdot"></span>En retard</span>';
  if (alert === 'À faire bientôt') return '<span class="badge badge-amber"><span class="bdot"></span>À faire bientôt</span>';
  if (alert === 'À venir') return '<span class="badge badge-blue"><span class="bdot"></span>À venir</span>';
  return '<span class="muted">—</span>';
}

function scheduleBadge(status) {
  if (status === 'Payée') return '<span class="badge badge-green"><span class="bdot"></span>Payée</span>';
  if (status === 'En retard') return '<span class="badge badge-red"><span class="bdot"></span>En retard</span>';
  return '<span class="badge badge-blue"><span class="bdot"></span>À venir</span>';
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/* ---------- Modales, toasts, confirmations ---------- */
function openModal({ title, subtitle = '', body = '', footer = '', size = '', noPad = false, onMount = null, onClose = null }) {
  const root = $('#modal-root');
  const closeBtn = `<button class="icon-btn" type="button" data-close-modal aria-label="Fermer">${ico('close')}</button>`;
  root.innerHTML = `
    <div class="modal ${size}" role="dialog" aria-modal="true" aria-label="${escapeAttr(title)}">
      <div class="modal-head">
        <div>
          <h2>${escapeHtml(title)}</h2>
          ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}
        </div>
        ${closeBtn}
      </div>
      <div class="modal-body${noPad ? ' no-pad' : ''}">${body}</div>
      ${footer ? `<div class="modal-foot">${footer}</div>` : ''}
    </div>`;
  root.hidden = false;
  document.body.style.overflow = 'hidden';
  const modal = root.querySelector('.modal');

  const close = () => {
    root.hidden = true;
    root.innerHTML = '';
    document.body.style.overflow = '';
    if (typeof onClose === 'function') onClose();
  };
  root._closeModal = close;

  $$('[data-close-modal]', root).forEach(btn => btn.addEventListener('click', close));
  root.onmousedown = e => { if (e.target === root) close(); };

  const firstField = modal.querySelector('input:not([type=hidden]), select, textarea, button.btn-primary');
  if (firstField) setTimeout(() => firstField.focus(), 30);
  if (typeof onMount === 'function') onMount(modal, close);
  return { modal, close };
}

function closeModal() {
  const root = $('#modal-root');
  if (root && typeof root._closeModal === 'function') root._closeModal();
  else if (root) {
    root.hidden = true;
    root.innerHTML = '';
    document.body.style.overflow = '';
  }
}

function confirmAction({ title = 'Confirmer', message = '', confirmLabel = 'Confirmer', danger = false, onConfirm }) {
  openModal({
    title,
    body: `<div class="notice ${danger ? 'danger' : ''}">${ico('alert')}<div>${message}</div></div>`,
    footer: `
      <button class="btn" type="button" data-close-modal>Annuler</button>
      <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" type="button" id="confirm-action">${escapeHtml(confirmLabel)}</button>`,
    onMount(modal, close) {
      modal.querySelector('#confirm-action').addEventListener('click', () => {
        close();
        if (typeof onConfirm === 'function') onConfirm();
      });
    }
  });
}

function toast(message, type = 'success') {
  const root = $('#toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  el.innerHTML = `${ico(type === 'error' ? 'alert' : 'check')}<span>${escapeHtml(message)}</span>`;
  root.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .2s, transform .2s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    setTimeout(() => el.remove(), 220);
  }, 3200);
}

/* ---------- Export / import ---------- */
function downloadFile(filename, content, mime) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function exportJSON() {
  const payload = JSON.parse(JSON.stringify(state));
  downloadFile(`sauvegarde-cotisations-${todayISO()}.json`, JSON.stringify(payload, null, 2), 'application/json');
  toast('Sauvegarde JSON téléchargée.');
}

function csvValue(value) {
  return '"' + String(value == null ? '' : value).replace(/"/g, '""') + '"';
}

function downloadCSV(filename, headers, rows) {
  const lines = [];
  lines.push(headers.map(csvValue).join(';'));
  rows.forEach(row => lines.push(row.map(csvValue).join(';')));
  const content = '\ufeff' + lines.join('\r\n');
  downloadFile(filename, content, 'text/csv;charset=utf-8');
  toast('Export CSV téléchargé.');
}

function importJSONFile(file, onDone) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const raw = JSON.parse(String(reader.result || ''));
      const imported = normalizeImportedState(raw);
      confirmAction({
        title: 'Remplacer les données actuelles ?',
        message: `Le fichier contient <strong>${imported.employers.length} employeurs</strong>, ${imported.insured.length} lignes d’assurés, ${imported.journal.length} actions et ${imported.schedules.length} échéances. Les données actuelles de ce navigateur seront remplacées. Une sauvegarde automatique est créée avant l’import.`,
        confirmLabel: 'Importer et remplacer',
        danger: true,
        onConfirm() {
          const previous = JSON.parse(JSON.stringify(state));
          const backup = createLocalBackup('import');
          state = imported;
          ui.year = defaultViewYear();
          saveState();
          resetMonthSelections();
          renderCurrentView();
          if (backup) {
            toast('Données importées. Sauvegarde précédente conservée.');
          } else {
            downloadFile(`sauvegarde-avant-import-${todayISO()}.json`, JSON.stringify(previous, null, 2), 'application/json');
            toast('Données importées. Sauvegarde précédente téléchargée.');
          }
          if (typeof onDone === 'function') onDone();
        }
      });
    } catch (e) {
      toast('Import impossible : ' + e.message, 'error');
    }
  };
  reader.onerror = () => toast('Lecture du fichier impossible.', 'error');
  reader.readAsText(file, 'utf-8');
}

/* ---------- Divers ---------- */
function resetMonthSelections() {
  const months = monthsList();
  const current = currentMonthKey();
  if (!months.includes(ui.monthlyMonth)) {
    ui.monthlyMonth = months.includes(current) ? current : months[0];
  }
  if (!months.includes(ui.situationMonth)) {
    ui.situationMonth = months.includes(current) ? current : months[0];
  }
  if (ui.insuredMonth && !months.includes(ui.insuredMonth)) ui.insuredMonth = '';
}

function pageMeta(route) {
  const map = {
    dashboard: ['Tableau de bord', 'Vue d’ensemble du recouvrement des cotisations'],
    employers: ['Employeurs', 'Registre des employeurs débiteurs et de leur situation'],
    monthly: ['Suivi mensuel', 'Dû, encaissements et effectif par employeur, année civile'],
    situation: ['Situation mensuelle', 'Déclarations et paiements mois par mois'],
    insured: ['Détail assurés', 'Traçabilité des cotisations par assuré (facultatif)'],
    journal: ['Journal des actions', 'Appels, courriers, visites et engagements'],
    schedules: ['Échéanciers', 'Suivi des échéanciers de paiement négociés'],
    settings: ['Paramètres', 'Règles de calcul, sauvegarde et mode d’emploi']
  };
  return map[route] || map.dashboard;
}
