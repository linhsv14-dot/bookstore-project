<?php
require __DIR__ . '/_boot.php';

$code = strtoupper(trim((string) ($_GET['code'] ?? '')));
$sub  = max(0, (int) ($_GET['subtotal'] ?? 0));
$c = $code !== '' ? Coupon::valid($code, $sub) : null;
if (!$c) json_out(['error' => 'Mã giảm giá không hợp lệ, đã hết hạn hoặc đơn chưa đạt mức tối thiểu.'], 404);
json_out(['code' => $c['code'], 'percent' => (int) $c['discount_percent']]);
