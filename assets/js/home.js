/* BESTI — головна сторінка */
(function () {
  const { D, icon, fmt, esc, qs, productCard, initSlider, certsGrid, faqList, leadForm, bindLeadForm, messengerButtons, brandName, hydrateIcons } = window.Besti;

  // зображення
  qs('#quiz-img').src = D.IMAGES.quiz;
  qs('#consult-img').src = D.IMAGES.consult;
  qs('#about-img').src = D.COSMETOLOGIST.photo;
  qs('#about-img2').src = D.COSMETOLOGIST.cabinet;

  // типи шкіри
  qs('#skins').innerHTML = D.SKIN_TYPES.map((s) => {
    const n = D.PRODUCTS.filter((p) => p.skin.includes(s.key)).length;
    return `<a class="skin-pill" href="catalog.html?skin=${s.key}">
      <span class="ic">${icon(s.key)}</span>
      <span class="t"><b>${s.name}</b><small>${s.short}</small></span>
      <span class="n">${n}</span>
    </a>`;
  }).join('') + `<a class="skin-pill skin-pill--quiz" href="quiz.html">
      <span class="ic">${icon('quiz')}</span>
      <span class="t"><b>Не знаю свій тип</b><small>Тест за 2 хвилини</small></span>
      <span class="n">${icon('arrow')}</span>
    </a>`;

  // популярні
  const pop = qs('#popular');
  qs('.slider__track', pop).innerHTML = D.PRODUCTS.filter((p) => p.popular).map(productCard).join('');
  initSlider(pop);

  // порада тижня
  const a = D.ADVICE;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - start) / 864e5 + start.getDay() + 1) / 7);
  qs('#advice-week').textContent = '№' + week;
  qs('#advice-img').src = a.img;
  qs('#advice-title').textContent = a.title;
  qs('#advice-text').textContent = a.text;
  qs('#advice-avatar').src = D.COSMETOLOGIST.photo;
  qs('#advice-name').textContent = D.COSMETOLOGIST.name;
  qs('#advice-role').textContent = D.COSMETOLOGIST.title;
  const ap = D.PRODUCTS.find((p) => p.id === a.productId);
  if (ap) {
    qs('#advice-product').innerHTML = `<img src="${ap.img}" alt="">
      <div><small>Косметолог рекомендує</small><b>${esc(ap.name)}</b><span class="price" style="font-size:15px">${fmt(ap.price)}</span></div>
      <button class="add-btn" data-add="${ap.id}" aria-label="Додати в кошик">${icon('plus')}</button>`;
  }

  // про косметолога
  qs('#about-name').textContent = D.COSMETOLOGIST.name;
  qs('#facts').innerHTML = D.COSMETOLOGIST.facts.map(([b, s]) => `<div class="fact"><b>${b}</b><span>${s}</span></div>`).join('');

  // бренди
  const brandList = qs('#brand-list'); // блок брендів прибрано з головної; лишаємо на випадок повернення
  if (brandList) brandList.innerHTML = D.BRANDS.map((b) => `<div class="brand-card${b.active ? ' brand-card--main' : ' brand-card--soon'}">
      <span class="brand-card__logo">${b.name}</span>
      <div class="brand-card__meta">${b.active ? `<span class="chip">${b.country}</span><span class="chip">${b.since}</span><span class="chip">${D.PRODUCTS.filter((p) => p.brand === b.key).length} засобів</span>` : '<span class="chip chip--outline">Незабаром</span>'}</div>
      <p>${b.desc}</p>
      ${b.active ? `<a class="link" href="catalog.html?brand=${b.key}">Усі засоби ${brandName(b.key)} ${icon('arrow')}</a>` : ''}
    </div>`).join('');

  qs('#brand-strip').innerHTML = D.BRANDS.map((b) => b.active
    ? `<a href="catalog.html?brand=${b.key}" title="${esc(b.country)}">${esc(b.name)}</a>`
    : `<span title="${esc(b.country)}">${esc(b.name)}</span>`).join('');

  certsGrid(qs('#certs'));

  // відгуки
  qs('#reviews').innerHTML = D.REVIEWS.map((r) => `<div class="review">
      <span class="stars">★★★★★</span>
      <p>«${esc(r.text)}»</p>
      <div class="review__who"><span class="av">${r.name[0]}</span><div><b>${esc(r.name)}</b><small>${esc(r.skin)}</small></div></div>
    </div>`).join('');

  qs('#msgs').innerHTML = messengerButtons();

  // консультація
  qs('#consult-form').innerHTML = leadForm('consult', { problem: true, submit: 'Отримати підбір догляду' });
  bindLeadForm(qs('#consult-form form'), 'consult', () => ({ topic: 'Головна — блок консультації' }));

  faqList(qs('#faq-list'));
  hydrateIcons();
})();
