<?php
require __DIR__ . '/../app/bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function json_out($data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
function json_in(): array {
    $r = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($r) ? $r : [];
}
/** Chỉ nhận request AJAX do api.js gửi (chặn form giả mạo từ trang khác). */
function require_xhr(): void {
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'bookstore') json_out(['error' => 'Yêu cầu không hợp lệ.'], 400);
}
function require_post(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'Method not allowed'], 405);
    require_xhr();
}

set_exception_handler(function (Throwable $e) {
    error_log((string) $e);
    json_out(['error' => cfg('debug') ? $e->getMessage() : 'Lỗi hệ thống, vui lòng thử lại.'], 500);
});
