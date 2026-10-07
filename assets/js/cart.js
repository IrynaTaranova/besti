/* BESTI — кошик (localStorage) */
(function () {
  const KEY = 'besti_cart_v1';
  const listeners = new Set();

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return memory; }
  }
  let memory = [];
  function write(items) {
    memory = items;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* приватний режим */ }
    listeners.forEach((fn) => fn(items));
  }

  const Cart = {
    items: () => read(),
    count: () => read().reduce((s, i) => s + i.qty, 0),
    product: (id) => window.BESTI_DATA.PRODUCTS.find((p) => p.id === id),
    lines() {
      return read().map((i) => ({ ...i, product: Cart.product(i.id) })).filter((l) => l.product);
    },
    total() {
      return Cart.lines().reduce((s, l) => s + l.product.price * l.qty, 0);
    },
    has: (id) => read().some((i) => i.id === id),
    add(id, qty = 1) {
      const items = read();
      const ex = items.find((i) => i.id === id);
      if (ex) ex.qty = Math.min(99, ex.qty + qty); else items.push({ id, qty });
      write(items);
    },
    set(id, qty) {
      let items = read();
      if (qty <= 0) items = items.filter((i) => i.id !== id);
      else { const ex = items.find((i) => i.id === id); if (ex) ex.qty = Math.min(99, qty); }
      write(items);
    },
    remove(id) { write(read().filter((i) => i.id !== id)); },
    clear() { write([]); },
    onChange(fn) { listeners.add(fn); }
  };

  window.addEventListener('storage', (e) => { if (e.key === KEY) listeners.forEach((fn) => fn(read())); });
  window.BestiCart = Cart;
})();
