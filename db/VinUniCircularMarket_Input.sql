SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `Category`;
TRUNCATE TABLE `Comment`;
TRUNCATE TABLE `Listing`;
TRUNCATE TABLE `Order`;
TRUNCATE TABLE `Review`;
TRUNCATE TABLE `User`;

SET FOREIGN_KEY_CHECKS = 1;
INSERT INTO `Category` (name, description) VALUES
  ('Electronics', 'Phones, headphones, chargers, and everyday gadgets'),
  ('Books', 'Textbooks, novels, and printed course materials'),
  ('Furniture', 'Desks, chairs, shelves, and compact dorm furniture'),
  ('Clothing', 'Jackets, hoodies, shoes, and seasonal clothing'),
  ('Dorm Supplies', 'Bedding, storage items, hangers, and laundry essentials'),
  ('Stationery', 'Notebooks, pens, calculators, and study organizers'),
  ('Sports', 'Rackets, balls, gym accessories, and sports gear'),
  ('Kitchen', 'Kettles, mugs, cookware, and lunch boxes'),
  ('Bicycles', 'Bikes, helmets, locks, and basic bike parts'),
  ('Home Decor', 'Lamps, posters, plants, and small decorations'),
  ('Course Materials', 'Lecture notes, printouts, and reference handouts'),
  ('Lab Equipment', 'Non-hazardous lab tools, kits, and components'),
  ('Musical Instruments', 'Instruments and accessories for practice'),
  ('Gaming', 'Consoles, controllers, games, and gaming peripherals'),
  ('Phones', 'Smartphones and phone-specific accessories'),
  ('Laptops', 'Laptops, chargers, sleeves, and laptop add-ons'),
  ('Tablets', 'Tablets, stylus pens, and protective cases'),
  ('Accessories', 'Bags, watches, sunglasses, and small accessories'),
  ('Health & Beauty', 'Personal care items and beauty tools (clean/unused)'),
  ('Others', 'Miscellaneous items not covered by other categories');

