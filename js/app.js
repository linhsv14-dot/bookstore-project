/* =====================================================
   js/app.js — Shared UI logic
   ===================================================== */

/* ── Toast notification ─────────────────────────── */
let _toastTimer;
function showToast(msg) {
  clearTimeout(_toastTimer);
  const t  = document.getElementById('toast');
  const tm = document.getElementById('toastMsg');
  if (!t) return;
  if (tm) tm.textContent = msg;
  t.classList.add('show');
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Quick-View Modal ───────────────────────────── */
function openModal(bookId) {
  const b = BOOKS.find(x => x.id === bookId);
  if (!b) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

  // 1. Gán hình ảnh
  const modalImg = document.getElementById('modalImg');
  if (modalImg) {
    // Chỉ cần dùng ${b.image} thôi vì trong data.js đã có sẵn "assets/images/" rồi
    modalImg.innerHTML = `<img src="${b.image}" alt="${b.title}" style="width:100%; border-radius:8px;">`;
  }
  // 2. Gán thông tin cơ bản
  set('modalTitle', b.title);
  set('modalAuthor', `Tác giả: <strong>${b.author}</strong> &nbsp;•&nbsp; ${b.cat}`);
  set('modalRating', `<span style="color:#fbbf24;font-size:1rem">${'★'.repeat(Math.round(b.rating))}</span>
                      <span style="color:var(--text3);font-size:.8rem">${b.rating} (${b.reviewCount.toLocaleString()} đánh giá)</span>`);
  set('modalDesc', b.desc);

  // 3. Xử lý giá
  const discount = typeof calcDiscount !== 'undefined' ? calcDiscount(b.orig, b.price) : 0;
  const priceHTML = b.orig
    ? `<span style="color:var(--orange);font-size:1.35rem;font-weight:800">${formatPrice(b.price)}</span>
       <span style="font-size:.9rem;color:var(--text3);text-decoration:line-through;margin-left:.5rem">${formatPrice(b.orig)}</span>
       <span style="font-size:.8rem;font-weight:700;background:#fef2f2;color:#dc2626;padding:.15rem .5rem;border-radius:50px;margin-left:.4rem">-${discount}%</span>`
    : `<span style="color:var(--orange);font-size:1.35rem;font-weight:800">${formatPrice(b.price)}</span>`;
  set('modalPrice', priceHTML);

  const addBtn = document.getElementById('modalAddBtn');
  if (addBtn) {
    addBtn.onclick = () => { cartAdd(b.id); closeModal(); };
  }

  // 4. KÍCH HOẠT HỆ THỐNG ĐÁNH GIÁ
  const currentId = parseInt(bookId);
  if (typeof reviewsRender === 'function') reviewsRender(currentId);
  if (typeof reviewsInitForm === 'function') reviewsInitForm(currentId);

  const btn = document.getElementById('modalReviewSubmitBtn');
  if (btn) {
    btn.onclick = function () {
      if (typeof reviewsSubmit === 'function') {
        reviewsSubmit(currentId);
        setTimeout(() => { if (typeof reviewsRender === 'function') reviewsRender(currentId); }, 100);
      }
    };
  }

  // 5. Hiển thị modal
  document.getElementById('modalBg')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalBg')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Các hàm hỗ trợ khác ────────────────────────── */
function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => { btn.classList.toggle('open'); links.classList.toggle('mobile-open'); });
}

function initNavbarScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(15,27,53,.12)' : '0 4px 24px rgba(15,27,53,.08)';
  }, { passive: true });
}

function initModalClose() {
  const bg = document.getElementById('modalBg');
  if (!bg) return;
  bg.addEventListener('click', e => { if (e.target === bg) closeModal(); });
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeCart(); } });

document.addEventListener('DOMContentLoaded', () => {
  initBackTop();
  initHamburger();
  initNavbarScroll();
  initModalClose();
});