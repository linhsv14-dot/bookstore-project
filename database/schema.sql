-- BookStore — cấu trúc CSDL (MySQL/MariaDB, utf8mb4)
-- Chạy file này trước, sau đó chạy seed.sql.
CREATE DATABASE IF NOT EXISTS bookstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bookstore;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  phone         VARCHAR(20) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  emoji       VARCHAR(16)  NOT NULL DEFAULT '📚',
  image       VARCHAR(255) NOT NULL DEFAULT '',
  description VARCHAR(255) NOT NULL DEFAULT '',
  sort_order  INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS books (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  author       VARCHAR(150) NOT NULL,
  category_id  INT UNSIGNED NOT NULL,
  price        INT UNSIGNED NOT NULL,
  orig_price   INT UNSIGNED NULL,
  description  TEXT NOT NULL,
  emoji        VARCHAR(8)   NOT NULL DEFAULT '',
  image        VARCHAR(255) NOT NULL DEFAULT '',
  bg           VARCHAR(255) NOT NULL DEFAULT 'linear-gradient(135deg,#2563eb,#7c3aed)',
  badge        ENUM('','hot','sale','new') NOT NULL DEFAULT '',
  tags         VARCHAR(100) NOT NULL DEFAULT '',          -- bestseller,new,sale (cách nhau dấu phẩy)
  rating       DECIMAL(2,1) NOT NULL DEFAULT 0,
  review_count INT UNSIGNED NOT NULL DEFAULT 0,
  pages        INT UNSIGNED NOT NULL DEFAULT 0,
  publisher    VARCHAR(150) NOT NULL DEFAULT '',
  `year`       SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  lang         VARCHAR(40)  NOT NULL DEFAULT 'Tiếng Việt',
  stock        INT UNSIGNED NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_books_cat (category_id),
  CONSTRAINT fk_books_cat FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  book_id    INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NULL,
  name       VARCHAR(100) NOT NULL,
  stars      TINYINT UNSIGNED NOT NULL,
  content    TEXT NOT NULL,
  helpful    INT UNSIGNED NOT NULL DEFAULT 0,
  verified   TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_reviews_book (book_id),
  CONSTRAINT fk_reviews_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS coupons (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code             VARCHAR(40) NOT NULL UNIQUE,
  discount_percent TINYINT UNSIGNED NOT NULL,
  min_order        INT UNSIGNED NOT NULL DEFAULT 0,
  is_active        TINYINT(1) NOT NULL DEFAULT 1,
  expires_at       DATE NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code           VARCHAR(20) NOT NULL UNIQUE,
  user_id        INT UNSIGNED NULL,
  customer_name  VARCHAR(100) NOT NULL,
  phone          VARCHAR(20)  NOT NULL,
  email          VARCHAR(190) NOT NULL,
  address        VARCHAR(255) NOT NULL,
  city           VARCHAR(100) NOT NULL DEFAULT '',
  district       VARCHAR(100) NOT NULL DEFAULT '',
  note           VARCHAR(255) NOT NULL DEFAULT '',
  payment_method ENUM('cod','momo','bank') NOT NULL DEFAULT 'cod',
  subtotal       INT UNSIGNED NOT NULL,
  shipping_fee   INT UNSIGNED NOT NULL DEFAULT 0,
  discount       INT UNSIGNED NOT NULL DEFAULT 0,
  total          INT UNSIGNED NOT NULL,
  coupon_code    VARCHAR(40) NULL,
  status         ENUM('pending','confirmed','shipping','delivered','cancelled') NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_orders_user (user_id),
  KEY idx_orders_status (status),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  book_id  INT UNSIGNED NULL,
  title    VARCHAR(200) NOT NULL,
  price    INT UNSIGNED NOT NULL,
  qty      INT UNSIGNED NOT NULL,
  KEY idx_items_order (order_id),
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_book  FOREIGN KEY (book_id)  REFERENCES books(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

-- Quan hệ 1-1: mỗi user có tối đa một hồ sơ mở rộng (khóa chính = khóa ngoại).
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INT UNSIGNED PRIMARY KEY,
  dob     DATE NULL,
  address VARCHAR(255) NOT NULL DEFAULT '',
  avatar  VARCHAR(255) NULL,
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Quan hệ N-N: một user yêu thích nhiều sách, một sách được nhiều user yêu thích.
CREATE TABLE IF NOT EXISTS wishlists (
  user_id    INT UNSIGNED NOT NULL,
  book_id    INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, book_id),
  KEY idx_wishlists_book (book_id),
  CONSTRAINT fk_wish_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_wish_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;
