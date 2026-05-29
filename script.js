// ========== Game Data ==========
const BUSINESSES = [
  {
    id: 'lemonade',
    name: 'Лимонный ларек',
    icon: '🍋',
    price: 80,
    baseIncome: 8,
    desc: 'Простой уличный ларек с лимонадом. Быстрая окупаемость.',
    upgrades: [
      { name: 'Уголок у метро', cost: 60, income: 5, currency: 'gold' },
      { name: 'Начать рецепт', cost: 65, income: 10, currency: 'purple' },
      { name: 'Фирменный рецепт', cost: 900000, income: 50, currency: 'gold' },
    ]
  },
  {
    id: 'coffee',
    name: 'Кофейня',
    icon: '☕',
    price: 1200,
    baseIncome: 35,
    desc: 'Уютное место для кофе и работы. Стабильный поток клиентов.',
    upgrades: [
      { name: 'Второй бариста', cost: 500, income: 20, currency: 'gold' },
      { name: 'Выпечка', cost: 800, income: 30, currency: 'gold' },
      { name: 'Терраса', cost: 1500, income: 45, currency: 'gold' },
    ]
  },
  {
    id: 'startup',
    name: 'Стартап',
    icon: '💻',
    price: 6000,
    baseIncome: 180,
    desc: 'IT-компания на взлёте. Высокий потенциал роста.',
    upgrades: [
      { name: 'Новый офис', cost: 3000, income: 100, currency: 'gold' },
      { name: 'Маркетинг', cost: 5000, income: 150, currency: 'gold' },
      { name: 'Масштабирование', cost: 12000, income: 300, currency: 'gold' },
    ]
  },
  {
    id: 'cybersport',
    name: 'Киберспорт Арена',
    icon: '🎮',
    price: 35000,
    baseIncome: 1200,
    desc: 'Арена для киберспорта. Турниры и стримы.',
    upgrades: [
      { name: 'Оборудование', cost: 15000, income: 500, currency: 'gold' },
      { name: 'Спонсоры', cost: 25000, income: 800, currency: 'gold' },
    ]
  },
  {
    id: 'erp',
    name: 'Сеть ERP',
    icon: '🏢',
    price: 900000,
    baseIncome: 15000,
    desc: 'Корпоративная система. Пик масштаба.',
    upgrades: [
      { name: 'Глобальная экспансия', cost: 500000, income: 5000, currency: 'gold' },
    ]
  }
];

// ========== Game State ==========
let state = {
  balance: 100,
  incomePerSec: 0,
  owned: {},
  lastTick: Date.now(),
};

// ========== Format numbers ==========
function formatNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
  return Math.floor(n).toString();
}

// ========== Balance display ==========
let balanceEl = null;

function setBalance(val) {
  if (!balanceEl) balanceEl = document.getElementById('balance-display');
  balanceEl.textContent = formatNum(val);
}

// ========== Recompute income ==========
function recalcIncome() {
  let total = 0;
  for (const [id, data] of Object.entries(state.owned)) {
    const biz = BUSINESSES.find(b => b.id === id);
    if (!biz) continue;
    let inc = biz.baseIncome;
    for (const u of data.upgrades || []) {
      inc += biz.upgrades[u].income;
    }
    total += inc;
  }
  state.incomePerSec = total;
}

// ========== Passive income tick ==========
function tick() {
  const now = Date.now();
  const dt = (now - state.lastTick) / 1000;
  state.lastTick = now;
  state.balance += state.incomePerSec * dt;
  setBalance(state.balance);
  document.getElementById('income-per-sec').textContent = '+' + formatNum(state.incomePerSec);
}

// ========== Navigation ==========
function showScreen(id, data = {}) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById('screen-' + id);
  if (screen) screen.classList.add('active');

  if (id === 'info' && data.business) {
    renderBusinessInfo(data.business);
  } else if (id === 'upgrades' && data.business) {
    renderUpgrades(data.business);
  } else if (id === 'businesses') {
    renderOwnedBusinesses();
  } else if (id === 'shop') {
    renderShop();
  }
}

// ========== Render screens ==========
function renderOwnedBusinesses() {
  const list = document.getElementById('owned-businesses');
  const empty = document.getElementById('empty-state');
  const keys = Object.keys(state.owned);

  empty.style.display = keys.length === 0 ? 'block' : 'none';

  list.querySelectorAll('.business-card').forEach(el => el.remove());

  keys.forEach(id => {
    const biz = BUSINESSES.find(b => b.id === id);
    const data = state.owned[id];
    if (!biz || !data) return;

    let inc = biz.baseIncome;
    (data.upgrades || []).forEach(ui => {
      inc += biz.upgrades[ui].income;
    });

    const lvl = 1 + (data.upgrades?.length || 0);
    const maxLvl = biz.upgrades.length + 1;
    const pct = (lvl / maxLvl) * 100;

    const card = document.createElement('div');
    card.className = 'card card-owned business-card';
    card.innerHTML = `
      <div class="card-icon">${biz.icon}</div>
      <div class="card-body">
        <p class="card-name">${biz.name}</p>
        <div class="card-meta">
          <span>LVL ${lvl}</span>
          <span class="card-income">+${formatNum(inc)}/сек</span>
        </div>
        <div class="level-bar"><div class="level-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <button class="btn-upgrade" data-upgrade-id="${id}">Улучшить</button>
    `;
    card.onclick = (e) => {
      if (!e.target.closest('.btn-upgrade')) {
        showScreen('upgrades', { business: biz });
      }
    };
    card.querySelector('.btn-upgrade').onclick = (e) => {
      e.stopPropagation();
      showScreen('upgrades', { business: biz });
    };
    list.appendChild(card);
  });
}

