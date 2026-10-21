/**
 * BESTI — прийом заявок із сайту в Google Таблицю
 *
 * Як встановити:
 * 1. Відкрийте таблицю → Розширення → Apps Script.
 * 2. Видаліть весь код у файлі Code.gs і вставте цей.
 * 3. Натисніть «Розгорнути» → «Нове розгортання» → тип «Вебдодаток»:
 *      Виконувати від імені: Я
 *      Хто має доступ: Будь-хто
 * 4. Дозвольте доступ (Advanced → Go to … → Allow).
 * 5. Скопіюйте URL вебдодатка (…/exec) і вставте в assets/js/data.js → SITE.crmWebhook.
 */

const SHEET_ID = '1bLQFLtmbNksCbor_EApe66h_F66fkrA-_2ux-tOVdS0';

// Необов’язково: пошта, на яку дублювати кожну заявку (залиште '' щоб вимкнути)
const NOTIFY_EMAIL = '';

const SHEETS = {
  order: {
    name: 'Замовлення',
    headers: ['Дата', 'Статус', "Ім'я", 'Телефон', 'Зв’язок', 'Товари', 'Сума, ₴', 'Промокод', 'Місто', 'Відділення НП', 'Коментар', 'Сторінка']
  },
  quiz: {
    name: 'Тест шкіри',
    headers: ['Дата', 'Статус', "Ім'я", 'Телефон', 'Зв’язок', 'Тип шкіри', 'Ритуал', 'Відповіді', 'Сторінка']
  },
  consult: {
    name: 'Консультації',
    headers: ['Дата', 'Статус', "Ім'я", 'Телефон', 'Зв’язок', 'Тема', 'Що турбує', 'Сторінка']
  }
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const cfg = SHEETS[data.type] || SHEETS.consult;
    const sheet = getSheet_(cfg);
    const date = data.createdAt ? new Date(data.createdAt) : new Date();
    const phone = "'" + (data.phone || ''); // щоб Таблиця не перетворила номер на число

    let row;
    if (data.type === 'order') {
      const items = (data.items || []).map(function (i) {
        return i.name + ' (' + i.volume + ') × ' + i.qty + ' — ' + (i.price * i.qty) + ' ₴';
      }).join('\n');
      row = [date, 'Нове', data.name, phone, data.contact, items, data.total || '', data.promo || '', data.city || '', data.np || '', data.comment || '', data.page || ''];
    } else if (data.type === 'quiz') {
      row = [date, 'Нове', data.name, phone, data.contact, data.skinType || '', (data.routine || []).join('\n'), (data.answers || []).join('\n'), data.page || ''];
    } else {
      row = [date, 'Нове', data.name, phone, data.contact, data.topic || '', data.message || '', data.page || ''];
    }
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'Besti: нова заявка — ' + cfg.name,
        cfg.headers.map(function (h, i) { return h + ': ' + String(row[i]).replace(/^'/, ''); }).join('\n'));
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Перевірка, що вебдодаток працює: відкрийте URL …/exec у браузері
function doGet() {
  return json_({ ok: true, service: 'Besti leads' });
}

// Запустіть один раз вручну (кнопка ▶ Run), щоб створити аркуші та дати доступ
function setup() {
  Object.keys(SHEETS).forEach(function (k) { getSheet_(SHEETS[k]); });
}

function getSheet_(cfg) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(cfg.name);
  if (!sh) {
    sh = ss.insertSheet(cfg.name);
    sh.appendRow(cfg.headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, cfg.headers.length).setFontWeight('bold').setBackground('#EEE8F7');
    sh.getRange('A:A').setNumberFormat('dd.mm.yyyy hh:mm');
    sh.getRange(2, 2, 1000, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Нове', 'В роботі', 'Підтверджено', 'Відправлено', 'Скасовано'], true).build()
    );
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
