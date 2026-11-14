<div class="grid2">
  <section class="box">
    <h3>Thông tin giao hàng</h3>
    <dl class="kv">
      <dt>Khách hàng</dt><dd><?= e($o['customer_name']) ?></dd>
      <dt>Điện thoại</dt><dd><?= e($o['phone']) ?></dd>
      <dt>Email</dt><dd><?= e($o['email']) ?></dd>
      <dt>Địa chỉ</dt><dd><?= e(implode(', ', array_filter([$o['address'], $o['district'], $o['city']]))) ?></dd>
      <dt>Ghi chú</dt><dd><?= e($o['note'] ?: '—') ?></dd>
      <dt>Thanh toán</dt><dd><?= e(Order::PAYMENT[$o['payment_method']] ?? $o['payment_method']) ?></dd>
      <dt>Ngày đặt</dt><dd><?= e(date('d/m/Y H:i', strtotime($o['created_at']))) ?></dd>
    </dl>
  </section>
  <section class="box">
    <h3>Trạng thái đơn</h3>
    <p><span class="badge <?= e($o['status']) ?>"><?= e(Order::STATUS[$o['status']]) ?></span></p>
    <?php if ($o['status'] === 'cancelled'): ?>
      <p class="muted">Đơn đã hủy — tồn kho đã được hoàn lại, không thể đổi trạng thái.</p>
    <?php else: ?>
      <form method="post" action="<?= e(a_url('orders', 'status', ['id' => $o['id']])) ?>" onsubmit="return this.status.value!=='cancelled' || confirm('Hủy đơn? Thao tác này không hoàn tác được.')">
        <?= csrf_field() ?>
        <select name="status">
          <?php foreach (Order::STATUS as $k => $lbl): ?>
            <option value="<?= e($k) ?>" <?= $o['status'] === $k ? 'selected' : '' ?>><?= e($lbl) ?></option>
          <?php endforeach; ?>
        </select>
        <button class="btn primary" style="margin-top:.75rem">Cập nhật</button>
      </form>
    <?php endif; ?>
  </section>
</div>
<section class="box" style="margin-top:1rem">
  <h3>Sản phẩm</h3>
  <table>
    <tr><th>Sách</th><th class="r">Đơn giá</th><th class="r">SL</th><th class="r">Thành tiền</th></tr>
    <?php foreach ($items as $it): ?>
      <tr><td><?= e($it['title']) ?></td><td class="r"><?= e(money($it['price'])) ?></td>
          <td class="r"><?= (int) $it['qty'] ?></td><td class="r"><?= e(money($it['price'] * $it['qty'])) ?></td></tr>
    <?php endforeach; ?>
    <tr><td colspan="3" class="r muted">Tạm tính</td><td class="r"><?= e(money($o['subtotal'])) ?></td></tr>
    <tr><td colspan="3" class="r muted">Phí vận chuyển</td><td class="r"><?= e(money($o['shipping_fee'])) ?></td></tr>
    <?php if ($o['discount'] > 0): ?>
      <tr><td colspan="3" class="r muted">Giảm giá <?= $o['coupon_code'] ? '(' . e($o['coupon_code']) . ')' : '' ?></td><td class="r">-<?= e(money($o['discount'])) ?></td></tr>
    <?php endif; ?>
    <tr><td colspan="3" class="r"><b>Tổng cộng</b></td><td class="r"><b><?= e(money($o['total'])) ?></b></td></tr>
  </table>
</section>
<p><a href="<?= e(a_url('orders')) ?>">← Về danh sách đơn</a></p>
