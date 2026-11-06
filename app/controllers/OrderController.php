<?php
class OrderController extends Controller {
    protected array $allowed = ['index', 'show', 'status'];
    protected string $page = 'orders';

    public function index(): void {
        $status = $_GET['status'] ?? '';
        if (!isset(Order::STATUS[$status])) $status = '';
        $q = trim($_GET['q'] ?? '');
        $p = page_no(); $per = 15; $total = 0;
        $orders = Order::search($status, $q, $p, $per, $total);
        $this->render('orders/index', [
            'title' => 'Đơn hàng', 'orders' => $orders, 'status' => $status, 'q' => $q,
            'p' => $p, 'per' => $per, 'total' => $total,
        ]);
    }

    public function show(): void {
        $id = $this->idParam();
        $o = $id !== null ? Order::find($id) : null;
        if (!$o) { flash('Không tìm thấy đơn hàng.', 'err'); redirect(a_url('orders')); }
        $this->render('orders/show', ['title' => 'Đơn ' . $o['code'], 'o' => $o, 'items' => Order::items((int) $o['id'])]);
    }

    public function status(): void {
        $this->postOnly();
        $id = $this->idParam();
        $ok = $id !== null && Order::setStatus($id, (string) ($_POST['status'] ?? ''));
        flash($ok ? 'Đã cập nhật trạng thái đơn hàng.' : 'Không thể đổi trạng thái (đơn đã hủy hoặc không tồn tại).', $ok ? 'ok' : 'err');
        redirect(a_url('orders', 'show', ['id' => (int) $id]));
    }
}
