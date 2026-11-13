<?php
require __DIR__ . '/_boot.php';

$me = Auth::user();
if (!$me) json_out(['error' => 'Bạn chưa đăng nhập.'], 401);
$uid = (int) $me['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') json_out(['profile' => Profile::get($uid)]);

require_post();
$in    = json_in();
$name  = trim((string) ($in['name'] ?? ''));
$phone = trim((string) ($in['phone'] ?? ''));
$dob   = trim((string) ($in['dob'] ?? ''));
$addr  = mb_substr(trim((string) ($in['address'] ?? '')), 0, 255);

if (mb_strlen($name) < 2 || mb_strlen($name) > 100) json_out(['error' => 'Họ tên phải từ 2 đến 100 ký tự.'], 422);
if ($phone !== '' && !preg_match('/^[0-9+\s().-]{8,20}$/', $phone)) json_out(['error' => 'Số điện thoại không hợp lệ.'], 422);
if ($dob !== '') {
    $d = DateTime::createFromFormat('Y-m-d', $dob);
    if (!$d || $d->format('Y-m-d') !== $dob || $dob < '1900-01-01' || $dob > date('Y-m-d')) {
        json_out(['error' => 'Ngày sinh không hợp lệ.'], 422);
    }
}

Profile::update($uid, $name, $phone, $dob !== '' ? $dob : null, $addr);
$_SESSION['user']['name'] = $name;
json_out(['profile' => Profile::get($uid)]);
