/* =====================================================
   js/reviews.js — Hệ thống đánh giá & bình luận sách
   Lưu trữ: localStorage key "bs_reviews_{bookId}"
   ===================================================== */

const REVIEWS_PREFIX = 'bs_reviews_';

/* ── Lấy reviews của 1 cuốn sách ─────────────────────── */
function reviewsGet(bookId) {
  const raw = localStorage.getItem(REVIEWS_PREFIX + bookId);
  return raw ? JSON.parse(raw) : null; /* null = chưa có data local → dùng data mặc định */
}

/* ── Lưu reviews ─────────────────────────────────────── */
function reviewsSave(bookId, reviews) {
  localStorage.setItem(REVIEWS_PREFIX + bookId, JSON.stringify(reviews));
}

/* ── Thêm 1 review mới ───────────────────────────────── */
function reviewsAdd(bookId, review) {
  const book = BOOKS.find(b => b.id === bookId);
  /* Nếu chưa có trong localStorage, seed từ data.js */
  let list = reviewsGet(bookId);
  if (!list) list = book?.reviews ? [...book.reviews] : [];
  list.unshift(review); /* mới nhất lên đầu */
  reviewsSave(bookId, list);
  return list;
}

/* ── Tính rating trung bình ──────────────────────────── */
function reviewsAvgRating(bookId) {
  const book = BOOKS.find(b => b.id === bookId);
  let list = reviewsGet(bookId);
  if (!list) list = book?.reviews || [];
  if (!list.length) return book?.rating || 0;
  const sum = list.reduce((acc, r) => acc + r.stars, 0);
  return Math.round((sum / list.length) * 10) / 10;
}

