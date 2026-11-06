/* =====================================================
   js/home.js — Logic riêng cho trang chủ (index.html)
   ===================================================== */

/* ─────────────────────────────────────────────────────
   CAT-CARDS: Render danh mục nổi bật chuẩn giao diện mới
   ───────────────────────────────────────────────────── */
function renderHomeCategories() {
  const catGrid = document.getElementById('catGrid');
  if (!catGrid) return;

  // Lấy ra 4 danh mục nổi bật đầu tiên hiển thị ở trang chủ
  const featuredCats = CATEGORIES.slice(0, 4); 

  catGrid.innerHTML = featuredCats.map(c => `
    <div class="home-cat-card" onclick="window.location.href='books.html?cat=${encodeURIComponent(c.slug)}'" role="button" tabindex="0"
         onkeydown="if(event.key==='Enter')window.location.href='books.html?cat=${encodeURIComponent(c.slug)}'">
      <div class="home-cat-cover">
        <img src="assets/images/${c.image}" alt="${c.name}" loading="lazy"
             onerror="this.parentElement.innerHTML='<span style=font-size:3.5rem>${c.emoji}</span>'">
        <span class="home-cat-badge">${c.count} cuốn</span>
      </div>
      <div class="home-cat-body">
        <div class="home-cat-top">
          <div class="home-cat-emoji">${c.emoji || '📚'}</div>
          <div class="home-cat-name">${c.name}</div>
        </div>
        <div class="home-cat-desc">${c.desc || 'Khám phá ngay các đầu sách hay thuộc thể loại này.'}</div>
        <div class="home-cat-cta">Xem sách →</div>
      </div>
    </div>`).join('');
}

/* ─────────────────────────────────────────────────────
   HOME TAB: Preview sách nổi bật (tối đa 8 cuốn)
   ───────────────────────────────────────────────────── */
const HOME_PREVIEW_LIMIT = 8;
let _homeFilter = 'all';

function homeTab(filter, btn) {
  _homeFilter = filter;
  document.querySelectorAll('#homeTabRow .tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderHomeBooks();
}

function renderHomeBooks() {
  const grid = document.getElementById('bookGrid');
  if (!grid || typeof BOOKS === 'undefined') return;

  let list = [...BOOKS];
  if (_homeFilter !== 'all') {
    list = list.filter(b => b.tags.includes(_homeFilter));
  }

  /* Chỉ hiện tối đa HOME_PREVIEW_LIMIT cuốn */
  list = list.slice(0, HOME_PREVIEW_LIMIT);

  grid.innerHTML = list.map(b => renderBookCard(b)).join('');
}

/* ─────────────────────────────────────────────────────
   SEARCH REDIRECT từ navbar trang chủ
   ───────────────────────────────────────────────────── */
function goSearch(q) {
  const query = q || document.getElementById('searchInput')?.value?.trim();
  if (query) {
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  }
}

/* ─────────────────────────────────────────────────────
   DOM READY
   ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderHomeCategories(); // Đã sửa tên hàm cho đồng bộ ở đây
  renderHomeBooks();

  /* Gắn Enter key cho search input trên trang chủ */
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') goSearch(searchInput.value.trim());
    });
  }
});