/* =====================================================
   js/darkmode.js — Chế độ tối (Dark Mode)
   Lưu trữ: localStorage key "bs_theme" = "dark" | "light"
   Áp dụng class "dark" lên <html>
   ===================================================== */

const THEME_KEY = 'bs_theme';

/* ── Khởi tạo theme ngay khi script load (tránh flash) ─ */
(function initThemeEarly() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
})();

/* ── Lấy theme hiện tại ──────────────────────────────── */
function themeGet() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/* ── Bật dark mode ───────────────────────────────────── */
function themeSetDark() {
  document.documentElement.classList.add('dark');
  localStorage.setItem(THEME_KEY, 'dark');
  themeUpdateButtons();
}

/* ── Tắt dark mode ───────────────────────────────────── */
function themeSetLight() {
  document.documentElement.classList.remove('dark');
  localStorage.setItem(THEME_KEY, 'light');
  themeUpdateButtons();
}

/* ── Toggle ──────────────────────────────────────────── */
function themeToggle() {
  if (themeGet() === 'dark') {
    themeSetLight();
  } else {
    themeSetDark();
  }
}

/* ── Cập nhật nút toggle (icon mặt trời / mặt trăng) ── */
function themeUpdateButtons() {
  const isDark = themeGet() === 'dark';
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.innerHTML      = isDark ? '☀️' : '🌙';
    btn.title          = isDark ? 'Chuyển sang sáng' : 'Chuyển sang tối';
    btn.setAttribute('aria-pressed', isDark);
  });
}

/* ── Tạo nút toggle và chèn vào navbar ──────────────── */
function themeInjectToggleBtn() {
  /* Tránh tạo trùng */
  if (document.querySelector('.theme-toggle-btn')) {
    themeUpdateButtons();
    return;
  }

  const isDark = themeGet() === 'dark';
  const btn = document.createElement('button');
  btn.className = 'theme-toggle-btn';
  btn.innerHTML = isDark ? '☀️' : '🌙';
  btn.title     = isDark ? 'Chuyển sang sáng' : 'Chuyển sang tối';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.setAttribute('aria-pressed', isDark);
  btn.addEventListener('click', themeToggle);

  /* Chèn vào nav-right, trước nút profile */
  const navRight = document.querySelector('.nav-right');
  const profileBtn = navRight?.querySelector('.btn-navy');
  if (navRight && profileBtn) {
    navRight.insertBefore(btn, profileBtn);
  } else if (navRight) {
    navRight.appendChild(btn);
  }
}

/* ── Chạy khi DOM sẵn sàng ──────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  themeInjectToggleBtn();
  themeUpdateButtons();
});