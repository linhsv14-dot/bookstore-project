<div class="toolbar"><span class="grow"></span><a class="btn primary" href="<?= e(a_url('coupons', 'create')) ?>">+ Thêm mã</a></div>
<section class="box">
  <table>
    <tr><th>Mã</th><th class="r">Giảm</th><th class="r">Đơn tối thiểu</th><th>Hết hạn</th><th>Trạng thái</th><th></th></tr>
    <?php foreach ($coupons as $c): ?>
      <tr>
        <td><b><?= e($c['code']) ?></b></td>
        <td class="r"><?= (int) $c['discount_percent'] ?>%</td>
        <td class="r"><?= e(money($c['min_order'])) ?></td>
        <td><?= $c['expires_at'] ? e(date('d/m/Y', strtotime($c['expires_at']))) : '—' ?></td>
        <td><?= (int) $c['is_active'] === 1 ? '<span class="badge on">Bật</span>' : '<span class="badge off">Tắt</span>' ?></td>
        <td class="r">
          <a class="btn sm" href="<?= e(a_url('coupons', 'edit', ['id' => $c['id']])) ?>">Sửa</a>
          <form class="inline" method="post" action="<?= e(a_url('coupons', 'delete', ['id' => $c['id']])) ?>" onsubmit="return confirm('Xóa mã này?')">
            <?= csrf_field() ?><button class="btn sm danger">Xóa</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$coupons): ?><tr><td colspan="6" class="muted">Chưa có mã giảm giá.</td></tr><?php endif; ?>
  </table>
</section>
