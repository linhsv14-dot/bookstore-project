<?php
// Nhận ảnh đại diện (multipart/form-data, trường "avatar"). Xử lý file phía client page.
require __DIR__ . '/_boot.php';

$me = Auth::user();
if (!$me) json_out(['error' => 'Bạn chưa đăng nhập.'], 401);
require_post();
$uid = (int) $me['id'];

try {
    $name = save_upload('avatar', 'avt_', ROOT . '/assets/avatars/');
} catch (RuntimeException $e) {
    json_out(['error' => $e->getMessage()], 422);
}
if (!$name) json_out(['error' => 'Chưa chọn ảnh.'], 422);

$old = Profile::get($uid)['avatar'] ?? null;
$new = 'assets/avatars/' . $name;
Profile::setAvatar($uid, $new);
// Xóa ảnh cũ (chỉ xóa file do chính chức năng này tạo ra).
if ($old && preg_match('#^assets/avatars/avt_[a-f0-9]+\.(jpg|png|webp)$#', $old)) {
    @unlink(ROOT . '/' . $old);
}
json_out(['avatar' => $new]);
