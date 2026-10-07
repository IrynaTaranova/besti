/* BESTI — тест «Твій Skin-паспорт» */
(function () {
  const { D, Cart, icon, fmt, esc, qs, qsa, leadForm, bindLeadForm, successBlock, toast, hydrateIcons, skinName } = window.Besti;
  const root = qs('#quiz');

  // Кожна відповідь додає бали типам шкіри
  const QUESTIONS = [
    { q: 'Як почувається шкіра через 1–2 години після вмивання, якщо не наносити крем?', hint: 'Згадайте звичайний день без догляду',
      a: [['😣', 'Стягнута, хочеться швидше нанести крем', { dry: 3 }], ['😌', 'Комфортно, без особливих відчуттів', { all: 2 }], ['🌗', 'Блищить Т-зона, щоки — нормальні або сухі', { combo: 3 }], ['✨', 'Блищить усе обличчя', { oily: 3 }]] },
    { q: 'Як виглядає шкіра до обіду?', hint: 'Без макіяжу та пудри',
      a: [['🍂', 'Матова, можливе лущення', { dry: 2 }], ['💧', 'Блиск лише на лобі, носі, підборідді', { combo: 2 }], ['🪞', 'Блищить усе обличчя', { oily: 2 }], ['🌸', 'Рівна та свіжа', { all: 2 }]] },
    { q: 'Які у вас пори?', hint: 'Подивіться у дзеркало при денному світлі',
      a: [['·', 'Майже непомітні', { dry: 1, all: 1 }], ['◐', 'Помітні в Т-зоні', { combo: 2 }], ['●', 'Розширені по всьому обличчю', { oily: 2 }]] },
    { q: 'Як часто з’являються висипання?', hint: '',
      a: [['🙂', 'Рідко або ніколи', { all: 1 }], ['🌙', 'Поодинокі, перед циклом або від стресу', { combo: 1 }], ['🔴', 'Постійно є запалення, чорні цятки', { acne: 4, oily: 1 }], ['🟤', 'Залишаються плями та сліди постакне', { acne: 2 }]] },
    { q: 'Чи буває почервоніння на обличчі?', hint: '',
      a: [['🤍', 'Ні, майже ніколи', { all: 1 }], ['🌡️', 'Іноді — після вмивання чи нового засобу', { sensitive: 2 }], ['🌹', 'Постійне почервоніння щік, носа, видимі судинки', { rosacea: 4 }], ['🔥', 'Червонію від холоду, спеки, гострої їжі', { rosacea: 2, sensitive: 1 }]] },
    { q: 'Як шкіра реагує на нові засоби?', hint: '',
      a: [['🌿', 'Майже ніколи не реагує', { all: 1 }], ['🪶', 'Іноді пощипування або свербіж', { sensitive: 3 }], ['⚡', 'Часто подразнення, доводиться ретельно обирати', { sensitive: 5 }]] },
    { q: 'Що для вас зараз найважливіше?', hint: 'Оберіть головну мету догляду',
      a: [['💦', 'Зволоження та комфорт', { dry: 1 }], ['🫧', 'Чиста шкіра без висипань', { acne: 1 }], ['🕊️', 'Зменшити почервоніння й чутливість', { rosacea: 1, sensitive: 1 }], ['⏳', 'Антивіковий догляд, пружність', { all: 1 }], ['🍃', 'Мат і звужені пори', { oily: 1 }]] }
  ];

  const EXPLAIN = {
    oily: 'Сальні залози працюють активно, тому шкіра блищить, а пори розширені. Головна помилка — пересушувати її: шкіра відповідає ще більшою кількістю себуму. Потрібні м’яке очищення, кислоти та легке зволоження.',
    combo: 'Т-зона схильна до блиску, а щоки можуть бути нормальними чи сухими. Завдання догляду — баланс: очищувати без агресії, зволожувати всю шкіру й точково працювати з порами.',
    dry: 'Шкірі не вистачає ліпідів, тому вона швидко втрачає вологу, стягується та лущиться. Робимо ставку на відновлення бар’єру, гіалуронову кислоту та живильні олії.',
    sensitive: 'Захисний бар’єр шкіри ослаблений, тому вона реагує на воду, температуру та нові засоби. Обираємо мінімалістичний догляд із заспокійливими компонентами і вводимо новинки поступово.',
    acne: 'Висипання — це запалення, з яким потрібно працювати системно. Домашній догляд має знімати запалення, очищувати пори й не пересушувати шкіру. Рекомендую також очну консультацію для виключення внутрішніх причин.',
    rosacea: 'Почервоніння та судинки говорять про чутливість судин. Уникаємо скрабів, гарячої води та спирту, зміцнюємо капіляри й обов’язково користуємося SPF щодня.',
    all: 'Ваша шкіра у хорошому балансі! Основне завдання — підтримувати зволоження, захищати від сонця та антиоксидантами працювати на профілактику передчасного старіння.'
  };

  const state = { step: -1, answers: [] };

  function calc() {
    const s = { oily: 0, combo: 0, dry: 0, sensitive: 0, acne: 0, rosacea: 0, all: 0 };
    state.answers.forEach((ai, qi) => { const pts = QUESTIONS[qi].a[ai][2]; for (const k in pts) s[k] += pts[k]; });
    if (s.acne >= 4) return 'acne';
    if (s.rosacea >= 4) return 'rosacea';
    if (s.sensitive >= 5) return 'sensitive';
    return ['oily', 'combo', 'dry', 'all'].sort((a, b) => s[b] - s[a])[0];
  }

  function pick(type, cat, exclude = []) {
    const ok = (p) => p.cat === cat && !exclude.includes(p.id);
    const sort = (a, b) => b.popular - a.popular;
    return D.PRODUCTS.filter((p) => ok(p) && p.skin.includes(type)).sort(sort)[0]
      || D.PRODUCTS.filter((p) => ok(p) && p.skin.includes('all')).sort(sort)[0];
  }

  function routine(type) {
    const used = [];
    const take = (cat, label) => { const p = pick(type, cat, used); if (p) used.push(p.id); return p ? { p, label } : null; };
    const morning = [take('cleanse', 'Очищення'), take('tonic', 'Тонізування'), take('serum', 'Сироватка'), take('cream', 'Крем'), take('spf', 'Захист SPF')].filter(Boolean);
    const cleanse = morning.find((x) => x.p.cat === 'cleanse');
    const evening = [cleanse ? { p: cleanse.p, label: 'Очищення' } : null, take('serum', 'Сироватка / олія'), take('cream', 'Нічний крем')].filter(Boolean);
    if (!evening.find((x) => x.p.cat === 'serum')) { const s = morning.find((x) => x.p.cat === 'serum'); if (s) evening.splice(1, 0, { p: s.p, label: 'Сироватка' }); }
    if (!evening.find((x) => x.p.cat === 'cream')) { const c = morning.find((x) => x.p.cat === 'cream'); if (c) evening.push({ p: c.p, label: 'Крем' }); }
    const weekly = [take('mask', '1–2 рази на тиждень')].filter(Boolean);
    const all = [...new Map([...morning, ...evening, ...weekly].map((x) => [x.p.id, x.p])).values()];
    return { morning, evening, weekly, all };
  }

  /* ---------- Views ---------- */
  function intro() {
    root.innerHTML = `<div class="quiz__card">
      <div class="quiz__intro">
        <div style="display:grid;gap:20px">
          <span class="eyebrow">Безкоштовний тест · 2 хвилини</span>
          <h1 style="font-size:clamp(36px,4.6vw,56px)">Твій <em>Skin-паспорт</em></h1>
          <p class="lead">7 питань, складених лікарем-косметологом. Наприкінці — ваш тип шкіри, пояснення та готовий ритуал догляду з каталогу.</p>
          <ul>
            <li>${icon('check')} Тип шкіри та головні потреби</li>
            <li>${icon('check')} Ритуал ранок / вечір / раз на тиждень</li>
            <li>${icon('check')} Безкоштовна перевірка схеми косметологом</li>
            <li>${icon('gift')} Промокод −10% на перше замовлення</li>
          </ul>
          <div><button class="btn" id="start">Почати тест ${icon('arrow')}</button></div>
        </div>
        <div class="img tint"><img src="${D.IMAGES.quiz}" alt=""></div>
      </div>
    </div>`;
    qs('#start').addEventListener('click', () => { state.step = 0; question(); });
  }

  function question() {
    const i = state.step, Q = QUESTIONS[i];
    const sel = state.answers[i];
    root.innerHTML = `<div class="quiz__card">
      <div class="quiz__progress"><span>Питання ${i + 1} з ${QUESTIONS.length}</span><div class="progress"><span style="width:${((i + (sel != null ? 1 : 0)) / QUESTIONS.length) * 100}%"></span></div></div>
      <h2 class="quiz__q">${esc(Q.q)}</h2>
      <p class="quiz__hint">${esc(Q.hint || 'Оберіть варіант, який найбільше схожий на вашу ситуацію')}</p>
      <div class="quiz__opts" role="radiogroup">
        ${Q.a.map(([em, t], ai) => `<button class="qopt${sel === ai ? ' is-selected' : ''}" data-a="${ai}" role="radio" aria-checked="${sel === ai}"><span class="r"></span><span class="em" aria-hidden="true">${em}</span>${esc(t)}</button>`).join('')}
      </div>
      <div class="quiz__nav">
        <button class="btn btn--ghost btn--sm" id="back">${icon('arrowL')} Назад</button>
        <button class="btn btn--sm" id="next"${sel == null ? ' disabled' : ''}>${i === QUESTIONS.length - 1 ? 'Отримати результат' : 'Далі'} ${icon('arrow')}</button>
      </div>
    </div>`;
    qsa('.qopt').forEach((b) => b.addEventListener('click', () => {
      state.answers[i] = +b.dataset.a;
      qsa('.qopt').forEach((x) => { x.classList.toggle('is-selected', x === b); x.setAttribute('aria-checked', x === b); });
      qs('#next').disabled = false;
      qs('.quiz__progress .progress span').style.width = ((i + 1) / QUESTIONS.length) * 100 + '%';
      setTimeout(next, 320);
    }));
    qs('#next').addEventListener('click', next);
    qs('#back').addEventListener('click', () => { if (state.step === 0) { state.step = -1; intro(); } else { state.step--; question(); } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  let advancing = false;
  function next() {
    if (advancing || state.answers[state.step] == null) return;
    advancing = true;
    setTimeout(() => { advancing = false; }, 400);
    if (state.step < QUESTIONS.length - 1) { state.step++; question(); } else result();
  }

  function rstep(x) {
    return `<a class="rstep" href="product.html?id=${x.p.id}"><img src="${x.p.img}" alt=""><div><small>${esc(x.label)}</small><b>${esc(x.p.name)}</b><span class="p">${fmt(x.p.price)} · ${x.p.volume}</span></div></a>`;
  }

  function result() {
    const type = calc();
    const st = D.SKIN_TYPES.find((s) => s.key === type);
    const r = routine(type);
    const total = r.all.reduce((s, p) => s + p.price, 0);
    try { localStorage.setItem('besti_promo', D.SITE.promo); localStorage.setItem('besti_quiz', JSON.stringify({ type, at: Date.now() })); } catch (e) { /* ignore */ }

    root.innerHTML = `<div class="quiz__card result" id="result">
      <div class="result__head">
        <span class="eyebrow">Ваш Skin-паспорт</span>
        <span class="result__type"><span class="ic">${icon(type)}</span>${type === 'all' ? 'Нормальна, збалансована шкіра' : st.name}</span>
        <h2>${type === 'all' ? 'Шкіра в <em>балансі</em>' : `Тип: <em>${st.name.toLowerCase()}</em>`}</h2>
      </div>
      <div class="cosm-note">
        <img src="${D.COSMETOLOGIST.photo}" alt="">
        <div><b>Коментар косметолога · ${D.COSMETOLOGIST.name}</b><p>«${EXPLAIN[type]}»</p></div>
      </div>
      <div>
        <h3 style="font-size:30px;margin-bottom:16px">Ваш ритуал догляду</h3>
        <div class="routine">
          <div class="routine__col"><h3>${icon('sun')} Ранок</h3>${r.morning.map(rstep).join('')}</div>
          <div class="routine__col"><h3>${icon('moon')} Вечір</h3>${r.evening.map(rstep).join('')}
            ${r.weekly.length ? `<h3 style="margin-top:10px">${icon('spark')} Раз на тиждень</h3>${r.weekly.map(rstep).join('')}` : ''}</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between">
        <div><span class="muted" style="font-size:14px">Повний ритуал (${r.all.length} засобів)</span><div class="price" style="font-size:26px">${fmt(total)}</div></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <a class="btn btn--ghost" href="catalog.html?skin=${type}">Усі засоби для типу</a>
          <button class="btn" id="add-all">${icon('bag')} Додати ритуал у кошик</button>
        </div>
      </div>
      <div class="promo-box">
        <div><b>Подарунок за проходження тесту</b><small>−10% на перше замовлення. Промокод уже збережено в кошику.</small></div>
        <button class="promo-code" id="copy-promo">${D.SITE.promo} ${icon('copy')}</button>
      </div>
      <div style="border-top:1px solid var(--line);padding-top:28px;display:grid;gap:16px">
        <span class="eyebrow">Безкоштовно</span>
        <h3 style="font-size:32px">Отримайте Skin-паспорт у PDF <em>+ перевірку косметологом</em></h3>
        <p class="muted">Косметолог перегляне ваші відповіді, за потреби скоригує ритуал і надішле персональний Skin-паспорт у зручний месенджер.</p>
        <div id="quiz-lead">${leadForm('quiz', { submit: 'Отримати Skin-паспорт' })}</div>
      </div>
      <div style="text-align:center"><button class="link" id="restart">Пройти тест ще раз</button></div>
    </div>`;

    qs('#add-all').addEventListener('click', () => {
      r.all.forEach((p) => { if (!Cart.has(p.id)) Cart.add(p.id, 1); });
      toast(`<span>Ритуал із ${r.all.length} засобів додано в кошик</span><a href="cart.html">Кошик →</a>`);
    });
    qs('#copy-promo').addEventListener('click', () => { try { navigator.clipboard.writeText(D.SITE.promo); } catch (e) { /* ignore */ } toast('<span>Промокод скопійовано</span>'); });
    qs('#restart').addEventListener('click', () => { state.step = -1; state.answers = []; intro(); });
    bindLeadForm(qs('#quiz-lead form'), 'quiz', () => ({
      skinType: st.name,
      answers: state.answers.map((ai, qi) => `${QUESTIONS[qi].q} — ${QUESTIONS[qi].a[ai][1]}`),
      routine: r.all.map((p) => p.name)
    }), (res, data, form) => {
      form.outerHTML = successBlock(data, `Заявку прийнято! Косметолог перевірить ваш ритуал і надішле Skin-паспорт ${data.contact === 'Дзвінок' ? 'після дзвінка' : 'у ' + esc(data.contact)} протягом робочого дня.`);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  intro();
  hydrateIcons();
})();
