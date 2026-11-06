<?php
require __DIR__ . '/_boot.php';
require_post();
$in = json_in();

$bookId = isset($in['book_id']) && is_numeric($in['book_id']) ? (int) $in['book_id'] : -1;
if ($bookId < 0 || !Book::find($bookId)) json_out(['error' => 'Sách không tồn tại.'], 404);

$stars = (int) ($in['stars'] ?? 0);
$text  = trim((string) ($in['text'] ?? ''));
if ($stars < 1 || $stars > 5) json_out(['error' => 'Số sao không hợp lệ.'], 422);
if (mb_strlen($text) < 10 || mb_strlen($text) > 1000) json_out(['error' => 'Nội dung đánh giá phải từ 10 đến 1000 ký tự.'], 422);

$me   = Auth::user();
$name = trim((string) ($in['name'] ?? ''));
if ($name === '') $name = $me['name'] ?? 'Bạn';
$name = mb_substr($name, 0, 60);

// Trang web hiển thị đánh giá bằng innerHTML -> lưu bản đã escape để không bị chèn script.
Review::create(
    $bookId,
    $me['id'] ?? null,
    htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
    $stars,
    htmlspecialchars($text, ENT_QUOTES, 'UTF-8'),
    $me !== null
);
json_out(['ok' => true], 201);
