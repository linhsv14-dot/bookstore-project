<form class="toolbar" method="get">
  <input type="hidden" name="page" value="reviews">
  <select name="book">
    <option value="0">Tất cả sách</option>
    <?php foreach ($books as $b): ?>
      <option value="<?= (int) $b['id'] ?>" <?= $book === (int) $b['id'] ? 'selected' : '' ?>><?= e($b['title']) ?></option>
    <?php endforeach; ?>
  </select>
  <button class="btn">Lọc</button>
</form>
<section class="box">
  <table>
    <tr><th>Sách</th><th>Người đánh giá</th><th>Sao</th><th>Nội dung</th><th>Ngày</th><th></th></tr>
    <?php foreach ($reviews as $r): ?>
      <tr>
        <td><?= e($r['book_title']) ?></td>
        <td><?= e($r['name']) ?><?= (int) $r['verified'] === 1 ? ' <span class="badge on">Đã đăng nhập</span>' : '' ?></td>
        <td style="color:#f59e0b;white-space:nowrap"><?= str_repeat('★', (int) $r['stars']) ?></td>
        <td style="max-width:360px"><?= e($r['content']) ?></td>
        <td><?= e(date('d/m/Y', strtotime($r['created_at']))) ?></td>
        <td class="r">
          <form class="inline" method="post" action="<?= e(a_url('reviews', 'delete', ['id' => $r['id']])) ?>" onsubmit="return confirm('Xóa đánh giá này?')">
            <?= csrf_field() ?><button class="btn sm danger">Xóa</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$reviews): ?><tr><td colspan="6" class="muted">Chưa có đánh giá.</td></tr><?php endif; ?>
  </table>
  <?= pager($total, $p, $per, 'reviews', ['book' => $book]) ?>
</section>
