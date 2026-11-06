<form class="toolbar" method="get">
  <input type="hidden" name="page" value="orders">
  <input type="text" name="q" value="<?= e($q) ?>" placeholder="Mã đơn, tên, số điện thoại...">
  <select name="status">
    <option value="">Tất cả trạng thái</option>
    <?php foreach (Order::STATUS as $k => $lbl): ?>
      <option value="<?= e($k) ?>" <?= $status === $k ? 'selected' : '' ?>><?= e($lbl) ?></option>
    <?php endforeach; ?>
  </select>
  <button class="btn">Lọc</button>
</form>
<section class="box">
  <table>
    <tr><th>Mã đơn</th><th>Khách hàng</th><th>Thanh toán</th><th class="r">Tổng tiền</th><th>Trạng thái</th><th>Ngày đặt</th><th></th></tr>
    <?php foreach ($orders as $o): ?>
      <tr>
        <td><b><?= e($o['code']) ?></b></td>
        <td><?= e($o['customer_name']) ?><div class="muted"><?= e($o['phone']) ?></div></td>
        <td><?= e(Order::PAYMENT[$o['payment_method']] ?? $o['payment_method']) ?></td>
        <td class="r"><?= e(money($o['total'])) ?></td>
        <td><span class="badge <?= e($o['status']) ?>"><?= e(Order::STATUS[$o['status']]) ?></span></td>
        <td><?= e(date('d/m/Y H:i', strtotime($o['created_at']))) ?></td>
        <td class="r"><a class="btn sm" href="<?= e(a_url('orders', 'show', ['id' => $o['id']])) ?>">Chi tiết</a></td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$orders): ?><tr><td colspan="7" class="muted">Chưa có đơn hàng nào.</td></tr><?php endif; ?>
  </table>
  <?= pager($total, $p, $per, 'orders', ['q' => $q, 'status' => $status]) ?>
</section>
