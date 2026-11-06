<?php
define('ROOT', dirname(__DIR__));
$GLOBALS['__cfg'] = require __DIR__ . '/config.php';

function cfg(string $key, $default = null) {
    $v = $GLOBALS['__cfg'];
    foreach (explode('.', $key) as $k) {
        if (!is_array($v) || !array_key_exists($k, $v)) return $default;
        $v = $v[$k];
    }
    return $v;
}

date_default_timezone_set('Asia/Ho_Chi_Minh');
mb_internal_encoding('UTF-8');
ini_set('display_errors', cfg('debug') ? '1' : '0');
ini_set('log_errors', '1');

if (session_status() === PHP_SESSION_NONE) {
    session_name('bsid');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => cfg('base_url') ?: '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

set_exception_handler(function (Throwable $e) {
    error_log((string) $e);
    http_response_code(500);
    echo cfg('debug') ? '<pre>' . e($e->getMessage()) . '</pre>' : 'Đã có lỗi xảy ra.';
});

spl_autoload_register(function (string $class) {
    foreach (['core', 'models', 'controllers'] as $dir) {
        $f = __DIR__ . "/$dir/$class.php";
        if (is_file($f)) { require $f; return; }
    }
});

/* ---------- Helpers ---------- */
function e($s): string { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }
function money($n): string { return number_format((int) $n, 0, ',', '.') . '₫'; }
function redirect(string $url): void { header('Location: ' . $url); exit; }

function a_url(string $page, string $action = 'index', array $q = []): string {
    return 'index.php?' . http_build_query(array_merge(['page' => $page, 'action' => $action], $q));
}
function page_no(): int { return max(1, (int) ($_GET['p'] ?? 1)); }

function pager(int $total, int $page, int $per, string $pageName, array $q = []): string {
    $pages = (int) ceil($total / $per);
    if ($pages <= 1) return '';
    $h = '<div class="pager">';
    for ($i = 1; $i <= $pages; $i++) {
        $h .= $i === $page
            ? '<span class="cur">' . $i . '</span>'
            : '<a href="' . e(a_url($pageName, 'index', $q + ['p' => $i])) . '">' . $i . '</a>';
    }
    return $h . '</div>';
}

function flash(string $msg, string $type = 'ok'): void { $_SESSION['flash'] = ['msg' => $msg, 'type' => $type]; }
function flash_pull(): ?array { $f = $_SESSION['flash'] ?? null; unset($_SESSION['flash']); return $f; }

function csrf_token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}
function csrf_field(): string { return '<input type="hidden" name="_csrf" value="' . e(csrf_token()) . '">'; }
function csrf_check(): void {
    if (!hash_equals($_SESSION['csrf'] ?? '', (string) ($_POST['_csrf'] ?? ''))) {
        http_response_code(419);
        exit('Phiên làm việc đã hết hạn, hãy tải lại trang và thử lại.');
    }
}

/** Lưu ảnh upload vào assets/images, trả về tên file (hoặc null nếu không có file). */
function save_upload(string $field, string $prefix): ?string {
    if (empty($_FILES[$field]['name']) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) return null;
    $f = $_FILES[$field];
    if ($f['error'] !== UPLOAD_ERR_OK || $f['size'] > 2 * 1024 * 1024) {
        throw new RuntimeException('Tải ảnh thất bại hoặc ảnh lớn hơn 2MB.');
    }
    $info = @getimagesize($f['tmp_name']);
    $ext  = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'][$info[2] ?? 0] ?? null;
    if (!$ext) throw new RuntimeException('Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.');
    $name = $prefix . bin2hex(random_bytes(6)) . '.' . $ext;
    if (!move_uploaded_file($f['tmp_name'], cfg('upload_dir') . $name)) {
        throw new RuntimeException('Không lưu được ảnh (kiểm tra quyền ghi thư mục assets/images).');
    }
    return $name;
}

/** Tạo slug không dấu từ tiếng Việt. */
function slugify(string $s): string {
    $map = [
        'a' => 'àáạảãâầấậẩẫăằắặẳẵ', 'e' => 'èéẹẻẽêềếệểễ', 'i' => 'ìíịỉĩ',
        'o' => 'òóọỏõôồốộổỗơờớợởỡ', 'u' => 'ùúụủũưừứựửữ', 'y' => 'ỳýỵỷỹ', 'd' => 'đ',
    ];
    $tr = [];
    foreach ($map as $ascii => $chars) {
        foreach (preg_split('//u', $chars, -1, PREG_SPLIT_NO_EMPTY) as $ch) $tr[$ch] = $ascii;
    }
    $s = strtr(mb_strtolower(trim($s)), $tr);
    return trim((string) preg_replace('/[^a-z0-9]+/', '-', $s), '-');
}
