/* =====================================================
   js/cart.js — Giỏ hàng (localStorage, sidebar, badge)
   Dùng chung cho toàn bộ website
   ===================================================== */

const CART_KEY = 'bs_cart';

/* ── Đọc / ghi localStorage ─────────────────────── */
function cartGet()          { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function cartSave(items)    { localStorage.setItem(CART_KEY, JSON.stringify(items)); }

/* ── Thêm sách vào giỏ ──────────────────────────── */
function cartAdd(bookId, qty = 1) {
  const book = BOOKS.find(b => b.id === bookId);
  if (!book) return;
  const items = cartGet();
  const idx = items.findIndex(i => i.id === bookId);
  if (idx >= 0) items[idx].qty += qty;
  else items.push({ ...book, qty });
  cartSave(items);
  cartUpdateUI();
  showToast(`✓ Đã thêm "${book.title}" vào giỏ!`);
}

/* ── Xóa sách khỏi giỏ ─────────────────────────── */
function cartRemove(bookId) {
  const items = cartGet().filter(i => i.id !== bookId);
  cartSave(items);
  cartUpdateUI();
  cartRenderSidebar();
  cartRenderPage();
  showToast('🗑 Đã xóa khỏi giỏ hàng');
}

/* ── Đổi số lượng ───────────────────────────────── */
function cartChangeQty(bookId, delta) {
  const items = cartGet();
  const idx = items.findIndex(i => i.id === bookId);
  if (idx < 0) return;
  items[idx].qty += delta;
  if (items[idx].qty <= 0) items.splice(idx, 1);
  cartSave(items);
  cartUpdateUI();
  cartRenderSidebar();
  cartRenderPage();
}

/* ── Xóa toàn bộ giỏ ───────────────────────────── */
function cartClear() {
  cartSave([]);
  cartUpdateUI();
  cartRenderSidebar();
  cartRenderPage();
}

/* ── Tổng số lượng ──────────────────────────────── */
function cartTotalQty() {
  return cartGet().reduce((s, i) => s + i.qty, 0);
}

/* ── Tổng tiền ──────────────────────────────────── */
function cartTotalPrice() {
  return cartGet().reduce((s, i) => s + i.price * i.qty, 0);
}

/* ── Cập nhật badge & sidebar ───────────────────── */
function cartUpdateUI() {
  const qty   = cartTotalQty();
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = qty;
    badge.style.display = qty > 0 ? 'flex' : 'none';
  }
}

/* ── Render sidebar (tất cả trang) ──────────────── */
function cartRenderSidebar() {
  const body = document.getElementById('cartBody');
  if (!body) return;
  const items = cartGet();

  if (!items.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="ei">🛒</div>
        <p><strong>Giỏ hàng trống</strong></p>
        <p>Hãy thêm sách vào giỏ nhé!</p>
      </div>`;
    const total = document.getElementById('cartTotal');
    if (total) total.textContent = '0₫';
    return;
  }

  body.innerHTML = items.map(b => `
    <div class="cart-item">
      <div class="cart-item-img" style="background:${b.bg}">${b.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-title">${b.title}</div>
        <div class="cart-item-author">${b.author}</div>
        <div class="cart-item-price">${formatPrice(b.price * b.qty)}</div>
        <div class="qty-wrap">
          <button class="qty-btn" onclick="cartChangeQty(${b.id}, -1)">−</button>
          <span class="qty-num">${b.qty}</span>
          <button class="qty-btn" onclick="cartChangeQty(${b.id}, 1)">+</button>
          <button class="remove-item" onclick="cartRemove(${b.id})">🗑 Xóa</button>
        </div>
      </div>
    </div>`).join('');

  const total = document.getElementById('cartTotal');
  if (total) total.textContent = formatPrice(cartTotalPrice());
}

/* ── Render trang cart.html ─────────────────────── */
function cartRenderPage() {
  const tbody = document.getElementById('cartPageBody');
  if (!tbody) return;
  const items = cartGet();

  if (!items.length) {
    tbody.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;color:var(--text3)">
        <div style="font-size:3rem;margin-bottom:1rem">🛒</div>
        <p style="font-size:1.1rem;font-weight:600;margin-bottom:.5rem">Giỏ hàng trống</p>
        <p style="font-size:.875rem">Hãy thêm sách vào giỏ nhé!</p>
        <a href="index.html" class="btn-primary" style="margin-top:1.5rem;display:inline-flex">
          📚 Tiếp tục mua sắm
        </a>
      </div>`;
    updateSummary(0, 0);
    return;
  }

  tbody.innerHTML = items.map(b => `
    <div class="cart-row" id="row-${b.id}">
      <div class="cart-row-book">
        <div class="cart-row-img" style="background:${b.bg}">${b.emoji}</div>
        <div>
          <div class="cart-row-title">${b.title}</div>
          <div class="cart-row-author">${b.author}</div>
        </div>
      </div>
      <div class="cart-row-price">${formatPrice(b.price)}</div>
      <div class="qty-wrap cart-row-qty">
        <button class="qty-btn" onclick="cartChangeQty(${b.id}, -1)">−</button>
        <span class="qty-num">${b.qty}</span>
        <button class="qty-btn" onclick="cartChangeQty(${b.id}, 1)">+</button>
      </div>
      <div class="cart-row-total">${formatPrice(b.price * b.qty)}</div>
      <button class="cart-delete-btn" onclick="cartRemove(${b.id})">🗑</button>
    </div>`).join('');

  const sub      = cartTotalPrice();
  const shipping = sub >= 199000 ? 0 : 30000;
  updateSummary(sub, shipping);
}

function updateSummary(sub, shipping) {
  const el = id => document.getElementById(id);
  if (el('summarySubtotal')) el('summarySubtotal').textContent = formatPrice(sub);
  if (el('summaryShipping')) el('summaryShipping').textContent = shipping === 0 ? 'Miễn phí' : formatPrice(shipping);
  if (el('summaryTotal'))    el('summaryTotal').textContent    = formatPrice(sub + shipping);
}

/* ── Mở / đóng sidebar ──────────────────────────── */
function openCart() {
  cartRenderSidebar();
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('overlay')?.classList.add('open');
}
function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('open');
}

/* ── Checkout ───────────────────────────────────── */
function checkout() {
  if (!cartTotalQty()) {
    showToast('⚠ Giỏ hàng đang trống!');
    return;
  }
  closeCart();
  cartClear();
  showToast('🎉 Đặt hàng thành công! Cảm ơn bạn.');
}

/* ── Khởi tạo khi DOM ready ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  cartUpdateUI();
  cartRenderSidebar();
  cartRenderPage();

  /* Overlay click đóng sidebar */
  document.getElementById('overlay')?.addEventListener('click', closeCart);
});