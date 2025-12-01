📌 Project Title
CampusCircle: Student Circular Market Platform
📄 Brief Description
Many students frequently buy new items (books, electronics, dorm furniture, etc.) that quickly become underused or are thrown away at the end of each semester. At the same time, new students need these exact items but have difficulty finding trusted sellers at reasonable prices.
CampusCircle is an internal marketplace for students to buy, sell, and share second-hand items within the university community. The system provides:
A safe, student-only platform (login with student accounts).
Listing and searching of used items by category and condition.
Options to sell, reserve, or lend/borrow for free.
Ratings and reviews to build trust between buyers and sellers.
This helps reduce waste, save money for students, and promote a circular, sustainable campus economy.
🎯 Functional & Non-functional Requirements
1. Functional Requirements
User & Authentication
Users can register with Vinuni email and log in/out securely.
Users can update their profile (name, phone, dorm/area, description).
Admin can manage user accounts (activate/deactivate, reset roles).


Items, Categories & Listings
 4. Admin can manage categories (create, edit, delete categories such as Books, Electronics, Furniture, Others).
 5. A logged-in user can create an item and publish a listing (set price, condition, listing type: sell or lend).
 6. A user can edit or delete their own listings while they are still available.
 7. Listings have statuses: available, reserved, sold, or borrowed.
Search, Filter & Browsing
 8. Users can search listings by keyword (title/description).
 9. Users can filter listings by category, price range, item condition, and status.
 10. Users can sort listings by newest, lowest price, highest price.
Orders & Transactions
 11. A buyer can place an order or send a request to borrow for an available listing.
 12. The system prevents double-selling: once a listing is sold or borrowed, it cannot be ordered again.
 13. Sellers can accept or reject incoming orders/requests.
 14. When an order is confirmed, the system updates the listing status (e.g., from available → sold or borrowed).
Reviews & Ratings
 15. After a completed order, the buyer can leave a review and rating for the seller.
 16. The system computes and displays the average rating for each seller.
Comments, Q&A (Message-like feature)
 17. Under each listing, logged-in users can post public comments to ask questions or discuss item details.
 18. Each comment displays the commenter’s name, timestamp, and content below the corresponding listing.
 19. Sellers can reply to comments on their own listings (e.g., answer questions about price, condition, or meeting time).
 20. The system stores all comments in the database and shows them in chronological order.
 21. Admin can view and delete inappropriate comments to keep the marketplace safe and clean.
Admin & Analytics
 22. Admin can view overall statistics (number of users, active listings, completed orders).
 23. The system provides summary reports, e.g.:
 - Number of orders per month.
 - Most popular categories.
 - Top-rated sellers.
2. Non-functional Requirements
Security & Access Control
Passwords are stored in the database using hashing.
Different roles: admin, student (normal user) with least-privilege access.
Prevent SQL injection using prepared statements.


Performance
Basic operations (search listings, view item details, create order) should respond within 2–3 seconds for typical load.
Use indexes on frequently queried columns (e.g., category, price, listing status).


Reliability & Data Integrity
Use foreign keys and constraints to maintain referential integrity.
Prevent invalid states (e.g., orders on non-existing listings, negative prices).


Usability
Simple, mobile-friendly UI with clear navigation (Home, Browse, My Listings, My Orders).
Clear error messages and form validation.


Maintainability
Separate layers: database, backend, frontend.
Use clear naming conventions and comments in code and SQL.


🧱 Planned Core Entities (brief outline)
User


Attributes: user_id (PK), full_name, email, password_hash, phone, dorm, role (admin/student), created_at, status.
Relationships:
1–N with Listing (one user has many listings).
1–N with Order (one user has many orders (customer)).
1–N with Review (one user receive many reviews (seller)).


Category


Attributes: category_id (PK), name, description.
Relationships:
1–N with Item.


Item


Attributes: item_id (PK), title, description, condition (new/used/like new), base_price, category_id (FK).
Relationships:
N–1 with Category.
1–N with Listing.


Listing


Attributes: listing_id (PK), item_id (FK), seller_id (FK -> User), listing_type (sell / lend), list_price, status (available/reserved/sold/borrowed), created_at, updated_at.
Relationships:
N–1 with Item.
N–1 with User (seller).
1–N with Order.
1–N with Message (optional).


Order


Attributes: order_id (PK), listing_id (FK), buyer_id (FK -> User), final_price, is_borrow (boolean), order_date, status (requested/confirmed/cancelled/completed).
Relationships:
N–1 with Listing.
N–1 with User (buyer).
1–N with Review.


Review


Attributes: review_id (PK), order_id (FK), rating (1–5), comment, created_at.
Relationships:
N–1 with Order (connect to seller).


Comment


Attributes: comment_id (PK), listing_id (FK), user_id (FK -> User), content, created_at, parent_id (FK -> Comment, nullable).
Relationships:
N–1 with Listing.
N–1 with User (sender/receiver).
1–N with Comment (self-relationship via parent_id, for replies).


🔧 Tech Stack
Database: MySQL
Tables, views, stored procedures, triggers, indexing.


Backend: Python Flask
REST-like routes for login, listings, orders, reviews, admin functions.
Uses parameterized queries to interact with MySQL.


Frontend: HTML, CSS, Bootstrap, basic JavaScript
Simple responsive pages for mobile & desktop.


Tools:
MySQL Workbench (design & queries).
GitHub for version control.


👥 Team Members and Roles
Nguyen The An – Database Architect
Gather requirements, design the ERD and logical schema, write DDL (tables, constraints, relationships), define indexing strategy, and coordinate how the database will be used by the web application.


Le Ngoc Bich Phuong – Database Implementation
Implement the schema in MySQL, populate sample data, create views, stored procedures, triggers, and user/role permissions, and optimize queries and indexes to support the web application.


Phan Nguyen Tuan Anh – Web Developer
Implement the Flask web application (routes, authentication, business logic for listings/orders/comments) using prepared statements, and design the user interface (pages, forms, navigation, Bootstrap styling) and integrate it with the MySQL database.


📅 Timeline (planned milestones)
By 01/12 – Topic & Requirements
Finalize project idea (CampusCircle).
Draft functional & non-functional requirements.
Register group and project title with instructor.


By 08/12 – Proposal & Peer Review
Submit a short proposal (description, main features, initial entities).
Receive and incorporate feedback from peers/lecturers.


By 15/12 – Database Design
Complete ERD (entities, relationships, cardinalities).
Normalize schema to 3NF.
Write a full DDL script (CREATE DATABASE, CREATE TABLE, PK/FK, constraints).
Prepare a design document (requirements + ERD + schema).


By 18/12 – Database Implementation
Implement schema in MySQL.
Insert sample data for users, items, listings, orders, reviews.
Create at least:
1–2 views (e.g., active listings, monthly stats).
2 stored procedures (e.g., create_order, update_listing_status).
1 trigger (e.g., when order completed → update listing status).
Test queries and measure simple performance with/without indexes.


By 20/12 – Web Application Core
Implement authentication (register/login/logout).
Implement CRUD for listings (create, view, edit, delete).
Implement basic order flow (buyer requests, seller confirms).


By 22/12 – Final Integration & Presentation
Add reviews, basic analytics pages (stats).
Finalize role-based access (admin vs student).
Prepare:
Slide deck (system overview, ERD, key features, demo screenshots).
Project report (requirements, design, implementation, security, performance, testing).
Final testing and live demo preparation.

