-- 1) Views
-- 1.1 vw_active_listings — Active listings for browsing
CREATE OR REPLACE VIEW vw_active_listings AS
SELECT
  l.listing_id,
  l.title,
  l.description,
  l.`condition`,
  l.listing_type,
  l.list_price,
  l.status,
  l.created_at,
  u.user_id AS seller_id,
  u.full_name AS seller_name,
  u.email AS seller_email,
  c.category_id,
  c.name AS category_name
FROM `Listing` l
JOIN `User` u ON u.user_id = l.seller_id
JOIN `Category` c ON c.category_id = l.category_id
WHERE l.status = 'available';

-- 1.2 vw_monthly_orders — Orders per month (completed orders)
CREATE OR REPLACE VIEW vw_monthly_orders AS
SELECT
  DATE_FORMAT(COALESCE(o.completed_at, o.order_date), '%Y-%m') AS yearmonth,
  COUNT(*) AS completed_orders,
  SUM(COALESCE(o.final_price, 0)) AS total_revenue
FROM `Order` o
WHERE o.status = 'completed'
GROUP BY DATE_FORMAT(COALESCE(o.completed_at, o.order_date), '%Y-%m');

-- 1.3 vw_top_sellers — Top-rated sellers
CREATE OR REPLACE VIEW vw_top_sellers AS
SELECT
  u.user_id AS seller_id,
  u.full_name AS seller_name,
  u.email AS seller_email,
  u.rating_count,
  u.avg_rating
FROM `User` u
WHERE u.rating_count > 0
ORDER BY u.avg_rating DESC, u.rating_count DESC;

-- 2) Indexes
-- 2.1 Listing browsing, filtering, and sorting
CREATE INDEX idx_listing_status_category_created
ON `Listing`(status, category_id, created_at);

CREATE INDEX idx_listing_status_price
ON `Listing`(status, list_price);

CREATE INDEX idx_listing_seller_created
ON `Listing`(seller_id, created_at);

-- 2.2 Full-text search for keyword search
ALTER TABLE `Listing`
ADD FULLTEXT INDEX ft_listing_title_desc (title, description);

-- 2.3 Orders: seller workflow, buyer history, analytics
CREATE INDEX idx_order_listing_status
ON `Order`(listing_id, status);

CREATE INDEX idx_order_buyer_date
ON `Order`(buyer_id, order_date);

CREATE INDEX idx_order_status_completed
ON `Order`(status, completed_at);

-- 3) Stored Procedures
-- 3.1. Refresh seller ratings: Update a seller's average rating and review count based on completed transactions
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_refresh_seller_rating$$
CREATE PROCEDURE sp_refresh_seller_rating(IN p_seller_id BIGINT UNSIGNED)
BEGIN
  UPDATE `User` u
  LEFT JOIN (
    SELECT
      l.seller_id AS seller_id,
      COUNT(*) AS rating_count,
      ROUND(AVG(r.rating), 2) AS avg_rating
    FROM `Review` r
    JOIN `Order`  o ON o.order_id   = r.order_id
    JOIN `Listing` l ON l.listing_id = o.listing_id
    WHERE l.seller_id = p_seller_id
    GROUP BY l.seller_id
  ) x ON x.seller_id = u.user_id
  SET
    u.rating_count = COALESCE(x.rating_count, 0),
    u.avg_rating   = COALESCE(x.avg_rating, 0.00)
  WHERE u.user_id = p_seller_id;
END$$

DELIMITER ;

-- 3.2. Confirm order and prevent double-selling: Confirms a pending order and updates listing status atomically to prevent race conditions
DELIMITER $$

CREATE PROCEDURE sp_confirm_order(IN p_order_id BIGINT UNSIGNED)
BEGIN
  DECLARE v_listing_id BIGINT UNSIGNED;
  DECLARE v_listing_type ENUM('sell','lend');
  DECLARE v_listing_status ENUM('available','reserved','sold','borrowed');
  DECLARE v_conflicts INT DEFAULT 0;

  START TRANSACTION;

  -- Lock the order row and get listing_id
  SELECT o.listing_id INTO v_listing_id
  FROM `Order` o
  WHERE o.order_id = p_order_id
  FOR UPDATE;

  IF v_listing_id IS NULL THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order not found.';
  END IF;

  -- Lock the listing row (this is the key lock to prevent race)
  SELECT l.listing_type, l.status
  INTO v_listing_type, v_listing_status
  FROM Listing l
  WHERE l.listing_id = v_listing_id
  FOR UPDATE;

  -- Listing must be available to confirm
  IF v_listing_status <> 'available' THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Listing is not available.';
  END IF;

  -- Conflicts: another order still competing/active for the same listing
  SELECT COUNT(*) INTO v_conflicts
  FROM `Order` o
  WHERE o.listing_id = v_listing_id
    AND o.order_id <> p_order_id
    AND o.status IN ('requested','confirmed');

  IF v_conflicts > 0 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Conflict: another active order exists for this listing.';
  END IF;

  -- Confirm this order (only from requested)
  UPDATE `Order`
  SET status = 'confirmed'
  WHERE order_id = p_order_id
    AND status = 'requested';

  IF ROW_COUNT() = 0 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order cannot be confirmed (must be requested).';
  END IF;

  -- Update listing status atomically
  IF v_listing_type = 'sell' THEN
    UPDATE Listing SET status = 'reserved'
    WHERE listing_id = v_listing_id;
  ELSE
    UPDATE Listing SET status = 'borrowed'
    WHERE listing_id = v_listing_id;
  END IF;

  COMMIT;
