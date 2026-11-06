<?php
require __DIR__ . '/_boot.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $me = Auth::user();
    if (!$me) json_out(['error' => 'Bạn chưa đăng nhập.'], 401);
    json_out(['orders' => Order::forUser((int) $me['id'])]);
}

require_post();
$in = json_in();

$clean = [
    'name'     => mb_substr(trim((string) ($in['name'] ?? '')), 0, 100),
    'phone'    => trim((string) ($in['phone'] ?? '')),
    'email'    => trim((string) ($in['email'] ?? '')),
    'address'  => mb_substr(trim((string) ($in['address'] ?? '')), 0, 255),
    'city'     => mb_substr(trim((string) ($in['city'] ?? '')), 0, 100),
    'district' => mb_substr(trim((string) ($in['district'] ?? '')), 0, 100),
    'note'     => mb_substr(trim((string) ($in['note'] ?? '')), 0, 255),
    'payment'  => (string) ($in['payment'] ?? 'cod'),
    'coupon'   => (string) ($in['coupon'] ?? ''),
    'items'    => is_array($in['items'] ?? null) ? $in['items'] : [],
];
if (mb_strlen($clean['name']) < 2) json_out(['error' => 'Vui lòng nhập họ tên.'], 422);
if (!preg_match('/^[0-9+\s().-]{8,20}$/', $clean['phone'])) json_out(['error' => 'Số điện thoại không hợp lệ.'], 422);
if (!filter_var($clean['email'], FILTER_VALIDATE_EMAIL) || strlen($clean['email']) > 190) json_out(['error' => 'Email không hợp lệ.'], 422);
if ($clean['address'] === '') json_out(['error' => 'Vui lòng nhập địa chỉ giao hàng.'], 422);

try {
    $res = Order::create($clean, Auth::user()['id'] ?? null);
    json_out($res, 201);
} catch (InvalidArgumentException $e) {
    json_out(['error' => $e->getMessage()], 422);
}
