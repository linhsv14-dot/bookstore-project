<?php
require __DIR__ . '/../app/bootstrap.php';

if (!Auth::isAdmin()) redirect('login.php');

$routes = [
    'dashboard'  => 'DashboardController',
    'books'      => 'BookController',
    'categories' => 'CategoryController',
    'orders'     => 'OrderController',
    'users'      => 'UserController',
    'reviews'    => 'ReviewController',
    'coupons'    => 'CouponController',
];
$page   = (string) ($_GET['page'] ?? 'dashboard');
$action = (string) ($_GET['action'] ?? 'index');

if (!isset($routes[$page])) { http_response_code(404); exit('Không tìm thấy trang.'); }
(new $routes[$page])->run($action);