END$$

DELIMITER ;

-- 3.3. Reject requested order: Rejects a requested order, preventing it from being confirmed
DELIMITER $$

CREATE PROCEDURE sp_reject_order(IN p_order_id BIGINT UNSIGNED)
BEGIN
  START TRANSACTION;

  UPDATE `Order`
  SET status = 'rejected'
  WHERE order_id = p_order_id
    AND status = 'requested';

  IF ROW_COUNT() = 0 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order cannot be rejected (must be requested).';
  END IF;

  COMMIT;
END$$

DELIMITER ;

-- 3.4. Cancel requested order: Cancels a requested order before it gets confirmed
DELIMITER $$

CREATE PROCEDURE sp_cancel_order(IN p_order_id BIGINT UNSIGNED)
BEGIN
  START TRANSACTION;

  UPDATE `Order`
  SET status = 'cancelled'
  WHERE order_id = p_order_id
    AND status IN ('requested');  -- thường chỉ cho cancel khi chưa confirmed

  IF ROW_COUNT() = 0 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order cannot be cancelled (must be requested).';
  END IF;

  COMMIT;
END$$

DELIMITER ;

-- 3.5. Complete confirmed order: Marks a confirmed order as completed and handles listing status transitions
DROP PROCEDURE IF EXISTS sp_complete_order;

DELIMITER $$

CREATE PROCEDURE sp_complete_order(IN p_order_id BIGINT UNSIGNED)
BEGIN
  DECLARE v_listing_id BIGINT UNSIGNED;
  DECLARE v_listing_type ENUM('sell','lend');
  DECLARE v_listing_status ENUM('available','reserved','sold','borrowed');

  START TRANSACTION;

  -- Lock order and get listing_id
  SELECT o.listing_id INTO v_listing_id
  FROM `Order` o
  WHERE o.order_id = p_order_id
  FOR UPDATE;

  IF v_listing_id IS NULL THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order not found.';
  END IF;

  -- Lock listing
  SELECT l.listing_type, l.status
  INTO v_listing_type, v_listing_status
  FROM Listing l
  WHERE l.listing_id = v_listing_id
  FOR UPDATE;

  -- Must be confirmed to complete
  UPDATE `Order`
  SET status = 'completed'
  WHERE order_id = p_order_id
    AND status = 'confirmed';

  IF ROW_COUNT() = 0 THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order cannot be completed (must be confirmed).';
  END IF;

  IF v_listing_type = 'sell' THEN
    -- sell: reserved -> sold
    IF v_listing_status <> 'reserved' THEN
      ROLLBACK;
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Listing status mismatch for sell completion.';
    END IF;

    UPDATE Listing SET status = 'sold'
    WHERE listing_id = v_listing_id;

  ELSE
    -- lend: record return time, then release listing
    UPDATE `Order`
    SET returned_at = NOW(),
      completed_at = NOW()
    WHERE order_id = p_order_id;

    UPDATE `Listing` SET status = 'available'
    WHERE listing_id = v_listing_id;
  END IF;

  COMMIT;
END$$

DELIMITER ;

-- 4) Triggers
-- 4.1. Review: Automatically refreshes seller ratings after review changes
DELIMITER $$

DROP TRIGGER IF EXISTS trg_review_ai$$
CREATE TRIGGER trg_review_ai
AFTER INSERT ON `Review`
FOR EACH ROW
BEGIN
  DECLARE v_seller_id BIGINT UNSIGNED;

  SELECT l.seller_id INTO v_seller_id
  FROM `Order` o
  JOIN `Listing` l ON l.listing_id = o.listing_id
  WHERE o.order_id = NEW.order_id;

  IF v_seller_id IS NOT NULL THEN
    CALL sp_refresh_seller_rating(v_seller_id);
  END IF;
END$$

DROP TRIGGER IF EXISTS trg_review_ad$$
CREATE TRIGGER trg_review_ad
AFTER DELETE ON `Review`
FOR EACH ROW
BEGIN
  DECLARE v_seller_id BIGINT UNSIGNED;

  SELECT l.seller_id INTO v_seller_id
  FROM `Order` o
  JOIN `Listing` l ON l.listing_id = o.listing_id
  WHERE o.order_id = OLD.order_id;

  IF v_seller_id IS NOT NULL THEN
    CALL sp_refresh_seller_rating(v_seller_id);
  END IF;
END$$

-- 4.2. Ensure VinUni email: Ensures that the email is a VinUni email before insert or update
DELIMITER $$

CREATE TRIGGER trg_user_email_vinuni_bi
BEFORE INSERT ON `User`
FOR EACH ROW
BEGIN
  IF LOWER(NEW.email) NOT REGEXP '^[a-z0-9._%+-]+@vinuni\\.edu\\.vn$' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Registration requires a VinUni email (@vinuni.edu.vn).';
  END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_user_email_vinuni_bu
BEFORE UPDATE ON `User`
FOR EACH ROW
BEGIN
  IF NEW.email <> OLD.email THEN
    IF LOWER(NEW.email) NOT REGEXP '^[a-z0-9._%+-]+@vinuni\\.edu\\.vn$' THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email must remain a VinUni email (@vinuni.edu.vn).';
    END IF;
  END IF;
END$$

DELIMITER ;