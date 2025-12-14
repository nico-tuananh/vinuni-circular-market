<h1 align="center">♻️💰 CampusCircle: Student Circular Market Platform</h1>

<p align="center">
  <strong>COMP3030 – Databases and Database Systems (Fall 2025)</strong><br/>
  <em>Project Proposal (Revised v2)</em>
</p>

---

## 1) Problem Statement

At the end of each semester, many students throw away or leave behind underused items (textbooks, electronics, dorm furniture, etc.). Meanwhile, incoming students need these exact items but struggle to find trusted sellers at fair prices.

**CampusCircle** is a student-only marketplace that enables students to **buy/sell** or **lend/borrow** second-hand items within the university community. The platform aims to:

* Reduce campus waste and promote a circular economy.
* Help students save money by reusing items.
* Increase trust via ratings, reviews, and moderated public Q&A.

---

## 2) Goals & Scope

### Goals

* Provide a secure, internal marketplace accessible only to university students.
* Support listing creation, browsing/searching, ordering/borrowing flows, and reviews.
* Ensure data integrity (no double-selling, valid state transitions).
* Provide admin controls and basic analytics.

### Out of Scope (for course scope)

* Online payment integration.
* Shipping/logistics and real-time chat (we use listing comments as Q&A).
* External user access (non-students).

---

## 3) Functional Requirements

### A) User & Authentication

* Users register using a VinUni email and log in/out securely.
* Users can update profile information (name, phone, dorm/area, description).
* Admin can manage accounts (activate/deactivate) and manage roles (admin/student).

### B) Categories & Listings

* Admin can create/edit/delete categories (Books, Electronics, Furniture, Others, etc.).
* Logged-in users can create listings with:

  * Title, description, condition, category
  * Listing type: **sell** or **lend**
  * Price rules:

    * **Sell**: `list_price` is the asking price.
    * **Lend**: `list_price` can be **0** (free lending) or a small **fee/deposit** (optional).
* Users can edit/delete their own listings while still available.

### C) Search, Filter & Sort

* Keyword search by title/description.
* Filter by category, price range, condition, and status.
* Sort listings by newest, lowest price, or highest price.

### D) Orders & Transactions (Sell + Lend)

* A buyer can submit an order/request for an **available** listing.
* **Requested orders do not lock listings.** A listing becomes locked only after the seller confirms.
* The system prevents double-selling/double-borrowing: once confirmed, a listing is locked.
* Sellers can accept or reject incoming requests.
* After completion:

  * For **sell**: the listing becomes **sold**.
  * For **lend**: the listing becomes **available** again after return is recorded.

### E) Reviews & Ratings

* After a completed transaction, the buyer can leave a rating (1–5) and review for the seller.
* The system displays the seller’s average rating (optionally pre-aggregated for performance).

### F) Comments & Q&A (Message-like)

* Under each listing, logged-in users can post public comments in chronological order.
* Sellers can reply to comments on their own listings.
* Admin can delete inappropriate comments.

### G) Admin & Analytics

* Admin can view overall statistics: number of users, active listings, completed orders.
* The system provides summary reports via predefined views, e.g.:

  * Orders per month
  * Most popular categories
  * Top-rated sellers

---

## 4) Non-functional Requirements

### Security & Access Control

* Passwords stored using hashing.
* Role-based access: **admin** vs **student**, least-privilege permissions.
* Prevent SQL injection via parameterized queries / ORM.

### Performance

* Typical operations (browse/search/view/create order) respond within **2–3 seconds** under course-scale load.
* Use indexes on frequently queried columns and full-text search where appropriate.

### Reliability & Data Integrity

* Foreign keys and constraints enforce referential integrity.
* Prevent invalid states (negative prices, invalid ratings, orders on unavailable listings).

### Usability

* Simple, mobile-friendly UI with clear navigation (Home, Browse, My Listings, My Orders).

### Maintainability

