/* =====================================================
   js/books.js — Render danh sách sách, filter, search
   Dùng cho: books.html

   KIẾN TRÚC FILTER (3 chiều độc lập, kết hợp được):
   _currentFilter : 'all' | 'bestseller' | 'new' | 'sale'   ← Tab
   _currentCat    : '' | slug string                          ← Select thể loại
   _currentSearch : '' | string                               ← Search input
   _currentSort   : 'default' | 'price-asc' | ...            ← Select sắp xếp

   KHÔNG có logic filter nào nằm trong navbar.
   ===================================================== */

let _currentFilter = 'all';
let _currentSearch = '';
let _currentCat    = '';
let _currentSort   = 'default';
let _currentPage   = 1;
const BOOKS_PER_PAGE = 8;   /* số sách mỗi trang (chỉ áp dụng cho books.html) */

/* ─────────────────────────────────────────────────────
   RENDER MỘT BOOK CARD
   ───────────────────────────────────────────────────── */
function renderBookCard(b) {
  const discount  = calcDiscount(b.orig, b.price);
  const badgeHTML = b.badge === 'sale' ? `<span class="badge badge-sale">-${discount}%</span>`
                  : b.badge === 'new'  ? `<span class="badge badge-new">Mới</span>`
                  : b.badge === 'hot'  ? `<span class="badge badge-hot">🔥 Hot</span>`
                  : '';
  const priceHTML = b.orig
    ? `<div class="price-sale">${formatPrice(b.price)}</div>
       <div class="price-orig">${formatPrice(b.orig)}</div>`
    : `<div class="price-only">${formatPrice(b.price)}</div>`;

  return `
  <div class="book-card" data-id="${b.id}">
    <div class="book-img">
      <button class="wish-btn"
              data-wish-id="${b.id}"
              onclick="event.stopPropagation(); wishlistToggle(${b.id})">
        🤍
      </button>
      ${badgeHTML}
      <img src="${b.image}" alt="${b.title}" loading="lazy">
    </div>
    <div class="book-body">
      <div class="book-cat">${b.cat}</div>
      <div class="book-title">${b.title}</div>
      <div class="book-author">${b.author}</div>
      <div class="book-stars">
        <span class="stars">${'★'.repeat(Math.round(b.rating))}</span>
        <span class="review-count">(${b.reviewCount.toLocaleString()})</span>
      </div>
      <div class="book-footer">
        <div class="price-wrap">${priceHTML}</div>
        <button class="add-btn" onclick="event.stopPropagation();cartAdd(${b.id})" title="Thêm vào giỏ">+</button>
      </div>
    </div>
    <button class="quick-add" onclick="openModal(${b.id})">👁 Xem nhanh</button>
  </div>`;
}

/* ─────────────────────────────────────────────────────
   LỌC + SẮP XẾP
   Ba chiều filter hoàn toàn độc lập, kết hợp tự do.
   ───────────────────────────────────────────────────── */
