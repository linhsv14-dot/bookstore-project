<?php
class Category {
    public static function all(): array {
        return Database::all(
            'SELECT c.*, (SELECT COUNT(*) FROM books b WHERE b.category_id = c.id) AS book_count
             FROM categories c ORDER BY c.sort_order, c.id'
        );
    }
    public static function find(int $id): ?array {
        return Database::one('SELECT * FROM categories WHERE id = ?', [$id]);
    }
    public static function slugTaken(string $slug, int $exceptId = 0): bool {
        return (int) Database::val('SELECT COUNT(*) FROM categories WHERE slug = ? AND id <> ?', [$slug, $exceptId]) > 0;
    }
    public static function bookCount(int $id): int {
        return (int) Database::val('SELECT COUNT(*) FROM books WHERE category_id = ?', [$id]);
    }
    public static function save(array $d, ?int $id = null): int {
        $v = [$d['name'], $d['slug'], $d['emoji'], $d['image'], $d['description'], $d['sort_order']];
        if ($id !== null) {
            Database::run('UPDATE categories SET name=?, slug=?, emoji=?, image=?, description=?, sort_order=? WHERE id=?', array_merge($v, [$id]));
            return $id;
        }
        Database::run('INSERT INTO categories (name, slug, emoji, image, description, sort_order) VALUES (?,?,?,?,?,?)', $v);
        return Database::id();
    }
    public static function delete(int $id): void {
        Database::run('DELETE FROM categories WHERE id = ?', [$id]);
    }
}