* Clear separation of concerns: database layer, backend API, and frontend pages.
* Consistent naming conventions and documented SQL/logic.

---

## 5) Data Model (Revised v2)

### Key Design Decision: Listing-Centric Model

To avoid redundancy, the project uses a **listing-centric** schema where a listing includes the item’s descriptive fields (title, description, condition). This simplifies queries and reduces unnecessary joins.

### Core Entities

#### User

* Attributes:

  * `user_id (PK)`, `full_name`, `email (unique)`, `password_hash`, `phone`, `dorm`,
    `role (admin/student)`, `status (active/inactive)`, `created_at`
* Optional performance fields:

  * `avg_rating`, `rating_count` (maintained via trigger)

* Relationships:
  * 1–N with Listing (seller)
  * 1–N with Order (buyer)

* Integrity constraints (key examples):
  * `UNIQUE(email)` to prevent duplicate accounts.
  * One active confirmed transaction per listing is enforced via stored procedures with row locking.

#### Category

* Attributes:

  * `category_id (PK)`, `name (unique)`, `description`

* Relationships:
  * 1–N with Listing

#### Listing

* Attributes:

  * `listing_id (PK)`, `seller_id (FK → User)`, `category_id (FK → Category)`,
    `title`, `description`, `condition (new/like_new/used)`,
    `listing_type (sell/lend)`, `list_price (>=0)`,
    `status (available/reserved/sold/borrowed)`, `created_at`, `updated_at`

* Relationships:
  * N–1 with User (seller)
  * N–1 with Category
  * 1–N with Order
  * 1–N with Comment

#### Order

* Attributes:

  * `order_id (PK)`, `listing_id (FK → Listing)`, `buyer_id (FK → User)`,
    `offer_price`, `final_price`,
    `status (requested/confirmed/rejected/cancelled/completed)`,
    `order_date`, `confirmed_at`, `completed_at`,
    Borrow-specific: `borrow_due_date`, `returned_at`

* Relationships:
  
  * N-1 with Listing
  * N-1 with User (buyer)
  * 1-N with Review

* Notes:
  * For **sell**: `completed` means transaction done; listing becomes `sold`.
  * For **lend**: `completed` means item returned (`returned_at` is set); listing returns to `available`.

#### Review

* Attributes:

  * `review_id (PK)`, `order_id (FK → Order, UNIQUE)`, `rating (1–5)`, `comment`, `created_at`

* Relationships:

  * N–1 with Order (connect to seller)

* Notes:
  
  * One review per order (enforced by `UNIQUE(order_id)`).
  * The reviewed seller is derived via `Order → Listing → seller_id` to avoid redundant seller fields.

#### Comment

* Attributes:

  * `comment_id (PK)`, `listing_id (FK → Listing)`, `user_id (FK → User)`,
    `content`, `created_at`, `parent_id (FK → Comment, nullable)`
    
* Relationships:
  * N–1 with Listing
  * N–1 with User (sender/receiver)
  * 1–N with Comment (self-relationship via parent_id, for replies)

---

## 6) Status Flow Clarification (Listing ↔ Order)

### Listing Status

* `available`: open for requests
* `reserved` (**sell only**): an order is **confirmed**; listing locked (no other confirmations allowed)
* `sold` (**sell only**): sale completed
* `borrowed` (**lend only**): currently lent out; waiting for return

**Rule:** `requested` orders do **not** change listing status. Only `confirmed` orders lock a listing.

### Order Status

* `requested`: buyer submitted request (does not lock listing yet)
* `confirmed`: seller accepted; locks listing (reserved/borrowed)
* `rejected`: seller rejected
* `cancelled`: buyer (or seller) cancelled before completion
* `completed`: finished

  * sell: transaction done
  * lend: item returned (`returned_at` set)

### Borrow Rules (Lend)

* `borrow_due_date` is required for lend-type orders when confirming.
* `completed` for lend means the item is returned (`returned_at IS NOT NULL`).
* Overdue can be computed as: `NOW() > borrow_due_date AND returned_at IS NULL`.

