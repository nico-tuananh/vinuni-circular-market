SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `Category`;
TRUNCATE TABLE `Comment`;
TRUNCATE TABLE `Listing`;
TRUNCATE TABLE `Order`;
TRUNCATE TABLE `Review`;
TRUNCATE TABLE `User`;

SET FOREIGN_KEY_CHECKS = 1;
INSERT INTO `Category` (category_id, name, description) VALUES
  (1, 'Electronics', 'Phones, headphones, chargers, and everyday gadgets'),
  (2, 'Books', 'Textbooks, novels, and printed course materials'),
  (3, 'Furniture', 'Desks, chairs, shelves, and compact dorm furniture'),
  (4, 'Clothing', 'Jackets, hoodies, shoes, and seasonal clothing'),
  (5, 'Dorm Supplies', 'Bedding, storage items, hangers, and laundry essentials'),
  (6, 'Stationery', 'Notebooks, pens, calculators, and study organizers'),
  (7, 'Sports', 'Rackets, balls, gym accessories, and sports gear'),
  (8, 'Kitchen', 'Kettles, mugs, cookware, and lunch boxes'),
  (9, 'Bicycles', 'Bikes, helmets, locks, and basic bike parts'),
  (10, 'Home Decor', 'Lamps, posters, plants, and small decorations'),
  (11, 'Course Materials', 'Lecture notes, printouts, and reference handouts'),
  (12, 'Lab Equipment', 'Non-hazardous lab tools, kits, and components'),
  (13, 'Musical Instruments', 'Instruments and accessories for practice'),
  (14, 'Gaming', 'Consoles, controllers, games, and gaming peripherals'),
  (15, 'Phones', 'Smartphones and phone-specific accessories'),
  (16, 'Laptops', 'Laptops, chargers, sleeves, and laptop add-ons'),
  (17, 'Tablets', 'Tablets, stylus pens, and protective cases'),
  (18, 'Accessories', 'Bags, watches, sunglasses, and small accessories'),
  (19, 'Health & Beauty', 'Personal care items and beauty tools (clean/unused)'),
  (20, 'Others', 'Miscellaneous items not covered by other categories');
  
