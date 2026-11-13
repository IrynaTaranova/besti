/* =========================================================
   BESTI — спільні компоненти: іконки, хедер, футер, пошук,
   картки товарів, тост, модалки, форми
   ========================================================= */
(function () {
  const D = window.BESTI_DATA;
  const Cart = window.BestiCart;
  const Leads = window.BestiLeads;

  /* ---------- Icons ---------- */
  const PATHS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    bag: '<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    home: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>',
    shield: '<path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    cert: '<circle cx="12" cy="9" r="5"/><path d="m9 13.5-1.5 7L12 18l4.5 2.5-1.5-7"/><path d="m10 9 1.5 1.5L14 8"/>',
    doctor: '<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"/><path d="M12 14v4M10 16h4"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-1.5-3-5-4-5.5-2S9 9 12 9c3 0 6-.5 5.5-2.5S13.5 6 12 9"/>',
    spark: '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z"/><path d="M19 15.5c.2 1.5.9 2.2 2.4 2.4-1.5.2-2.2.9-2.4 2.4-.2-1.5-.9-2.2-2.4-2.4 1.5-.2 2.2-.9 2.4-2.4z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6.5 10-8.5"/>',
    telegram: '<path d="m21 4-3 16-6-5-3 3v-4.5L18 6 7.5 12 3 10.5z"/>',
    viber: '<path d="M12 3c5 0 8 2.5 8 8s-3 8-8 8c-1 0-2-.1-3-.4L6 20v-3c-1.6-1.3-2-3.3-2-6 0-5.5 3-8 8-8z"/><path d="M9.5 8.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-.9-.4-1.5-1-1.8-1.8l.8-1-1-2z"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17" cy="7" r=".6" fill="currentColor"/>',
    quiz: '<path d="M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.6v.6"/><circle cx="12" cy="17.5" r=".6" fill="currentColor"/><circle cx="12" cy="12" r="9"/>',
    // skin types
    oily: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    combo: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" opacity=".25"/>',
    dry: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6.5 10-8.5"/>',
    sensitive: '<path d="M20 4c-8 0-13 5-14 12l-2 4"/><path d="M6 16c6 0 10-3 11-8"/><path d="M9 12h5"/>',
    acne: '<circle cx="12" cy="12" r="8"/><circle cx="9" cy="10" r="1.2" fill="currentColor"/><circle cx="14.5" cy="9" r=".9" fill="currentColor"/><circle cx="13" cy="14.5" r="1.4" fill="currentColor"/>',
    rosacea: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    normal: '<circle cx="12" cy="12" r="8"/><path d="M8.5 13.5a4 4 0 0 0 7 0"/><circle cx="9.5" cy="10" r=".7" fill="currentColor"/><circle cx="14.5" cy="10" r=".7" fill="currentColor"/>',
    postacne: '<circle cx="12" cy="12" r="8"/><circle cx="9.5" cy="10.5" r="1.6"/><circle cx="14.5" cy="14" r="1.2"/>',
    pigment: '<circle cx="12" cy="12" r="8"/><path d="M9 9.5c1 .3 1.6 1 1.4 2-.2 1.1-1.6 1.4-2.3.6M15 13.5c-.9-.1-1.6.6-1.4 1.5"/>',
    age: '<path d="M6 8c2 1.5 4 1.5 6 0s4-1.5 6 0M6 12c2 1.5 4 1.5 6 0s4-1.5 6 0M6 16c2 1.5 4 1.5 6 0s4-1.5 6 0"/>',
    all: '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7z"/>'
  };
  function icon(name, cls = 'icon') {
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name] || ''}</svg>`;
  }

  const fmt = (n) => n.toLocaleString('uk-UA').replace(/ /g, ' ') + ' ₴';
  const skinName = (k) => (D.SKIN_TYPES.find((s) => s.key === k) || {}).name || k;
  const catName = (k) => (D.CATEGORIES.find((c) => c.key === k) || {}).name || k;
  const brandName = (k) => (D.BRANDS.find((b) => b.key === k) || {}).name || k;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => [...el.querySelectorAll(s)];
  const page = document.body.dataset.page || '';

  const LOGO = `<a href="index.html" class="logo" aria-label="Besti — на головну">
      <img class="logo__img" src="assets/img/logo.png" alt="Besti" onerror="this.remove()">
      <svg class="logo__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="19" stroke="#B8876F" stroke-width="1.2"/>
        <path d="M20 9c3.5 4.2 5.5 7.6 5.5 11.2a5.5 5.5 0 0 1-11 0C14.5 16.6 16.5 13.2 20 9Z" fill="#F1E3D9" stroke="#662E28" stroke-width="1.2"/>
        <path d="M17.6 21.5a2.6 2.6 0 0 0 2.4 2.4" stroke="#662E28" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
      <span class="logo__word">Best<b>i</b></span>
    </a>`;

  /* ---------- Header ---------- */
  function renderHeader() {
    const el = qs('#site-header');
    if (!el) return;
    const navActive = (p) => (page === p ? ' is-active' : '');
    el.outerHTML = `
    <div class="topbar">Безкоштовний підбір догляду від косметолога <span class="sep hide-sm">·</span><span class="hide-sm">Доставка 1–2 дні, від ${D.SITE.freeShipping} ₴ — безкоштовно</span></div>
    <header class="header" id="header">
      <div class="container header__in">
        <button class="icon-btn burger" data-open-menu aria-label="Меню">${icon('menu')}</button>
        ${LOGO}
        <nav class="nav" aria-label="Головне меню">
          <div class="nav__item">
            <a class="nav__link${navActive('catalog')}" href="catalog.html">Каталог ${icon('chevron')}</a>
            <div class="mega">
              <div>
                <div class="mega__title">Оберіть тип шкіри</div>
                <div class="mega__list">
                  ${D.SKIN_TYPES.map((s) => `<a href="catalog.html?skin=${s.key}"><span class="ic">${icon(s.key)}</span><span>${s.name}<small>${s.short}</small></span></a>`).join('')}
                </div>
              </div>
              <a class="mega__promo" href="quiz.html">
                <img src="${D.IMAGES.quiz}" alt="" loading="lazy">
                <h4>Не знаєте свій тип шкіри?</h4>
                <p>Тест за 2 хвилини + персональний ритуал догляду від косметолога</p>
                <span class="btn btn--light btn--sm">Пройти тест</span>
              </a>
            </div>
          </div>
          <a class="nav__link${navActive('quiz')}" href="quiz.html">Тест шкіри</a>
          <a class="nav__link" href="catalog.html?brand=drspiller">Dr. Spiller</a>
          <a class="nav__link${navActive('about')}" href="about.html">Про косметолога</a>
          <a class="nav__link" href="about.html#certificates">Сертифікати</a>
        </nav>
        <div class="hdr-actions">
          <div class="hdr-phone"><a href="tel:${D.SITE.phoneRaw}">${D.SITE.phone}</a><span>${D.SITE.hours}</span></div>
          <button class="icon-btn" data-open-search aria-label="Пошук">${icon('search')}</button>
          <a class="icon-btn" href="cart.html" aria-label="Кошик">${icon('bag')}<span class="badge-count" data-cart-count>0</span></a>
        </div>
      </div>
    </header>
    <div class="drawer-backdrop" data-close-menu></div>
    <aside class="drawer" id="menu" aria-label="Мобільне меню">
      <div class="drawer__head">${LOGO}<button class="icon-btn" data-close-menu aria-label="Закрити">${icon('close')}</button></div>
      <div class="drawer__body">
        <a class="btn btn--block" href="quiz.html">${icon('spark')} Підібрати догляд за 2 хв</a>
        <div>
          <div class="mega__title">Тип шкіри</div>
          <div class="drawer__skins">${D.SKIN_TYPES.map((s) => `<a href="catalog.html?skin=${s.key}">${s.name}</a>`).join('')}</div>
        </div>
        <nav class="drawer__nav">
          <a href="catalog.html">Весь каталог ${icon('arrow')}</a>
          <a href="catalog.html?brand=drspiller">Dr. Spiller ${icon('arrow')}</a>
          <a href="about.html">Про косметолога ${icon('arrow')}</a>
          <a href="about.html#certificates">Сертифікати ${icon('arrow')}</a>
          <a href="about.html#delivery">Доставка та оплата ${icon('arrow')}</a>
          <a href="about.html#faq">Питання та відповіді ${icon('arrow')}</a>
        </nav>
        <div class="drawer__contacts">
          <a href="tel:${D.SITE.phoneRaw}"><b>${D.SITE.phone}</b></a>
          <span class="muted">${D.SITE.hours}</span>
          <div class="messengers">${messengerButtons()}</div>
        </div>
      </div>
    </aside>
    <nav class="tabbar" aria-label="Швидка навігація">
      <a href="index.html" class="${page === 'home' ? 'is-active' : ''}">${icon('home')}<span>Головна</span></a>
      <a href="catalog.html" class="${page === 'catalog' ? 'is-active' : ''}">${icon('grid')}<span>Каталог</span></a>
      <a href="quiz.html" class="tabbar__quiz"><span class="dot">${icon('spark')}</span><span>Тест</span></a>
      <button data-open-search>${icon('search')}<span>Пошук</span></button>
      <a href="cart.html" class="${page === 'cart' ? 'is-active' : ''}">${icon('bag')}<span>Кошик</span><span class="badge-count" data-cart-count>0</span></a>
    </nav>
    ${searchMarkup()}
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <div class="modal" id="modal" aria-modal="true" role="dialog"><div class="modal__box"><button class="icon-btn modal__close" data-close-modal aria-label="Закрити">${icon('close')}</button><div class="modal__content"></div></div></div>`;

    const header = qs('#header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const menu = qs('#menu'), back = qs('.drawer-backdrop');
    const setMenu = (open) => { menu.classList.toggle('is-open', open); back.classList.toggle('is-open', open); document.body.style.overflow = open ? 'hidden' : ''; };
    qsa('[data-open-menu]').forEach((b) => b.addEventListener('click', () => setMenu(true)));
    qsa('[data-close-menu]').forEach((b) => b.addEventListener('click', () => setMenu(false)));
    qsa('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

    initSearch();
    initModal();
    updateCount();
    Cart.onChange(() => updateCount(true));
  }

  function messengerButtons() {
    return `<a class="msg-btn" href="${Leads.links.telegram()}" target="_blank" rel="noopener">${icon('telegram')} Telegram</a>
      <a class="msg-btn" href="${Leads.links.viber()}">${icon('viber')} Viber</a>
      <a class="msg-btn" href="https://instagram.com/${D.SITE.instagram}" target="_blank" rel="noopener">${icon('instagram')} Instagram</a>`;
  }

  function updateCount(bump) {
    const n = Cart.count();
    qsa('[data-cart-count]').forEach((b) => {
      b.textContent = n;
      b.classList.toggle('is-on', n > 0);
      if (bump && n > 0) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    });
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const el = qs('#site-footer');
    if (!el) return;
    el.outerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__about">
            <a href="index.html" class="logo" aria-label="Besti — на головну"><img class="logo__full" src="assets/img/logo-full.png" alt="Besti" width="120" height="120"></a>
            <p>Професійна сертифікована косметика, підібрана лікарем-косметологом. Тільки оригінал від офіційних дистриб’юторів.</p>
            <div class="footer__social">
              <a href="https://instagram.com/${D.SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>
              <a href="${Leads.links.telegram()}" target="_blank" rel="noopener" aria-label="Telegram">${icon('telegram')}</a>
              <a href="${Leads.links.viber()}" aria-label="Viber">${icon('viber')}</a>
            </div>
          </div>
          <div>
            <h4>Тип шкіри</h4>
            <ul>${D.SKIN_TYPES.map((s) => `<li><a href="catalog.html?skin=${s.key}">${s.name}</a></li>`).join('')}</ul>
          </div>
          <div>
            <h4>Покупцям</h4>
            <ul>
              <li><a href="quiz.html">Тест на тип шкіри</a></li>
              <li><a href="about.html#consult">Консультація косметолога</a></li>
              <li><a href="about.html#delivery">Доставка та оплата</a></li>
              <li><a href="about.html#certificates">Сертифікати</a></li>
              <li><a href="about.html#faq">Питання та відповіді</a></li>
              <li><a href="oferta.html">Публічна оферта</a></li>
            </ul>
          </div>
          <div>
            <h4>Контакти</h4>
            <ul>
              <li><a href="tel:${D.SITE.phoneRaw}"><b style="color:#fff">${D.SITE.phone}</b></a></li>
              <li>${D.SITE.hours}</li>
              <li><a href="mailto:${D.SITE.email}">${D.SITE.email}</a></li>
              <li>${D.SITE.address}</li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} Besti · ${D.SITE.fop.short} · <a href="oferta.html">Публічна оферта</a></span>
          <span>Не є медичною рекомендацією. Перед використанням ознайомтеся з інструкцією.</span>
        </div>
      </div>
    </footer>`;
  }

  /* ---------- Search ---------- */
  function searchMarkup() {
    return `<div class="search" id="search" role="dialog" aria-label="Пошук">
      <div class="search__in">
        <div style="display:flex;justify-content:flex-end;margin-bottom:12px"><button class="icon-btn" data-close-search aria-label="Закрити пошук">${icon('close')}</button></div>
        <form class="search__bar" action="catalog.html">
          ${icon('search')}
          <input type="search" name="q" placeholder="Що шукаємо?" autocomplete="off" aria-label="Пошук товарів">
        </form>
        <div class="search__hints">
          ${['сироватка', 'SPF', 'акне', 'зволоження', 'Aquamarin', 'чутлива'].map((h) => `<button type="button">${h}</button>`).join('')}
        </div>
        <div class="search__results" aria-live="polite"></div>
      </div>
    </div>`;
  }

  function searchProducts(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    const words = q.split(/\s+/);
    return D.PRODUCTS.map((p) => {
      const hay = [p.name, p.line, brandName(p.brand), catName(p.cat), p.short, p.actives.join(' '), p.skin.map(skinName).join(' ')].join(' ').toLowerCase();
      let score = 0;
      for (const w of words) {
        if (!hay.includes(w)) return null;
        score += p.name.toLowerCase().includes(w) ? 3 : 1;
      }
      return { p, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score).map((x) => x.p);
  }

  function initSearch() {
    const s = qs('#search');
    const input = qs('input', s);
    const res = qs('.search__results', s);
    const open = () => { s.classList.add('is-open'); document.body.style.overflow = 'hidden'; setTimeout(() => input.focus(), 50); render(); };
    const close = () => { s.classList.remove('is-open'); document.body.style.overflow = ''; };
    const render = () => {
      const q = input.value;
      if (!q.trim()) { res.innerHTML = `<p class="muted" style="font-size:14px">Популярне: ${D.PRODUCTS.filter((p) => p.popular).slice(0, 4).map((p) => `<a class="link" style="margin:6px 10px 0 0" href="product.html?id=${p.id}">${esc(p.name)}</a>`).join(' ')}</p>`; return; }
      const list = searchProducts(q);
      res.innerHTML = list.length
        ? list.slice(0, 8).map((p) => `<a class="search__item" href="product.html?id=${p.id}"><img src="${p.img}" alt="" loading="lazy"><div><b>${esc(p.name)}</b><small>${brandName(p.brand)} · ${p.line} · ${p.volume}</small></div><span class="price">${fmt(p.price)}</span></a>`).join('')
          + (list.length > 8 ? `<a class="link" href="catalog.html?q=${encodeURIComponent(q)}" style="margin-top:12px">Усі результати (${list.length}) ${icon('arrow')}</a>` : '')
        : `<div class="search__empty">Нічого не знайдено за запитом «${esc(q)}». Спробуйте інше слово або <a class="link" href="quiz.html">пройдіть тест</a> — косметолог підбере догляд.</div>`;
    };
    qsa('[data-open-search]').forEach((b) => b.addEventListener('click', open));
    qsa('[data-close-search]', s).forEach((b) => b.addEventListener('click', close));
    input.addEventListener('input', render);
    qsa('.search__hints button', s).forEach((b) => b.addEventListener('click', () => { input.value = b.textContent; render(); input.focus(); }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && s.classList.contains('is-open')) close();
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
    });
  }

  /* ---------- Product card ---------- */
  function productCard(p) {
    const added = Cart.has(p.id);
    return `<article class="pcard">
      <a class="pcard__media" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">
        <div class="pcard__badges">${p.popular ? '<span class="pbadge pbadge--hit">Хіт</span>' : ''}${p.isNew ? '<span class="pbadge">Новинка</span>' : ''}</div>
        <span class="pcard__cert" title="Сертифікований засіб">${icon('shield')}</span>
        <img src="${p.img}" alt="${esc(p.name)}" loading="lazy">
      </a>
      <div class="pcard__body">
        <span class="pcard__brand">${brandName(p.brand)} · ${p.line}</span>
        <a class="pcard__name" href="product.html?id=${p.id}">${esc(p.name)}</a>
        <div class="pcard__skins">${p.skin.filter((s) => s !== 'all' && !(s === 'normal' && p.skin.includes('all'))).slice(0, 3).map((s) => `<span class="chip chip--cream">${skinName(s)}</span>`).join('')}${p.skin.includes('all') ? '<span class="chip chip--cream">Усі типи</span>' : ''}</div>
        <div class="pcard__foot">
          <span class="price">${fmt(p.price)}<small>${p.volume}</small></span>
          <button class="buy-btn${added ? ' is-added' : ''}" data-add="${p.id}" aria-label="Додати в кошик">${icon(added ? 'check' : 'bag')}<span>${added ? 'У кошику' : 'Купити'}</span></button>
        </div>
      </div>
    </article>`;
  }

  // делегування «у кошик» для всіх карток
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    e.preventDefault();
    const id = b.dataset.add;
    Cart.add(id, 1);
    if (b.classList.contains('add-btn')) { b.classList.add('is-added'); b.innerHTML = icon('check'); }
    if (b.classList.contains('buy-btn')) { b.classList.add('is-added'); b.innerHTML = icon('check') + '<span>У кошику</span>'; }
    const p = Cart.product(id);
    toast(`<img src="${p.img}" alt=""><span>Додано в кошик<br><b>${esc(p.name)}</b></span><a href="cart.html">Кошик →</a>`);
  });

  /* ---------- Toast ---------- */
  let toastT;
  function toast(html) {
    const t = qs('#toast');
    if (!t) return;
    t.innerHTML = html;
    t.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('is-on'), 3200);
  }

  /* ---------- Modal ---------- */
  function initModal() {
    const m = qs('#modal');
    m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close-modal]')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    document.addEventListener('click', (e) => {
      const c = e.target.closest('[data-consult]');
      if (c) { e.preventDefault(); openConsult(c.dataset.consult); }
    });
  }
  function openModal(html, cls = '') {
    const m = qs('#modal');
    const box = qs('.modal__box', m);
    box.className = 'modal__box ' + cls;
    qs('.modal__content', m).innerHTML = html;
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    return m;
  }
  function closeModal() {
    const m = qs('#modal');
    if (!m || !m.classList.contains('is-open')) return;
    m.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function openConsult(topic) {
    const m = openModal(`
      <div style="display:grid;gap:18px">
        <span class="eyebrow">Безкоштовно</span>
        <h3 style="font-size:34px">Підбір догляду <em>косметологом</em></h3>
        <p class="muted">Опишіть, що турбує — косметолог зв’яжеться з вами в месенджері, за потреби попросить фото та складе персональну схему догляду.</p>
        ${leadForm('consult', { problem: true, topic })}
      </div>`);
    bindLeadForm(qs('form', m), 'consult', () => ({ topic: topic || '' }));
  }

  /* ---------- Lead form ---------- */
  function leadForm(type, opts = {}) {
    return `<form class="form" novalidate data-lead="${type}">
      <div class="form-row">
        <div class="field"><label for="${type}-name">Ім’я</label><input id="${type}-name" name="name" autocomplete="given-name" placeholder="Як до вас звертатися?" required><span class="err">Вкажіть ім’я</span></div>
        <div class="field"><label for="${type}-phone">Телефон</label><input id="${type}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+380 __ ___ __ __" required><span class="err">Вкажіть коректний номер</span></div>
      </div>
      <div class="field"><label>Як зручніше зв’язатися?</label>
        <div class="seg">
          <label><input type="radio" name="contact" value="Дзвінок" checked><span>${icon('phone')} Дзвінок</span></label>
          <label><input type="radio" name="contact" value="Telegram"><span>${icon('telegram')} Telegram</span></label>
          <label><input type="radio" name="contact" value="Viber"><span>${icon('viber')} Viber</span></label>
          <label><input type="radio" name="contact" value="Instagram"><span>${icon('instagram')} Instagram</span></label>
        </div>
      </div>
      ${opts.problem ? `<div class="field"><label for="${type}-msg">Що турбує?</label><textarea id="${type}-msg" name="message" placeholder="Наприклад: висипання на підборідді, шкіра стягується після вмивання…"></textarea></div>` : ''}
      ${opts.delivery ? `<div class="field"><label>Доставка</label>
        <div class="seg" data-delivery>
          <label><input type="radio" name="delivery" value="Нова пошта" checked><span>Нова пошта</span></label>
          <label><input type="radio" name="delivery" value="Укрпошта"><span>Укрпошта</span></label>
          <label><input type="radio" name="delivery" value="Самовивіз"><span>Самовивіз із салону</span></label>
        </div></div>
        <div class="form-row" data-address><div class="field"><label for="${type}-city">Місто</label><input id="${type}-city" name="city" placeholder="Івано-Франківськ"></div><div class="field"><label for="${type}-np">Відділення</label><input id="${type}-np" name="np" placeholder="№ відділення або поштомату"></div></div>
        <p class="form-note hide" data-pickup>${icon('home')} Самовивіз із салону в м. ${D.SITE.city} — менеджер узгодить зручний час.</p>
        <div class="field"><label for="${type}-comment">Коментар</label><textarea id="${type}-comment" name="comment" placeholder="Побажання до замовлення (необов’язково)"></textarea></div>` : ''}
      <label class="check"><input type="checkbox" name="agree" checked required><span>Погоджуюся на обробку персональних даних та з <a href="oferta.html" target="_blank" style="text-decoration:underline">умовами оферти</a></span></label>
      <button class="btn btn--block" type="submit">${opts.submit || 'Отримати консультацію'} ${icon('arrow')}</button>
      <p class="form-note">${icon('lock')} Ваші дані не передаються третім особам. Без спаму.</p>
    </form>`;
  }

  function phoneMask(input) {
    const fmtPhone = (v) => {
      let d = v.replace(/\D/g, '');
      if (d.startsWith('380')) d = d.slice(3); else if (d.startsWith('0')) d = d.slice(1);
      d = d.slice(0, 9);
      let out = '+380';
      if (d.length) out += ' ' + d.slice(0, 2);
      if (d.length > 2) out += ' ' + d.slice(2, 5);
      if (d.length > 5) out += ' ' + d.slice(5, 7);
      if (d.length > 7) out += ' ' + d.slice(7, 9);
      return out;
    };
    input.addEventListener('focus', () => { if (!input.value) input.value = '+380 '; });
    input.addEventListener('blur', () => { if (input.value.replace(/\D/g, '').length <= 3) input.value = ''; });
    input.addEventListener('input', () => { input.value = fmtPhone(input.value); });
  }

  function validate(form) {
    let ok = true;
    const name = form.elements.name, phone = form.elements.phone, agree = form.elements.agree;
    const set = (el, bad) => { el.closest('.field').classList.toggle('has-error', bad); if (bad) ok = false; };
    set(name, name.value.trim().length < 2);
    set(phone, phone.value.replace(/\D/g, '').length !== 12);
    if (agree && !agree.checked) { ok = false; toast('<span>Потрібна згода на обробку даних</span>'); }
    if (!ok) { const f = qs('.has-error input', form); if (f) f.focus(); }
    return ok;
  }

  function bindLeadForm(form, type, extra, onDone) {
    phoneMask(form.elements.phone);
    const seg = qs('[data-delivery]', form);
    if (seg) seg.addEventListener('change', () => {
      const pickup = form.elements.delivery.value === 'Самовивіз';
      qs('[data-address]', form).classList.toggle('hide', pickup);
      qs('[data-pickup]', form).classList.toggle('hide', !pickup);
    });
    qsa('input', form).forEach((i) => i.addEventListener('input', () => i.closest('.field') && i.closest('.field').classList.remove('has-error')));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      const btn = qs('button[type=submit]', form);
      btn.disabled = true; btn.textContent = 'Надсилаємо…';
      const data = Object.fromEntries(new FormData(form).entries());
      delete data.agree;
      if (data.delivery) {
        data.np = data.delivery === 'Самовивіз' ? 'Самовивіз із салону' : data.delivery + (data.np ? ', ' + data.np : '');
        if (data.delivery === 'Самовивіз') data.city = D.SITE.city;
      }
      const r = await Leads.submitLead(type, { ...data, ...(extra ? extra() : {}) });
      if (onDone) return onDone(r, data, form);
      form.outerHTML = successBlock(data);
    });
  }

  function successBlock(data, text) {
    return `<div class="success">
      <span class="ic">${icon('check')}</span>
      <h3>Дякуємо${data && data.name ? ', ' + esc(data.name) : ''}!</h3>
      <p class="muted">${text || 'Заявку прийнято. Косметолог або менеджер зв’яжеться з вами протягом 15 хвилин у робочий час.'}</p>
      <p class="muted" style="font-size:14px">Не хочете чекати? Напишіть нам напряму:</p>
      <div class="messengers" style="justify-content:center">${messengerButtons()}</div>
    </div>`;
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = qsa('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Slider ---------- */
  function initSlider(root) {
    const track = qs('.slider__track', root);
    const bar = qs('.slider__progress span', root);
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 20 : 300);
    qsa('[data-prev]', root).forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' })));
    qsa('[data-next]', root).forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' })));
    const upd = () => {
      if (!bar) return;
      const max = track.scrollWidth - track.clientWidth;
      const vis = track.clientWidth / track.scrollWidth;
      bar.style.width = vis * 100 + '%';
      bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * ((1 - vis) / vis) * 100 : 0}%)`;
    };
    track.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  /* ---------- Certificates ---------- */
  function certDoc(c) {
    return `<div class="cert__doc">
      <span class="t">${esc(c.title)}</span>
      <span class="l s"></span><span class="l"></span><span class="l"></span><span class="l xs"></span><span class="l"></span><span class="l s"></span>
      <span class="seal">${icon('cert')}</span>
    </div>`;
  }
  function certsGrid(el) {
    el.innerHTML = D.CERTS.map((c, i) => `<button class="cert" data-cert="${i}">
      <div style="position:relative">${certDoc(c)}<span class="cert__zoom">${icon('zoom')}</span></div>
      <div><b>${esc(c.title)}</b><small>${esc(c.sub)} · ${c.year}</small></div>
    </button>`).join('');
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cert]');
      if (!b) return;
      const c = D.CERTS[+b.dataset.cert];
      openModal(`${certDoc(c)}<div style="padding:16px 4px 4px;display:grid;gap:6px"><b>${esc(c.title)}</b><small class="muted">${esc(c.sub)} · ${c.year}. Тут буде скан оригінального документа.</small></div>`, 'modal__box--cert');
    });
  }

  /* ---------- FAQ ---------- */
  function faqList(el, items) {
    el.innerHTML = (items || D.FAQ).map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}<span class="pm">${icon('plus')}</span></summary><p>${esc(a)}</p></details>`).join('');
  }

  /* ---------- data-icon hydration ---------- */
  function hydrateIcons(root = document) {
    qsa('[data-icon]', root).forEach((el) => {
      const svg = icon(el.dataset.icon);
      if (el.children.length === 0 && !el.textContent.trim()) el.innerHTML = svg;
      else el.insertAdjacentHTML('afterbegin', svg);
      el.removeAttribute('data-icon');
    });
  }

  /* ---------- Init ---------- */
  renderHeader();
  renderFooter();
  hydrateIcons();
  document.addEventListener('DOMContentLoaded', () => hydrateIcons());
  document.addEventListener('DOMContentLoaded', initReveal);
  if (document.readyState !== 'loading') initReveal();

  window.Besti = {
    D, Cart, Leads, icon, fmt, esc, qs, qsa, skinName, catName, brandName,
    productCard, toast, openModal, closeModal, openConsult, leadForm, bindLeadForm, successBlock,
    messengerButtons, initSlider, hydrateIcons, initReveal, certsGrid, faqList, searchProducts, phoneMask, validate
  };
})();
