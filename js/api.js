/* =====================================================
   js/api.js — Nối giao diện BookStore với backend PHP (api/*.php)
   Nạp SAU các script khác (cuối trang) để ghi đè các hàm demo:
   đăng nhập/đăng ký, đặt hàng, mã giảm giá, đơn hàng trong profile,
   đổi mật khẩu, đăng xuất và gửi đánh giá lên server.
   ===================================================== */
(function () {
  'use strict';

  var API = 'api/';
  function toast(m) { if (typeof showToast === 'function') showToast(m); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Toast phải nổi lên trên cửa sổ đặt hàng (nếu không, lỗi bị che mất) */
  var st = document.createElement('style');
  st.textContent = '.toast{z-index:99999 !important}';
  document.head.appendChild(st);

  /* Hiện thông báo lỗi ngay trong form đặt hàng, ngay phía trên nút xác nhận */
  function orderMsg(m) {
    var b = document.querySelector('#checkoutFormContent .checkout-btn');
    if (!b) { toast(m); return; }
    var d = document.getElementById('orderErr');
    if (!d) {
      d = document.createElement('div');
      d.id = 'orderErr';
      d.style.cssText = 'color:#dc2626;font-size:.85rem;font-weight:600;margin:.5rem 0';
      b.parentNode.insertBefore(d, b);
    }
    d.textContent = m;
  }

  /* Tương thích mọi phiên bản cart.js (có hoặc không có chức năng chọn sản phẩm để thanh toán) */
  function selectedItems() {
    if (typeof cartSelectedItems === 'function') return cartSelectedItems();
    return typeof cartGet === 'function' ? cartGet() : [];
  }
  function removeSelected() {
    if (typeof cartRemoveSelected === 'function') cartRemoveSelected();
    else if (typeof cartClear === 'function') cartClear();
  }

  function call(path, method, body) {
    return fetch(API + path, {
      method: method || 'GET',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'bookstore' },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var err = new Error(data.error || ('Lỗi máy chủ (' + res.status + ')'));
          err.status = res.status;
          throw err;
        }
        return data;
      });
    });
  }

  function saveUser(u) {
    var old = {};
    try { old = JSON.parse(localStorage.getItem('bs_user') || '{}') || {}; } catch (e) {}
    localStorage.setItem('bs_user', JSON.stringify(Object.assign(old, { name: u.name, email: u.email, role: u.role })));
  }

  /* ---------- Đăng nhập / đăng ký (login.html) ---------- */
  window.loginSubmit = function () {
    var email = document.getElementById('loginEmail').value.trim();
    var pw = document.getElementById('loginPw').value;
    var ok = true;
    if (!isEmail(email)) { showErr('loginEmailErr', true); ok = false; } else showErr('loginEmailErr', false);
    if (pw.length < 6) { showErr('loginPwErr', true); ok = false; } else showErr('loginPwErr', false);
    if (!ok) return;

    call('auth.php?action=login', 'POST', { email: email, password: pw }).then(function (d) {
      saveUser(d.user);
      toast('✅ Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(function () { location.href = d.user.role === 'admin' ? 'admin/' : 'index.html'; }, 1000);
    }).catch(function (e) { toast('❌ ' + e.message); });
  };

  window.registerSubmit = function () {
    var name = document.getElementById('regName').value.trim();
    var email = document.getElementById('regEmail').value.trim();
    var phone = (document.getElementById('regPhone') || {}).value || '';
    var pw = document.getElementById('regPw').value;
    var pw2 = document.getElementById('regPwConfirm').value;
    var agree = document.getElementById('regAgree').checked;
    var ok = true;
    if (name.length < 2) { showErr('regNameErr', true); ok = false; } else showErr('regNameErr', false);
    if (!isEmail(email)) { showErr('regEmailErr', true); ok = false; } else showErr('regEmailErr', false);
    if (pw.length < 6) { showErr('regPwErr', true); ok = false; } else showErr('regPwErr', false);
    if (pw !== pw2) { showErr('regPwConfirmErr', true); ok = false; } else showErr('regPwConfirmErr', false);
    if (!agree) { toast('⚠ Vui lòng đồng ý với điều khoản sử dụng'); ok = false; }
    if (!ok) return;

    call('auth.php?action=register', 'POST', { name: name, email: email, phone: phone.trim(), password: pw }).then(function (d) {
      saveUser(d.user);
      toast('🎉 Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(function () { location.href = 'index.html'; }, 1000);
    }).catch(function (e) { toast('❌ ' + e.message); });
  };

  window.socialLogin = function (provider) {
    toast('ℹ️ Đăng nhập bằng ' + provider + ' chưa được hỗ trợ. Vui lòng dùng email.');
  };

  /* ---------- Mã giảm giá + đặt hàng (cart.html) ---------- */
  window._couponCode = '';
  window.applyCoupon = function () {
    var input = document.getElementById('couponInput');
    var code = input.value.trim().toUpperCase();
    if (!code) return;
    var sub = typeof cartSelectedTotalPrice === 'function' ? cartSelectedTotalPrice() : cartTotalPrice();
    call('coupon.php?code=' + encodeURIComponent(code) + '&subtotal=' + sub).then(function (r) {
      window._couponCode = r.code;
      _discount = r.percent / 100;           // biến toàn cục của cart.html
      document.getElementById('discountRow').style.display = 'flex';
      updatePageSummary();
      toast('🎉 Áp dụng mã thành công! Giảm ' + r.percent + '%');
    }).catch(function (e) {
      window._couponCode = '';
      _discount = 0;
      document.getElementById('discountRow').style.display = 'none';
      updatePageSummary();
      toast('❌ ' + e.message);
    });
  };

  var placing = false;
  window.placeOrder = function () {
    if (placing) return;
    var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var f = { name: v('orderName'), phone: v('orderPhone'), email: v('orderEmail'), address: v('orderAddress'),
              city: v('orderCity'), district: v('orderDistrict'), note: v('orderNote') };
    if (!f.name || !f.phone || !f.email || !f.address) { orderMsg('⚠ Vui lòng điền đầy đủ họ tên, số điện thoại, email và địa chỉ!'); return; }

    var items = selectedItems().map(function (i) { return { id: i.id, qty: i.qty }; });
    if (!items.length) { orderMsg('⚠ Vui lòng chọn sản phẩm cần thanh toán!'); return; }
    var pmEl = document.querySelector('input[name="pm"]:checked');
    var pm = pmEl ? pmEl.value : 'cod';
    var pmLabel = { cod: 'COD', momo: 'MoMo', bank: 'Chuyển khoản' }[pm];

    placing = true;
    f.items = items; f.payment = pm; f.coupon = window._couponCode;
    call('orders.php', 'POST', f).then(function (o) {
      document.getElementById('checkoutFormContent').innerHTML =
        '<div class="order-success">' +
        '<div class="success-icon">🎉</div><h3>Đặt hàng thành công!</h3>' +
        '<p style="color:var(--text2);font-size:.9rem">Cảm ơn <strong>' + esc(f.name) + '</strong> đã mua hàng tại BookStore!</p>' +
        '<div class="order-code-box">' + esc(o.code) + '</div>' +
        '<p style="font-size:.85rem;color:var(--text3);margin-bottom:.5rem">Mã đơn hàng của bạn</p>' +
        '<div style="background:var(--bg);border-radius:var(--r);padding:1rem;text-align:left;margin:1rem 0;font-size:.875rem">' +
        '<p style="margin-bottom:.4rem">📦 Địa chỉ: <strong>' + esc(f.address) + '</strong></p>' +
        '<p style="margin-bottom:.4rem">📞 Điện thoại: <strong>' + esc(f.phone) + '</strong></p>' +
        '<p style="margin-bottom:.4rem">💳 Thanh toán: <strong>' + esc(pmLabel) + '</strong></p>' +
        '<p>💰 Tổng thanh toán: <strong>' + esc(formatPrice(o.total)) + '</strong></p></div>' +
        '<p style="font-size:.8rem;color:var(--text3)">Chúng tôi sẽ liên hệ xác nhận qua email <strong>' + esc(f.email) + '</strong></p>' +
        '<button class="btn-primary" style="margin-top:1.5rem" onclick="orderDone()">Về trang chủ</button></div>';
      removeSelected();
    }).catch(function (e) {
      orderMsg('❌ ' + e.message);
    }).then(function () { placing = false; });
  };

  /* ---------- Profile ---------- */
  var STATUS = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', shipping: '🚚 Đang giao', delivered: '✅ Đã giao', cancelled: 'Đã hủy' };

  function loadOrders() {
    var box = document.getElementById('ordersContainer');
    if (!box) return;
    call('orders.php').then(function (d) {
      var os = d.orders || [];
      if (!os.length) {
        box.innerHTML = '<p style="color:var(--text3)">Bạn chưa có đơn hàng nào.</p>';
      } else {
        box.innerHTML = os.map(function (o) {
          var day = String(o.created_at).slice(0, 10).split('-').reverse().join('/');
          var cls = o.status === 'delivered' || o.status === 'shipping' ? ' ' + o.status : '';
          var names = o.items.map(function (i) { return esc(i.title) + ' ×' + i.qty; }).join(', ');
          return '<div class="order-card"><div class="order-head"><span class="order-code">' + esc(o.code) + '</span>' +
            '<span class="order-status' + cls + '">' + esc(STATUS[o.status] || o.status) + '</span></div>' +
            '<div class="order-items">📚 ' + names + '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
            '<span style="font-size:.8rem;color:var(--text3)">' + day + '</span>' +
            '<span class="order-total">' + esc(formatPrice(Number(o.total))) + '</span></div></div>';
        }).join('');
      }
      var nums = document.querySelectorAll('.stats-row .stat-card .num');
      if (nums.length >= 2) {
        nums[0].textContent = os.length;
        nums[1].textContent = os.reduce(function (s, o) {
          return s + o.items.reduce(function (t, i) { return t + i.qty; }, 0);
        }, 0);
      }
    }).catch(function (e) {
      var nz = document.querySelectorAll('.stats-row .stat-card .num');
      if (nz.length >= 2) { nz[0].textContent = 0; nz[1].textContent = 0; }
      box.innerHTML = '<p style="color:var(--text3)">' + esc(e.status === 401
        ? 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.' : e.message) + '</p>';
    });
  }

  window.changePassword = function () {
    var cur = document.getElementById('currentPw').value;
    var nw = document.getElementById('newPw').value;
    var conf = document.getElementById('confirmNewPw').value;
    if (!cur) { toast('⚠ Nhập mật khẩu hiện tại!'); return; }
    if (nw.length < 6) { toast('⚠ Mật khẩu mới phải ≥ 6 ký tự!'); return; }
    if (nw !== conf) { toast('⚠ Mật khẩu xác nhận không khớp!'); return; }
    call('auth.php?action=password', 'POST', { current: cur, new: nw }).then(function () {
      ['currentPw', 'newPw', 'confirmNewPw'].forEach(function (id) { document.getElementById(id).value = ''; });
      toast('✅ Đã đổi mật khẩu thành công!');
    }).catch(function (e) { toast('❌ ' + e.message); });
  };

  window.doLogout = function () {
    call('auth.php?action=logout', 'POST', {}).catch(function () {}).then(function () {
      localStorage.removeItem('bs_user');
      localStorage.removeItem('bs_wishlist');
      toast('👋 Đã đăng xuất!');
      setTimeout(function () { location.href = 'index.html'; }, 800);
    });
  };

  /* ---------- Gửi đánh giá lên server (giữ nguyên bản lưu localStorage) ---------- */
  if (typeof window.reviewsAdd === 'function') {
    var origAdd = window.reviewsAdd;
    window.reviewsAdd = function (bookId, review) {
      var list = origAdd(bookId, review);
      call('reviews.php', 'POST', { book_id: bookId, name: review.name, stars: review.stars, text: review.text })
        .catch(function () {});
      return list;
    };
  }


  /* ---------- Hồ sơ cá nhân + ảnh đại diện (profile.html) ---------- */
  function setVal(id, v) { var el = document.getElementById(id); if (el && v != null) el.value = v; }

  function applyAvatar(url) {
    var av = document.getElementById('profileAvatar');
    if (!av || !url) return;
    av.style.overflow = 'hidden';
    av.innerHTML = '<img src="' + esc(url) + '?t=' + Date.now() + '" alt="Ảnh đại diện" ' +
      'style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
  }

  function loadProfileData() {
    if (!document.getElementById('infoName')) return;
    injectAvatarUpload();
    call('profile.php').then(function (d) {
      var p = d.profile || {};
      setVal('infoPhone', p.phone); setVal('infoDob', p.dob); setVal('infoAddress', p.address);
      applyAvatar(p.avatar);
    }).catch(function () {});
  }

  function injectAvatarUpload() {
    var av = document.getElementById('profileAvatar');
    if (!av || document.getElementById('avatarFile')) return;
    var wrap = document.createElement('div');
    wrap.style.cssText = 'margin-top:.6rem;text-align:center';
    wrap.innerHTML = '<input type="file" id="avatarFile" accept="image/jpeg,image/png,image/webp" style="display:none">' +
      '<button type="button" id="avatarBtn" style="background:none;border:1px solid var(--border);' +
      'border-radius:50px;padding:.3rem .8rem;font-size:.78rem;cursor:pointer">📷 Đổi ảnh</button>';
    av.parentNode.insertBefore(wrap, av.nextSibling);

    var file = document.getElementById('avatarFile');
    document.getElementById('avatarBtn').addEventListener('click', function () { file.click(); });
    file.addEventListener('change', function () {
      var f = file.files[0];
      if (!f) return;
      if (f.size > 2 * 1024 * 1024) { toast('⚠ Ảnh tối đa 2MB!'); file.value = ''; return; }
      var fd = new FormData();
      fd.append('avatar', f);
      fetch(API + 'avatar.php', { method: 'POST', body: fd, credentials: 'same-origin',
                                  headers: { 'X-Requested-With': 'bookstore' } })
        .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, d: d }; }); })
        .then(function (r) {
          if (!r.ok) throw new Error(r.d.error || 'Tải ảnh thất bại');
          applyAvatar(r.d.avatar);
          toast('✅ Đã cập nhật ảnh đại diện!');
        })
        .catch(function (e) { toast('❌ ' + e.message); })
        .then(function () { file.value = ''; });
    });
  }

  window.saveInfo = function () {
    var g = function (id) { return document.getElementById(id).value.trim(); };
    call('profile.php', 'POST', { name: g('infoName'), phone: g('infoPhone'), dob: g('infoDob'), address: g('infoAddress') })
      .then(function (d) {
        saveUser({ name: d.profile.name, email: d.profile.email, role: (JSON.parse(localStorage.getItem('bs_user') || '{}')).role });
        document.getElementById('profileName').textContent = d.profile.name;
        var av = document.getElementById('profileAvatar');
        if (av && !av.querySelector('img')) av.textContent = d.profile.name.charAt(0).toUpperCase();
        toast('✅ Đã lưu thông tin thành công!');
      }).catch(function (e) { toast('❌ ' + e.message); });
  };

  /* ---------- Wishlist (đồng bộ với bảng wishlists khi đã đăng nhập) ---------- */
  function loggedIn() {
    try { return !!JSON.parse(localStorage.getItem('bs_user') || 'null'); } catch (e) { return false; }
  }
  function localWish() {
    try { return JSON.parse(localStorage.getItem('bs_wishlist') || '[]'); } catch (e) { return []; }
  }

  if (typeof window.wishlistToggle === 'function') {
    var origToggle = window.wishlistToggle;
    window.wishlistToggle = function (bookId) {
      var added = origToggle(bookId);
      if (loggedIn()) call('wishlist.php', 'POST', { book_id: bookId, on: added }).catch(function () {});
      return added;
    };
  }

  function syncWishlist() {
    call('wishlist.php').then(function (d) {
      var server = d.ids || [];
      var onlyLocal = localWish().filter(function (id) { return server.indexOf(id) < 0; });
      onlyLocal.forEach(function (id) {            // mục thêm lúc chưa đăng nhập -> đẩy lên server
        call('wishlist.php', 'POST', { book_id: id, on: true }).catch(function () {});
      });
      var merged = server.concat(onlyLocal);
      localStorage.setItem('bs_wishlist', JSON.stringify(merged));
      if (typeof wishlistSyncAll === 'function') wishlistSyncAll();
      if (typeof wishlistUpdateBadge === 'function') wishlistUpdateBadge();
      renderProfileWishlist(merged);
    }).catch(function () {});
  }

  function renderProfileWishlist(ids) {
    var wg = document.getElementById('wishlistGrid');
    if (!wg || typeof BOOKS === 'undefined') return;
    var books = ids.map(function (id) {
      return BOOKS.filter(function (b) { return b.id === id; })[0];
    }).filter(Boolean);
    var nums = document.querySelectorAll('.stats-row .stat-card .num');
    if (nums.length >= 3) nums[2].textContent = books.length;   /* ô "Yêu thích" */
    if (!books.length) {
      wg.innerHTML = '<p style="grid-column:1/-1;color:var(--text3)">Chưa có sách yêu thích nào.</p>';
      return;
    }
    wg.innerHTML = books.map(function (b) {
      return '<div style="background:#fff;border:1px solid var(--border);border-radius:var(--r2);overflow:hidden">' +
        '<a href="detail.html?id=' + b.id + '"><div style="aspect-ratio:3/4;overflow:hidden;background:#f1f5f9">' +
        '<img src="' + esc(b.image) + '" alt="' + esc(b.title) + '" style="width:100%;height:100%;object-fit:cover"></div></a>' +
        '<div style="padding:.75rem"><div style="font-weight:600;font-size:.85rem;color:var(--navy);margin-bottom:.25rem">' + esc(b.title) + '</div>' +
        '<div style="font-size:.78rem;color:var(--text3)">' + esc(b.author) + '</div>' +
        '<div style="color:var(--orange);font-weight:700;font-size:.9rem;margin-top:.4rem">' + esc(formatPrice(b.price)) + '</div>' +
        '<div style="display:flex;gap:.4rem;margin-top:.5rem">' +
        '<button onclick="cartAdd(' + b.id + ')" style="flex:1;background:var(--navy);color:#fff;border:none;border-radius:50px;padding:.5rem;font-size:.8rem;font-weight:600;cursor:pointer">+ Giỏ hàng</button>' +
        '<button onclick="bsWishRemove(' + b.id + ')" title="Bỏ yêu thích" style="border:1px solid var(--border);background:#fff;border-radius:50px;padding:.5rem .7rem;cursor:pointer">✕</button>' +
        '</div></div></div>';
    }).join('');
  }

  window.bsWishRemove = function (id) {
    var ids = localWish().filter(function (x) { return x !== id; });
    localStorage.setItem('bs_wishlist', JSON.stringify(ids));
    call('wishlist.php', 'POST', { book_id: id, on: false }).catch(function () {});
    toast('💔 Đã xóa khỏi yêu thích');
    renderProfileWishlist(ids);
    if (typeof wishlistUpdateBadge === 'function') wishlistUpdateBadge();
  };

  /* ---------- Đồng bộ phiên đăng nhập + link Quản trị ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    loadOrders();
    renderProfileWishlist(localWish());   /* thay 2 cuốn mẫu gõ cứng của profile.html */
    call('auth.php?action=me').then(function (d) {
      if (!d.user) {
        /* Phiên đã hết hoặc đã đăng xuất: wishlist trong máy là của tài khoản cũ -> bỏ */
        if (localStorage.getItem('bs_user')) localStorage.removeItem('bs_wishlist');
        localStorage.removeItem('bs_user');
        renderProfileWishlist(localWish());
        if (typeof wishlistSyncAll === 'function') wishlistSyncAll();
        if (typeof wishlistUpdateBadge === 'function') wishlistUpdateBadge();
        return;
      }
      saveUser(d.user);
      syncWishlist();
      loadProfileData();
      if (d.user.role === 'admin') {
        var tr = document.querySelector('.topbar-right');
        if (tr && !tr.querySelector('.admin-link')) {
          var a = document.createElement('a');
          a.className = 'admin-link'; a.href = 'admin/'; a.textContent = '⚙ Quản trị';
          tr.insertBefore(a, tr.firstChild);
        }
      }
    }).catch(function () {});
  });
})();