function getFilteredBooks() {
  let list = [...BOOKS];

  /* 1. Tab filter */
  if (_currentFilter !== 'all') {
    list = list.filter(b => b.tags.includes(_currentFilter));
  }

  /* 2. Thể loại */
  if (_currentCat) {
    list = list.filter(b =>
      b.catSlug === _currentCat ||
      b.cat.toLowerCase() === _currentCat.toLowerCase()
    );
  }

  /* 3. Search */
  if (_currentSearch) {
    const q = _currentSearch.toLowerCase();
    list = list.filter(b =>
      b.title.toLowerCase().includes(q)  ||
      b.author.toLowerCase().includes(q) ||
      b.cat.toLowerCase().includes(q)
    );
  }

  /* 4. Sort */
  if (_currentSort === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (_currentSort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (_currentSort === 'rating')     list.sort((a, b) => b.rating - a.rating);
  if (_currentSort === 'newest')     list.sort((a, b) => b.id - a.id);

  return list;
}

/* ─────────────────────────────────────────────────────
   RENDER GRID
   ───────────────────────────────────────────────────── */
function renderBooks(containerId = 'bookGrid') {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  const list  = getFilteredBooks();
  const count = document.getElementById('filterCount');
  if (count) count.textContent = `${list.length} cuốn sách`;

  /* Hiện/ẩn nút reset */
  const hasFilter = _currentFilter !== 'all' || _currentCat || _currentSearch;
  const resetBtn  = document.getElementById('filterReset');
  if (resetBtn) resetBtn.style.display = hasFilter ? 'inline-flex' : 'none';

  /* Phân trang: chỉ bật trên trang có filter bar (books.html) */
  const usePager = !!document.getElementById('filterBar');
  const pages    = usePager ? Math.max(1, Math.ceil(list.length / BOOKS_PER_PAGE)) : 1;
  if (_currentPage > pages) _currentPage = pages;
  const view = usePager
    ? list.slice((_currentPage - 1) * BOOKS_PER_PAGE, _currentPage * BOOKS_PER_PAGE)
    : list;
  if (usePager) renderBookPager(grid, pages);

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="ei">😔</div>
        <p>Không tìm thấy sách phù hợp${_currentSearch ? ` với "<b>${_currentSearch}</b>"` : ''}.</p>
        <button class="btn-navy" style="margin-top:1rem;display:inline-flex"
                onclick="resetAllFilters()">Xóa bộ lọc</button>
      </div>`;
    return;
  }

  grid.innerHTML = view.map(b => renderBookCard(b)).join('');
  wishlistSyncAll();
}


/* ─────────────────────────────────────────────────────
   PHÂN TRANG (client-side) cho books.html
   ───────────────────────────────────────────────────── */
function renderBookPager(grid, pages) {
  let box = document.getElementById('bookPager');
  if (!box) {
    box = document.createElement('div');
    box.id = 'bookPager';
    box.className = 'pagination';
    box.style.cssText = 'display:flex;gap:.4rem;justify-content:center;flex-wrap:wrap;margin-top:2rem';
    grid.parentNode.insertBefore(box, grid.nextSibling);
  }
  if (pages <= 1) { box.innerHTML = ''; return; }

  const btn = (label, page, disabled, active) =>
    `<button type="button" ${disabled ? 'disabled' : `onclick="goBookPage(${page})"`}
       style="min-width:38px;padding:.45rem .8rem;border-radius:8px;cursor:${disabled ? 'default' : 'pointer'};
              border:1px solid ${active ? 'var(--blue)' : 'var(--border)'};
              background:${active ? 'var(--blue)' : '#fff'};color:${active ? '#fff' : 'var(--text)'};
              opacity:${disabled ? '.45' : '1'};font-weight:600">${label}</button>`;

  let html = btn('‹', _currentPage - 1, _currentPage === 1, false);
  for (let i = 1; i <= pages; i++) html += btn(i, i, false, i === _currentPage);
  html += btn('›', _currentPage + 1, _currentPage === pages, false);
  box.innerHTML = html;
}

function goBookPage(n) {
  _currentPage = n;
  renderBooks();
  const bar = document.getElementById('filterBar');
  if (bar) window.scrollTo({ top: bar.offsetTop - 80, behavior: 'smooth' });
}

/* ─────────────────────────────────────────────────────
   CÁC HÀM ĐIỀU KHIỂN FILTER
   ───────────────────────────────────────────────────── */

/** Tab: Tất cả / Bán chạy / Sách mới / Sale */
function switchTab(filter, btn) {
  _currentFilter = filter;
  _currentPage = 1;
  document.querySelectorAll('#filterBar .tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updatePageHero();
  renderBooks();
}

/** Select thể loại (dropdown trong filter bar) */
function filterByCatSelect(slug) {
  _currentCat = slug;
  _currentPage = 1;
  updatePageHero();
  renderBooks();
}

/** Gọi từ category.html hoặc home cat-cards — nhận slug từ URL */
function filterByCatSlug(slug) {
  _currentCat = slug;
  _currentPage = 1;
  const select = document.getElementById('catFilter');
  if (select) select.value = slug;
  updatePageHero();
  renderBooks();
}

/** Search realtime từ input trong navbar */
function filterBooks(q) {
  _currentSearch = q;
  _currentPage = 1;
  renderBooks();
}

/** Sort */
function sortBooks(val) {
  _currentSort = val;
  _currentPage = 1;
  renderBooks();
}

/** Reset toàn bộ filter về trạng thái ban đầu */
function resetAllFilters() {
  _currentFilter = 'all';
  _currentCat    = '';
  _currentSearch = '';
  _currentSort   = 'default';
  _currentPage   = 1;

  /* Reset UI controls */
  document.querySelectorAll('#filterBar .tab').forEach((t, i) => {
    t.classList.toggle('active', i === 0);
  });
  const catSel  = document.getElementById('catFilter');
  const sortSel = document.getElementById('sortFilter');
  const search  = document.getElementById('searchInput');
  if (catSel)  catSel.value  = '';
  if (sortSel) sortSel.value = 'default';
  if (search)  search.value  = '';

  updatePageHero();
  renderBooks();
}

/* ─────────────────────────────────────────────────────
   CẬP NHẬT TIÊU ĐỀ TRANG (page-hero) THEO FILTER HIỆN TẠI
   Giúp user biết mình đang xem gì — chuẩn UX ecommerce
   ───────────────────────────────────────────────────── */
function updatePageHero() {
  const titleEl = document.getElementById('pageHeroTitle');
  const subEl   = document.getElementById('pageHeroSub');
  const bcEl    = document.getElementById('breadcrumbCurrent');

  const tabLabels = {
    all:        { title: 'Tất cả sách',   sub: 'Khám phá hàng nghìn đầu sách chất lượng' },
    bestseller: { title: '🔥 Sách bán chạy', sub: 'Những cuốn sách được yêu thích nhất' },
    new:        { title: '🆕 Sách mới',   sub: 'Vừa cập nhật — mới nhất tháng này' },
    sale:       { title: '💰 Đang giảm giá', sub: 'Ưu đãi hấp dẫn — mua ngay hôm nay' },
  };

  let label = tabLabels[_currentFilter] || tabLabels.all;

  /* Nếu đang lọc theo thể loại, ưu tiên hiển thị tên thể loại */
  if (_currentCat) {
    const cat = CATEGORIES.find(c => c.slug === _currentCat);
    if (cat) {
      label = { title: `${cat.emoji} ${cat.name}`, sub: cat.desc };
    }
  }

  if (titleEl) titleEl.textContent = label.title;
  if (subEl)   subEl.textContent   = label.sub;
  if (bcEl)    bcEl.textContent    = label.title;
}

/* ─────────────────────────────────────────────────────
   KHỞI TẠO SELECT THỂ LOẠI từ CATEGORIES data
   ───────────────────────────────────────────────────── */
function initCatSelect() {
  const select = document.getElementById('catFilter');
  if (!select || typeof CATEGORIES === 'undefined') return;

  select.innerHTML =
    '<option value="">Tất cả thể loại</option>' +
    CATEGORIES.map(c => `<option value="${c.slug}">${c.emoji} ${c.name}</option>`).join('');
}

/* ─────────────────────────────────────────────────────
   ĐỌC QUERY PARAMS TỪ URL
   Hỗ trợ: ?filter=bestseller | ?cat=ky-nang-song | ?q=keyword
   Kết hợp tự do, ví dụ: ?filter=sale&cat=cong-nghe
   ───────────────────────────────────────────────────── */
function initBooksFromURL() {
  const params = new URLSearchParams(window.location.search);
  const q      = params.get('q')      || '';
  const cat    = params.get('cat')    || '';
  const filter = params.get('filter') || 'all';

  if (q) {
    _currentSearch = q;
    const si = document.getElementById('searchInput');
    if (si) si.value = q;
  }

  if (cat) {
    _currentCat = cat;
    /* Sync select UI sau khi CATEGORIES load */
    const select = document.getElementById('catFilter');
    if (select) select.value = cat;
  }

  if (filter && filter !== 'all') {
    _currentFilter = filter;
  }

  /* Sync tab UI */
  document.querySelectorAll('#filterBar .tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filter === _currentFilter);
  });

  /* Sync sort UI */
  const sortSel = document.getElementById('sortFilter');
  if (sortSel) sortSel.value = _currentSort;
}

/* ─────────────────────────────────────────────────────
   DOM READY
   ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCatSelect();      /* 1. Điền options vào select thể loại */
  initBooksFromURL();   /* 2. Đọc URL params và sync UI        */
  updatePageHero();     /* 3. Cập nhật tiêu đề trang           */
  renderBooks();        /* 4. Render grid                      */
});