// ========== Game Data ==========
const BUSINESSES = [
  {
    id: 'lemonade',
    name: 'Лимонный ларек',
    icon: '🍋',
    image: 'assets/businesses/lemonade.png',
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
    image: 'assets/businesses/coffee.png',
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
    image: 'assets/businesses/startup.png',
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
    image: 'assets/businesses/cybersport.png',
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
    image: 'assets/businesses/erp.png',
    price: 900000,
    baseIncome: 15000,
    desc: 'Корпоративная система. Пик масштаба.',
    upgrades: [
      { name: 'Глобальная экспансия', cost: 500000, income: 5000, currency: 'gold' },
    ]
  }
];

const WORK_TASKS = [
  { id: 'flyers', name: 'Раздать листовки', reward: 500, xp: 10, icon: 'assets/icons/work.png' },
  { id: 'survey', name: 'Провести опрос', reward: 750, xp: 15, icon: 'assets/icons/check.png' },
  { id: 'event', name: 'Помочь на мероприятии', reward: 1000, xp: 20, icon: 'assets/icons/trophy.png' },
  { id: 'delivery', name: 'Доставка продуктов', reward: 1250, xp: 25, icon: 'assets/icons/basket.png' },
];

const STORE_ITEMS = [
  {
    id: 'income-boost',
    name: 'x2 дохода на 1 час',
    desc: 'Ускорение',
    price: 50,
    icon: 'assets/icons/income.png',
    repeatable: true,
    buy() {
      const now = Date.now();
      state.boostUntil = Math.max(now, state.boostUntil || 0) + 60 * 60 * 1000;
      recalcIncome();
    }
  },
  {
    id: 'day-boost',
    name: 'x2 дохода на 24 часа',
    desc: 'Ускорение',
    price: 200,
    icon: 'assets/icons/upgrade.png',
    repeatable: true,
    buy() {
      const now = Date.now();
      state.boostUntil = Math.max(now, state.boostUntil || 0) + 24 * 60 * 60 * 1000;
      recalcIncome();
    }
  },
  {
    id: 'bonus-small',
    name: '+5 000 $',
    desc: 'Бонусы',
    price: 100,
    icon: 'assets/icons/money.png',
    repeatable: true,
    buy() {
      addMoney(5000);
    }
  },
  {
    id: 'bonus-big',
    name: '+25 000 $',
    desc: 'Бонусы',
    price: 400,
    icon: 'assets/icons/money.png',
    repeatable: true,
    buy() {
      addMoney(25000);
    }
  },
  {
    id: 'no-ads',
    name: 'Убрать рекламу',
    desc: 'Премиум',
    price: 300,
    icon: 'assets/icons/settings.png',
    repeatable: false,
    buy() {
      state.adFree = true;
    }
  },
];

const ACHIEVEMENTS = [
  {
    id: 'first-business',
    name: 'Первый шаг',
    desc: 'Купить первый бизнес',
    target: 1,
    getProgress: () => Object.keys(state.owned).length,
  },
  {
    id: 'entrepreneur',
    name: 'Предприниматель',
    desc: 'Купить 3 бизнеса',
    target: 3,
    getProgress: () => Object.keys(state.owned).length,
  },
  {
    id: 'magnate',
    name: 'Магнат',
    desc: 'Купить 5 бизнесов',
    target: 5,
    getProgress: () => Object.keys(state.owned).length,
  },
  {
    id: 'worker',
    name: 'Трудоголик',
    desc: 'Выполнить 10 работ',
    target: 10,
    getProgress: () => state.workDone,
  },
  {
    id: 'millionaire',
    name: 'Миллионер',
    desc: 'Заработать 1 000 000 $',
    target: 1000000,
    getProgress: () => state.totalEarned,
  },
];

// ========== Game State ==========
let state = {
  balance: 100,
  incomePerSec: 0,
  owned: {},
  xp: 0,
  workDone: 0,
  totalEarned: 100,
  storePurchases: {},
  boostUntil: 0,
  adFree: false,
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

function addMoney(amount) {
  state.balance += amount;
  state.totalEarned += amount;
  setBalance(state.balance);
}

function getIncomeMultiplier() {
  return state.boostUntil > Date.now() ? 2 : 1;
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
  state.incomePerSec = total * getIncomeMultiplier();
}

// ========== Passive income tick ==========
function tick() {
  const now = Date.now();
  const dt = (now - state.lastTick) / 1000;
  state.lastTick = now;
  recalcIncome();
  const earned = state.incomePerSec * dt;
  state.balance += earned;
  state.totalEarned += earned;
  setBalance(state.balance);
  document.getElementById('income-per-sec').textContent = '+' + formatNum(state.incomePerSec) + '/сек';
}

// ========== Navigation ==========
function setActiveNav(id) {
  document.querySelectorAll('.bottom-nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.screen === id);
  });
}

function showScreen(id, data = {}) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById('screen-' + id);
  if (screen) screen.classList.add('active');
  setActiveNav(id);

  if (id === 'info' && data.business) {
    renderBusinessInfo(data.business);
  } else if (id === 'upgrades' && data.business) {
    renderUpgrades(data.business);
  } else if (id === 'businesses') {
    renderOwnedBusinesses();
  } else if (id === 'shop') {
    renderShop();
  } else if (id === 'work') {
    renderWork();
  } else if (id === 'achievements') {
    renderAchievements();
  } else if (id === 'store') {
    renderStore();
  }
}

