<?php
class CouponController extends Controller {
    protected array $allowed = ['index', 'create', 'edit', 'save', 'delete'];
    protected string $page = 'coupons';

    public function index(): void {
        $this->render('coupons/index', ['title' => 'Mã giảm giá', 'coupons' => Coupon::all()]);
    }
    public function create(): void {
        $this->form(['id' => null, 'code' => '', 'discount_percent' => 10, 'min_order' => 0, 'is_active' => 1, 'expires_at' => ''], [], 'Thêm mã giảm giá');
    }
    public function edit(): void {
        $id = $this->idParam();
        $c = $id !== null ? Coupon::find($id) : null;
        if (!$c) { flash('Không tìm thấy mã giảm giá.', 'err'); redirect(a_url('coupons')); }
        $this->form($c, [], 'Sửa mã giảm giá');
    }

    public function save(): void {
        $this->postOnly();
        $id = ($_POST['id'] ?? '') !== '' ? (int) $_POST['id'] : null;
        $exp = trim($_POST['expires_at'] ?? '');
        $d = [
            'code'             => strtoupper(trim($_POST['code'] ?? '')),
            'discount_percent' => (int) ($_POST['discount_percent'] ?? 0),
            'min_order'        => max(0, (int) ($_POST['min_order'] ?? 0)),
            'is_active'        => isset($_POST['is_active']) ? 1 : 0,
            'expires_at'       => $exp === '' ? null : $exp,
        ];
        $err = [];
        if (!preg_match('/^[A-Z0-9_-]{3,40}$/', $d['code'])) $err[] = 'Mã gồm 3–40 ký tự: chữ hoa, số, gạch ngang/gạch dưới.';
        elseif (Coupon::codeTaken($d['code'], $id ?? 0)) $err[] = 'Mã này đã tồn tại.';
        if ($d['discount_percent'] < 1 || $d['discount_percent'] > 100) $err[] = 'Phần trăm giảm từ 1 đến 100.';
        if ($d['expires_at'] !== null) {
            $dt = DateTime::createFromFormat('Y-m-d', $d['expires_at']);
            if (!$dt || $dt->format('Y-m-d') !== $d['expires_at']) $err[] = 'Ngày hết hạn không hợp lệ.';
        }
        if ($err) { $this->form($d + ['id' => $id], $err, $id !== null ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'); return; }
        Coupon::save($d, $id);
        flash('Đã lưu mã giảm giá.');
        redirect(a_url('coupons'));
    }

    public function delete(): void {
        $this->postOnly();
        $id = $this->idParam();
        if ($id !== null) { Coupon::delete($id); flash('Đã xóa mã giảm giá.'); }
        redirect(a_url('coupons'));
    }

    private function form(array $c, array $errors, string $title): void {
        $this->render('coupons/form', ['title' => $title, 'c' => $c, 'errors' => $errors]);
    }
}
