<div class="toolbar"><span class="grow"></span><a class="btn primary" href="<?= e(a_url('categories', 'create')) ?>">+ Thêm danh mục</a></div>
<section class="box">
  <table>
    <tr><th>Thứ tự</th><th></th><th>Tên</th><th>Slug</th><th class="r">Số sách</th><th></th></tr>
    <?php foreach ($cats as $c): ?>
      <tr>
        <td><?= (int) $c['sort_order'] ?></td>
        <td style="font-size:1.4rem"><?= e($c['emoji']) ?></td>
        <td><b><?= e($c['name']) ?></b><div class="muted"><?= e($c['description']) ?></div></td>
        <td><?= e($c['slug']) ?></td>
        <td class="r"><?= (int) $c['book_count'] ?></td>
        <td class="r">
          <a class="btn sm" href="<?= e(a_url('categories', 'edit', ['id' => $c['id']])) ?>">Sửa</a>
          <form class="inline" method="post" action="<?= e(a_url('categories', 'delete', ['id' => $c['id']])) ?>" onsubmit="return confirm('Xóa danh mục này?')">
            <?= csrf_field() ?><button class="btn sm danger">Xóa</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
  </table>
</section>
