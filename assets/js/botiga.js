/* ============================================================
   BOTIGA · localStorage cart + Netlify order form
   No backend / no DB. Cart lives in localStorage and is
   serialized into a single hidden field before native submit.
   Loaded AFTER i18n.js, so it reuses global `currentLang`,
   `TRANSLATIONS` and `setLang`.
   ============================================================ */
(function () {
  'use strict';

  /* ---- Config ---- */
  var PRERESERVA_ACTIVE = true;               // toggle the pre-reservation campaign
  var PRERESERVA_DEPOSIT = 5;                 // deposit (€) for the shirt
  var BIZUM_NUMBER = '614 936 429';
  var STORAGE_KEY = 'jab-cart';

  var PRODUCTS = {
    camiseta: { id: 'camiseta', price: 25, sizes: ['S', 'M', 'L', 'XL', 'XXL'], nameKey: 'botiga.prod.camiseta.name' },
    clauer:   { id: 'clauer',   price: 5,  sizes: null,                          nameKey: 'botiga.prod.clauer.name' }
  };

  /* ---- i18n helper ---- */
  function t(key) {
    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'ca';
    var val = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang] && TRANSLATIONS[lang][key]);
    if (!val && typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS.ca) val = TRANSLATIONS.ca[key];
    return val || key;
  }

  /* ---- Cart persistence ---- */
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveCart(cart) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }

  function lineKey(productId, size, type) {
    return [type || 'buy', productId, size || ''].join('|');
  }

  function addToCart(productId, size, qty, type) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var cart = loadCart();
    var isPre = type === 'prereserva';
    var price = isPre ? PRERESERVA_DEPOSIT : PRODUCTS[productId].price;
    var key = lineKey(productId, size, type);
    var existing = cart.filter(function (l) { return l.key === key; })[0];
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ key: key, productId: productId, size: size || '', qty: qty, price: price, type: isPre ? 'prereserva' : 'buy' });
    }
    saveCart(cart);
    renderCart();
    openCart();
  }

  function changeLineQty(key, delta) {
    var cart = loadCart();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].key === key) {
        cart[i].qty += delta;
        if (cart[i].qty <= 0) { cart.splice(i, 1); }
        break;
      }
    }
    saveCart(cart);
    renderCart();
  }

  function removeLine(key) {
    saveCart(loadCart().filter(function (l) { return l.key !== key; }));
    renderCart();
  }

  function cartCount() { return loadCart().reduce(function (n, l) { return n + l.qty; }, 0); }
  function cartTotal() { return loadCart().reduce(function (s, l) { return s + l.price * l.qty; }, 0); }

  function lineName(line) {
    var base = t(PRODUCTS[line.productId].nameKey);
    if (line.type === 'prereserva') base = t('botiga.prereserva.name');
    return base;
  }

  /* ---- Rendering ---- */
  function renderCart() {
    var cart = loadCart();
    var count = cartCount();
    var total = cartTotal();

    // FAB
    var fab = document.getElementById('cart-fab');
    if (fab) {
      fab.classList.toggle('show', count > 0);
      var c = fab.querySelector('.cart-count');
      if (c) c.textContent = count;
    }

    // Drawer lines
    var body = document.getElementById('cart-lines');
    if (body) {
      if (!cart.length) {
        body.innerHTML = '<div class="cart-empty" data-i18n="botiga.cart.empty">' + t('botiga.cart.empty') + '</div>';
      } else {
        body.innerHTML = cart.map(function (l) {
          var meta = [];
          if (l.size) meta.push(t('botiga.cart.size') + ' ' + l.size);
          if (l.type === 'prereserva') meta.unshift(t('botiga.prereserva.tag'));
          return '' +
            '<div class="cart-line">' +
              '<div class="cart-line-info">' +
                '<div class="cart-line-name">' + lineName(l) + '</div>' +
                (meta.length ? '<div class="cart-line-meta">' + meta.join(' · ') + '</div>' : '') +
                '<div class="cart-line-bottom">' +
                  '<div class="qty-stepper">' +
                    '<button type="button" onclick="JABotiga.dec(\'' + l.key + '\')">−</button>' +
                    '<span class="qty-val">' + l.qty + '</span>' +
                    '<button type="button" onclick="JABotiga.inc(\'' + l.key + '\')">+</button>' +
                  '</div>' +
                  '<span class="cart-line-price">' + (l.price * l.qty) + '€</span>' +
                '</div>' +
                '<button type="button" class="cart-line-remove" onclick="JABotiga.remove(\'' + l.key + '\')">' + t('botiga.cart.remove') + '</button>' +
              '</div>' +
            '</div>';
        }).join('');
      }
    }

    // Totals
    var totalEl = document.getElementById('cart-total-val');
    if (totalEl) totalEl.textContent = total + '€';
    var checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) checkoutBtn.disabled = count === 0;

    renderCheckoutSummary();
  }

  function renderCheckoutSummary() {
    var wrap = document.getElementById('checkout-summary');
    if (!wrap) return;
    var cart = loadCart();
    var rows = cart.map(function (l) {
      var label = lineName(l) + (l.size ? ' · ' + t('botiga.cart.size') + ' ' + l.size : '') + ' ×' + l.qty;
      return '<div class="cs-line"><span>' + label + '</span><span>' + (l.price * l.qty) + '€</span></div>';
    }).join('');
    rows += '<div class="cs-line cs-total"><span>' + t('botiga.checkout.total') + '</span><span class="cs-amount">' + cartTotal() + '€</span></div>';
    wrap.innerHTML = rows;
    updateDeliveryVisibility();
  }

  /* ---- Delivery block only matters when there's something to ship/pick up now.
     A cart with only pre-reservation deposits ships nothing yet, so hide it. ---- */
  function cartHasBuy() {
    return loadCart().some(function (l) { return l.type !== 'prereserva'; });
  }
  function updateDeliveryVisibility() {
    var group = document.getElementById('delivery-group');
    var addr = document.getElementById('shipping-address-group');
    var addrInput = document.getElementById('shipping-address');
    var hasBuy = cartHasBuy();
    if (group) group.style.display = hasBuy ? '' : 'none';
    if (hasBuy) {
      onDeliveryChange();
    } else {
      var rec = document.querySelector('input[name="entrega"][value="recollida"]');
      if (rec) rec.checked = true;
      if (addr) addr.style.display = 'none';
      if (addrInput) addrInput.required = false;
    }
  }

  /* ---- Order number ---- */
  function pad(n, len) { n = String(n); while (n.length < len) n = '0' + n; return n; }
  function genOrderNumber() {
    var d = new Date();
    var ymd = '' + d.getFullYear() + pad(d.getMonth() + 1, 2) + pad(d.getDate(), 2);
    var rnd = pad(Math.floor(Math.random() * 10000), 4);
    var hasPre = loadCart().some(function (l) { return l.type === 'prereserva'; });
    return (hasPre ? 'JAB-PRE-' : 'JAB-') + ymd + '-' + rnd;
  }

  /* ---- Serialize cart for the email ---- */
  function serializeCart() {
    return loadCart().map(function (l) {
      var parts = [lineName(l)];
      if (l.type === 'prereserva') parts.unshift('[PRE-RESERVA]');
      if (l.size) parts.push('Talla ' + l.size);
      parts.push('x' + l.qty);
      parts.push('= ' + (l.price * l.qty) + '€');
      return parts.join(' · ');
    }).join('\n');
  }

  /* ---- Drawer open/close ---- */
  function openCart() {
    var d = document.getElementById('cart-drawer'), o = document.getElementById('cart-overlay');
    if (d) d.classList.add('open');
    if (o) o.classList.add('open');
  }
  function closeCart() {
    var d = document.getElementById('cart-drawer'), o = document.getElementById('cart-overlay');
    if (d) d.classList.remove('open');
    if (o) o.classList.remove('open');
  }

  /* ---- Product card interactions ---- */
  function swapImage(btn) {
    var card = btn.closest('.product-card');
    var main = card.querySelector('.product-media img');
    var thumbImg = btn.querySelector('img');
    if (main && thumbImg) main.src = thumbImg.src;
    card.querySelectorAll('.product-thumb').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
  }
  function zoom(mediaEl) {
    var card = mediaEl.closest('.product-card');
    var photos = [];
    var startIdx = 0;
    var thumbs = card.querySelectorAll('.product-thumb');
    if (thumbs.length) {
      thumbs.forEach(function (b, i) {
        var im = b.querySelector('img');
        if (im) photos.push({ src: im.src, alt: im.alt });
        if (b.classList.contains('active')) startIdx = i;
      });
    } else {
      var main = mediaEl.querySelector('img');
      if (main) photos.push({ src: main.src, alt: main.alt });
    }
    if (window.JABLightbox && photos.length) window.JABLightbox.open(photos, startIdx);
  }
  function selectSize(btn) {
    var card = btn.closest('.product-card');
    card.querySelectorAll('.size-btn').forEach(function (b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    card.dataset.size = btn.dataset.size;
  }
  function stepQty(btn, delta) {
    var card = btn.closest('.product-card');
    var q = Math.max(1, (parseInt(card.dataset.qty, 10) || 1) + delta);
    card.dataset.qty = q;
    card.querySelector('.qty-val').textContent = q;
  }
  function addFromCard(btn, type) {
    var card = btn.closest('.product-card');
    var productId = card.dataset.product;
    var needsSize = !!PRODUCTS[productId].sizes;
    var size = card.dataset.size || '';
    if (needsSize && !size) {
      var sr = card.querySelector('.size-row');
      if (sr) { sr.style.outline = '2px solid #ef4444'; sr.style.outlineOffset = '6px'; sr.style.borderRadius = '8px'; setTimeout(function () { sr.style.outline = ''; }, 1500); }
      var msg = card.querySelector('.size-error');
      if (msg) msg.style.display = 'block';
      return;
    }
    addToCart(productId, size, card.dataset.qty || 1, type);
  }

  /* ---- Checkout: go from drawer to order form ---- */
  function goToCheckout() {
    if (!cartCount()) return;
    closeCart();
    var el = document.getElementById('checkout');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---- Delivery mode toggle ---- */
  function onDeliveryChange() {
    var form = document.getElementById('form-botiga');
    if (!form) return;
    var selected = form.querySelector('input[name="entrega"]:checked');
    form.querySelectorAll('.delivery-opt').forEach(function (o) { o.classList.remove('selected'); });
    var addr = document.getElementById('shipping-address-group');
    var addrInput = document.getElementById('shipping-address');
    if (selected) {
      selected.closest('.delivery-opt').classList.add('selected');
      var ship = selected.value === 'enviament';
      if (addr) addr.style.display = ship ? '' : 'none';
      if (addrInput) addrInput.required = ship;
    }
  }

  /* ---- Form submit (native, so Netlify reCAPTCHA works) ---- */
  function onSubmit(e) {
    var form = e.target;

    if (!cartCount()) {
      e.preventDefault();
      alert(t('botiga.cart.empty'));
      return;
    }

    // Basic required validation
    var valid = true, firstInvalid = null;
    form.querySelectorAll('[required]').forEach(function (el) {
      el.style.borderColor = '';
      var bad = (el.type === 'checkbox') ? !el.checked : !el.value.trim();
      if (bad) { el.style.borderColor = '#ef4444'; valid = false; if (!firstInvalid) firstInvalid = el; }
    });
    if (!valid) {
      e.preventDefault();
      if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Fill hidden fields
    var orderNum = genOrderNumber();
    form.querySelector('[name="order-number"]').value = orderNum;
    form.querySelector('[name="comanda"]').value = serializeCart();
    form.querySelector('[name="total"]').value = cartTotal() + '€';

    // Pass order number in the redirect URL so we can show it after reload
    form.setAttribute('action', '/?comanda=1&num=' + encodeURIComponent(orderNum) + '#merch');
    // Native submit proceeds → Netlify handles reCAPTCHA + email
  }

  /* ---- On load: show success after Netlify redirect ---- */
  function handleSuccessRedirect() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('comanda') === '1') {
      localStorage.removeItem(STORAGE_KEY);   // clear cart
      var num = params.get('num') || '';
      var checkout = document.getElementById('checkout');
      var success = document.getElementById('botiga-success');
      var catalog = document.getElementById('botiga-catalog');
      if (checkout) checkout.style.display = 'none';
      if (catalog) catalog.style.display = 'none';
      if (success) {
        var pill = success.querySelector('.bs-num .order-num-pill');
        if (pill) pill.textContent = num;
        success.style.display = 'block';
      }
      if (typeof showSection === 'function') showSection('merch');
    }
  }

  /* ---- Init ---- */
  function init() {
    renderCart();
    handleSuccessRedirect();
    // Toggle the pre-reservation campaign UI.
    // While the campaign is active we ONLY allow pre-reserving the shirt:
    // hide the normal "buy / add to cart" action (`.js-buy`). When it ends,
    // hide the campaign elements (`.js-prereserva`) and restore normal sale.
    if (PRERESERVA_ACTIVE) {
      document.querySelectorAll('.js-buy').forEach(function (el) { el.style.display = 'none'; });
    } else {
      document.querySelectorAll('.js-prereserva').forEach(function (el) { el.style.display = 'none'; });
    }
    var form = document.getElementById('form-botiga');
    if (form) {
      form.addEventListener('submit', onSubmit);
      form.querySelectorAll('input[name="entrega"]').forEach(function (r) { r.addEventListener('change', onDeliveryChange); });
      onDeliveryChange();
    }
    // Re-render dynamic cart text when language changes
    if (typeof window.setLang === 'function') {
      var orig = window.setLang;
      window.setLang = function (l) { orig(l); renderCart(); };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ---- Public API (for inline onclick) ---- */
  window.JABotiga = {
    swapImage: swapImage,
    zoom: zoom,
    selectSize: selectSize,
    stepQty: stepQty,
    add: addFromCard,
    inc: function (key) { changeLineQty(key, 1); },
    dec: function (key) { changeLineQty(key, -1); },
    remove: removeLine,
    open: openCart,
    close: closeCart,
    checkout: goToCheckout
  };
})();
