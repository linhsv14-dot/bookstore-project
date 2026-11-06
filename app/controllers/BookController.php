<?php
class BookController extends Controller {
    protected array $allowed = ['index', 'create', 'edit', 'save', 'delete'];
    protected string $page = 'books';

    public function index(): void {
        $q = trim($_GET['q'] ?? '');
        $cat = (int) ($_GET['cat'] ?? 0);
        $p = page_no(); $per = 15; $total = 0;
        $books = Book::search($q, $cat, $p, $per, $total);
        $this->render('books/index', [
            'title' => 'Quản lý sách', 'books' => $books, 'q' => $q, 'cat' => $cat,
            'p' => $p, 'per' => $per, 'total' => $total, 'cats' => Category::all(),
        ]);
    }

    public function create(): void {
        $this->form(['id' => null, 'title' => '', 'author' => '', 'category_id' => 0, 'price' => '', 'orig_price' => '',
                     'description' => '', 'image' => '', 'badge' => '', 'tags' => '', 'rating' => 0, 'review_count' => 0,
                     'pages' => '', 'publisher' => '', 'year' => date('Y'), 'lang' => 'Tiếng Việt', 'stock' => 0], [], 'Thêm sách');
    }

    public function edit(): void {
        $id = $this->idParam();
        $b = $id !== null ? Book::find($id) : null;
        if (!$b) { flash('Không tìm thấy sách.', 'err'); redirect(a_url('books')); }
        $this->form($b, [], 'Sửa sách #' . $b['id']);
    }

    public function save(): void {
        $this->postOnly();
        $id = ($_POST['id'] ?? '') !== '' ? (int) $_POST['id'] : null;
        $old = $id !== null ? Book::find($id) : null;
        if ($id !== null && !$old) { flash('Không tìm thấy sách.', 'err'); redirect(a_url('books')); }

        $d = $this->collect($old);
        $errors = $this->validate($d);
        try {
            $up = save_upload('image_file', 'bk_');
            if ($up) $d['image'] = 'assets/images/' . $up;
        } catch (RuntimeException $e) { $errors[] = $e->getMessage(); }

        if ($errors) {
            $this->form($d + ['id' => $id], $errors, $id !== null ? 'Sửa sách #' . $id : 'Thêm sách');
            return;
        }
        Book::save($d, $id);
        flash($id !== null ? 'Đã cập nhật sách.' : 'Đã thêm sách mới.');
        redirect(a_url('books'));
    }

    public function delete(): void {
        $this->postOnly();
        $id = $this->idParam();
        if ($id !== null) { Book::delete($id); flash('Đã xóa sách (đơn hàng cũ vẫn giữ tên sách).'); }
        redirect(a_url('books'));
    }

    private function form(array $book, array $errors, string $title): void {
        $this->render('books/form', ['title' => $title, 'book' => $book, 'errors' => $errors, 'cats' => Category::all()]);
    }

    private function collect(?array $old): array {
        $title = trim($_POST['title'] ?? '');
        $orig  = trim($_POST['orig_price'] ?? '');
        $tags  = array_values(array_intersect(Book::TAGS, (array) ($_POST['tags'] ?? [])));
        $badge = $_POST['badge'] ?? '';
        return [
            'title'        => $title,
            'author'       => trim($_POST['author'] ?? ''),
            'category_id'  => (int) ($_POST['category_id'] ?? 0),
            'price'        => (int) ($_POST['price'] ?? 0),
            'orig_price'   => $orig === '' ? null : (int) $orig,
            'description'  => trim($_POST['description'] ?? ''),
            'emoji'        => mb_strtoupper(mb_substr($title, 0, 1)),
            'image'        => trim($_POST['image'] ?? ''),
            'bg'           => $old['bg'] ?? Book::DEFAULT_BG,
            'badge'        => in_array($badge, Book::BADGES, true) ? $badge : '',
            'tags'         => implode(',', $tags),
            'rating'       => max(0, min(5, round((float) ($_POST['rating'] ?? 0), 1))),
            'review_count' => max(0, (int) ($_POST['review_count'] ?? 0)),
            'pages'        => max(0, (int) ($_POST['pages'] ?? 0)),
            'publisher'    => trim($_POST['publisher'] ?? ''),
            'year'         => (int) ($_POST['year'] ?? 0),
            'lang'         => trim($_POST['lang'] ?? '') ?: 'Tiếng Việt',
            'stock'        => max(0, (int) ($_POST['stock'] ?? 0)),
        ];
    }

    private function validate(array $d): array {
        $err = [];
        if ($d['title'] === '' || mb_strlen($d['title']) > 200) $err[] = 'Tên sách bắt buộc, tối đa 200 ký tự.';
        if ($d['author'] === '' || mb_strlen($d['author']) > 150) $err[] = 'Tác giả bắt buộc, tối đa 150 ký tự.';
        if (!Category::find($d['category_id'])) $err[] = 'Hãy chọn danh mục hợp lệ.';
        if ($d['price'] <= 0) $err[] = 'Giá bán phải lớn hơn 0.';
        if ($d['orig_price'] !== null && $d['orig_price'] <= $d['price']) $err[] = 'Giá gốc phải lớn hơn giá bán (hoặc để trống nếu không giảm giá).';
        if ($d['year'] !== 0 && ($d['year'] < 1900 || $d['year'] > 2100)) $err[] = 'Năm xuất bản không hợp lệ.';
        if ($d['image'] !== '' && (!preg_match('#^assets/images/[^"\'<>\\\\]+$#u', $d['image']) || strpos($d['image'], '..') !== false)) {
            $err[] = 'Đường dẫn ảnh phải nằm trong assets/images/ (hoặc hãy tải ảnh lên).';
        }
        return $err;
    }
}
