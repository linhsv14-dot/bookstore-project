<?php
require __DIR__ . '/_boot.php';

$action = $_GET['action'] ?? 'me';
if ($action === 'me') json_out(['user' => Auth::user()]);

require_post();
$in = json_in();

switch ($action) {
    case 'login':
        $u = Auth::attempt(strtolower(trim((string) ($in['email'] ?? ''))), (string) ($in['password'] ?? ''));
        if (!$u) json_out(['error' => 'Email hoặc mật khẩu không đúng (hoặc tài khoản đã bị khóa).'], 401);
        Auth::login($u);
        json_out(['user' => Auth::user()]);

    case 'register':
        $name  = trim((string) ($in['name'] ?? ''));
        $email = strtolower(trim((string) ($in['email'] ?? '')));
        $phone = trim((string) ($in['phone'] ?? ''));
        $pw    = (string) ($in['password'] ?? '');
        if (mb_strlen($name) < 2 || mb_strlen($name) > 100) json_out(['error' => 'Họ tên phải từ 2 đến 100 ký tự.'], 422);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) json_out(['error' => 'Email không hợp lệ.'], 422);
        if ($phone !== '' && !preg_match('/^[0-9+\s().-]{8,20}$/', $phone)) json_out(['error' => 'Số điện thoại không hợp lệ.'], 422);
        if (strlen($pw) < 6 || strlen($pw) > 72) json_out(['error' => 'Mật khẩu phải từ 6 đến 72 ký tự.'], 422);
        if (User::findByEmail($email)) json_out(['error' => 'Email này đã được đăng ký.'], 409);
        $id = User::create($name, $email, $phone, $pw);
        Auth::login(User::find($id));
        json_out(['user' => Auth::user()], 201);

    case 'logout':
        Auth::logout();
        json_out(['ok' => true]);

    case 'password':
        $me = Auth::user();
        if (!$me) json_out(['error' => 'Bạn chưa đăng nhập.'], 401);
        $cur = (string) ($in['current'] ?? '');
        $new = (string) ($in['new'] ?? '');
        $row = User::find((int) $me['id']);
        if (!$row || !password_verify($cur, $row['password_hash'])) json_out(['error' => 'Mật khẩu hiện tại không đúng.'], 422);
        if (strlen($new) < 6 || strlen($new) > 72) json_out(['error' => 'Mật khẩu mới phải từ 6 đến 72 ký tự.'], 422);
        User::updatePassword((int) $me['id'], $new);
        json_out(['ok' => true]);

    default:
        json_out(['error' => 'Không tìm thấy.'], 404);
}
