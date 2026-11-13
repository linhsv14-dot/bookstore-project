<?php
/** Danh sách yêu thích (quan hệ N-N giữa users và books). */
class Wishlist
{
    public static function ids(int $userId): array
    {
        return array_map('intval', array_column(
            Database::all('SELECT book_id FROM wishlists WHERE user_id = ? ORDER BY created_at', [$userId]),
            'book_id'
        ));
    }

    public static function set(int $userId, int $bookId, bool $on): void
    {
        if ($on) {
            Database::run('INSERT IGNORE INTO wishlists (user_id, book_id) VALUES (?,?)', [$userId, $bookId]);
        } else {
            Database::run('DELETE FROM wishlists WHERE user_id = ? AND book_id = ?', [$userId, $bookId]);
        }
    }
}
