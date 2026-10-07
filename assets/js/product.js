/* BESTI — сторінка товару */
(function () {
  const { D, Cart, icon, fmt, esc, qs, qsa, productCard, skinName, catName, brandName, initSlider, toast, hydrateIcons, Leads } = window.Besti;

  const id = new URLSearchParams(location.search).get('id');
  const p = D.PRODUCTS.find((x) => x.id === id) || D.PRODUCTS[0];
  document.title = `${p.name} ${brandName(p.brand)} — Besti`;

  const firstSkin = p.skin.find((s) => s !== 'all') || 'all';
  qs('#crumbs').innerHTML = `<a href="index.html">Головна</a><span class="sep">/</span><a href="catalog.html">Каталог</a><span class="sep">/</span><a href="catalog.html?skin=${firstSkin}">${skinName(firstSkin)}</a><span class="sep">/</span><span>${esc(p.line)}</span>`;

  // галерея: основне фото + текстури (демо)
  const textures = ['1748543668687-624e058c367c', '1741017778557-31eaf775ce0a', '1585945037805-5fd82c2e60b1'].map((t) => D.U(t, 700, 875));
  const gallery = [p.img, ...textures.filter((t) => t !== p.img)].slice(0, 3);

  qs('#product').innerHTML = `
    <div class="gallery">
      <div class="gallery__thumbs">${gallery.map((g, i) => `<button class="${i === 0 ? 'is-active' : ''}" data-g="${i}" aria-label="Фото ${i + 1}"><img src="${g}" alt="" loading="lazy"></button>`).join('')}</div>
      <div class="gallery__main">
        <div class="pcard__badges">${p.popular ? '<span class="pbadge pbadge--hit">Хіт салону</span>' : ''}${p.isNew ? '<span class="pbadge">Новинка</span>' : ''}</div>
        <img id="g-main" src="${gallery[0]}" alt="${esc(p.name)}">
      </div>
    </div>
    <div class="pinfo">
      <div class="pinfo__top">
        <span class="pcard__brand">${brandName(p.brand)} · ${esc(p.line)}</span>
        <span class="chip">${icon('shield')} Сертифіковано</span>
        <span class="chip chip--cream">${catName(p.cat)}</span>
      </div>
      <h1>${esc(p.name)}</h1>
      <p class="lead">${esc(p.short)}</p>
      <div class="pinfo__price"><span class="price">${fmt(p.price)}</span><span class="muted">${p.volume}</span></div>
      <div class="pinfo__skins"><span>Підходить для шкіри:</span><div>${p.skin.map((s) => `<a class="chip" href="catalog.html?skin=${s}">${icon(s)} ${skinName(s)}</a>`).join('')}</div></div>
      <div class="pinfo__buy">
        <div class="qty"><button data-q="-1" aria-label="Менше">${icon('minus')}</button><input id="qty" type="number" value="1" min="1" max="99" aria-label="Кількість"><button data-q="1" aria-label="Більше">${icon('plus')}</button></div>
        <button class="btn" id="buy">${icon('bag')} Додати в кошик</button>
      </div>
      <div class="pinfo__perks">
        <div class="perk">${icon('cert')}<span>Сертифікат відповідності — <a href="about.html#certificates">переглянути</a></span></div>
        <div class="perk">${icon('truck')}<span>Доставка Новою поштою 1–2 дні, від 3000 ₴ — безкоштовно</span></div>
        <div class="perk">${icon('shield')}<span>Оригінал від офіційного дистриб’ютора</span></div>
        <div class="perk">${icon('chat')}<span>Безкоштовна консультація щодо застосування</span></div>
      </div>
      <div class="cosm-note">
        <img src="${D.COSMETOLOGIST.photo}" alt="">
        <div><b>Коментар косметолога · ${D.COSMETOLOGIST.name}</b><p>«${esc(p.comment)}»</p></div>
      </div>
      <div class="tabs">
        <div class="tabs__nav" role="tablist">
          <button class="is-active" data-tab="0">Опис</button>
          <button data-tab="1">Активні компоненти</button>
          <button data-tab="2">Застосування</button>
          <button data-tab="3">Склад</button>
        </div>
        <div class="tabs__panel is-active"><p>${esc(p.desc)}</p></div>
        <div class="tabs__panel"><ul>${p.actives.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>
        <div class="tabs__panel"><p>${esc(p.usage)}</p></div>
        <div class="tabs__panel"><p class="muted">Повний склад INCI вказаний на упаковці. Менеджер надішле фото складу за запитом — напишіть нам у месенджер.</p></div>
      </div>
      <div class="help-card">
        <div><b>Не впевнені, що підійде?</b><small>Косметолог відповість безкоштовно протягом 15 хвилин</small></div>
        <button class="btn btn--ghost btn--sm" data-consult="Питання про товар: ${esc(p.name)}">${icon('chat')} Запитати косметолога</button>
      </div>
    </div>`;

  // галерея
  qsa('[data-g]').forEach((b) => b.addEventListener('click', () => {
    qsa('[data-g]').forEach((x) => x.classList.remove('is-active'));
    b.classList.add('is-active');
    qs('#g-main').src = gallery[+b.dataset.g];
  }));

  // кількість
  const qty = qs('#qty');
  qsa('[data-q]').forEach((b) => b.addEventListener('click', () => {
    qty.value = Math.max(1, Math.min(99, (+qty.value || 1) + +b.dataset.q));
  }));

  qs('#buy').addEventListener('click', () => {
    Cart.add(p.id, Math.max(1, +qty.value || 1));
    toast(`<img src="${p.img}" alt=""><span>Додано в кошик<br><b>${esc(p.name)}</b></span><a href="cart.html">Кошик →</a>`);
  });

  // таби
  const tabBtns = qsa('.tabs__nav button'), panels = qsa('.tabs__panel');
  tabBtns.forEach((b) => b.addEventListener('click', () => {
    tabBtns.forEach((x, i) => { x.classList.toggle('is-active', x === b); panels[i].classList.toggle('is-active', x === b); });
  }));

  // поєднують
  const pairs = (p.pairs || []).map((pid) => D.PRODUCTS.find((x) => x.id === pid)).filter(Boolean);
  const extra = D.PRODUCTS.filter((x) => x.id !== p.id && !pairs.includes(x) && x.skin.some((s) => p.skin.includes(s)));
  const list = pairs.concat(extra).slice(0, 8);
  qs('#pairs .slider__track').innerHTML = list.map(productCard).join('');
  initSlider(qs('#pairs'));
  hydrateIcons();
})();
