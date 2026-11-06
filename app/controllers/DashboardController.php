<?php
class DashboardController extends Controller {
    protected string $page = 'dashboard';

    public function index(): void {
        $this->render('dashboard', [
            'title'      => 'Tổng quan',
            'booksCount' => (int) Database::val('SELECT COUNT(*) FROM books'),
            'ordersCount'=> (int) Database::val('SELECT COUNT(*) FROM orders'),
            'usersCount' => (int) Database::val("SELECT COUNT(*) FROM users WHERE role = 'customer'"),
            'revenue'    => Order::revenueDelivered(),
            'byStatus'   => Order::countByStatus(),
            'recent'     => Order::recent(6),
            'top'        => Order::topBooks(5),
            'lowStock'   => Database::all('SELECT id, title, stock FROM books WHERE stock < 20 ORDER BY stock, id LIMIT 8'),
        ]);
    }
}
