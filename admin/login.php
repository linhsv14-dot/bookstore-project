<?php
require __DIR__ . '/../app/bootstrap.php';

if (isset($_GET['logout'])) { Auth::logout(); redirect('login.php'); }

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $u = Auth::attempt(strtolower(trim($_POST['email'] ?? '')), (string) ($_POST['password'] ?? ''));
    if ($u && $u['role'] === 'admin') { Auth::login($u); redirect('index.php'); }
    $error = $u ? 'Tài khoản này không có quyền quản trị.' : 'Email hoặc mật khẩu không đúng.';
} elseif (Auth::isAdmin()) {
    redirect('index.php');
}
?><!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Đăng nhập quản trị — BookStore</title>
  <link rel="stylesheet" href="assets/admin.css">
</head>
<body class="login-body">
  <form class="login-box" method="post" autocomplete="off">
    <div class="brand big">📚 Book<span>Store</span> <small>Admin</small></div>
    <?php if ($error): ?><div class="flash err"><?= e($error) ?></div><?php endif; ?>
    <?= csrf_field() ?>
    <label>Email</label>
    <input type="email" name="email" required autofocus>
    <label>Mật khẩu</label>
    <input type="password" name="password" required>
    <button class="btn primary" type="submit">Đăng nhập</button>
    <a class="back" href="../index.html">← Về website</a>
  </form>
</body>
</html>
