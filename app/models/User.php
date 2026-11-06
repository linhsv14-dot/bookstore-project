<?php
class User {
    public static function findByEmail(string $email): ?array {
        return Database::one('SELECT * FROM users WHERE email = ?', [$email]);
    }
    public static function find(int $id): ?array {
        return Database::one('SELECT * FROM users WHERE id = ?', [$id]);
    }
    public static function create(string $name, string $email, string $phone, string $password, string $role = 'customer'): int {
        Database::run(
            'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?,?,?,?,?)',
            [$name, $email, $phone !== '' ? $phone : null, password_hash($password, PASSWORD_DEFAULT), $role]
        );
        return Database::id();
    }
    public static function updatePassword(int $id, string $password): void {
        Database::run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash($password, PASSWORD_DEFAULT), $id]);
    }
    public static function search(string $q, int $page, int $per, &$total): array {
        $where = '1=1'; $p = [];
        if ($q !== '') { $where = '(u.name LIKE ? OR u.email LIKE ?)'; $p = ["%$q%", "%$q%"]; }
        $total = (int) Database::val("SELECT COUNT(*) FROM users u WHERE $where", $p);
        $off = ($page - 1) * $per;
        return Database::all(
            "SELECT u.*, (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
             FROM users u WHERE $where ORDER BY u.id DESC LIMIT $per OFFSET $off", $p
        );
    }
    public static function setActive(int $id, bool $active): void {
        Database::run('UPDATE users SET is_active = ? WHERE id = ?', [$active ? 1 : 0, $id]);
    }
    public static function setRole(int $id, string $role): void {
        Database::run('UPDATE users SET role = ? WHERE id = ?', [$role, $id]);
    }
}
