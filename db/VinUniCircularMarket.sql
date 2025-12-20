CREATE DATABASE IF NOT EXISTS VinUniCircularMarket;
USE VinUniCircularMarket;

-- 1. User
CREATE TABLE `User` (
  user_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name      VARCHAR(120)    NOT NULL,
  email          VARCHAR(255)    NOT NULL,
  password_hash  VARCHAR(255)    NOT NULL,
  phone          VARCHAR(30)     NULL,
  address        VARCHAR(255)    NULL,
  role           ENUM('admin','student') NOT NULL DEFAULT 'student',
  status         ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  avg_rating     DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  rating_count   INT UNSIGNED    NOT NULL DEFAULT 0,

  PRIMARY KEY (user_id),
  UNIQUE KEY uq_user_email (email),

  CONSTRAINT chk_user_avg_rating
    CHECK (avg_rating >= 0.00 AND avg_rating <= 5.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. Category
CREATE TABLE `Category` (
  category_id   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120)     NOT NULL,
  description   VARCHAR(255)    NULL,

  PRIMARY KEY (category_id),
  UNIQUE KEY uq_category_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Listing
CREATE TABLE `Listing` (
  listing_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  seller_id      BIGINT UNSIGNED NOT NULL,
  category_id    BIGINT UNSIGNED NOT NULL,
  title          VARCHAR(200)    NOT NULL,
  description    TEXT            NULL,
  `condition`    ENUM('new','like_new','used') NOT NULL,
  listing_type   ENUM('sell','lend') NOT NULL,
  list_price     DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  status         ENUM('available','reserved','sold','borrowed') NOT NULL DEFAULT 'available',
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (listing_id),

  KEY idx_listing_seller (seller_id),
  KEY idx_listing_category (category_id),
  KEY idx_listing_status_created (status, created_at),

  CONSTRAINT fk_listing_seller
    FOREIGN KEY (seller_id) REFERENCES `User`(user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_listing_category
    FOREIGN KEY (category_id) REFERENCES `Category`(category_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT chk_listing_list_price
    CHECK (list_price >= 0.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Order
CREATE TABLE `Order` (
  order_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id      BIGINT UNSIGNED NOT NULL,
  buyer_id        BIGINT UNSIGNED NOT NULL,
  offer_price     DECIMAL(10,2)   NULL,
  final_price     DECIMAL(10,2)   NULL,
  status          ENUM('requested','confirmed','rejected','cancelled','completed')
                  NOT NULL DEFAULT 'requested',
  order_date      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmed_at    DATETIME        NULL,
  completed_at    DATETIME        NULL,
  borrow_due_date DATETIME        NULL, -- borrow-specific
  returned_at     DATETIME        NULL, -- borrow-specific

  PRIMARY KEY (order_id),

  KEY idx_order_listing (listing_id),
  KEY idx_order_buyer (buyer_id),
  KEY idx_order_status_date (status, order_date),

  CONSTRAINT fk_order_listing
    FOREIGN KEY (listing_id) REFERENCES `Listing`(listing_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_order_buyer
    FOREIGN KEY (buyer_id) REFERENCES `User`(user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT chk_order_offer_price
    CHECK (offer_price IS NULL OR offer_price >= 0.00),

  CONSTRAINT chk_order_final_price
    CHECK (final_price IS NULL OR final_price >= 0.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. Review
CREATE TABLE `Review` (
  review_id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id      BIGINT UNSIGNED NOT NULL,
  rating        INT UNSIGNED NOT NULL,
  comment       TEXT            NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (review_id),
  UNIQUE KEY uq_review_order (order_id),

  CONSTRAINT fk_review_order
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT chk_review_rating
    CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. Comment
CREATE TABLE `Comment` (
  comment_id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id        BIGINT UNSIGNED NOT NULL,
  user_id           BIGINT UNSIGNED NOT NULL,
  content           TEXT            NOT NULL,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  parent_id         BIGINT UNSIGNED NULL,

  PRIMARY KEY (comment_id),

  KEY idx_comment_listing_created (listing_id, created_at),
  KEY idx_comment_user (user_id),
  KEY idx_comment_parent (parent_id),

  CONSTRAINT fk_comment_listing
    FOREIGN KEY (listing_id) REFERENCES `Listing`(listing_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_comment_user
    FOREIGN KEY (user_id) REFERENCES `User`(user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_comment_parent
    FOREIGN KEY (parent_id) REFERENCES `Comment`(comment_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;