INSERT INTO `User` (user_id, full_name, email, password_hash, phone, address, role, status, created_at) VALUES
  (1,  'Nguyễn Thế An',        '23an.nt@vinuni.edu.vn',     'hash_01', '+84000000091', 'Gia Lam, Hanoi',      'admin',   'active',   '2025-09-02 00:00:00'),
  (2,  'Trần Minh Anh',        '25anh.tm@vinuni.edu.vn',    'hash_02', '+84000000092', 'VinUni Dorm, Hanoi',  'admin',   'active',   '2025-09-03 00:00:00'),
  (3,  'Lê Quang Huy',         '22huy.lq@vinuni.edu.vn',    'hash_03', '+84000000093', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-04 00:00:00'),
  (4,  'Phạm Thu Hà',          '24ha.pt@vinuni.edu.vn',     'hash_04', '+84000000094', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-05 00:00:00'),
  (5,  'Vũ Đức Long',          '23long.vd@vinuni.edu.vn',   'hash_05', '+84000000095', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-06 00:00:00'),
  (6,  'Đặng Hải Nam',         '25nam.dh@vinuni.edu.vn',    'hash_06', '+84000000096', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-07 00:00:00'),
  (7,  'Bùi Ngọc Anh',         '22anh.bn@vinuni.edu.vn',    'hash_07', '+84000000097', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-08 00:00:00'),
  (8,  'Hoàng Gia Bảo',        '24bao.hg@vinuni.edu.vn',    'hash_08', '+84000000098', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-09 00:00:00'),
  (9,  'Ngô Thanh Tùng',       '23tung.nt@vinuni.edu.vn',   'hash_09', '+84000000099', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-10 00:00:00'),
  (10, 'Đỗ Mai Linh',          '25linh.dm@vinuni.edu.vn',   'hash_10', '+84000000100', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-11 00:00:00'),
  (11, 'Phan Nhật Minh',       '22minh.pn@vinuni.edu.vn',   'hash_11', '+84000000101', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-12 00:00:00'),
  (12, 'Lý Khánh Vy',          '24vy.lk@vinuni.edu.vn',     'hash_12', '+84000000102', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-13 00:00:00'),
  (13, 'Đinh Anh Tuấn',        '23tuan.da@vinuni.edu.vn',   'hash_13', '+84000000103', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-14 00:00:00'),
  (14, 'Nguyễn Hoàng Phương',  '25phuong.nh@vinuni.edu.vn', 'hash_14', '+84000000104', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-15 00:00:00'),
  (15, 'Trương Quốc Hưng',     '22hung.tq@vinuni.edu.vn',   'hash_15', '+84000000105', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-16 00:00:00'),
  (16, 'Đào Thùy Dương',       '24duong.dt@vinuni.edu.vn',  'hash_16', '+84000000106', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-17 00:00:00'),
  (17, 'Võ Thành Đạt',         '23dat.vt@vinuni.edu.vn',    'hash_17', '+84000000107', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-18 00:00:00'),
  (18, 'Nguyễn Hải Yến',       '25yen.nh@vinuni.edu.vn',    'hash_18', '+84000000108', 'VinUni Dorm, Hanoi',  'student', 'inactive', '2025-09-19 00:00:00'),
  (19, 'Trần Đức Anh',         '22anh.td@vinuni.edu.vn',    'hash_19', '+84000000109', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-20 00:00:00'),
  (20, 'Lê Thu Trang',         '24trang.lt@vinuni.edu.vn',  'hash_20', '+84000000110', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-21 00:00:00');

INSERT INTO `Listing` (listing_id, seller_id, category_id, title, description, `condition`, listing_type, list_price, status, created_at, updated_at) VALUES
  (1, 3, 2, 'iPhone 12 64GB (Like New)', 'iPhone 12 64GB (Like New) - seeded sample listing.', 'used', 'sell', 3500000, 'available', '2025-10-02 09:00:00', '2025-10-02 11:00:00'),
  (2, 4, 3, 'Calculus Textbook (Used)', 'Calculus Textbook (Used) - seeded sample listing.', 'new', 'sell', 120000, 'available', '2025-10-03 09:00:00', '2025-10-03 11:00:00'),
  (3, 5, 4, 'Desk Lamp (New)', 'Desk Lamp (New) - seeded sample listing.', 'like_new', 'sell', 200000, 'available', '2025-10-04 09:00:00', '2025-10-04 11:00:00'),
  (4, 6, 5, 'Winter Jacket (Used)', 'Winter Jacket (Used) - seeded sample listing.', 'used', 'sell', 450000, 'available', '2025-10-05 09:00:00', '2025-10-05 11:00:00'),
  (5, 7, 6, 'Mechanical Keyboard (Like New)', 'Mechanical Keyboard (Like New) - seeded sample listing.', 'new', 'sell', 900000, 'reserved', '2025-10-06 09:00:00', '2025-10-06 11:00:00'),
  (6, 8, 7, 'Data Structures Book (Used)', 'Data Structures Book (Used) - seeded sample listing.', 'like_new', 'sell', 150000, 'reserved', '2025-10-07 09:00:00', '2025-10-07 11:00:00'),
  (7, 9, 8, 'Ergonomic Chair (Used)', 'Ergonomic Chair (Used) - seeded sample listing.', 'used', 'sell', 800000, 'reserved', '2025-10-08 09:00:00', '2025-10-08 11:00:00'),
  (8, 10, 9, 'VinUni Hoodie (New)', 'VinUni Hoodie (New) - seeded sample listing.', 'new', 'sell', 250000, 'reserved', '2025-10-09 09:00:00', '2025-10-09 11:00:00'),
  (9, 11, 10, 'Noise-cancelling Headphones (Like New)', 'Noise-cancelling Headphones (Like New) - seeded sample listing.', 'like_new', 'sell', 1000000, 'sold', '2025-10-10 09:00:00', '2025-10-10 11:00:00'),
  (10, 12, 11, 'MacBook Air M1 (Used)', 'MacBook Air M1 (Used) - seeded sample listing.', 'used', 'sell', 9500000, 'sold', '2025-10-11 09:00:00', '2025-10-11 11:00:00'),
  (11, 13, 12, 'Graph Notebook Pack (New)', 'Graph Notebook Pack (New) - seeded sample listing.', 'new', 'sell', 60000, 'sold', '2025-10-12 09:00:00', '2025-10-12 11:00:00'),
  (12, 14, 13, 'Gaming Mouse (Like New)', 'Gaming Mouse (Like New) - seeded sample listing.', 'like_new', 'sell', 300000, 'sold', '2025-10-13 09:00:00', '2025-10-13 11:00:00'),
  (13, 15, 14, 'Badminton Racket (Lend)', 'Badminton Racket (Lend) - seeded sample listing.', 'used', 'lend', 50000, 'available', '2025-10-14 09:00:00', '2025-10-14 11:00:00'),
  (14, 16, 15, 'Guitar (Lend)', 'Guitar (Lend) - seeded sample listing.', 'new', 'lend', 80000, 'available', '2025-10-15 09:00:00', '2025-10-15 11:00:00'),
  (15, 17, 16, 'Projector (Lend)', 'Projector (Lend) - seeded sample listing.', 'like_new', 'lend', 150000, 'available', '2025-10-16 09:00:00', '2025-10-16 11:00:00'),
  (16, 18, 17, 'Camera Tripod (Lend)', 'Camera Tripod (Lend) - seeded sample listing.', 'used', 'lend', 70000, 'available', '2025-10-17 09:00:00', '2025-10-17 11:00:00'),
  (17, 19, 18, 'Yoga Mat (Lend)', 'Yoga Mat (Lend) - seeded sample listing.', 'new', 'lend', 40000, 'borrowed', '2025-10-18 09:00:00', '2025-10-18 11:00:00'),
  (18, 20, 19, 'Power Drill (Lend)', 'Power Drill (Lend) - seeded sample listing.', 'like_new', 'lend', 100000, 'borrowed', '2025-10-19 09:00:00', '2025-10-19 11:00:00'),
  (19, 3, 20, 'Board Game Set (Lend)', 'Board Game Set (Lend) - seeded sample listing.', 'used', 'lend', 60000, 'borrowed', '2025-10-20 09:00:00', '2025-10-20 11:00:00'),
  (20, 4, 1, 'Calculator TI-84 (Lend)', 'Calculator TI-84 (Lend) - seeded sample listing.', 'new', 'lend', 30000, 'borrowed', '2025-10-21 09:00:00', '2025-10-21 11:00:00');

INSERT INTO `Order` (order_id, listing_id, buyer_id, offer_price, final_price, status, order_date, confirmed_at, completed_at, borrow_due_date, returned_at) VALUES
  (1, 5, 9, 810000, 810000, 'confirmed', '2025-10-10 10:00:00', '2025-10-10 12:00:00', NULL, NULL, NULL),
  (2, 6, 10, 135000, 135000, 'confirmed', '2025-10-11 10:00:00', '2025-10-11 12:00:00', NULL, NULL, NULL),
  (3, 7, 11, 720000, 720000, 'confirmed', '2025-10-12 10:00:00', '2025-10-12 12:00:00', NULL, NULL, NULL),
  (4, 8, 12, 225000, 225000, 'confirmed', '2025-10-13 10:00:00', '2025-10-13 12:00:00', NULL, NULL, NULL),
  (5, 9, 15, 950000, 950000, 'completed', '2025-10-14 10:00:00', '2025-10-14 13:00:00', '2025-10-15 16:00:00', NULL, NULL),
  (6, 10, 16, 9025000, 9025000, 'completed', '2025-10-15 10:00:00', '2025-10-15 13:00:00', '2025-10-16 16:00:00', NULL, NULL),
  (7, 11, 17, 57000, 57000, 'completed', '2025-10-16 10:00:00', '2025-10-16 13:00:00', '2025-10-17 16:00:00', NULL, NULL),
  (8, 12, 18, 285000, 285000, 'completed', '2025-10-17 10:00:00', '2025-10-17 13:00:00', '2025-10-18 16:00:00', NULL, NULL),
  (9, 1, 8, 2975000, NULL, 'requested', '2025-10-26 10:00:00', NULL, NULL, NULL, NULL),
  (10, 2, 9, 102000, NULL, 'rejected', '2025-10-27 10:00:00', NULL, NULL, NULL, NULL),
  (11, 3, 10, 170000, NULL, 'cancelled', '2025-10-28 10:00:00', NULL, NULL, NULL, NULL),
  (12, 4, 11, 382500, NULL, 'rejected', '2025-10-29 10:00:00', NULL, NULL, NULL, NULL),
  (13, 13, 11, 50000, 50000, 'completed', '2025-10-18 10:00:00', '2025-10-18 11:00:00', '2025-10-20 12:00:00', '2025-10-25 10:00:00', '2025-10-24 22:00:00'),
  (14, 14, 12, 80000, 80000, 'completed', '2025-10-19 10:00:00', '2025-10-19 11:00:00', '2025-10-21 12:00:00', '2025-10-26 10:00:00', '2025-10-25 22:00:00'),
  (15, 15, 13, 150000, 150000, 'completed', '2025-10-20 10:00:00', '2025-10-20 11:00:00', '2025-10-22 12:00:00', '2025-10-27 10:00:00', '2025-10-26 22:00:00'),
  (16, 16, 14, 70000, 70000, 'completed', '2025-10-21 10:00:00', '2025-10-21 11:00:00', '2025-10-23 12:00:00', '2025-10-28 10:00:00', '2025-10-27 22:00:00'),
  (17, 17, 14, 40000, 40000, 'confirmed', '2025-10-22 10:00:00', '2025-10-22 12:00:00', NULL, '2025-11-01 10:00:00', NULL),
  (18, 18, 15, 100000, 100000, 'confirmed', '2025-10-23 10:00:00', '2025-10-23 12:00:00', NULL, '2025-11-02 10:00:00', NULL),
  (19, 19, 12, 60000, 60000, 'confirmed', '2025-10-24 10:00:00', '2025-10-24 12:00:00', NULL, '2025-11-03 10:00:00', NULL),
  (20, 20, 13, 30000, 30000, 'confirmed', '2025-10-25 10:00:00', '2025-10-25 12:00:00', NULL, '2025-11-04 10:00:00', NULL);

INSERT INTO `Review` (review_id, order_id, rating, comment, created_at) VALUES
  (1, 1, 5, 'Excellent — smooth transaction!', '2025-10-16 15:00:00'),
  (2, 2, 4, 'Good — item matched the description.', '2025-10-17 15:00:00'),
  (3, 3, 4, 'Good communication and on-time meetup.', '2025-10-18 15:00:00'),
  (4, 4, 3, 'Okay — everything worked, minor delays.', '2025-10-19 15:00:00'),
  (5, 5, 5, 'Great seller — highly recommended!', '2025-10-20 15:00:00'),
  (6, 6, 4, 'Good deal, friendly interaction.', '2025-10-21 15:00:00'),
  (7, 7, 3, 'Decent — acceptable condition for the price.', '2025-10-22 15:00:00'),
  (8, 8, 5, 'Perfect — exactly as advertised.', '2025-10-23 15:00:00'),
  (9, 9, 4, 'Good — quick and easy.', '2025-10-24 15:00:00'),
  (10, 10, 3, 'Okay — could be faster to respond.', '2025-10-25 15:00:00'),
  (11, 11, 5, 'Excellent experience overall!', '2025-10-26 15:00:00'),
  (12, 12, 5, 'Great quality — would buy again.', '2025-10-27 15:00:00'),
  (13, 13, 4, 'Good — returned on time and clean.', '2025-10-28 15:00:00'),
  (14, 14, 3, 'Okay — worked fine for borrowing.', '2025-10-29 15:00:00'),
  (15, 15, 4, 'Good — helpful and cooperative.', '2025-10-30 15:00:00'),
  (16, 16, 5, 'Excellent — very reliable!', '2025-10-31 15:00:00'),
  (17, 17, 3, 'Okay — item was usable, slight wear.', '2025-11-01 15:00:00'),
  (18, 18, 4, 'Good — clear instructions and pickup.', '2025-11-02 15:00:00'),
  (19, 19, 5, 'Amazing — super smooth process!', '2025-11-03 15:00:00'),
  (20, 20, 4, 'Good — thanks!', '2025-11-04 15:00:00');
  
INSERT INTO `Comment` (comment_id, listing_id, user_id, content, created_at, parent_id) VALUES
  (1, 2, 2, 'Comment 1: Interested! Is this still available?', '2025-10-20 11:00:00', NULL),
  (2, 3, 3, 'Comment 2: Interested! Is this still available?', '2025-10-20 14:00:00', NULL),
  (3, 4, 4, 'Comment 3: Interested! Is this still available?', '2025-10-20 17:00:00', NULL),
  (4, 5, 5, 'Comment 4: Interested! Is this still available?', '2025-10-20 20:00:00', NULL),
  (5, 6, 6, 'Comment 5: Interested! Is this still available?', '2025-10-20 23:00:00', NULL),
  (6, 7, 7, 'Comment 6: Interested! Is this still available?', '2025-10-21 02:00:00', NULL),
  (7, 8, 8, 'Comment 7: Interested! Is this still available?', '2025-10-21 05:00:00', NULL),
  (8, 9, 9, 'Comment 8: Interested! Is this still available?', '2025-10-21 08:00:00', NULL),
  (9, 10, 10, 'Comment 9: Interested! Is this still available?', '2025-10-21 11:00:00', NULL),
  (10, 11, 11, 'Comment 10: Interested! Is this still available?', '2025-10-21 14:00:00', NULL),
  (11, 12, 12, 'Comment 11: Interested! Is this still available?', '2025-10-21 17:00:00', NULL),
  (12, 13, 13, 'Comment 12: Interested! Is this still available?', '2025-10-21 20:00:00', NULL),
  (13, 14, 14, 'Comment 13: Interested! Is this still available?', '2025-10-21 23:00:00', NULL),
  (14, 15, 15, 'Comment 14: Interested! Is this still available?', '2025-10-22 02:00:00', NULL),
  (15, 16, 16, 'Comment 15: Interested! Is this still available?', '2025-10-22 05:00:00', NULL),
  (16, 2, 17, 'Reply 16 -> 1: Yes, please DM me.', '2025-10-22 08:00:00', 1),
  (17, 3, 18, 'Reply 17 -> 2: Yes, please DM me.', '2025-10-22 11:00:00', 2),
  (18, 4, 19, 'Reply 18 -> 3: Yes, please DM me.', '2025-10-22 14:00:00', 3),
  (19, 5, 20, 'Reply 19 -> 4: Yes, please DM me.', '2025-10-22 17:00:00', 4),
  (20, 6, 1, 'Reply 20 -> 5: Yes, please DM me.', '2025-10-22 20:00:00', 5);
  