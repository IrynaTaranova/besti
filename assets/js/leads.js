/* =========================================================
   BESTI — заявки (замовлення, тест, консультація)
   Єдина точка інтеграції з CRM: функція submitLead.
   Щоб підключити CRM — вкажіть SITE.crmWebhook у data.js
   (або замініть тіло sendToCrm під API вашої CRM).
   ========================================================= */
(function () {
  const { SITE } = window.BESTI_DATA;
  const LOG_KEY = 'besti_leads_log';

  async function sendToCrm(lead) {
    if (!SITE.crmWebhook) return { ok: true, demo: true };
    const res = await fetch(SITE.crmWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    return { ok: res.ok };
  }

  function saveLocal(lead) {
    try {
      const log = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      log.push(lead);
      localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(-50)));
    } catch (e) { /* ignore */ }
  }

  /**
   * @param {'order'|'quiz'|'consult'} type
   * @param {object} payload — name, phone, contact, ... + items / skinType
   */
  async function submitLead(type, payload) {
    const lead = {
      type,
      createdAt: new Date().toISOString(),
      page: location.pathname.split('/').pop() || 'index.html',
      ...payload
    };
    saveLocal(lead);
    try {
      const r = await sendToCrm(lead);
      return { ok: r.ok !== false, lead };
    } catch (e) {
      // CRM недоступна — заявка все одно збережена, користувачу показуємо месенджери
      return { ok: true, lead, offline: true };
    }
  }

  function orderText(lines, extra = {}) {
    const fmt = (n) => n.toLocaleString('uk-UA') + ' грн';
    let t = 'Вітаю! Хочу оформити замовлення на сайті Besti:\n';
    lines.forEach((l, i) => {
      t += `${i + 1}. ${l.product.name} (${l.product.volume}) × ${l.qty} — ${fmt(l.product.price * l.qty)}\n`;
    });
    t += `Разом: ${fmt(lines.reduce((s, l) => s + l.product.price * l.qty, 0))}`;
    if (extra.name) t += `\nІм'я: ${extra.name}`;
    if (extra.phone) t += `\nТелефон: ${extra.phone}`;
    if (extra.promo) t += `\nПромокод: ${extra.promo}`;
    return t;
  }

  const links = {
    telegram: () => `https://t.me/${SITE.telegram}`,
    viber: () => `viber://chat?number=${encodeURIComponent(SITE.viber)}`,
    instagram: () => `https://ig.me/m/${SITE.instagram}`,
    phone: () => `tel:${SITE.phoneRaw}`
  };

  window.BestiLeads = { submitLead, orderText, links };
})();
