<?php
$tagList = array_filter(explode(',', (string) $book['tags']));
$badges  = ['' => '— Không —', 'hot' => '🔥 Hot', 'sale' => 'Sale', 'new' => 'Mới'];
?>
<?php if ($errors): ?>
  <div class="flash err"><b>Vui lòng kiểm tra lại:</b><ul><?php foreach ($errors as $er): ?><li><?= e($er) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>
<form class="box" method="post" enctype="multipart/form-data" action="<?= e(a_url('books', 'save')) ?>">
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= e($book['id'] ?? '') ?>">
  <div class="fgrid">
    <div class="full"><label>Tên sách *</label><input name="title" value="<?= e($book['title']) ?>" maxlength="200" required></div>
    <div><label>Tác giả *</label><input name="author" value="<?= e($book['author']) ?>" maxlength="150" required></div>
    <div><label>Danh mục *</label>
      <select name="category_id" required>
        <option value="">— Chọn —</option>
        <?php foreach ($cats as $c): ?>
          <option value="<?= (int) $c['id'] ?>" <?= (int) $book['category_id'] === (int) $c['id'] ? 'selected' : '' ?>><?= e($c['name']) ?></option>
        <?php endforeach; ?>
      </select></div>
    <div><label>Giá bán (₫) *</label><input type="number" name="price" min="1" value="<?= e($book['price']) ?>" required></div>
    <div><label>Giá gốc (₫)</label><input type="number" name="orig_price" min="0" value="<?= e($book['orig_price']) ?>">
      <div class="hint">Để trống nếu không giảm giá.</div></div>
    <div><label>Tồn kho</label><input type="number" name="stock" min="0" value="<?= e($book['stock']) ?>"></div>
    <div><label>Huy hiệu</label>
      <select name="badge"><?php foreach ($badges as $v => $lbl): ?>
        <option value="<?= e($v) ?>" <?= $book['badge'] === $v ? 'selected' : '' ?>><?= e($lbl) ?></option>
      <?php endforeach; ?></select></div>
    <div class="full checks"><label>Hiển thị ở tab</label>
      <?php foreach (['bestseller' => 'Bán chạy', 'new' => 'Sách mới', 'sale' => 'Khuyến mãi'] as $v => $lbl): ?>
        <label><input type="checkbox" name="tags[]" value="<?= e($v) ?>" <?= in_array($v, $tagList, true) ? 'checked' : '' ?>> <?= e($lbl) ?></label>
      <?php endforeach; ?></div>
    <div class="full"><label>Mô tả</label><textarea name="description" rows="5"><?= e($book['description']) ?></textarea></div>
    <div><label>Ảnh bìa (đường dẫn)</label><input name="image" value="<?= e($book['image']) ?>" placeholder="assets/images/ten-file.jpg"></div>
    <div><label>Hoặc tải ảnh lên (JPG/PNG/WEBP ≤ 2MB)</label><input type="file" name="image_file" accept="image/jpeg,image/png,image/webp"></div>
    <div><label>Nhà xuất bản</label><input name="publisher" value="<?= e($book['publisher']) ?>"></div>
    <div><label>Năm xuất bản</label><input type="number" name="year" value="<?= e($book['year']) ?>"></div>
    <div><label>Số trang</label><input type="number" name="pages" min="0" value="<?= e($book['pages']) ?>"></div>
    <div><label>Ngôn ngữ</label><input name="lang" value="<?= e($book['lang']) ?>"></div>
    <div><label>Điểm đánh giá hiển thị (0–5)</label><input type="number" step="0.1" min="0" max="5" name="rating" value="<?= e($book['rating']) ?>"></div>
    <div><label>Số lượt đánh giá hiển thị</label><input type="number" min="0" name="review_count" value="<?= e($book['review_count']) ?>"></div>
  </div>
  <div style="margin-top:1.25rem;display:flex;gap:.6rem">
    <button class="btn primary">Lưu</button>
    <a class="btn" href="<?= e(a_url('books')) ?>">Hủy</a>
  </div>
</form>
