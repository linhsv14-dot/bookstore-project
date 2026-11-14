<div class="cards">
  <div class="card"><div class="num"><?= number_format($booksCount) ?></div><div class="lbl">Đầu sách</div></div>
  <div class="card"><div class="num"><?= number_format($ordersCount) ?></div><div class="lbl">Đơn hàng</div></div>
  <div class="card"><div class="num"><?= number_format($usersCount) ?></div><div class="lbl">Khách hàng</div></div>
  <div class="card"><div class="num"><?= e(money($revenue)) ?></div><div class="lbl">Doanh thu (đơn đã giao)</div></div>
</div>
<div class="grid2">
  <section class="box">
    <h3>Đơn hàng gần đây</h3>
    <table>
      <tr><th>Mã</th><th>Khách</th><th class="r">Tổng</th><th>Trạng thái</th></tr>
      <?php foreach ($recent as $o): ?>
        <tr>
          <td><a href="<?= e(a_url('orders', 'show', ['id' => $o['id']])) ?>"><?= e($o['code']) ?></a></td>
          <td><?= e($o['customer_name']) ?></td>
          <td class="r"><?= e(money($o['total'])) ?></td>
          <td><span class="badge <?= e($o['status']) ?>"><?= e(Order::STATUS[$o['status']]) ?></span></td>
        </tr>
      <?php endforeach; ?>
      <?php if (!$recent): ?><tr><td colspan="4" class="muted">Chưa có đơn hàng.</td></tr><?php endif; ?>
    </table>
  </section>
  <section class="box">
    <h3>Đơn theo trạng thái</h3>
    <?php $max = max(1, max($byStatus)); foreach ($byStatus as $k => $n): ?>
      <div class="bar"><span class="t"><?= e(Order::STATUS[$k]) ?></span>
        <span class="b"><i style="width:<?= (int) round($n / $max * 100) ?>%"></i></span>
        <span class="n"><?= (int) $n ?></span></div>
    <?php endforeach; ?>
  </section>
  <section class="box">
    <h3>Sách bán chạy</h3>
    <table>
      <?php foreach ($top as $t): ?>
        <tr><td><?= e($t['title']) ?></td><td class="r"><b><?= (int) $t['sold'] ?></b> cuốn</td></tr>
      <?php endforeach; ?>
      <?php if (!$top): ?><tr><td class="muted">Chưa có dữ liệu bán hàng.</td></tr><?php endif; ?>
    </table>
  </section>
  <section class="box">
    <h3>Sắp hết hàng (&lt; 20)</h3>
    <table>
      <?php foreach ($lowStock as $b): ?>
        <tr><td><a href="<?= e(a_url('books', 'edit', ['id' => $b['id']])) ?>"><?= e($b['title']) ?></a></td>
            <td class="r"><b><?= (int) $b['stock'] ?></b></td></tr>
      <?php endforeach; ?>
      <?php if (!$lowStock): ?><tr><td class="muted">Tồn kho ổn.</td></tr><?php endif; ?>
    </table>
  </section>
</div>
