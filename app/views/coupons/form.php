<?php if ($errors): ?>
  <div class="flash err"><b>Vui lòng kiểm tra lại:</b><ul><?php foreach ($errors as $er): ?><li><?= e($er) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>
<form class="box" method="post" action="<?= e(a_url('coupons', 'save')) ?>">
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= e($c['id'] ?? '') ?>">
  <div class="fgrid">
    <div><label>Mã *</label><input name="code" value="<?= e($c['code']) ?>" maxlength="40" required style="text-transform:uppercase"></div>
    <div><label>Phần trăm giảm (1–100) *</label><input type="number" name="discount_percent" min="1" max="100" value="<?= e($c['discount_percent']) ?>" required></div>
    <div><label>Đơn tối thiểu (₫)</label><input type="number" name="min_order" min="0" value="<?= e($c['min_order']) ?>"></div>
    <div><label>Ngày hết hạn</label><input type="date" name="expires_at" value="<?= e($c['expires_at']) ?>"><div class="hint">Để trống nếu không hết hạn.</div></div>
    <div class="full checks"><label><input type="checkbox" name="is_active" value="1" <?= (int) $c['is_active'] === 1 ? 'checked' : '' ?>> Đang bật</label></div>
  </div>
  <div style="margin-top:1.25rem;display:flex;gap:.6rem">
    <button class="btn primary">Lưu</button>
    <a class="btn" href="<?= e(a_url('coupons')) ?>">Hủy</a>
  </div>
</form>