// ========== Render screens ==========
function renderOwnedBusinesses() {
  const list = document.getElementById('owned-businesses');
  const empty = document.getElementById('empty-state');
  const keys = Object.keys(state.owned);

  empty.style.display = keys.length === 0 ? 'flex' : 'none';
  list.classList.toggle('has-items', keys.length > 0);

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
      <img class="card-icon" src="${biz.image}" alt="">
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
        <img class="shop-card-icon" src="${biz.image}" alt="">
        <div>
          <div class="shop-card-name">${biz.name}</div>
          <div class="shop-card-income">+${formatNum(biz.baseIncome)}/сек</div>
        </div>
      </div>
      <div class="shop-card-price ${locked ? 'locked' : ''}">${owned ? '✓' : formatNum(biz.price) + ' $'}</div>
    `;
    if (!owned) {
      card.onclick = () => showScreen('info', { business: biz });
    }
    list.appendChild(card);
  });
}

function renderBusinessInfo(biz) {
  document.getElementById('info-title').textContent = biz.name;
  const icon = document.getElementById('info-icon');
  icon.src = biz.image;
  icon.alt = biz.name;
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
    renderAchievements();
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
    const affordable = !isBought && state.balance >= cost;
    const locked = !isBought && !affordable;

    const card = document.createElement('div');
    card.className = `upgrade-card ${isBought ? 'bought' : affordable ? 'affordable' : locked ? 'locked' : ''}`;
    card.innerHTML = `
      <div class="upgrade-card-left">
        <img class="upgrade-card-icon" src="assets/icons/upgrade.png" alt="">
        <div>
          <div class="upgrade-card-name">${upg.name}</div>
          <div class="upgrade-card-income">+${formatNum(upg.income)}/сек</div>
        </div>
      </div>
      <div class="upgrade-card-price ${locked ? 'locked' : ''}">${isBought ? '✓' : formatNum(cost)}</div>
      <button class="btn-upgrade btn-upgrade-buy" type="button" ${isBought || locked ? 'disabled' : ''}>Улучшить</button>
    `;
    if (!isBought && affordable) {
      const buyUpgrade = () => {
        if (state.balance < cost) return;
        state.balance -= cost;
        if (!state.owned[biz.id]) state.owned[biz.id] = { upgrades: [] };
        state.owned[biz.id].upgrades.push(idx);
        recalcIncome();
        renderUpgrades(biz);
      };
      card.onclick = buyUpgrade;
      card.querySelector('.btn-upgrade-buy').onclick = (e) => {
        e.stopPropagation();
        buyUpgrade();
      };
    }
    list.appendChild(card);
  });
}

function renderWork() {
  const list = document.getElementById('work-list');
  const xp = document.getElementById('xp-display');
  xp.textContent = formatNum(state.xp);
  list.innerHTML = '';

  WORK_TASKS.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
      <img class="task-icon" src="${task.icon}" alt="">
      <div>
        <div class="task-name">${task.name}</div>
        <div class="task-meta">+${formatNum(task.reward)} $ · +${task.xp} опыта</div>
      </div>
      <button class="btn-small-action" type="button">Начать</button>
    `;
    card.querySelector('button').onclick = () => {
      addMoney(task.reward);
      state.xp += task.xp;
      state.workDone += 1;
      xp.textContent = formatNum(state.xp);
      renderWork();
    };
    list.appendChild(card);
  });
}

function renderAchievements() {
  const list = document.getElementById('achievements-list');
  if (!list) return;
  list.innerHTML = '';

  ACHIEVEMENTS.forEach(item => {
    const rawProgress = item.getProgress();
    const progress = Math.min(rawProgress, item.target);
    const pct = Math.min(100, (progress / item.target) * 100);
    const done = rawProgress >= item.target;
    const card = document.createElement('div');
    card.className = `achievement-card ${done ? 'complete' : ''}`;
    card.innerHTML = `
      <img class="achievement-icon" src="${done ? 'assets/icons/check.png' : 'assets/icons/trophy.png'}" alt="">
      <div>
        <div class="achievement-name">${item.name}</div>
        <div class="achievement-desc">${item.desc}</div>
        <div class="level-bar"><div class="level-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <span class="achievement-progress">${formatNum(progress)} / ${formatNum(item.target)}</span>
    `;
    list.appendChild(card);
  });
}

function renderStore() {
  const list = document.getElementById('store-list');
  list.innerHTML = '';

  STORE_ITEMS.forEach(item => {
    const owned = !item.repeatable && state.storePurchases[item.id];
    const affordable = state.balance >= item.price;
    const card = document.createElement('div');
    card.className = `store-card ${owned ? 'bought' : affordable ? 'affordable' : 'locked'}`;
    card.innerHTML = `
      <img class="store-icon" src="${item.icon}" alt="">
      <div>
        <div class="store-section">${item.desc}</div>
        <div class="store-name">${item.name}</div>
      </div>
      <div class="store-price">${owned ? '✓' : formatNum(item.price) + ' $'}</div>
      <button class="btn-cart" type="button" ${owned || !affordable ? 'disabled' : ''}>
        <img src="assets/icons/cart.png" alt="">
      </button>
    `;
    card.querySelector('button').onclick = () => {
      if (owned || state.balance < item.price) return;
      state.balance -= item.price;
      state.storePurchases[item.id] = (state.storePurchases[item.id] || 0) + 1;
      item.buy();
      setBalance(state.balance);
      renderStore();
    };
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
  document.querySelector('[data-action="work"]').onclick = () => showScreen('work');
  document.querySelector('[data-action="shop"]').onclick = () => showScreen('shop');

  // Empty state
  document.querySelector('#empty-state .btn-accent').onclick = () => showScreen('shop');

  // Bottom navigation
  document.querySelectorAll('.bottom-nav-link[data-screen]').forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      showScreen(link.dataset.screen);
    };
  });

  // Back buttons
  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.onclick = () => showScreen(btn.dataset.back);
  });

  // Tick loop
  setInterval(tick, 100);
});
