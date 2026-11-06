<?php
// Xuất dữ liệu từ MySQL dưới dạng JavaScript, cùng cấu trúc với js/data.js cũ
// (BOOKS, CATEGORIES + các hàm tiện ích) nên toàn bộ code giao diện chạy nguyên vẹn.
require __DIR__ . '/../app/bootstrap.php';

header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache');

$reviews = [];
foreach (Review::allForStore() as $r) {
    $reviews[(int) $r['book_id']][] = [
        'name'     => $r['name'],
        'stars'    => (int) $r['stars'],
        'date'     => date('d/m/Y', strtotime($r['created_at'])),
        'text'     => $r['content'],
        'helpful'  => (int) $r['helpful'],
        'verified' => (int) $r['verified'] === 1,
    ];
}

$books = [];
foreach (Book::allForStore() as $b) {
    $tags = array_merge(['all'], array_values(array_filter(explode(',', (string) $b['tags']))));
    $books[] = [
        'id'          => (int) $b['id'],
        'title'       => $b['title'],
        'author'      => $b['author'],
        'cat'         => $b['cat_name'],
        'catSlug'     => $b['cat_slug'],
        'price'       => (int) $b['price'],
        'orig'        => $b['orig_price'] !== null ? (int) $b['orig_price'] : null,
        'desc'        => $b['description'],
        'emoji'       => $b['emoji'],
        'image'       => $b['image'],
        'bg'          => $b['bg'],
        'badge'       => $b['badge'],
        'rating'      => (float) $b['rating'],
        'reviewCount' => (int) $b['review_count'],
        'pages'       => (int) $b['pages'],
        'publisher'   => $b['publisher'],
        'year'        => (int) $b['year'],
        'lang'        => $b['lang'],
        'stock'       => (int) $b['stock'],
        'tags'        => $tags,
        'reviews'     => $reviews[(int) $b['id']] ?? [],
    ];
}

$cats = [];
foreach (Category::all() as $c) {
    $cats[] = [
        'name'  => $c['name'],
        'slug'  => $c['slug'],
        'emoji' => $c['emoji'],
        'image' => $c['image'],
        'count' => (int) $c['book_count'],
        'desc'  => $c['description'],
    ];
}

$flags = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP;
echo 'const BOOKS = ', json_encode($books, $flags), ";\n";
echo 'const CATEGORIES = ', json_encode($cats, $flags), ";\n";
?>

/* Helper: tính % giảm giá */
function calcDiscount(orig, price) {
  if (!orig || orig <= price) return 0;
  return Math.round((orig - price) / orig * 100);
}

/* Helper: format giá VND */
function formatPrice(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

/* Helper: render sao */
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}
