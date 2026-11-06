<?php
class Book {
    const TAGS   = ['bestseller', 'new', 'sale'];
    const BADGES = ['', 'hot', 'sale', 'new'];
    const DEFAULT_BG = 'linear-gradient(135deg,#2563eb,#7c3aed)';
    const COLS = ['title', 'author', 'category_id', 'price', 'orig_price', 'description', 'emoji', 'image', 'bg',
                  'badge', 'tags', 'rating', 'review_count', 'pages', 'publisher', 'year', 'lang', 'stock'];

    public static function search(string $q, int $cat, int $page, int $per, &$total): array {
        $w = ['1=1']; $p = [];
        if ($q !== '') { $w[] = '(b.title LIKE ? OR b.author LIKE ?)'; $p[] = "%$q%"; $p[] = "%$q%"; }
        if ($cat > 0)  { $w[] = 'b.category_id = ?'; $p[] = $cat; }
        $where = implode(' AND ', $w);
        $total = (int) Database::val("SELECT COUNT(*) FROM books b WHERE $where", $p);
        $off = ($page - 1) * $per;
        return Database::all(
            "SELECT b.*, c.name AS cat_name FROM books b JOIN categories c ON c.id = b.category_id
             WHERE $where ORDER BY b.id DESC LIMIT $per OFFSET $off", $p
        );
    }
    public static function find(int $id): ?array {
        return Database::one('SELECT * FROM books WHERE id = ?', [$id]);
    }
    public static function save(array $d, ?int $id = null): int {
        $vals = [];
        foreach (self::COLS as $c) $vals[] = $d[$c];
        if ($id !== null) {
            $set = implode(', ', array_map(fn($c) => "`$c` = ?", self::COLS));
            Database::run("UPDATE books SET $set WHERE id = ?", array_merge($vals, [$id]));
            return $id;
        }
        $cols = implode(', ', array_map(fn($c) => "`$c`", self::COLS));
        $ph   = implode(', ', array_fill(0, count(self::COLS), '?'));
        Database::run("INSERT INTO books ($cols) VALUES ($ph)", $vals);
        return Database::id();
    }
    public static function delete(int $id): void {
        Database::run('DELETE FROM books WHERE id = ?', [$id]);
    }
    /** Toàn bộ sách (kèm danh mục) cho api/data.php. */
    public static function allForStore(): array {
        return Database::all(
            'SELECT b.*, c.name AS cat_name, c.slug AS cat_slug
             FROM books b JOIN categories c ON c.id = b.category_id ORDER BY b.id'
        );
    }
}
