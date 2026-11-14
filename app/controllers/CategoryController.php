<?php
class CategoryController extends Controller {
    protected array $allowed = ['index', 'create', 'edit', 'save', 'delete'];
    protected string $page = 'categories';

    public function index(): void {
        $this->render('categories/index', ['title' => 'Danh mục', 'cats' => Category::all()]);
    }
    public function create(): void {
        $this->form(['id' => null, 'name' => '', 'slug' => '', 'emoji' => '📚', 'image' => '', 'description' => '', 'sort_order' => 0], [], 'Thêm danh mục');
    }
    public function edit(): void {
        $id = $this->idParam();
        $c = $id !== null ? Category::find($id) : null;
        if (!$c) { flash('Không tìm thấy danh mục.', 'err'); redirect(a_url('categories')); }
        $this->form($c, [], 'Sửa danh mục');
    }

    public function save(): void {
        $this->postOnly();
        $id = ($_POST['id'] ?? '') !== '' ? (int) $_POST['id'] : null;
        $old = $id !== null ? Category::find($id) : null;
        if ($id !== null && !$old) { flash('Không tìm thấy danh mục.', 'err'); redirect(a_url('categories')); }

        $name = trim($_POST['name'] ?? '');
        $slug = trim($_POST['slug'] ?? '');
        $d = [
            'name'        => $name,
            'slug'        => $slug !== '' ? mb_strtolower($slug) : slugify($name),
            'emoji'       => trim($_POST['emoji'] ?? '') ?: '📚',
            'image'       => trim($_POST['image'] ?? ''),
            'description' => trim($_POST['description'] ?? ''),
            'sort_order'  => (int) ($_POST['sort_order'] ?? 0),
        ];
        $err = [];
        if ($name === '' || mb_strlen($name) > 100) $err[] = 'Tên danh mục bắt buộc, tối đa 100 ký tự.';
        if (!preg_match('/^[\p{L}\p{N}-]+$/u', $d['slug'])) $err[] = 'Slug chỉ gồm chữ, số và dấu gạch ngang.';
        elseif (Category::slugTaken($d['slug'], $id ?? 0)) $err[] = 'Slug đã tồn tại.';
        if ($d['image'] !== '' && !preg_match('/^[^\/\\\\"\'<>]+$/u', $d['image'])) $err[] = 'Ảnh danh mục chỉ là tên file (nằm trong assets/images/).';
        try {
            $up = save_upload('image_file', 'cat_');
            if ($up) $d['image'] = $up;
        } catch (RuntimeException $e) { $err[] = $e->getMessage(); }

        if ($err) { $this->form($d + ['id' => $id], $err, $id !== null ? 'Sửa danh mục' : 'Thêm danh mục'); return; }
        Category::save($d, $id);
        flash($id !== null ? 'Đã cập nhật danh mục.' : 'Đã thêm danh mục.');
        redirect(a_url('categories'));
    }

    public function delete(): void {
        $this->postOnly();
        $id = $this->idParam();
        if ($id !== null) {
            if (Category::bookCount($id) > 0) flash('Danh mục còn sách, hãy chuyển sách sang danh mục khác trước khi xóa.', 'err');
            else { Category::delete($id); flash('Đã xóa danh mục.'); }
        }
        redirect(a_url('categories'));
    }

    private function form(array $cat, array $errors, string $title): void {
        $this->render('categories/form', ['title' => $title, 'cat' => $cat, 'errors' => $errors]);
    }
}