function renderShop() {
  const list = document.getElementById('shop-list');
  list.innerHTML = '';
  const ownedIds = Object.keys(state.owned);

  BUSINESSES.forEach(biz => {
    const owned = ownedIds.includes(biz.id);
    const affordable = !owned && state.balance >= biz.price;
    const locked = biz.price > 50000 && !affordable;

    const card = document.createElement('div');
    card.className = `shop-card ${affordable ? 'affordable' : ''} ${locked ? 'locked' : ''}`;
    card.innerHTML = `
      <div class="shop-card-left">
        <div class="shop-card-icon">${biz.icon}</div>
        <div>
          <div class="shop-card-name">${biz.name}</div>
          <div style="font-size:12px;color:var(--text-secondary)">+${formatNum(biz.baseIncome)}/сек</div>
        </div>
      </div>
      <div class="shop-card-price ${locked ? 'locked' : ''}">${owned ? '✓' : formatNum(biz.price)}</div>
    `;
    if (!owned) {
      card.onclick = () => showScreen('info', { business: biz });
    }
    list.appendChild(card);
  });
}

function renderBusinessInfo(biz) {
  document.getElementById('info-title').textContent = biz.name;
  document.getElementById('info-icon').textContent = biz.icon;
  document.getElementById('info-desc').textContent = biz.desc;
  document.getElementById('info-cost').textContent = formatNum(biz.price);
  document.getElementById('info-income').textContent = '+' + formatNum(biz.baseIncome) + '/сек';

  const btn = document.getElementById('btn-buy-info');
  const canBuy = state.balance >= biz.price;
  btn.disabled = !canBuy;
  btn.classList.toggle('disabled', !canBuy);
  btn.onclick = () => {
    if (!canBuy) return;
    state.balance -= biz.price;
    state.owned[biz.id] = { upgrades: [] };
    recalcIncome();
    showScreen('home');
  };
}

function renderUpgrades(biz) {
  document.getElementById('upgrades-title').textContent = biz.name;
  const list = document.getElementById('upgrades-list');
  list.innerHTML = '';
  const data = state.owned[biz.id] || { upgrades: [] };
  const bought = data.upgrades || [];

  biz.upgrades.forEach((upg, idx) => {
    const isBought = bought.includes(idx);
    const cost = upg.cost;
    const currencyIcon = upg.currency === 'purple' ? '💎' : '💰';
    const affordable = !isBought && state.balance >= cost;
    const locked = !isBought && !affordable;

    const card = document.createElement('div');
    card.className = `upgrade-card ${isBought ? 'bought' : affordable ? 'affordable' : locked ? 'locked' : ''}`;
    card.innerHTML = `
      <div class="upgrade-card-left">
        <div class="upgrade-card-icon">📈</div>
        <div>
          <div class="upgrade-card-name">${upg.name}</div>
          <div class="upgrade-card-income">+${formatNum(upg.income)}/сек</div>
        </div>
      </div>
      <div class="upgrade-card-price ${locked ? 'locked' : ''}">${isBought ? '✓' : currencyIcon + ' ' + formatNum(cost)}</div>
    `;
    if (!isBought && affordable) {
      card.onclick = () => {
        if (state.balance < cost) return;
        state.balance -= cost;
        if (!state.owned[biz.id]) state.owned[biz.id] = { upgrades: [] };
        state.owned[biz.id].upgrades.push(idx);
        recalcIncome();
        renderUpgrades(biz);
      };
    }
    list.appendChild(card);
  });
}

// ========== Event Listeners ==========
document.addEventListener('DOMContentLoaded', () => {
  balanceEl = document.getElementById('balance-display');
  setBalance(state.balance);
  recalcIncome();
  document.getElementById('income-per-sec').textContent = '+' + state.incomePerSec + '/сек';

  // Main buttons
  document.querySelector('[data-action="work"]').onclick = () => showScreen('businesses');
  document.querySelector('[data-action="shop"]').onclick = () => showScreen('shop');

  // Empty state
  document.querySelector('#empty-state .btn-accent').onclick = () => showScreen('shop');

  // Back buttons
  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.onclick = () => showScreen(btn.dataset.back);
  });

  // Tick loop
  setInterval(tick, 100);
});
