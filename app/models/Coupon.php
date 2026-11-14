<?php
class Coupon {
    public static function all(): array { return Database::all('SELECT * FROM coupons ORDER BY id DESC'); }
    public static function find(int $id): ?array { return Database::one('SELECT * FROM coupons WHERE id = ?', [$id]); }
    public static function codeTaken(string $code, int $exceptId = 0): bool {
        return (int) Database::val('SELECT COUNT(*) FROM coupons WHERE code = ? AND id <> ?', [$code, $exceptId]) > 0;
    }
    /** Mã còn hiệu lực và đơn đạt mức tối thiểu? Trả về dòng coupon hoặc null. */
    public static function valid(string $code, int $subtotal): ?array {
        $c = Database::one(
            'SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at >= CURDATE())',
            [$code]
        );
        if (!$c || $subtotal < (int) $c['min_order']) return null;
        return $c;
    }
    public static function save(array $d, ?int $id = null): int {
        $v = [$d['code'], $d['discount_percent'], $d['min_order'], $d['is_active'], $d['expires_at']];
        if ($id !== null) {
            Database::run('UPDATE coupons SET code=?, discount_percent=?, min_order=?, is_active=?, expires_at=? WHERE id=?', array_merge($v, [$id]));
            return $id;
        }
        Database::run('INSERT INTO coupons (code, discount_percent, min_order, is_active, expires_at) VALUES (?,?,?,?,?)', $v);
        return Database::id();
    }
    public static function delete(int $id): void { Database::run('DELETE FROM coupons WHERE id = ?', [$id]); }
}
