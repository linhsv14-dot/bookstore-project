/* =====================================================
   js/wishlist.js — Quản lý danh sách yêu thích
   Lưu trữ: localStorage key "bs_wishlist"
   ===================================================== */

const WISHLIST_KEY = 'bs_wishlist';

/* ── Lấy danh sách từ localStorage ─────────────────── */
function wishlistGet() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
}

/* ── Lưu vào localStorage ───────────────────────────── */
function wishlistSave(ids) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
}

/* ── Kiểm tra sách có trong wishlist không ──────────── */
function wishlistHas(bookId) {
  return wishlistGet().includes(bookId);
}

/* ── Thêm / xóa (toggle) ────────────────────────────── */
function wishlistToggle(bookId) {
  const ids = wishlistGet();
  const idx = ids.indexOf(bookId);
  if (idx === -1) {
    ids.push(bookId);
    wishlistSave(ids);
    showToast('❤️ Đã thêm vào yêu thích!');
  } else {
    ids.splice(idx, 1);
    wishlistSave(ids);
    showToast('💔 Đã xóa khỏi yêu thích');
  }
  /* Cập nhật tất cả nút wishlist đang hiển thị trên trang */
  wishlistSyncAllBtns(bookId);
  return idx === -1; /* true = đã thêm, false = đã xóa */
}

/* ── Đồng bộ trạng thái nút trên toàn trang ─────────── */
function wishlistSyncAllBtns(bookId) {
  const wished = wishlistHas(bookId);
  document.querySelectorAll(`[data-wish-id="${bookId}"]`).forEach(btn => {
    btn.classList.toggle('wished', wished);
    btn.title = wished ? 'Bỏ yêu thích' : 'Thêm vào yêu thích';
    btn.innerHTML = wished ? '❤️' : '🤍';
  });
}

/* ── Đồng bộ tất cả nút khi trang load ──────────────── */
function wishlistSyncAll() {
  const ids = wishlistGet();
  document.querySelectorAll('[data-wish-id]').forEach(btn => {
    const id = parseInt(btn.dataset.wishId, 10);
    const wished = ids.includes(id);
    btn.classList.toggle('wished', wished);
    btn.title = wished ? 'Bỏ yêu thích' : 'Thêm vào yêu thích';
    btn.innerHTML = wished ? '❤️' : '🤍';
  });
}

/* ── Render trang wishlist trong profile ─────────────── */
function wishlistRenderProfile() {
  const container = document.getElementById('wishlistGrid');
  if (!container) return;

  const ids = wishlistGet();
  if (!ids.length) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;color:var(--text3)">
        <div style="font-size:2.5rem;margin-bottom:.75rem">🤍</div>
        <div style="font-size:.95rem;font-weight:500">Chưa có sách yêu thích nào</div>
        <a href="books.html" style="color:var(--blue);font-size:.875rem;margin-top:.5rem;display:inline-block">
          Khám phá sách ngay →
        </a>
      </div>`;
    return;
  }

  const books = ids.map(id => BOOKS.find(b => b.id === id)).filter(Boolean);
  container.innerHTML = books.map(b => `
    <div class="wishlist-card" data-book-id="${b.id}">
      <button class="wishlist-remove-btn" onclick="wishlistRemoveFromProfile(${b.id})" title="Xóa khỏi yêu thích">✕</button>
      <a href="detail.html?id=${b.id}">
        <div class="wishlist-card-img" style="background:${b.bg}">${b.emoji}</div>
      </a>
      <div class="wishlist-card-body">
        <a href="detail.html?id=${b.id}" class="wishlist-card-title">${b.title}</a>
        <div class="wishlist-card-author">${b.author}</div>
        <div class="wishlist-card-price">
          ${b.orig ? `<span class="price-sale">${formatPrice(b.price)}</span><span class="price-orig-small">${formatPrice(b.orig)}</span>` : `<span class="price-sale">${formatPrice(b.price)}</span>`}
        </div>
        <button class="btn-add-wish" onclick="cartAdd(${b.id}); showToast('🛒 Đã thêm vào giỏ!')">
          🛒 Thêm vào giỏ
        </button>
      </div>
    </div>`).join('');
}

/* ── Xóa khỏi wishlist và re-render profile ─────────── */
function wishlistRemoveFromProfile(bookId) {
  const ids = wishlistGet().filter(id => id !== bookId);
  wishlistSave(ids);
  showToast('💔 Đã xóa khỏi yêu thích');
  wishlistRenderProfile();
  /* Cập nhật badge đếm số lượng nếu có */
  wishlistUpdateBadge();
}

/* ── Cập nhật badge số lượng wishlist ───────────────── */
function wishlistUpdateBadge() {
  const badge = document.getElementById('wishlistBadge');
  if (badge) {
    const count = wishlistGet().length;
    badge.textContent = count;
    badge.style.display = count ? 'inline-flex' : 'none';
  }
}

/* ── Toggle từ trang detail (nút ❤️ trên detail.html) ── */
function toggleWishlistDetail() {
  if (!_currentBook) return;
  const bookId = _currentBook.id;
  wishlistToggle(bookId);
  wishlistUpdateBadge();

  /* Cập nhật nút wishlist trên trang detail */
  const btn = document.getElementById('detailWishBtn');
  if (btn) {
    const wished = wishlistHas(bookId);
    btn.innerHTML = wished ? '❤️' : '🤍';
    btn.style.borderColor = wished ? 'var(--orange)' : 'var(--border)';
    btn.style.background  = wished ? '#fff5f0' : '#fff';
    btn.title = wished ? 'Bỏ yêu thích' : 'Thêm vào yêu thích';
  }
}

/* ── Khởi tạo trạng thái nút wishlist trên detail.html ─ */
function wishlistInitDetailBtn() {
  if (!_currentBook) return;
  const btn = document.getElementById('detailWishBtn');
  if (!btn) return;
  const wished = wishlistHas(_currentBook.id);
  btn.innerHTML = wished ? '❤️' : '🤍';
  btn.style.borderColor = wished ? 'var(--orange)' : 'var(--border)';
  btn.style.background  = wished ? '#fff5f0' : '#fff';
  btn.title = wished ? 'Bỏ yêu thích' : 'Thêm vào yêu thích';
}

/* ── Tự động gọi khi DOM sẵn sàng ──────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  wishlistSyncAll();
  wishlistUpdateBadge();
});