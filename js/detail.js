/* =====================================================
   js/detail.js — Trang chi tiết sách (pages/detail.html)
   ===================================================== */

let _detailQty = 1;
let _currentBook = null;

/* ── Lấy id từ URL ──────────────────────────────── */
function getBookIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'), 10);
}

/* ── Render toàn bộ trang chi tiết ─────────────── */
function renderDetail() {
  const id = getBookIdFromURL();
  const b  = BOOKS.find(x => x.id === id);

  if (!b) {
    document.body.innerHTML = `
      <div style="text-align:center;padding:6rem 2rem">
        <div style="font-size:3rem;margin-bottom:1rem">📚</div>
        <h2>Không tìm thấy sách</h2>
        <a href="index.html" style="color:#2563eb;margin-top:1rem;display:inline-block">← Về trang chủ</a>
      </div>`;
    return;
  }

  _currentBook = b;
  const discount = calcDiscount(b.orig, b.price);

  /* ── Breadcrumb ── */
  const bc = document.getElementById('breadcrumb');
  if (bc) bc.innerHTML = `
    <a href="index.html">Trang chủ</a>
    <span class="sep">›</span>
    <a href="books.html">Sách</a>
    <span class="sep">›</span>
    <a href="category.html?cat=${b.catSlug}">${b.cat}</a>
    <span class="sep">›</span>
    <span class="current">${b.title}</span>`;

  /* ── Page title ── */
  document.title = `${b.title} — BookStore`;

  /* ── Hình ảnh ── */
  const img = document.getElementById('detailImg');
  if (img) { img.style.background = b.bg; img.textContent = b.emoji; }

  /* ── Category ── */
  set('detailCat',    b.cat);

  /* ── Title ── */
  set('detailTitle',  b.title);

  /* ── Author ── */
  set('detailAuthor', `<span style="color:var(--text2)">Tác giả:</span> <strong>${b.author}</strong>`);

  /* ── Rating ── */
  const stars = '★'.repeat(Math.round(b.rating)) + '☆'.repeat(5 - Math.round(b.rating));
  set('detailRating', `
    <span style="color:#fbbf24;font-size:1.1rem">${stars}</span>
    <strong style="margin-left:.35rem">${b.rating}</strong>
    <span style="color:var(--text3);font-size:.875rem;margin-left:.25rem">(${b.reviewCount.toLocaleString()} đánh giá)</span>
    <span style="color:var(--text3);font-size:.875rem;margin-left:.75rem">|</span>
    <span style="color:var(--text3);font-size:.875rem;margin-left:.75rem">Còn ${b.stock} cuốn</span>`);

  /* ── Price ── */
  const priceHTML = b.orig
    ? `<span class="detail-price">${formatPrice(b.price)}</span>
       <span class="detail-orig">${formatPrice(b.orig)}</span>
       <span class="detail-discount">-${discount}%</span>`
    : `<span class="detail-price">${formatPrice(b.price)}</span>`;
  set('detailPrice', priceHTML);

  /* ── Meta info ── */
  set('detailMeta', `
    <div class="detail-meta-item">
      <div class="label">Nhà xuất bản</div>
      <div class="val">${b.publisher}</div>
    </div>
    <div class="detail-meta-item">
      <div class="label">Năm xuất bản</div>
      <div class="val">${b.year}</div>
    </div>
    <div class="detail-meta-item">
      <div class="label">Số trang</div>
      <div class="val">${b.pages} trang</div>
    </div>
    <div class="detail-meta-item">
      <div class="label">Ngôn ngữ</div>
      <div class="val">${b.lang}</div>
    </div>`);

  /* ── Description ── */
  set('detailDesc', b.desc);
  const fullDesc = document.getElementById('detailDescFull');

if (fullDesc) {
  fullDesc.innerHTML = b.desc;
}

  /* ── Qty display ── */
  updateQtyDisplay();

  /* ── Reviews + wishlist ── */
reviewsRender(b.id);
reviewsInitForm(b.id);
wishlistInitDetailBtn();

  /* ── Related books ── */
  renderRelated(b);
}

/* ── Helper set innerHTML ───────────────────────── */
function set(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

/* ── Qty controls ───────────────────────────────── */
function detailChangeQty(delta) {
  _detailQty = Math.max(1, Math.min(_detailQty + delta, _currentBook?.stock || 99));
  updateQtyDisplay();
}

function updateQtyDisplay() {
  const el = document.getElementById('detailQty');
  if (el) el.textContent = _detailQty;
}

function detailAddToCart() {
  if (!_currentBook) return;
  cartAdd(_currentBook.id, _detailQty);
  openCart();
}



/* ── Render sách liên quan ──────────────────────── */
function renderRelated(b) {
  const el = document.getElementById('relatedGrid');
  if (!el) return;

  const related = BOOKS
    .filter(x => x.id !== b.id && (x.cat === b.cat || x.catSlug === b.catSlug))
    .slice(0, 4);

  if (!related.length) {
    /* Nếu không có cùng danh mục thì lấy random */
    const random = BOOKS.filter(x => x.id !== b.id).slice(0, 4);
    el.innerHTML = random.map(x => renderBookCard(x)).join('');
    return;
  }

  el.innerHTML = related.map(x => renderBookCard(x)).join('');
}

/* ── Init khi DOM ready ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderDetail();
});