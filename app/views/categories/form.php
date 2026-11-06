<?php if ($errors): ?>
  <div class="flash err"><b>Vui lòng kiểm tra lại:</b><ul><?php foreach ($errors as $er): ?><li><?= e($er) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>
<form class="box" method="post" enctype="multipart/form-data" action="<?= e(a_url('categories', 'save')) ?>">
  <?= csrf_field() ?>
  <input type="hidden" name="id" value="<?= e($cat['id'] ?? '') ?>">
  <div class="fgrid">
    <div><label>Tên danh mục *</label><input name="name" value="<?= e($cat['name']) ?>" maxlength="100" required></div>
    <div><label>Slug</label><input name="slug" value="<?= e($cat['slug']) ?>"><div class="hint">Để trống để tự tạo từ tên (không dấu).</div></div>
    <div><label>Emoji</label><input name="emoji" value="<?= e($cat['emoji']) ?>" maxlength="8"></div>
    <div><label>Thứ tự hiển thị</label><input type="number" name="sort_order" value="<?= e($cat['sort_order']) ?>"></div>
    <div class="full"><label>Mô tả ngắn</label><input name="description" value="<?= e($cat['description']) ?>" maxlength="255"></div>
    <div><label>Tên file ảnh bìa</label><input name="image" value="<?= e($cat['image']) ?>" placeholder="ky-nang-song.jpg"><div class="hint">File nằm trong assets/images/.</div></div>
    <div><label>Hoặc tải ảnh lên</label><input type="file" name="image_file" accept="image/jpeg,image/png,image/webp"></div>
  </div>
  <div style="margin-top:1.25rem;display:flex;gap:.6rem">
    <button class="btn primary">Lưu</button>
    <a class="btn" href="<?= e(a_url('categories')) ?>">Hủy</a>
  </div>
</form>
