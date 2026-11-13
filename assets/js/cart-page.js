/* BESTI — кошик та оформлення заявки */
(function () {
  const { D, Cart, Leads, icon, fmt, esc, qs, qsa, productCard, leadForm, bindLeadForm, messengerButtons, toast, hydrateIcons, brandName } = window.Besti;
  const FREE = D.SITE.freeShipping;
  const root = qs('#cart-root');
  let promo = '';
  try { promo = localStorage.getItem('besti_promo') || ''; } catch (e) { /* ignore */ }

  function emptyView() {
    const pop = D.PRODUCTS.filter((p) => p.popular).slice(0, 4);
    root.innerHTML = `<div class="empty" style="margin-bottom:64px">
        <span class="ic">${icon('bag')}</span>
        <h3>Кошик поки порожній</h3>
        <p class="muted">Почніть з вибору типу шкіри або пройдіть тест — косметолог підкаже ідеальний ритуал.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><a class="btn" href="quiz.html">${icon('spark')} Пройти тест</a><a class="btn btn--ghost" href="catalog.html">До каталогу</a></div>
      </div>
      <div class="section-head" style="margin-bottom:24px"><div><h2>Популярні <em>засоби</em></h2></div></div>
      <div class="pgrid" style="margin-bottom:100px">${pop.map(productCard).join('')}</div>`;
  }

  function layout() {
    root.innerHTML = `<div class="cart">
      <div class="cart__list" id="lines"></div>
      <aside class="summary" id="summary"></aside>
      <div class="summary cart__order" style="position:static" id="order-form">
        <div><span class="eyebrow">Оформлення</span><h3 style="font-size:32px;margin-top:8px">Залиште контакт — <em>менеджер зв’яжеться</em></h3>
        <p class="muted" style="margin-top:8px;font-size:14px">Онлайн-оплата не потрібна. Ми зателефонуємо або напишемо, підтвердимо наявність і деталі доставки.</p></div>
        ${leadForm('order', { delivery: true, submit: 'Оформити замовлення' })}
      </div>
    </div>`;
    bindLeadForm(qs('#order-form form'), 'order', () => {
      const lines = Cart.lines();
      return {
        promo,
        total: Cart.total(),
        items: lines.map((l) => ({ id: l.id, name: l.product.name, volume: l.product.volume, qty: l.qty, price: l.product.price }))
      };
    }, onOrder);
  }

  function renderLines() {
    const lines = Cart.lines();
    qs('#lines').innerHTML = lines.map((l) => `<div class="citem">
        <a href="product.html?id=${l.id}"><img src="${l.product.img}" alt=""></a>
        <div class="citem__info">
          <small>${brandName(l.product.brand)} · ${esc(l.product.line)} · ${l.product.volume}</small>
          <a href="product.html?id=${l.id}"><b>${esc(l.product.name)}</b></a>
          <small>${fmt(l.product.price)} / шт.</small>
        </div>
        <div class="citem__right">
          <div class="qty qty--sm"><button data-dec="${l.id}" aria-label="Менше">${icon('minus')}</button><input value="${l.qty}" readonly aria-label="Кількість"><button data-inc="${l.id}" aria-label="Більше">${icon('plus')}</button></div>
          <span class="price">${fmt(l.product.price * l.qty)}</span>
          <button class="citem__rm" data-rm="${l.id}">${icon('trash')} Видалити</button>
        </div>
      </div>`).join('');
  }

  function renderSummary() {
    const total = Cart.total();
    const left = Math.max(0, FREE - total);
    const disc = promo ? Math.round(total * 0.1) : 0;
    qs('#summary').innerHTML = `
      <h3 style="font-size:28px">Підсумок</h3>
      <div class="summary__row"><span>Товари (${Cart.count()})</span><span>${fmt(total)}</span></div>
      ${disc ? `<div class="summary__row" style="color:var(--lav-700)"><span>Знижка за промокодом ${esc(promo)}</span><span>−${fmt(disc)}</span></div>` : ''}
      <div class="summary__row"><span>Доставка</span><span>${left ? 'за тарифами НП' : 'безкоштовно'}</span></div>
      <div class="summary__row total"><span>Разом</span><span>${fmt(total - disc)}</span></div>
      <div class="ship-note">
        <div class="progress"><span style="width:${Math.min(100, (total / FREE) * 100)}%"></span></div>
        <span>${left ? `Додайте ще <b>${fmt(left)}</b> — і доставка буде безкоштовною` : '🎉 Вам доступна безкоштовна доставка'}</span>
      </div>
      <form class="price-range" id="promo-form" style="grid-template-columns:1fr auto">
        <input name="promo" placeholder="Промокод" value="${esc(promo)}" aria-label="Промокод" style="text-transform:uppercase">
        <button class="btn btn--ghost btn--sm" type="submit">Застосувати</button>
      </form>
      <p class="form-note">${icon('shield')} Оплата після підтвердження: накладений платіж (передоплата ${D.SITE.prepay} ₴), на рахунок або в салоні</p>
      <a class="btn btn--block btn--ghost" href="#order-form">Перейти до оформлення</a>`;
    qs('#promo-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = e.target.promo.value.trim().toUpperCase();
      if (!v) { promo = ''; } else if (v === D.SITE.promo) { promo = v; toast('<span>Промокод застосовано: −10%</span>'); } else { toast('<span>Промокод не знайдено. Менеджер перевірить його при дзвінку.</span>'); promo = ''; }
      try { promo ? localStorage.setItem('besti_promo', promo) : localStorage.removeItem('besti_promo'); } catch (er) { /* ignore */ }
      renderSummary();
    });
  }

  function onOrder(r, data) {
    const lines = Cart.lines();
    const text = Leads.orderText(lines, { name: data.name, phone: data.phone, promo });
    const n = 'B' + String(Date.now()).slice(-6);
    Cart.clear();
    try { localStorage.removeItem('besti_promo'); } catch (e) { /* ignore */ }
    root.innerHTML = `<div class="quiz__card" style="max-width:720px;margin:0 auto 100px">
      <div class="success">
        <span class="ic">${icon('check')}</span>
        <span class="eyebrow">Заявка № ${n}</span>
        <h2>Дякуємо, ${esc(data.name)}!</h2>
        <p class="muted">Замовлення прийнято. Менеджер ${data.contact === 'Дзвінок' ? 'зателефонує' : 'напише в ' + esc(data.contact)} протягом 15 хвилин у робочий час (${D.SITE.hours}).</p>
        <div style="width:100%;text-align:left;background:var(--milk);border:1px solid var(--line);border-radius:16px;padding:16px;font-size:14px;white-space:pre-line" id="order-text">${esc(text)}</div>
        <p class="muted" style="font-size:14px">Хочете швидше? Скопіюйте замовлення та надішліть у месенджер:</p>
        <div class="messengers" style="justify-content:center">
          <button class="msg-btn" id="copy">${icon('copy')} Скопіювати</button>
          ${messengerButtons()}
        </div>
        <a class="link" href="index.html" style="margin-top:10px">Повернутися на головну ${icon('arrow')}</a>
      </div>
    </div>`;
    const copy = () => { try { navigator.clipboard.writeText(text); toast('<span>Текст замовлення скопійовано — вставте його в чат</span>'); } catch (e) { /* ignore */ } };
    qs('#copy').addEventListener('click', copy);
    qsa('.success .messengers a').forEach((a) => a.addEventListener('click', copy));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  root.addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]'), rm = e.target.closest('[data-rm]');
    const line = (id) => Cart.items().find((i) => i.id === id);
    if (inc) Cart.set(inc.dataset.inc, line(inc.dataset.inc).qty + 1);
    if (dec) Cart.set(dec.dataset.dec, line(dec.dataset.dec).qty - 1);
    if (rm) Cart.remove(rm.dataset.rm);
  });

  function render() {
    if (!Cart.count()) { if (!qs('.success', root)) emptyView(); return; }
    if (!qs('#lines')) layout();
    renderLines();
    renderSummary();
  }
  Cart.onChange(render);
  render();
  hydrateIcons();
})();