INSERT INTO `User` (full_name, email, password_hash, phone, address, role, status, created_at) VALUES
  ('Nguyễn Thế An',        '23an.nt@vinuni.edu.vn',     'hash_01', '+84000000091', 'Gia Lam, Hanoi',      'admin',   'active',   '2025-09-02 00:00:00'),
  ('Trần Minh Anh',        '25anh.tm@vinuni.edu.vn',    'hash_02', '+84000000092', 'VinUni Dorm, Hanoi',  'admin',   'active',   '2025-09-03 00:00:00'),
  ('Lê Quang Huy',         '22huy.lq@vinuni.edu.vn',    'hash_03', '+84000000093', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-04 00:00:00'),
  ('Phạm Thu Hà',          '24ha.pt@vinuni.edu.vn',     'hash_04', '+84000000094', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-05 00:00:00'),
  ('Vũ Đức Long',          '23long.vd@vinuni.edu.vn',   'hash_05', '+84000000095', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-06 00:00:00'),
  ('Đặng Hải Nam',         '25nam.dh@vinuni.edu.vn',    'hash_06', '+84000000096', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-07 00:00:00'),
  ('Bùi Ngọc Anh',         '22anh.bn@vinuni.edu.vn',    'hash_07', '+84000000097', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-08 00:00:00'),
  ('Hoàng Gia Bảo',        '24bao.hg@vinuni.edu.vn',    'hash_08', '+84000000098', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-09 00:00:00'),
  ('Ngô Thanh Tùng',       '23tung.nt@vinuni.edu.vn',   'hash_09', '+84000000099', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-10 00:00:00'),
  ('Đỗ Mai Linh',          '25linh.dm@vinuni.edu.vn',   'hash_10', '+84000000100', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-11 00:00:00'),
  ('Phan Nhật Minh',       '22minh.pn@vinuni.edu.vn',   'hash_11', '+84000000101', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-12 00:00:00'),
  ('Lý Khánh Vy',          '24vy.lk@vinuni.edu.vn',     'hash_12', '+84000000102', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-13 00:00:00'),
  ('Đinh Anh Tuấn',        '23tuan.da@vinuni.edu.vn',   'hash_13', '+84000000103', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-14 00:00:00'),
  ('Nguyễn Hoàng Phương',  '25phuong.nh@vinuni.edu.vn', 'hash_14', '+84000000104', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-15 00:00:00'),
  ('Trương Quốc Hưng',     '22hung.tq@vinuni.edu.vn',   'hash_15', '+84000000105', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-16 00:00:00'),
  ('Đào Thùy Dương',       '24duong.dt@vinuni.edu.vn',  'hash_16', '+84000000106', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-17 00:00:00'),
  ('Võ Thành Đạt',         '23dat.vt@vinuni.edu.vn',    'hash_17', '+84000000107', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-18 00:00:00'),
  ('Nguyễn Hải Yến',       '25yen.nh@vinuni.edu.vn',    'hash_18', '+84000000108', 'VinUni Dorm, Hanoi',  'student', 'inactive', '2025-09-19 00:00:00'),
  ('Trần Đức Anh',         '22anh.td@vinuni.edu.vn',    'hash_19', '+84000000109', 'Gia Lam, Hanoi',      'student', 'active',   '2025-09-20 00:00:00'),
  ('Lê Thu Trang',         '24trang.lt@vinuni.edu.vn',  'hash_20', '+84000000110', 'VinUni Dorm, Hanoi',  'student', 'active',   '2025-09-21 00:00:00');

INSERT INTO `Listing` (seller_id, category_id, title, description, `condition`, listing_type, list_price, status, created_at, updated_at) VALUES
  (3, 2, 'iPhone 12 64GB (Like New)', 'iPhone 12 64GB (Like New) - seeded sample listing.', 'used', 'sell', 3500000, 'available', '2025-10-02 09:00:00', '2025-10-02 11:00:00'),
  (4, 3, 'Calculus Textbook (Used)', 'Calculus Textbook (Used) - seeded sample listing.', 'new', 'sell', 120000, 'available', '2025-10-03 09:00:00', '2025-10-03 11:00:00'),
  (5, 4, 'Desk Lamp (New)', 'Desk Lamp (New) - seeded sample listing.', 'like_new', 'sell', 200000, 'available', '2025-10-04 09:00:00', '2025-10-04 11:00:00'),
  (6, 5, 'Winter Jacket (Used)', 'Winter Jacket (Used) - seeded sample listing.', 'used', 'sell', 450000, 'available', '2025-10-05 09:00:00', '2025-10-05 11:00:00'),
  (7, 6, 'Mechanical Keyboard (Like New)', 'Mechanical Keyboard (Like New) - seeded sample listing.', 'new', 'sell', 900000, 'reserved', '2025-10-06 09:00:00', '2025-10-06 11:00:00'),
  (8, 7, 'Data Structures Book (Used)', 'Data Structures Book (Used) - seeded sample listing.', 'like_new', 'sell', 150000, 'reserved', '2025-10-07 09:00:00', '2025-10-07 11:00:00'),
  (9, 8, 'Ergonomic Chair (Used)', 'Ergonomic Chair (Used) - seeded sample listing.', 'used', 'sell', 800000, 'reserved', '2025-10-08 09:00:00', '2025-10-08 11:00:00'),
  (10, 9, 'VinUni Hoodie (New)', 'VinUni Hoodie (New) - seeded sample listing.', 'new', 'sell', 250000, 'reserved', '2025-10-09 09:00:00', '2025-10-09 11:00:00'),
  (11, 10, 'Noise-cancelling Headphones (Like New)', 'Noise-cancelling Headphones (Like New) - seeded sample listing.', 'like_new', 'sell', 1000000, 'sold', '2025-10-10 09:00:00', '2025-10-10 11:00:00'),
  (12, 11, 'MacBook Air M1 (Used)', 'MacBook Air M1 (Used) - seeded sample listing.', 'used', 'sell', 9500000, 'sold', '2025-10-11 09:00:00', '2025-10-11 11:00:00'),
  (13, 12, 'Graph Notebook Pack (New)', 'Graph Notebook Pack (New) - seeded sample listing.', 'new', 'sell', 60000, 'sold', '2025-10-12 09:00:00', '2025-10-12 11:00:00'),
  (14, 13, 'Gaming Mouse (Like New)', 'Gaming Mouse (Like New) - seeded sample listing.', 'like_new', 'sell', 300000, 'sold', '2025-10-13 09:00:00', '2025-10-13 11:00:00'),
  (15, 14, 'Badminton Racket (Lend)', 'Badminton Racket (Lend) - seeded sample listing.', 'used', 'lend', 50000, 'available', '2025-10-14 09:00:00', '2025-10-14 11:00:00'),
  (16, 15, 'Guitar (Lend)', 'Guitar (Lend) - seeded sample listing.', 'new', 'lend', 80000, 'available', '2025-10-15 09:00:00', '2025-10-15 11:00:00'),
  (17, 16, 'Projector (Lend)', 'Projector (Lend) - seeded sample listing.', 'like_new', 'lend', 150000, 'available', '2025-10-16 09:00:00', '2025-10-16 11:00:00'),
  (18, 17, 'Camera Tripod (Lend)', 'Camera Tripod (Lend) - seeded sample listing.', 'used', 'lend', 70000, 'available', '2025-10-17 09:00:00', '2025-10-17 11:00:00'),
  (19, 18, 'Yoga Mat (Lend)', 'Yoga Mat (Lend) - seeded sample listing.', 'new', 'lend', 40000, 'borrowed', '2025-10-18 09:00:00', '2025-10-18 11:00:00'),
  (20, 19, 'Power Drill (Lend)', 'Power Drill (Lend) - seeded sample listing.', 'like_new', 'lend', 100000, 'borrowed', '2025-10-19 09:00:00', '2025-10-19 11:00:00'),
  (3, 20, 'Board Game Set (Lend)', 'Board Game Set (Lend) - seeded sample listing.', 'used', 'lend', 60000, 'borrowed', '2025-10-20 09:00:00', '2025-10-20 11:00:00'),
  (4, 1, 'Calculator TI-84 (Lend)', 'Calculator TI-84 (Lend) - seeded sample listing.', 'new', 'lend', 30000, 'borrowed', '2025-10-21 09:00:00', '2025-10-21 11:00:00');

INSERT INTO `Order` (listing_id, buyer_id, offer_price, final_price, status, order_date, confirmed_at, completed_at, borrow_due_date, returned_at) VALUES
  (5, 9, 810000, 810000, 'confirmed', '2025-10-10 10:00:00', '2025-10-10 12:00:00', NULL, NULL, NULL),
  (6, 10, 135000, 135000, 'confirmed', '2025-10-11 10:00:00', '2025-10-11 12:00:00', NULL, NULL, NULL),
  (7, 11, 720000, 720000, 'confirmed', '2025-10-12 10:00:00', '2025-10-12 12:00:00', NULL, NULL, NULL),
  (8, 12, 225000, 225000, 'confirmed', '2025-10-13 10:00:00', '2025-10-13 12:00:00', NULL, NULL, NULL),
  (9, 15, 950000, 950000, 'completed', '2025-10-14 10:00:00', '2025-10-14 13:00:00', '2025-10-15 16:00:00', NULL, NULL),
  (10, 16, 9025000, 9025000, 'completed', '2025-10-15 10:00:00', '2025-10-15 13:00:00', '2025-10-16 16:00:00', NULL, NULL),
  (11, 17, 57000, 57000, 'completed', '2025-10-16 10:00:00', '2025-10-16 13:00:00', '2025-10-17 16:00:00', NULL, NULL),
  (12, 18, 285000, 285000, 'completed', '2025-10-17 10:00:00', '2025-10-17 13:00:00', '2025-10-18 16:00:00', NULL, NULL),
  (1, 8, 2975000, NULL, 'requested', '2025-10-26 10:00:00', NULL, NULL, NULL, NULL),
  (2, 9, 102000, NULL, 'rejected', '2025-10-27 10:00:00', NULL, NULL, NULL, NULL),
  (3, 10, 170000, NULL, 'cancelled', '2025-10-28 10:00:00', NULL, NULL, NULL, NULL),
  (4, 11, 382500, NULL, 'rejected', '2025-10-29 10:00:00', NULL, NULL, NULL, NULL),
  (13, 11, 50000, 50000, 'completed', '2025-10-18 10:00:00', '2025-10-18 11:00:00', '2025-10-20 12:00:00', '2025-10-25 10:00:00', '2025-10-24 22:00:00'),
  (14, 12, 80000, 80000, 'completed', '2025-10-19 10:00:00', '2025-10-19 11:00:00', '2025-10-21 12:00:00', '2025-10-26 10:00:00', '2025-10-25 22:00:00'),
  (15, 13, 150000, 150000, 'completed', '2025-10-20 10:00:00', '2025-10-20 11:00:00', '2025-10-22 12:00:00', '2025-10-27 10:00:00', '2025-10-26 22:00:00'),
  (16, 14, 70000, 70000, 'completed', '2025-10-21 10:00:00', '2025-10-21 11:00:00', '2025-10-23 12:00:00', '2025-10-28 10:00:00', '2025-10-27 22:00:00'),
  (17, 14, 40000, 40000, 'confirmed', '2025-10-22 10:00:00', '2025-10-22 12:00:00', NULL, '2025-11-01 10:00:00', NULL),
  (18, 15, 100000, 100000, 'confirmed', '2025-10-23 10:00:00', '2025-10-23 12:00:00', NULL, '2025-11-02 10:00:00', NULL),
  (19, 12, 60000, 60000, 'confirmed', '2025-10-24 10:00:00', '2025-10-24 12:00:00', NULL, '2025-11-03 10:00:00', NULL),
  (20, 13, 30000, 30000, 'confirmed', '2025-10-25 10:00:00', '2025-10-25 12:00:00', NULL, '2025-11-04 10:00:00', NULL);

INSERT INTO `Review` (order_id, rating, comment, created_at) VALUES
  (1, 5, 'Excellent — smooth transaction!', '2025-10-16 15:00:00'),
  (2, 4, 'Good — item matched the description.', '2025-10-17 15:00:00'),
  (3, 4, 'Good communication and on-time meetup.', '2025-10-18 15:00:00'),
  (4, 3, 'Okay — everything worked, minor delays.', '2025-10-19 15:00:00'),
  (5, 5, 'Great seller — highly recommended!', '2025-10-20 15:00:00'),
  (6, 4, 'Good deal, friendly interaction.', '2025-10-21 15:00:00'),
  (7, 3, 'Decent — acceptable condition for the price.', '2025-10-22 15:00:00'),
  (8, 5, 'Perfect — exactly as advertised.', '2025-10-23 15:00:00'),
  (9, 4, 'Good — quick and easy.', '2025-10-24 15:00:00'),
  (10, 3, 'Okay — could be faster to respond.', '2025-10-25 15:00:00'),
  (11, 5, 'Excellent experience overall!', '2025-10-26 15:00:00'),
  (12, 5, 'Great quality — would buy again.', '2025-10-27 15:00:00'),
  (13, 4, 'Good — returned on time and clean.', '2025-10-28 15:00:00'),
  (14, 3, 'Okay — worked fine for borrowing.', '2025-10-29 15:00:00'),
  (15, 4, 'Good — helpful and cooperative.', '2025-10-30 15:00:00'),
  (16, 5, 'Excellent — very reliable!', '2025-10-31 15:00:00'),
  (17, 3, 'Okay — item was usable, slight wear.', '2025-11-01 15:00:00'),
  (18, 4, 'Good — clear instructions and pickup.', '2025-11-02 15:00:00'),
  (19, 5, 'Amazing — super smooth process!', '2025-11-03 15:00:00'),
  (20, 4, 'Good — thanks!', '2025-11-04 15:00:00');
  
INSERT INTO `Comment` (listing_id, user_id, content, created_at, parent_id) VALUES
  (2, 2, 'Comment 1: Interested! Is this still available?', '2025-10-20 11:00:00', NULL),
  (3, 3, 'Comment 2: Interested! Is this still available?', '2025-10-20 14:00:00', NULL),
  (4, 4, 'Comment 3: Interested! Is this still available?', '2025-10-20 17:00:00', NULL),
  (5, 5, 'Comment 4: Interested! Is this still available?', '2025-10-20 20:00:00', NULL),
  (6, 6, 'Comment 5: Interested! Is this still available?', '2025-10-20 23:00:00', NULL),
  (7, 7, 'Comment 6: Interested! Is this still available?', '2025-10-21 02:00:00', NULL),
  (8, 8, 'Comment 7: Interested! Is this still available?', '2025-10-21 05:00:00', NULL),
  (9, 9, 'Comment 8: Interested! Is this still available?', '2025-10-21 08:00:00', NULL),
  (10, 10, 'Comment 9: Interested! Is this still available?', '2025-10-21 11:00:00', NULL),
  (11, 11, 'Comment 10: Interested! Is this still available?', '2025-10-21 14:00:00', NULL),
  (12, 12, 'Comment 11: Interested! Is this still available?', '2025-10-21 17:00:00', NULL),
  (13, 13, 'Comment 12: Interested! Is this still available?', '2025-10-21 20:00:00', NULL),
  (14, 14, 'Comment 13: Interested! Is this still available?', '2025-10-21 23:00:00', NULL),
  (15, 15, 'Comment 14: Interested! Is this still available?', '2025-10-22 02:00:00', NULL),
  (16, 16, 'Comment 15: Interested! Is this still available?', '2025-10-22 05:00:00', NULL),
  (2, 17, 'Reply 16 -> 1: Yes, please DM me.', '2025-10-22 08:00:00', 1),
  (3, 18, 'Reply 17 -> 2: Yes, please DM me.', '2025-10-22 11:00:00', 2),
  (4, 19, 'Reply 18 -> 3: Yes, please DM me.', '2025-10-22 14:00:00', 3),
  (5, 20, 'Reply 19 -> 4: Yes, please DM me.', '2025-10-22 17:00:00', 4),
  (6, 1, 'Reply 20 -> 5: Yes, please DM me.', '2025-10-22 20:00:00', 5);
  
  -- Same bcrypt hash for all inserted users
SET @pw := '$2a$10$KeSbvfoMy24vAwDzzFSugu.YcePK1sqgJkrakgnoMwQZhHCnX2u0y';

INSERT INTO `User` (full_name, email, password_hash, phone, address, role, status, created_at) VALUES
  ('Nguyễn Đức Khánh',  '23khanh.nd@vinuni.edu.vn', @pw, '0901000001', 'VinUni Dorm, Hanoi',            'student', 'active',   '2025-09-22 00:00:00'),
  ('Phạm Gia Hân',      '24han.pg@vinuni.edu.vn',   @pw, '0901000002', 'Vinhomes Ocean Park, Hanoi',    'student', 'active',   '2025-09-23 00:00:00'),
  ('Trần Quốc Sơn',     '25son.tq@vinuni.edu.vn',   @pw, '0901000003', 'VinUni Dorm, Hanoi',            'student', 'active',   '2025-09-24 00:00:00'),
  ('Lê Minh Khoa',      '22khoa.lm@vinuni.edu.vn',  @pw, '0901000004', 'Cau Giay, Hanoi',               'student', 'active',   '2025-09-25 00:00:00'),
  ('Đỗ Ngọc Bích',      '23bich.dn@vinuni.edu.vn',  @pw, '0901000005', 'VinUni Dorm, Hanoi',            'student', 'active',   '2025-09-26 00:00:00'),
  ('Vũ Anh Quân',       '24quan.va@vinuni.edu.vn',  @pw, '0901000006', 'Long Bien, Hanoi',              'student', 'active',   '2025-09-27 00:00:00'),
  ('Nguyễn Thảo My',    '25my.nt@vinuni.edu.vn',    @pw, '0901000007', 'VinUni Dorm, Hanoi',            'student', 'active',   '2025-09-28 00:00:00'),
  ('Hoàng Minh Đức',    '22duc.hm@vinuni.edu.vn',   @pw, '0901000008', 'Vinhomes Ocean Park, Hanoi',    'student', 'active',   '2025-09-29 00:00:00'),
  ('Bùi Thuỳ Linh',     '23linh.bt@vinuni.edu.vn',  @pw, '0901000009', 'VinUni Dorm, Hanoi',            'student', 'active',   '2025-09-30 00:00:00'),
  ('Ngô Phương Thảo',   '24thao.np@vinuni.edu.vn',  @pw, '0901000010', 'Hai Ba Trung, Hanoi',           'student', 'active',   '2025-10-01 00:00:00'),
  ('Trương Nhật Nam',   '25nam.tn@vinuni.edu.vn',   @pw, '0901000011', 'VinUni Dorm, Hanoi',            'student', 'active',   '2025-10-02 00:00:00'),
  ('Lý Thanh Tâm',      '22tam.lt@vinuni.edu.vn',   @pw, '0901000012', 'Vinhomes Ocean Park, Hanoi',    'student', 'active',   '2025-10-03 00:00:00'),
  ('Phan Đức Huy',      '23huy.pd@vinuni.edu.vn',   @pw, '0901000013', 'VinUni Dorm, Hanoi',            'student', 'active',   '2025-10-04 00:00:00'),
  ('Đặng Khánh Linh',   '24linh.dk@vinuni.edu.vn',  @pw, '0901000014', 'Cau Giay, Hanoi',               'student', 'active',   '2025-10-05 00:00:00'),
  ('Mai Hoàng Anh',     '25anh.mh@vinuni.edu.vn',   @pw, '0901000015', 'VinUni Dorm, Hanoi',            'student', 'active',   '2025-10-06 00:00:00'),
  ('Nguyễn Gia Bảo',    '22bao.ng@vinuni.edu.vn',   @pw, '0901000016', 'Long Bien, Hanoi',              'student', 'active',   '2025-10-07 00:00:00'),
  ('Trần Thuỳ Dung',    '23dung.tt@vinuni.edu.vn',  @pw, '0901000017', 'VinUni Dorm, Hanoi',            'student', 'inactive', '2025-10-08 00:00:00'),
  ('Lê Hữu Phúc',       '24phuc.lh@vinuni.edu.vn',  @pw, '0901000018', 'Vinhomes Ocean Park, Hanoi',    'student', 'active',   '2025-10-09 00:00:00'),
  ('Võ Minh Tuệ',       '25tue.vm@vinuni.edu.vn',   @pw, '0901000019', 'VinUni Dorm, Hanoi',            'student', 'active',   '2025-10-10 00:00:00'),
  ('Đinh Hải Đăng',     '22dang.dh@vinuni.edu.vn',  @pw, '0901000020', 'Cau Giay, Hanoi',               'student', 'active',   '2025-10-11 00:00:00');

SET @pw := '$2a$10$QLhq3hg2pBwkNmRV1LcMGuxZK40Uedmmrvphm8Rdf6Dktvp3f8dbG';

INSERT INTO `User` (full_name, email, password_hash, phone, address, role, status) VALUES
  ('Nguyễn Minh Nhật Anh',      '23anh.nmn@vinuni.edu.vn',   @pw, '0903000001', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Trần Đức Minh Khoa',        '24khoa.tdm@vinuni.edu.vn',  @pw, '0903000002', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Lê Quang Hữu Phúc',         '25phuc.lqh@vinuni.edu.vn',  @pw, '0903000003', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Phạm Thảo Ngọc Lan',        '22lan.ptn@vinuni.edu.vn',   @pw, '0903000004', 'Long Bien, Hanoi',           'student', 'active'),
  ('Vũ Khánh Gia Huy',          '23huy.vkg@vinuni.edu.vn',   @pw, '0903000005', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Đỗ Hoàng Minh Long',        '24long.dhm@vinuni.edu.vn',  @pw, '0903000006', 'Hai Ba Trung, Hanoi',        'student', 'active'),
  ('Bùi Thuỳ Bảo Ngọc',         '25ngoc.btb@vinuni.edu.vn',  @pw, '0903000007', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Ngô Thanh Hải Đăng',        '22dang.nth@vinuni.edu.vn',  @pw, '0903000008', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Hoàng Gia Bảo Nam',         '23nam.hgb@vinuni.edu.vn',   @pw, '0903000009', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Đặng Minh Tuấn Kiệt',       '24kiet.dmt@vinuni.edu.vn',  @pw, '0903000010', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Mai Anh Thuỳ Dung',         '25dung.mat@vinuni.edu.vn',  @pw, '0903000011', 'Long Bien, Hanoi',           'student', 'inactive'),
  ('Lý Quốc Trung Hiếu',        '22hieu.lqt@vinuni.edu.vn',  @pw, '0903000012', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Nguyễn Thảo Minh Châu',     '23chau.ntm@vinuni.edu.vn',  @pw, '0903000013', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Trần Nhật Minh Quân',       '24quan.tnm@vinuni.edu.vn',  @pw, '0903000014', 'Hai Ba Trung, Hanoi',        'student', 'active'),
  ('Phan Đức Anh Tú',           '25tu.pda@vinuni.edu.vn',    @pw, '0903000015', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Võ Ngọc Minh Trang',        '22trang.vnm@vinuni.edu.vn', @pw, '0903000016', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Lê Thanh Gia Vy',           '23vy.ltg@vinuni.edu.vn',    @pw, '0903000017', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Phạm Minh Quang Sơn',       '24son.pmq@vinuni.edu.vn',   @pw, '0903000018', 'Long Bien, Hanoi',           'student', 'active'),
  ('Đinh Hữu Minh Tâm',         '25tam.dhm@vinuni.edu.vn',   @pw, '0903000019', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Nguyễn Hoàng Phương Linh',  '22linh.nhp@vinuni.edu.vn',  @pw, '0903000020', 'VinUni Dorm, Hanoi',         'student', 'active');

SET @pw := '$2a$10$4KmKd0HblXrcmVLAootABO/UkAmEG38Mx2joRBuUk2.9D4IiJ5CgW';

INSERT INTO `User` (full_name, email, password_hash, phone, address, role, status) VALUES
  ('Nguyễn Quang Minh Anh',     '23anh.nqm@vinuni.edu.vn',   @pw, '0904000001', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Trần Gia Huy Khoa',         '24khoa.tgh@vinuni.edu.vn',  @pw, '0904000002', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Lê Thanh Minh Phúc',        '25phuc.ltm@vinuni.edu.vn',  @pw, '0904000003', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Phạm Quốc Minh Lan',        '22lan.pqm@vinuni.edu.vn',   @pw, '0904000004', 'Long Bien, Hanoi',           'student', 'active'),
  ('Vũ Đức Minh Huy',           '23huy.vdm@vinuni.edu.vn',   @pw, '0904000005', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Đỗ Minh Anh Long',          '24long.dma@vinuni.edu.vn',  @pw, '0904000006', 'Hai Ba Trung, Hanoi',        'student', 'active'),
  ('Bùi Ngọc Minh Quân',        '25quan.bnm@vinuni.edu.vn',  @pw, '0904000007', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Ngô Đức Minh Đăng',         '22dang.ndm@vinuni.edu.vn',  @pw, '0904000008', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Hoàng Minh Gia Nam',        '23nam.hmg@vinuni.edu.vn',   @pw, '0904000009', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Đặng Quốc Minh Kiệt',       '24kiet.dqm@vinuni.edu.vn',  @pw, '0904000010', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Mai Minh Anh Dung',         '25dung.mma@vinuni.edu.vn',  @pw, '0904000011', 'Long Bien, Hanoi',           'student', 'inactive'),
  ('Lý Minh Quốc Hiếu',         '22hieu.lmq@vinuni.edu.vn',  @pw, '0904000012', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Nguyễn Gia Minh Châu',      '23chau.ngm@vinuni.edu.vn',  @pw, '0904000013', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Trần Đức Minh Quân',        '24quan.tdm@vinuni.edu.vn',  @pw, '0904000014', 'Hai Ba Trung, Hanoi',        'student', 'active'),
  ('Phan Minh Đức Tú',          '25tu.pmd@vinuni.edu.vn',    @pw, '0904000015', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Võ Minh Ngọc Trang',        '22trang.vmn@vinuni.edu.vn', @pw, '0904000016', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Lê Minh Thanh Vy',          '23vy.lmt@vinuni.edu.vn',    @pw, '0904000017', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Phạm Quang Minh Sơn',       '24son.pqm@vinuni.edu.vn',   @pw, '0904000018', 'Long Bien, Hanoi',           'student', 'active'),
  ('Đinh Minh Hữu Tâm',         '25tam.dmh@vinuni.edu.vn',   @pw, '0904000019', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Nguyễn Phương Hoàng Linh',  '22linh.nph@vinuni.edu.vn',  @pw, '0904000020', 'VinUni Dorm, Hanoi',         'student', 'active');

SET @pw := '$2a$10$mVmXE8l9OqW8u8VndowIB.MG.3pB/m2U05eXwSz8dWooXmbzxvbq.';

INSERT INTO `User` (full_name, email, password_hash, phone, address, role, status) VALUES
  ('Nguyễn Hải Minh Quân',      '23quan.nhm@vinuni.edu.vn',   @pw, '0906000001', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Trần Đức Anh Phát',         '24phat.tda@vinuni.edu.vn',   @pw, '0906000002', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Lê Minh Quang Bảo',         '25bao.lmq@vinuni.edu.vn',    @pw, '0906000003', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Phạm Thị Kim Ngân',         '22ngan.ptk@vinuni.edu.vn',   @pw, '0906000004', 'Long Bien, Hanoi',           'student', 'active'),
  ('Vũ Gia Huy Khánh',          '23khanh.vgh@vinuni.edu.vn',  @pw, '0906000005', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Đỗ Thanh Minh Tín',         '24tin.dtm@vinuni.edu.vn',    @pw, '0906000006', 'Hai Ba Trung, Hanoi',        'student', 'active'),
  ('Bùi Quốc Anh Tuấn',         '25tuan.bqa@vinuni.edu.vn',   @pw, '0906000007', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Ngô Minh Hoàng Yến',        '22yen.nmh@vinuni.edu.vn',    @pw, '0906000008', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Hoàng Đức Minh Khang',      '23khang.hdm@vinuni.edu.vn',  @pw, '0906000009', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Đặng Nhật Anh Kiên',        '24kien.dna@vinuni.edu.vn',   @pw, '0906000010', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Mai Thuỳ Anh My',           '25my.mta@vinuni.edu.vn',     @pw, '0906000011', 'Long Bien, Hanoi',           'student', 'inactive'),
  ('Lý Quang Minh Dương',       '22duong.lqm@vinuni.edu.vn',  @pw, '0906000012', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Nguyễn Phương Thảo Nhi',    '23nhi.npt@vinuni.edu.vn',    @pw, '0906000013', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Trương Gia Minh Thảo',      '24thao.tgm@vinuni.edu.vn',   @pw, '0906000014', 'Hai Ba Trung, Hanoi',        'student', 'active'),
  ('Phan Hoàng Anh Quý',        '25quy.pha@vinuni.edu.vn',    @pw, '0906000015', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Võ Thanh Hương Oanh',       '22oanh.vth@vinuni.edu.vn',   @pw, '0906000016', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Lê Ngọc Minh Trang',        '23trang.lnm@vinuni.edu.vn',  @pw, '0906000017', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Phạm Quang Hữu Lộc',        '24loc.pqh@vinuni.edu.vn',    @pw, '0906000018', 'Long Bien, Hanoi',           'student', 'active'),
  ('Đinh Gia Bảo Linh',         '25linh.dgb@vinuni.edu.vn',   @pw, '0906000019', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Nguyễn Hoàng Tuấn Việt',    '22viet.nht@vinuni.edu.vn',   @pw, '0906000020', 'VinUni Dorm, Hanoi',         'student', 'active');

SET @pw := '$2a$10$Czbdwq7pP/G3eahHyUlN8.G2dyxrEa67Fa72jIzP/v10I/YJX8/52';

INSERT INTO `User` (full_name, email, password_hash, phone, address, role, status) VALUES
  ('Nguyễn Trọng Hải Sơn',      '23son.nth@vinuni.edu.vn',    @pw, '0907000001', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Trần Minh Đức Duy',         '24duy.tmd@vinuni.edu.vn',    @pw, '0907000002', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Lê Phương Anh Kha',         '25kha.lpa@vinuni.edu.vn',    @pw, '0907000003', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Phạm Quốc Bảo Châu',        '22chau.pqb@vinuni.edu.vn',   @pw, '0907000004', 'Long Bien, Hanoi',           'student', 'active'),
  ('Vũ Thanh Ngọc Bảo',         '23bao.vtn@vinuni.edu.vn',    @pw, '0907000005', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Đỗ Hữu Minh Khôi',          '24khoi.dhm@vinuni.edu.vn',   @pw, '0907000006', 'Hai Ba Trung, Hanoi',        'student', 'active'),
  ('Bùi Gia Khánh Linh',        '25linh.bgk@vinuni.edu.vn',   @pw, '0907000007', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Ngô Thảo Kim Oanh',         '22oanh.ntk@vinuni.edu.vn',   @pw, '0907000008', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Hoàng Minh Tuấn Anh',       '23anh.hmt@vinuni.edu.vn',    @pw, '0907000009', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Đặng Quang Huy Hoàng',      '24hoang.dqh@vinuni.edu.vn',  @pw, '0907000010', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Mai Thanh Hà Vy',           '25vy.mth@vinuni.edu.vn',     @pw, '0907000011', 'Long Bien, Hanoi',           'student', 'inactive'),
  ('Lý Đức Quang Hưng',         '22hung.ldq@vinuni.edu.vn',   @pw, '0907000012', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Nguyễn Gia Minh Khang',     '23khang.ngm@vinuni.edu.vn',  @pw, '0907000013', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Trương Quốc Anh Tuấn',      '24tuan.tqa@vinuni.edu.vn',   @pw, '0907000014', 'Hai Ba Trung, Hanoi',        'student', 'active'),
  ('Phan Minh Nhật Tân',        '25tan.pmn@vinuni.edu.vn',    @pw, '0907000015', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Võ Hoàng Gia Bảo',          '22bao.vhg@vinuni.edu.vn',    @pw, '0907000016', 'Vinhomes Ocean Park, Hanoi', 'student', 'active'),
  ('Lê Ngọc Thanh Tâm',         '23tam.lnt@vinuni.edu.vn',    @pw, '0907000017', 'VinUni Dorm, Hanoi',         'student', 'active'),
  ('Phạm Hải Minh Phương',      '24phuong.phm@vinuni.edu.vn', @pw, '0907000018', 'Long Bien, Hanoi',           'student', 'active'),
  ('Đinh Anh Tuệ Nhi',          '25nhi.dat@vinuni.edu.vn',    @pw, '0907000019', 'Cau Giay, Hanoi',            'student', 'active'),
  ('Nguyễn Hồng Anh Thư',       '22thu.nha@vinuni.edu.vn',    @pw, '0907000020', 'VinUni Dorm, Hanoi',         'student', 'active');
