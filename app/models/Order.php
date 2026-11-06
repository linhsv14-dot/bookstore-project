<?php
class Order {
    const STATUS = [
        'pending'   => 'Chờ xác nhận',
        'confirmed' => 'Đã xác nhận',
        'shipping'  => 'Đang giao',
        'delivered' => 'Đã giao',
        'cancelled' => 'Đã hủy',
    ];
    const PAYMENT = ['cod' => 'COD', 'momo' => 'MoMo', 'bank' => 'Chuyển khoản'];

    /**
     * Tạo đơn hàng. Giá, phí ship, giảm giá đều được TÍNH LẠI ở server
     * (không tin số liệu từ trình duyệt). Ném InvalidArgumentException nếu không hợp lệ.
     */
    public static function create(array $in, ?int $userId): array {
        $want = [];
        foreach ((array) ($in['items'] ?? []) as $it) {
            $id = isset($it['id']) && is_numeric($it['id']) ? (int) $it['id'] : -1;
            $q  = isset($it['qty']) && is_numeric($it['qty']) ? (int) $it['qty'] : 0;
            if ($id < 0 || $q < 1 || $q > 99) throw new InvalidArgumentException('Giỏ hàng không hợp lệ.');
            $want[$id] = ($want[$id] ?? 0) + $q;
        }
        if (!$want) throw new InvalidArgumentException('Chưa chọn sản phẩm nào.');
        ksort($want); // khóa theo thứ tự cố định để tránh deadlock

        $payment = array_key_exists($in['payment'] ?? '', self::PAYMENT) ? $in['payment'] : 'cod';
        $pdo = Database::pdo();
        $pdo->beginTransaction();
        try {
            $lines = []; $sub = 0;
            foreach ($want as $id => $q) {
                $b = Database::one('SELECT id, title, price, stock FROM books WHERE id = ? FOR UPDATE', [$id]);
                if (!$b) throw new InvalidArgumentException('Có sản phẩm không còn tồn tại.');
                if ((int) $b['stock'] < $q) {
                    throw new InvalidArgumentException('Sách "' . $b['title'] . '" chỉ còn ' . (int) $b['stock'] . ' cuốn.');
                }
                $lines[] = [$b, $q];
                $sub += (int) $b['price'] * $q;
            }
            $ship = $sub >= cfg('free_ship_from') ? 0 : (int) cfg('ship_fee');

            $code = strtoupper(trim((string) ($in['coupon'] ?? '')));
            $disc = 0;
            if ($code !== '') {
                $cp = Coupon::valid($code, $sub);
                if (!$cp) throw new InvalidArgumentException('Mã giảm giá không hợp lệ hoặc đơn chưa đủ điều kiện.');
                $disc = (int) round($sub * (int) $cp['discount_percent'] / 100);
            }
            $total = $sub + $ship - $disc;
            $orderCode = 'BS' . date('ymd') . strtoupper(bin2hex(random_bytes(3)));

            Database::run(
                'INSERT INTO orders (code, user_id, customer_name, phone, email, address, city, district, note,
                                     payment_method, subtotal, shipping_fee, discount, total, coupon_code)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [$orderCode, $userId, $in['name'], $in['phone'], $in['email'], $in['address'],
                 $in['city'] ?? '', $in['district'] ?? '', $in['note'] ?? '',
                 $payment, $sub, $ship, $disc, $total, $code !== '' ? $code : null]
            );
            $orderId = Database::id();
            foreach ($lines as [$b, $q]) {
                Database::run('INSERT INTO order_items (order_id, book_id, title, price, qty) VALUES (?,?,?,?,?)',
                              [$orderId, $b['id'], $b['title'], $b['price'], $q]);
                Database::run('UPDATE books SET stock = stock - ? WHERE id = ?', [$q, $b['id']]);
            }
            $pdo->commit();
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            throw $e;
        }
        return ['id' => $orderId, 'code' => $orderCode, 'subtotal' => $sub,
                'shipping' => $ship, 'discount' => $disc, 'total' => $total];
    }

    public static function search(string $status, string $q, int $page, int $per, &$total): array {
        $w = ['1=1']; $p = [];
        if ($status !== '') { $w[] = 'status = ?'; $p[] = $status; }
        if ($q !== '') {
            $w[] = '(code LIKE ? OR customer_name LIKE ? OR phone LIKE ?)';
            array_push($p, "%$q%", "%$q%", "%$q%");
        }
        $where = implode(' AND ', $w);
        $total = (int) Database::val("SELECT COUNT(*) FROM orders WHERE $where", $p);
        $off = ($page - 1) * $per;
        return Database::all("SELECT * FROM orders WHERE $where ORDER BY id DESC LIMIT $per OFFSET $off", $p);
    }
    public static function find(int $id): ?array { return Database::one('SELECT * FROM orders WHERE id = ?', [$id]); }
    public static function items(int $orderId): array {
        return Database::all('SELECT * FROM order_items WHERE order_id = ? ORDER BY id', [$orderId]);
    }

    /** Đổi trạng thái. Đơn đã hủy là trạng thái cuối; hủy đơn sẽ hoàn lại tồn kho. */
    public static function setStatus(int $id, string $status): bool {
        if (!isset(self::STATUS[$status])) return false;
        $pdo = Database::pdo();
        $pdo->beginTransaction();
        try {
            $o = Database::one('SELECT status FROM orders WHERE id = ? FOR UPDATE', [$id]);
            if (!$o || $o['status'] === 'cancelled') { $pdo->rollBack(); return false; }
            if ($status === 'cancelled') {
                $items = Database::all('SELECT book_id, qty FROM order_items WHERE order_id = ? AND book_id IS NOT NULL', [$id]);
                foreach ($items as $it) {
                    Database::run('UPDATE books SET stock = stock + ? WHERE id = ?', [$it['qty'], $it['book_id']]);
                }
            }
            Database::run('UPDATE orders SET status = ? WHERE id = ?', [$status, $id]);
            $pdo->commit();
            return true;
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            throw $e;
        }
    }

    /** Đơn của một khách (kèm danh sách món) cho trang profile. */
    public static function forUser(int $userId): array {
        $orders = Database::all(
            'SELECT id, code, status, total, payment_method, created_at FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 50',
            [$userId]
        );
        if (!$orders) return [];
        $ids = array_column($orders, 'id');
        $ph  = implode(',', array_fill(0, count($ids), '?'));
        $by  = [];
        foreach (Database::all("SELECT order_id, title, qty FROM order_items WHERE order_id IN ($ph)", $ids) as $it) {
            $by[$it['order_id']][] = ['title' => $it['title'], 'qty' => (int) $it['qty']];
        }
        foreach ($orders as &$o) { $o['items'] = $by[$o['id']] ?? []; }
        unset($o);
        return $orders;
    }

    /* ----- Thống kê cho dashboard ----- */
    public static function countByStatus(): array {
        $r = array_fill_keys(array_keys(self::STATUS), 0);
        foreach (Database::all('SELECT status, COUNT(*) AS n FROM orders GROUP BY status') as $row) {
            $r[$row['status']] = (int) $row['n'];
        }
        return $r;
    }
    public static function revenueDelivered(): int {
        return (int) Database::val("SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'delivered'");
    }
    public static function recent(int $n): array {
        return Database::all('SELECT * FROM orders ORDER BY id DESC LIMIT ' . (int) $n);
    }
    public static function topBooks(int $n): array {
        return Database::all(
            "SELECT oi.title, SUM(oi.qty) AS sold FROM order_items oi
             JOIN orders o ON o.id = oi.order_id WHERE o.status <> 'cancelled'
             GROUP BY oi.title ORDER BY sold DESC LIMIT " . (int) $n
        );
    }
}
