<?php
class UserController extends Controller {
    protected array $allowed = ['index', 'toggle', 'role'];
    protected string $page = 'users';

    public function index(): void {
        $q = trim($_GET['q'] ?? '');
        $p = page_no(); $per = 20; $total = 0;
        $users = User::search($q, $p, $per, $total);
        $this->render('users/index', ['title' => 'Người dùng', 'users' => $users, 'q' => $q, 'p' => $p, 'per' => $per, 'total' => $total]);
    }

    /** Khóa / mở khóa tài khoản (không tự khóa chính mình). */
    public function toggle(): void {
        $this->postOnly();
        $u = $this->target();
        User::setActive((int) $u['id'], (int) $u['is_active'] !== 1);
        flash((int) $u['is_active'] === 1 ? 'Đã khóa tài khoản.' : 'Đã mở khóa tài khoản.');
        redirect(a_url('users'));
    }

    /** Cấp / gỡ quyền admin (không tự đổi quyền của chính mình). */
    public function role(): void {
        $this->postOnly();
        $u = $this->target();
        $new = $u['role'] === 'admin' ? 'customer' : 'admin';
        User::setRole((int) $u['id'], $new);
        flash($new === 'admin' ? 'Đã cấp quyền admin.' : 'Đã gỡ quyền admin.');
        redirect(a_url('users'));
    }

    private function target(): array {
        $id = $this->idParam();
        $u = $id !== null ? User::find($id) : null;
        if (!$u) { flash('Không tìm thấy người dùng.', 'err'); redirect(a_url('users')); }
        if ((int) $u['id'] === (int) Auth::user()['id']) { flash('Không thể thao tác trên chính tài khoản đang đăng nhập.', 'err'); redirect(a_url('users')); }
        return $u;
    }
}
