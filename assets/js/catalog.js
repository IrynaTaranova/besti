/* BESTI — каталог */
(function () {
  const { D, icon, esc, qs, qsa, productCard, skinName, catName, brandName, searchProducts, hydrateIcons } = window.Besti;

  const params = new URLSearchParams(location.search);
  const state = {
    skin: params.get('skin') || '',
    q: params.get('q') || '',
    cats: new Set((params.get('cat') || '').split(',').filter(Boolean)),
    brands: new Set((params.get('brand') || '').split(',').filter(Boolean)),
    min: '', max: '',
    sort: 'pop'
  };

  // вкладки типів шкіри
  const tabs = qs('#skin-tabs');
  tabs.innerHTML = `<button class="skin-tab skin-tab--all" data-skin="">Усі засоби</button>` +
    D.SKIN_TYPES.map((s) => `<button class="skin-tab" data-skin="${s.key}"><span class="ic">${icon(s.key)}</span>${s.name}</button>`).join('');
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-skin]');
    if (!b) return;
    state.skin = b.dataset.skin;
    render();
  });

  // фільтри
  const optList = (el, items, set, key) => {
    el.innerHTML = items.map((it) => `<label class="f-opt"><input type="checkbox" value="${it.key}"${set.has(it.key) ? ' checked' : ''}><span>${it.name}</span><span class="n" data-n="${key}:${it.key}"></span></label>`).join('');
    el.addEventListener('change', (e) => {
      const v = e.target.value;
      e.target.checked ? set.add(v) : set.delete(v);
      render();
    });
  };
  optList(qs('#f-cat'), D.CATEGORIES, state.cats, 'cat');
  optList(qs('#f-brand'), D.BRANDS.filter((b) => b.active), state.brands, 'brand');
  qs('#f-min').addEventListener('input', (e) => { state.min = e.target.value; render(); });
  qs('#f-max').addEventListener('input', (e) => { state.max = e.target.value; render(); });
  qs('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
  qs('#f-reset').addEventListener('click', reset);

  function reset() {
    state.cats.clear(); state.brands.clear(); state.min = ''; state.max = ''; state.q = '';
    qsa('#filters input[type=checkbox]').forEach((i) => (i.checked = false));
    qs('#f-min').value = ''; qs('#f-max').value = '';
    render();
  }

  // мобільна панель фільтрів
  const filters = qs('#filters'), back = qs('#filters-back');
  const setF = (o) => { filters.classList.toggle('is-open', o); back.classList.toggle('is-open', o); qs('.filters__apply').classList.toggle('hide', !o); document.body.style.overflow = o ? 'hidden' : ''; };
  qs('#open-filters').addEventListener('click', () => setF(true));
  qsa('[data-close-filters]').forEach((b) => b.addEventListener('click', () => setF(false)));

  function base() {
    let list = state.q ? searchProducts(state.q) : D.PRODUCTS.slice();
    if (state.skin) list = list.filter((p) => p.skin.includes(state.skin));
    return list;
  }

  function apply(list) {
    if (state.cats.size) list = list.filter((p) => state.cats.has(p.cat));
    if (state.brands.size) list = list.filter((p) => state.brands.has(p.brand));
    if (state.min) list = list.filter((p) => p.price >= +state.min);
    if (state.max) list = list.filter((p) => p.price <= +state.max);
    const s = state.sort;
    if (s === 'asc') list.sort((a, b) => a.price - b.price);
    else if (s === 'desc') list.sort((a, b) => b.price - a.price);
    else if (s === 'new') list.sort((a, b) => (b.isNew - a.isNew) || (b.popular - a.popular));
    else if (!state.q) list.sort((a, b) => b.popular - a.popular);
    return list;
  }

  function plural(n) {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return 'засіб';
    if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return 'засоби';
    return 'засобів';
  }

  function render() {
    // URL
    const u = new URLSearchParams();
    if (state.skin) u.set('skin', state.skin);
    if (state.q) u.set('q', state.q);
    if (state.cats.size) u.set('cat', [...state.cats].join(','));
    if (state.brands.size) u.set('brand', [...state.brands].join(','));
    history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));

    qsa('.skin-tab', tabs).forEach((t) => t.classList.toggle('is-active', t.dataset.skin === state.skin));
    const activeTab = qs('.skin-tab.is-active', tabs);
    if (activeTab && activeTab.scrollIntoView && window.innerWidth < 960) activeTab.scrollIntoView({ inline: 'center', block: 'nearest' });

    const st = D.SKIN_TYPES.find((s) => s.key === state.skin);
    qs('#cat-title').innerHTML = state.q ? `Пошук: <em>«${esc(state.q)}»</em>` : st ? `Догляд: <em>${st.name.toLowerCase()}</em>` : 'Каталог <em>засобів</em>';
    document.title = (st ? st.name + ' — ' : '') + 'Каталог — Besti';
    qs('#skin-info').innerHTML = st ? `<div class="skin-info"><span class="ic">${icon(st.key)}</span><div><b>Порада косметолога</b><p>${st.desc}</p></div><a class="btn btn--sm" href="quiz.html">Скласти ритуал</a></div>` : '';

    const b = base();
    // лічильники
    qsa('[data-n]').forEach((el) => {
      const [k, v] = el.dataset.n.split(':');
      el.textContent = b.filter((p) => (k === 'cat' ? p.cat : p.brand) === v).length;
    });

    const list = apply(b);
    qs('#count').textContent = `${list.length} ${plural(list.length)}`;

    const chips = [];
    if (state.q) chips.push(['q', '', `«${state.q}»`]);
    state.cats.forEach((c) => chips.push(['cat', c, catName(c)]));
    state.brands.forEach((c) => chips.push(['brand', c, brandName(c)]));
    if (state.min) chips.push(['min', '', `від ${state.min} ₴`]);
    if (state.max) chips.push(['max', '', `до ${state.max} ₴`]);
    qs('#active').innerHTML = chips.map(([k, v, l]) => `<button data-rm="${k}:${v}">${esc(l)} ${icon('close')}</button>`).join('');

    qs('#grid').innerHTML = list.length ? list.map(productCard).join('') : `<div class="empty" style="grid-column:1/-1">
        <span class="ic">${icon('search')}</span>
        <h3>Нічого не знайдено</h3>
        <p class="muted">Спробуйте змінити фільтри — або косметолог підбере догляд персонально.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn--ghost btn--sm" id="empty-reset">Скинути фільтри</button><button class="btn btn--sm" data-consult="Каталог — нічого не знайдено">Консультація косметолога</button></div>
      </div>`;
    const er = qs('#empty-reset');
    if (er) er.addEventListener('click', () => { state.skin = ''; reset(); });
  }

  qs('#active').addEventListener('click', (e) => {
    const b = e.target.closest('[data-rm]');
    if (!b) return;
    const [k, v] = b.dataset.rm.split(':');
    if (k === 'q') state.q = '';
    if (k === 'cat') { state.cats.delete(v); qs(`#f-cat input[value="${v}"]`).checked = false; }
    if (k === 'brand') { state.brands.delete(v); qs(`#f-brand input[value="${v}"]`).checked = false; }
    if (k === 'min') { state.min = ''; qs('#f-min').value = ''; }
    if (k === 'max') { state.max = ''; qs('#f-max').value = ''; }
    render();
  });

  render();
  hydrateIcons();
})();
