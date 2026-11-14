<?php
abstract class Controller {
    protected array $allowed = ['index'];   // các action được phép gọi từ URL
    protected string $page = '';            // khóa menu đang active

    public function run(string $action): void {
        if (!in_array($action, $this->allowed, true) || !method_exists($this, $action)) {
            http_response_code(404);
            exit('Không tìm thấy trang.');
        }
        $this->$action();
    }
    protected function render(string $view, array $data = []): void {
        $data['active'] = $data['active'] ?? $this->page;
        extract($data, EXTR_SKIP);
        ob_start();
        require ROOT . '/app/views/' . $view . '.php';
        $content = ob_get_clean();
        require ROOT . '/app/views/layout.php';
    }
    protected function postOnly(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Method not allowed'); }
        csrf_check();
    }
    protected function idParam(): ?int {
        return isset($_GET['id']) && ctype_digit((string) $_GET['id']) ? (int) $_GET['id'] : null;
    }
}
