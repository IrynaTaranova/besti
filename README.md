# Besti — каталог професійної косметики

Статичний сайт (HTML/CSS/JS, без збірки). Можна залити на будь-який хостинг (Netlify, Vercel, GitHub Pages, звичайний хостинг).

## Сторінки
- `index.html` — головна (типи шкіри, популярні, тест, порада тижня, косметолог, бренди, сертифікати, FAQ)
- `catalog.html` — каталог з фільтром за типом шкіри (`?skin=oily|combo|dry|sensitive|acne|rosacea|all`), категорією, брендом, ціною
- `product.html?id=…` — картка товару
- `quiz.html` — тест «Твій Skin-паспорт» (лід-магніт)
- `cart.html` — кошик і заявка на замовлення
- `about.html` — про косметолога, сертифікати, доставка, консультація, FAQ

## Що редагувати
Усе в `assets/js/data.js`:
- `SITE` — телефон, Telegram, Viber, Instagram, промокод, **`crmWebhook`**
- `COSMETOLOGIST` — ім’я, фото, цифри
- `PRODUCTS` — товари (ціна, опис, типи шкіри, фото, коментар косметолога)
- `ADVICE` — порада тижня
- `CERTS`, `REVIEWS`, `FAQ`, `BRANDS`

Фото зараз демонстраційні (Unsplash). Покладіть свої в `assets/img/` і вкажіть шлях, напр. `img: 'assets/img/products/serum.jpg'`.

## Заявки / CRM
Усі форми (замовлення, тест, консультація) йдуть через `submitLead()` у `assets/js/leads.js`.
Вкажіть URL вебхука CRM у `SITE.crmWebhook` — заявки надсилатимуться туди POST-запитом у JSON.

## Локальний перегляд
Відкрийте `index.html` у браузері або запустіть `.claude/serve.ps1` (http://localhost:5500).
