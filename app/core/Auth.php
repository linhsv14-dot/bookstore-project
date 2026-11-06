<?php
class Auth {
    public static function user(): ?array { return $_SESSION['user'] ?? null; }
    public static function isAdmin(): bool { return (self::user()['role'] ?? '') === 'admin'; }

    public static function login(array $u): void {
        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id' => (int) $u['id'], 'name' => $u['name'],
            'email' => $u['email'], 'role' => $u['role'],
        ];
    }
    public static function logout(): void {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    /** Trả về user nếu email + mật khẩu đúng và tài khoản chưa bị khóa. */
    public static function attempt(string $email, string $password): ?array {
        $u = User::findByEmail($email);
        if ($u && (int) $u['is_active'] === 1 && password_verify($password, $u['password_hash'])) return $u;
        usleep(400000); // làm chậm dò mật khẩu
        return null;
    }
}
