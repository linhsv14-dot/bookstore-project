<?php
class Review {
    public static function search(int $bookId, int $page, int $per, &$total): array {
        $where = '1=1'; $p = [];
        if ($bookId > 0) { $where = 'r.book_id = ?'; $p = [$bookId]; }
        $total = (int) Database::val("SELECT COUNT(*) FROM reviews r WHERE $where", $p);
        $off = ($page - 1) * $per;
        return Database::all(
            "SELECT r.*, b.title AS book_title FROM reviews r JOIN books b ON b.id = r.book_id
             WHERE $where ORDER BY r.id DESC LIMIT $per OFFSET $off", $p
        );
    }
    public static function delete(int $id): void { Database::run('DELETE FROM reviews WHERE id = ?', [$id]); }
    public static function create(int $bookId, ?int $userId, string $name, int $stars, string $content, bool $verified): int {
        Database::run(
            'INSERT INTO reviews (book_id, user_id, name, stars, content, verified) VALUES (?,?,?,?,?,?)',
            [$bookId, $userId, $name, $stars, $content, $verified ? 1 : 0]
        );
        return Database::id();
    }
    public static function allForStore(): array {
        return Database::all('SELECT * FROM reviews ORDER BY created_at DESC, id DESC');
    }
}
