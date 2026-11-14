<?php
class ReviewController extends Controller {
    protected array $allowed = ['index', 'delete'];
    protected string $page = 'reviews';

    public function index(): void {
        $book = (int) ($_GET['book'] ?? 0);
        $p = page_no(); $per = 20; $total = 0;
        $reviews = Review::search($book, $p, $per, $total);
        $this->render('reviews/index', [
            'title' => 'Đánh giá', 'reviews' => $reviews, 'book' => $book, 'p' => $p, 'per' => $per, 'total' => $total,
            'books' => Database::all('SELECT id, title FROM books ORDER BY title'),
        ]);
    }

    public function delete(): void {
        $this->postOnly();
        $id = $this->idParam();
        if ($id !== null) { Review::delete($id); flash('Đã xóa đánh giá.'); }
        redirect(a_url('reviews'));
    }
}
