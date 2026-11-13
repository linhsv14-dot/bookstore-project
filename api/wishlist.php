<?php
require __DIR__ . '/_boot.php';

$me = Auth::user();
if (!$me) json_out(['error' => 'Bạn chưa đăng nhập.'], 401);
$uid = (int) $me['id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') json_out(['ids' => Wishlist::ids($uid)]);

require_post();
$in = json_in();
$bookId = isset($in['book_id']) && is_numeric($in['book_id']) ? (int) $in['book_id'] : -1;
if ($bookId < 0 || !Book::find($bookId)) json_out(['error' => 'Sách không tồn tại.'], 404);
Wishlist::set($uid, $bookId, !empty($in['on']));
json_out(['ok' => true]);
