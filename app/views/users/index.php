<form class="toolbar" method="get">
  <input type="hidden" name="page" value="users">
  <input type="text" name="q" value="<?= e($q) ?>" placeholder="Tên hoặc email...">
  <button class="btn">Tìm</button>
</form>
<section class="box">
  <table>
    <tr><th>ID</th><th>Người dùng</th><th>Vai trò</th><th class="r">Đơn</th><th>Trạng thái</th><th>Ngày tạo</th><th></th></tr>
    <?php foreach ($users as $u): $self = (int) $u['id'] === (int) Auth::user()['id']; ?>
      <tr>
        <td><?= (int) $u['id'] ?></td>
        <td><b><?= e($u['name']) ?></b><div class="muted"><?= e($u['email']) ?></div></td>
        <td><?= $u['role'] === 'admin' ? '<span class="badge confirmed">Admin</span>' : 'Khách hàng' ?></td>
        <td class="r"><?= (int) $u['order_count'] ?></td>
        <td><?= (int) $u['is_active'] === 1 ? '<span class="badge on">Hoạt động</span>' : '<span class="badge off">Đã khóa</span>' ?></td>
        <td><?= e(date('d/m/Y', strtotime($u['created_at']))) ?></td>
        <td class="r">
          <?php if ($self): ?><span class="muted">(bạn)</span><?php else: ?>
            <form class="inline" method="post" action="<?= e(a_url('users', 'toggle', ['id' => $u['id']])) ?>" onsubmit="return confirm('Đổi trạng thái tài khoản này?')">
              <?= csrf_field() ?><button class="btn sm <?= (int) $u['is_active'] === 1 ? 'danger' : '' ?>"><?= (int) $u['is_active'] === 1 ? 'Khóa' : 'Mở khóa' ?></button>
            </form>
            <form class="inline" method="post" action="<?= e(a_url('users', 'role', ['id' => $u['id']])) ?>" onsubmit="return confirm('Đổi vai trò người dùng này?')">
              <?= csrf_field() ?><button class="btn sm"><?= $u['role'] === 'admin' ? 'Gỡ admin' : 'Cấp admin' ?></button>
            </form>
          <?php endif; ?>
        </td>
      </tr>
    <?php endforeach; ?>
  </table>
  <?= pager($total, $p, $per, 'users', ['q' => $q]) ?>
</section>