---

## 7) Performance Tuning Strategy (Indexes & Search) (Indexes & Search)

### Planned Indexes

**Listing**

* `(category_id, status)` for browsing filters
* `(status, created_at)` for newest/active listings
* `(list_price)` for price filter/sort
* `FULLTEXT(title, description)` for keyword search (preferred)

**Order**

* `(listing_id, status)` to check active/confirmed orders per listing
* `(buyer_id, order_date)` for “My Orders” pages

**Comment**

* `(listing_id, created_at)` for chronological display

**Review**

* `UNIQUE(order_id)` to enforce one review per order

---

## 8) Stored Procedures, Triggers & Views (Course Requirements)

### Where Rules Are Enforced (DB vs Backend)

* **Critical state transitions** (request/confirm/cancel/complete) are enforced in **stored procedures** using **transactions** and **row locking** (`SELECT ... FOR UPDATE`) to prevent race conditions and double-selling.
* **Triggers** are used for:

  * Maintaining **derived/aggregated fields** (e.g., `User.avg_rating`, `User.rating_count`), and
  * Acting as a lightweight safety net for consistency checks where appropriate.

### Stored Procedures (planned)

* `sp_request_order(...)`: validates listing is available; inserts order as requested.
* `sp_respond_order(...)`: seller accepts/rejects; uses transaction and row locking; updates listing status accordingly.
* `sp_complete_order(...)` (optional): completes an order; for lend-type orders it records returns (`returned_at`).

### Trigger (planned)

* A trigger maintains aggregated seller rating fields when a new review is inserted.

### Views (planned)

* `vw_active_listings`: active listings with seller/category details.
* `vw_monthly_orders`: orders per month (completed orders).
* `vw_top_categories` / `vw_top_sellers`: simplified analytics reports.

---

## 9) Tech Stack

* **Database:** MySQL

  * Tables, constraints, views, stored procedures, triggers, indexing, (optional) full-text search.
* **Backend:** Java (Spring Boot)

  * REST endpoints for authentication, listings, orders, reviews, admin.
* **Frontend:** Node.js + HTML + Bootstrap + JavaScript

  * Lightweight responsive UI for browsing and managing listings/orders.
* **Tools:** MySQL Workbench, GitHub

---

## 10) Team Members and Roles

* **Nguyen The An – Database Architect**

  * Requirements, ERD/logical schema, DDL, constraints, indexing strategy, DB coordination.

* **Le Ngoc Bich Phuong – Database Implementation**

  * Implement schema in MySQL, sample data, views/procedures/triggers, query optimization.

* **Phan Nguyen Tuan Anh – Software Engineer**

  * Spring Boot backend + UI integration with MySQL database.

---

## 11) Planned Milestones

* **By 01/12 – Topic & Requirements**

  * Finalize idea (CampusCircle)
  * Draft functional & non-functional requirements
  * Register project title with instructor

* **By 08/12 – Proposal & Peer Review**

  * Submit proposal (features + initial entities)
  * Incorporate feedback (this revised v2)

* **By 15/12 – Database Design**

  * Complete ERD (entities, relationships, cardinalities)
  * Normalize schema to 3NF
  * Write DDL script (create tables, PK/FK, constraints, indexes)
  * Prepare design document (requirements + ERD + schema)

* **By 18/12 – Database Implementation**

  * Implement schema in MySQL
  * Insert sample data (users, categories, listings, orders, reviews, comments)
  * Create:

    * 2+ views
    * 2 stored procedures
    * 1 trigger
  * Test queries and compare performance with/without indexes

* **By 20/12 – Web Application Core**

  * Authentication (register/login/logout)
  * CRUD listings
  * Basic order flow (request → confirm/reject)

* **By 22/12 – Final Integration & Presentation**

  * Reviews + analytics pages
  * Role-based access finalized
  * Slides + report + demo screenshots
  * Final testing and live demo rehearsal
