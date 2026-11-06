<?php
$nav = [
    'dashboard'  => ['📊', 'Tổng quan'],
    'books'      => ['📚', 'Sách'],
    'categories' => ['🗂️', 'Danh mục'],
    'orders'     => ['📦', 'Đơn hàng'],
    'users'      => ['👥', 'Người dùng'],
    'reviews'    => ['⭐', 'Đánh giá'],
    'coupons'    => ['🏷️', 'Mã giảm giá'],
];
$flash = flash_pull();
?><!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($title) ?> — BookStore Admin</title>
  <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<aside class="side">
  <div class="brand">📚 Book<span>Store</span> <small>Admin</small></div>
  <nav>
    <?php foreach ($nav as $key => $item): ?>
      <a href="<?= e(a_url($key)) ?>" class="<?= $active === $key ? 'on' : '' ?>"><?= $item[0] ?> <?= e($item[1]) ?></a>
    <?php endforeach; ?>
  </nav>
  <div class="side-foot">
    <a href="../index.html" target="_blank">↗ Xem website</a>
    <a href="login.php?logout=1">🚪 Đăng xuất</a>
  </div>
</aside>
<main>
  <div class="top"><h1><?= e($title) ?></h1><span>👤 <?= e(Auth::user()['name']) ?></span></div>
  <?php if ($flash): ?><div class="flash <?= e($flash['type']) ?>"><?= e($flash['msg']) ?></div><?php endif; ?>
  <?= $content ?>
</main>
</body>
</html>
