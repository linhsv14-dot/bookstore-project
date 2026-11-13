<?php
// Chạy 1 lần từ thư mục website:   php tools/patch-html.php
// - đổi js/data.js  ->  api/data.php (dữ liệu lấy từ MySQL)
// - thêm <script src="js/api.js"> vào cuối mỗi trang .html
// File gốc được sao lưu vào tools/backup/ trước khi sửa. Chạy lại nhiều lần vẫn an toàn.
$root = dirname(__DIR__);
$backup = __DIR__ . '/backup';
if (!is_dir($backup)) mkdir($backup, 0777, true);

$n = 0;
foreach (glob($root . '/*.html') as $f) {
    $old = file_get_contents($f);
    $new = str_replace('js/data.js', 'api/data.php', $old);
    if (strpos($new, 'js/api.js') === false) {
        $new = preg_replace('#</body>#i', '<script src="js/api.js"></script>' . "\n</body>", $new, 1);
    }
    if ($new !== $old) {
        if (!is_file($backup . '/' . basename($f))) copy($f, $backup . '/' . basename($f));
        file_put_contents($f, $new);
        echo 'Đã sửa: ' . basename($f) . "\n";
        $n++;
    }
}
echo "Xong, đã sửa $n file.\n";
