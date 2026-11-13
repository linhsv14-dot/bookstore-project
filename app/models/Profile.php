<?php
/** Hồ sơ mở rộng của người dùng (quan hệ 1-1 với users). */
class Profile
{
    public static function get(int $userId): array
    {
        return Database::one(
            'SELECT u.id, u.name, u.email, u.phone, p.dob, p.address, p.avatar
             FROM users u LEFT JOIN user_profiles p ON p.user_id = u.id WHERE u.id = ?',
            [$userId]
        ) ?? [];
    }

    public static function update(int $userId, string $name, string $phone, ?string $dob, string $address): void
    {
        $pdo = Database::pdo();
        $pdo->beginTransaction();
        try {
            Database::run('UPDATE users SET name = ?, phone = ? WHERE id = ?', [$name, $phone !== '' ? $phone : null, $userId]);
            Database::run(
                'INSERT INTO user_profiles (user_id, dob, address) VALUES (?,?,?)
                 ON DUPLICATE KEY UPDATE dob = VALUES(dob), address = VALUES(address)',
                [$userId, $dob, $address]
            );
            $pdo->commit();
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            throw $e;
        }
    }

    public static function setAvatar(int $userId, string $path): void
    {
        Database::run(
            'INSERT INTO user_profiles (user_id, avatar) VALUES (?,?) ON DUPLICATE KEY UPDATE avatar = VALUES(avatar)',
            [$userId, $path]
        );
    }
}
