<?php
// Cấu hình chung. Chỉnh theo máy của bạn (XAMPP mặc định: user root, mật khẩu rỗng).
return [
    'debug'       => true,          // đặt false khi nộp/triển khai thật
    'base_url'    => '/bookstore',  // tên thư mục website trong htdocs
    'db' => [
        'host' => '127.0.0.1',
        'name' => 'bookstore',
        'user' => 'root',
        'pass' => '',
        'charset' => 'utf8mb4',
    ],
    'upload_dir'     => dirname(__DIR__) . '/assets/images/',
    'free_ship_from' => 199000,     // miễn phí vận chuyển từ mức này
    'ship_fee'       => 30000,
];
