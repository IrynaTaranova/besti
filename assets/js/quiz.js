/* BESTI — тест «Твій Skin-паспорт»
   Методика косметолога Вікторії: окремо визначаємо ТИП шкіри (нормальна, жирна, суха,
   комбінована) і її СТАН (зневоднення, чутливість, схильність до акне, судинні прояви). */
(function () {
  const { D, Cart, icon, fmt, esc, qs, qsa, leadForm, bindLeadForm, successBlock, toast, hydrateIcons, skinName } = window.Besti;
  const root = qs('#quiz');

  // a: [емодзі, текст, бали типу, стани]
  const QUESTIONS = [
    { q: 'Як відчуває себе ваша шкіра після вмивання?', hint: 'Згадайте, як шкіра почувається, поки ви ще не нанесли крем',
      a: [['😣', 'Стягується, хочеться нанести крем', { dry: 2 }],
        ['😌', 'Комфортно, без відчуттів', { normal: 2 }],
        ['✨', 'Швидко з’являється жирний блиск', { oily: 2 }],
        ['🌗', 'Є стягнутість, але водночас жирний блиск', { combo: 2 }, ['dehydrated']]] },
    { q: 'Як шкіра поводиться протягом дня?', hint: 'Без макіяжу та пудри',
      a: [['🌸', 'Залишається матовою', { normal: 2 }],
        ['💧', 'Блищить у Т-зоні (лоб, ніс, підборіддя)', { combo: 2 }],
        ['🪞', 'Блищить по всьому обличчю', { oily: 2 }],
        ['🍂', 'Стає сухою, з’являється лущення', { dry: 2 }]] },
    { q: 'Чи помічаєте ви розширені пори?', hint: 'Подивіться у дзеркало при денному світлі',
      a: [['·', 'Ні, пори практично непомітні', { normal: 1, dry: 1 }],
        ['◐', 'Так, переважно на носі та підборідді', { combo: 1 }],
        ['●', 'Так, на всьому обличчі', { oily: 1 }]] },
    { q: 'Чи є схильність до висипань?', hint: '',
      a: [['🙂', 'Ні, практично ніколи', {}],
        ['🌙', 'Періодично з’являються прищики', {}],
        ['🔴', 'Часто є комедони, запалення', {}, ['acne']],
        ['🔄', 'Висипання пов’язані з циклом або стресом', {}, ['acne']]] },
    { q: 'Як шкіра реагує на косметичні засоби?', hint: '',
      a: [['🌿', 'Добре переносить більшість засобів', {}],
        ['🌹', 'Часто виникає почервоніння', {}, ['vascular']],
        ['🔥', 'Є печіння, свербіж або подразнення', {}, ['sensitive']],
        ['⚡', 'Реагує на нові засоби', {}, ['sensitive']]] },
    { q: 'Чи є відчуття сухості або зневоднення?', hint: 'Шкіра ніби «просить води», тьмяніє, з’являються дрібні зморшки',
      a: [['💦', 'Так, часто', { dry: 1 }, ['dehydrated']],
        ['🌤️', 'Іноді', {}],
        ['🙅', 'Ні', {}]] }
  ];

  const TYPES = {
    normal: { name: 'Нормальна', catalog: 'normal',
      text: 'Секреція себуму збалансована, пори малопомітні, немає вираженої сухості чи жирності. Завдання догляду — підтримувати цей баланс: м’яке очищення, зволоження, антиоксиданти та щоденний SPF.' },
    oily: { name: 'Жирна', catalog: 'oily',
      text: 'Жирний блиск протягом дня, розширені пори, схильність до комедонів і висипань. Шкіру важливо не пересушувати: м’яке очищення, кислоти та легке зволоження, яке не забиває пори.' },
    dry: { name: 'Суха', catalog: 'dry',
      text: 'Відчуття стягнутості, можливе лущення, жирний блиск майже не з’являється. Робимо ставку на відновлення ліпідного бар’єру, глибоке зволоження й живлення.' },
    combo: { name: 'Комбінована', catalog: 'combo',
      text: 'Жирна Т-зона, нормальна або суха шкіра щік, пори помітніші в центральній частині обличчя. Догляд — про баланс: очищувати без агресії, зволожувати все обличчя й окремо працювати з Т-зоною.' }
  };

  const STATES = {
    dehydrated: { label: 'зневоднена', key: 'dry', text: 'Шкірі бракує вологи, навіть якщо вона жирна. Додайте сироватку з гіалуроновою кислотою та не пересушуйте шкіру очищенням.' },
    sensitive: { label: 'чутлива', key: 'sensitive', text: 'Захисний бар’єр ослаблений. Обирайте заспокійливі формули й вводьте нові засоби по одному.' },
    acne: { label: 'схильна до акне', key: 'acne', text: 'Є комедони чи запалення. Потрібен протизапальний догляд, а на консультації варто з’ясувати причину висипань.' },
    vascular: { label: 'з судинними проявами', key: 'rosacea', text: 'Почервоніння говорить про чутливі судини. Уникайте гарячої води, скрабів і спирту, обов’язково щодня SPF.' }
  };

  const state = { step: -1, answers: [] };

  function calc() {
    const score = { combo: 0, oily: 0, dry: 0, normal: 0 };
    const flags = new Set();
    state.answers.forEach((ai, qi) => {
      const [, , pts = {}, st = []] = QUESTIONS[qi].a[ai];
      for (const k in pts) score[k] += pts[k];
      st.forEach((s) => flags.add(s));
    });
    const type = Object.keys(score).sort((a, b) => score[b] - score[a])[0]; // при рівності — у порядку combo, oily, dry, normal
    if (type === 'dry') flags.delete('dehydrated'); // для сухої шкіри це частина типу, а не окремий стан
    return { type, states: [...flags] };
  }

  // Перший засіб категорії, що підходить під будь-який із ключів (у порядку пріоритету)
  function pick(keys, cat, exclude, strict) {
    const pool = D.PRODUCTS.filter((p) => p.cat === cat && !exclude.includes(p.id));
    const sort = (a, b) => b.popular - a.popular;
    for (const k of strict ? keys : [...keys, 'all']) {
      const hit = pool.filter((p) => p.skin.includes(k)).sort(sort)[0];
      if (hit) return hit;
    }
    return null;
  }

  function routine(type, states) {
    const T = TYPES[type].catalog;
    const has = (s) => states.includes(s);
    // при почервонінні — так само делікатно, як для чутливої шкіри (без пілінгів і кислот)
    const calm = [has('vascular') && 'rosacea', (has('sensitive') || has('vascular')) && 'sensitive'].filter(Boolean);
    const used = [];
    const take = (keys, cat, label, strict) => { const p = pick(keys, cat, used, strict); if (p) used.push(p.id); return p ? { p, label } : null; };

    const cleanse = take([...calm, T], 'cleanse', 'Очищення');
    const tonic = calm.length ? null : take([has('acne') && 'acne', T].filter(Boolean), 'tonic', 'Тонізування');
    // активну сироватку проти висипань — увечері, зранку — зволоження
    const serumPm = take([has('acne') && 'acne', ...calm, T].filter(Boolean), 'serum', 'Сироватка');
    const serumAm = take([has('dehydrated') && 'dry', ...calm, T].filter(Boolean), 'serum', 'Сироватка');
    const cream = take([...calm, T], 'cream', 'Крем');
    const spf = take([T], 'spf', 'Захист SPF');
    const night = take([...calm, T], 'cream', 'Нічний крем', true); // лише під тип, інакше — той самий крем
    const mask = take(calm.length ? [...calm, has('dehydrated') && 'dry'].filter(Boolean) : [has('acne') && 'acne', has('dehydrated') && 'dry', T].filter(Boolean), 'mask', '1–2 рази на тиждень', !!calm.length);

    const morning = [cleanse, tonic, serumAm, cream, spf].filter(Boolean);
    const evening = [cleanse && { p: cleanse.p, label: 'Очищення' }, serumPm || (serumAm && { p: serumAm.p, label: 'Сироватка' }), night || (cream && { p: cream.p, label: 'Крем' })].filter(Boolean);
    const weekly = [mask].filter(Boolean);
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
          <p class="lead">${QUESTIONS.length} питань з анкети первинної консультації косметолога. Наприкінці — тип і стан вашої шкіри, пояснення та ритуал догляду з каталогу.</p>
          <ul>
            <li>${icon('check')} Тип шкіри та її стан</li>
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
    const { type, states } = calc();
    const T = TYPES[type];
    const r = routine(type, states);
    const total = r.all.reduce((s, p) => s + p.price, 0);
    const stateLine = states.length ? states.map((s) => STATES[s].label).join(', ') : 'без виражених особливостей';
    const summary = `${T.name}; стан: ${stateLine}`;
    try { localStorage.setItem('besti_promo', D.SITE.promo); localStorage.setItem('besti_quiz', JSON.stringify({ type, states, at: Date.now() })); } catch (e) { /* ignore */ }

    root.innerHTML = `<div class="quiz__card result" id="result">
      <div class="result__head">
        <span class="eyebrow">Ваш Skin-паспорт</span>
        <span class="result__type"><span class="ic">${icon(T.catalog)}</span>${T.name} шкіра</span>
        <h2>Тип: <em>${T.name.toLowerCase()}</em></h2>
        <p class="muted">Стан шкіри: <b style="color:var(--ink)">${stateLine}</b></p>
      </div>
      <div class="cosm-note">
        <img src="${D.COSMETOLOGIST.photo}" alt="">
        <div><b>Коментар косметолога · ${D.COSMETOLOGIST.name}</b><p>«${T.text}»</p></div>
      </div>
      ${states.length ? `<div class="routine__col" style="background:var(--brand-50);border-color:var(--brand-100)">
        <h3 style="font-size:22px">Тип і стан шкіри — різні речі</h3>
        ${states.map((s) => `<p style="font-size:15px"><b>${STATES[s].label[0].toUpperCase() + STATES[s].label.slice(1)}:</b> ${STATES[s].text}</p>`).join('')}
      </div>` : ''}
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
          <a class="btn btn--ghost" href="catalog.html?skin=${T.catalog}">Усі засоби для типу</a>
          <button class="btn" id="add-all">${icon('bag')} Додати ритуал у кошик</button>
        </div>
      </div>
      <div class="help-card">
        <div><b>Тест — це лише перший крок</b><small>Відповіді допомагають зібрати анамнез, але остаточно тип і стан шкіри визначає косметолог на огляді.</small></div>
        <button class="btn btn--ghost btn--sm" data-consult="Тест: ${esc(summary)}">${icon('doctor')} Безкоштовна консультація</button>
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
      skinType: summary,
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