/* ── Render toàn bộ phần đánh giá ───────────────────── */
function reviewsRender(bookId) {
  const book = BOOKS.find(b => b.id === bookId);
  if (!book) return;

  let list = reviewsGet(bookId);
  if (!list) list = book.reviews ? [...book.reviews] : [];

  /* Tổng hợp thống kê */
  const total   = list.length;
  const avg     = total ? Math.round(list.reduce((a, r) => a + r.stars, 0) / total * 10) / 10 : 0;
  const counts  = [5,4,3,2,1].map(s => ({ star: s, count: list.filter(r => r.stars === s).length }));

  /* Phần tóm tắt (summary bar) */
  const summaryEl = document.getElementById('reviewSummary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="rv-summary-left">
        <div class="rv-avg-num">${avg || book.rating}</div>
        <div class="rv-avg-stars">${renderStarsHTML(avg || book.rating)}</div>
        <div class="rv-avg-count">${(total || book.reviewCount || 0).toLocaleString('vi-VN')} đánh giá</div>
      </div>
      <div class="rv-summary-bars">
        ${counts.map(({ star, count }) => {
          const pct = total ? Math.round(count / total * 100) : 0;
          return `
            <div class="rv-bar-row">
              <span class="rv-bar-label">${star}★</span>
              <div class="rv-bar-track">
                <div class="rv-bar-fill rv-bar-${star}" style="width:${pct}%"></div>
              </div>
              <span class="rv-bar-pct">${pct}%</span>
            </div>`;
        }).join('')}
      </div>`;
  }

  /* Danh sách reviews */
  const listEl = document.getElementById('reviewsList');
  if (!listEl) return;

  if (!list.length) {
    listEl.innerHTML = `
      <div class="rv-empty">
        <div style="font-size:2rem;margin-bottom:.5rem">📝</div>
        <div>Chưa có đánh giá nào. Hãy là người đầu tiên nhận xét!</div>
      </div>`;
    return;
  }

  /* Render từng review */
  listEl.innerHTML = list.map((r, i) => `
    <div class="review-card" style="animation-delay:${i * 0.05}s">
      <div class="review-head">
        <div class="review-avatar">${(r.name || 'A').charAt(0).toUpperCase()}</div>
        <div class="review-meta">
          <span class="review-name">${r.name || 'Ẩn danh'}</span>
          <span class="review-date">${r.date || ''}</span>
        </div>
        ${r.verified ? '<span class="review-verified">✅ Đã mua</span>' : ''}
      </div>
      <div class="review-stars">${renderStarsHTML(r.stars)}</div>
      <div class="review-text">${r.text}</div>
      <div class="review-actions">
        <button class="rv-helpful-btn" onclick="reviewsMarkHelpful(this, ${i})">
          👍 Hữu ích ${r.helpful ? `(${r.helpful})` : ''}
        </button>
      </div>
    </div>`).join('');
}

/* ── Render sao HTML chuẩn hiển thị ─────────────────── */
function renderStarsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  
  return `<span style="color:#fbbf24">` +
    '★'.repeat(full) + 
    (half ? '★' : '') + 
    `</span><span style="color:#cbd5e1">` + 
    '☆'.repeat(empty) + 
    `</span>`;
}

/* ── Đánh dấu review là hữu ích (Có lưu trạng thái) ──── */
function reviewsMarkHelpful(btn, idx) {
  if (btn.dataset.voted) return;
  btn.dataset.voted = '1';
  
  // Tìm ID sách hiện tại đang hiển thị dựa vào URL
  const params = new URLSearchParams(window.location.search);
  const bookId = parseInt(params.get('id') || '1'); 
  
  let list = reviewsGet(bookId) || [];
  if (list[idx]) {
    list[idx].helpful = (list[idx].helpful || 0) + 1;
    reviewsSave(bookId, list); // Lưu lại vào máy
    
    btn.innerHTML = `👍 Hữu ích (${list[idx].helpful})`;
    btn.style.color = 'var(--blue)';
    btn.style.borderColor = 'var(--blue)';
  }
}

/* ── Giao diện form viết đánh giá ───────────────────── */
let _selectedStars = 0;

function reviewsInitForm(bookId) {
  _selectedStars = 0;
  /* Render star selector */
  const starEl = document.getElementById('starSelect');
  if (starEl) {
    starEl.innerHTML = [1,2,3,4,5].map(n =>
      `<button type="button" class="star-btn" data-star="${n}" onclick="reviewsSelectStar(${n})">★</button>`
    ).join('');
  }
}

function reviewsSelectStar(n) {
  _selectedStars = n;
  document.querySelectorAll('.star-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i < n);
  });
  /* Cập nhật label */
  const labels = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];
  const labelEl = document.getElementById('starLabel');
  if (labelEl) { labelEl.textContent = labels[n]; labelEl.style.display = 'block'; }
}

function reviewsSubmit(bookId) {
  const txtEl = document.getElementById('reviewText');
  const nameEl = document.getElementById('reviewName');
  const txt  = txtEl?.value.trim();
  const name = nameEl?.value.trim();

  if (!_selectedStars)    { showToast('⚠️ Vui lòng chọn số sao đánh giá!'); return; }
  if (!txt || txt.length < 10) { showToast('⚠️ Vui lòng viết ít nhất 10 ký tự!'); return; }

  /* Lấy tên từ localStorage user nếu không điền */
  const user = JSON.parse(localStorage.getItem('bs_user') || 'null');
  const reviewerName = name || user?.name || 'Bạn';

  const review = {
    name: reviewerName,
    stars: _selectedStars,
    text: txt,
    date: new Date().toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }),
    helpful: 0,
    verified: !!user
  };

  reviewsAdd(bookId, review);

  /* Reset form */
  if (txtEl)  txtEl.value  = '';
  if (nameEl) nameEl.value = '';
  _selectedStars = 0;
  document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
  const labelEl = document.getElementById('starLabel');
  if (labelEl) labelEl.style.display = 'none';

  /* Re-render */
  reviewsRender(bookId);

  /* Cập nhật rating trên trang */
  const avgEl = document.getElementById('detailRating');
  if (avgEl) {
    const newAvg = reviewsAvgRating(bookId);
    const list   = reviewsGet(bookId) || [];
    avgEl.innerHTML = `
      <span style="color:#fbbf24;font-size:1.1rem">${renderStarsHTML(newAvg)}</span>
      <strong style="margin-left:.35rem">${newAvg}</strong>
      <span style="color:var(--text3);font-size:.875rem;margin-left:.25rem">(${list.length.toLocaleString()} đánh giá)</span>`;
  }

  /* Scroll đến danh sách */
  document.getElementById('reviewsList')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('✅ Cảm ơn bạn đã đánh giá!');
}
