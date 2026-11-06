<form class="toolbar" method="get">
  <input type="hidden" name="page" value="books">
  <input type="text" name="q" value="<?= e($q) ?>" placeholder="Tìm tên sách, tác giả...">
  <select name="cat">
    <option value="0">Tất cả danh mục</option>
    <?php foreach ($cats as $c): ?>
      <option value="<?= (int) $c['id'] ?>" <?= $cat === (int) $c['id'] ? 'selected' : '' ?>><?= e($c['name']) ?></option>
    <?php endforeach; ?>
  </select>
  <button class="btn">Lọc</button>
  <span class="grow"></span>
  <a class="btn primary" href="<?= e(a_url('books', 'create')) ?>">+ Thêm sách</a>
</form>
<section class="box">
  <table>
    <tr><th>ID</th><th></th><th>Sách</th><th>Danh mục</th><th class="r">Giá</th><th class="r">Tồn</th><th>Nhãn</th><th></th></tr>
    <?php foreach ($books as $b): ?>
      <tr>
        <td><?= (int) $b['id'] ?></td>
        <td><?php if ($b['image'] !== ''): ?><img class="thumb" src="../<?= e($b['image']) ?>" alt=""><?php endif; ?></td>
        <td><b><?= e($b['title']) ?></b><div class="muted"><?= e($b['author']) ?></div></td>
        <td><?= e($b['cat_name']) ?></td>
        <td class="r"><?= e(money($b['price'])) ?><?php if ($b['orig_price']): ?><div class="muted"><s><?= e(money($b['orig_price'])) ?></s></div><?php endif; ?></td>
        <td class="r"><?= (int) $b['stock'] ?></td>
        <td><?= e(trim($b['badge'] . ' ' . str_replace(',', ' ', $b['tags']))) ?></td>
        <td class="r">
          <a class="btn sm" href="<?= e(a_url('books', 'edit', ['id' => $b['id']])) ?>">Sửa</a>
          <form class="inline" method="post" action="<?= e(a_url('books', 'delete', ['id' => $b['id']])) ?>" onsubmit="return confirm('Xóa sách này?')">
            <?= csrf_field() ?><button class="btn sm danger">Xóa</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$books): ?><tr><td colspan="8" class="muted">Không có sách nào.</td></tr><?php endif; ?>
  </table>
  <?= pager($total, $p, $per, 'books', ['q' => $q, 'cat' => $cat]) ?>
</section>
