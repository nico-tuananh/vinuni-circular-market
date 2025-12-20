<h1 align="center">♻️💰 CampusCircle: Student Circular Market Platform</h1>

<p align="center">
  <strong>COMP3030 – Databases and Database Systems (Fall 2025)</strong><br/>
  <em>Project Proposal (Revised v2)</em>
</p>

---

## Project Structure

This project follows a standard full-stack web application architecture with separate backend and frontend applications, containerized for easy deployment.

```
vinuni-circular-market/
├── backend/                          # Spring Boot REST API
│   ├── src/main/java/com/vinuni/circularmarket/
│   │   ├── controller/               # REST endpoints (@RestController)
│   │   │   ├── AuthController.java   # Authentication endpoints
│   │   │   ├── ListingController.java # Listing CRUD operations
│   │   │   ├── OrderController.java  # Order management
│   │   │   ├── ReviewController.java # Review operations
│   │   │   └── AdminController.java  # Admin functionality
│   │   ├── service/                  # Business logic (@Service)
│   │   │   ├── UserService.java
│   │   │   ├── ListingService.java
│   │   │   ├── OrderService.java
│   │   │   └── ReviewService.java
│   │   ├── repository/               # Data access (@Repository)
│   │   │   ├── UserRepository.java
│   │   │   ├── ListingRepository.java
│   │   │   ├── OrderRepository.java
│   │   │   └── ReviewRepository.java
│   │   ├── model/                    # JPA entities (@Entity)
│   │   │   ├── User.java
│   │   │   ├── Category.java
│   │   │   ├── Listing.java
│   │   │   ├── Order.java
│   │   │   ├── Review.java
│   │   │   └── Comment.java
│   │   ├── config/                   # Configuration classes
│   │   │   ├── DatabaseConfig.java
│   │   │   ├── SecurityConfig.java
│   │   │   └── WebConfig.java
│   │   └── security/                 # Security components
│   │       ├── JwtAuthenticationFilter.java
│   │       └── CustomUserDetailsService.java
│   ├── src/main/resources/
│   │   ├── application.properties    # App configuration
│   │   ├── application-dev.properties
│   │   └── static/                   # Static resources
│   ├── src/test/                     # Unit & integration tests
│   ├── pom.xml                       # Maven dependencies
│   └── Dockerfile                    # Backend containerization
├── frontend/                         # Node.js SPA
│   ├── public/                       # Static assets
│   │   ├── index.html                # Main HTML template
│   │   ├── favicon.ico
│   │   └── assets/                   # Images, icons
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── ListingCard.js
│   │   │   ├── OrderForm.js
│   │   │   └── ReviewForm.js
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.js           # Browse listings
│   │   │   ├── ListingDetailPage.js  # Individual listing
│   │   │   ├── MyListingsPage.js     # User listings
│   │   │   ├── MyOrdersPage.js       # User orders
│   │   │   ├── CreateListingPage.js  # New listing form
│   │   │   ├── LoginPage.js          # Authentication
│   │   │   ├── RegisterPage.js
│   │   │   └── AdminPage.js          # Admin dashboard
│   │   ├── services/                 # API integration
│   │   │   ├── api.js                # Axios configuration
│   │   │   ├── authService.js        # Authentication API
│   │   │   ├── listingService.js     # Listing operations
│   │   │   ├── orderService.js       # Order management
│   │   │   └── reviewService.js      # Review operations
│   │   ├── utils/                    # Utilities
│   │   │   ├── helpers.js            # Common functions
│   │   │   ├── validation.js         # Form validation
│   │   │   └── constants.js          # App constants
│   │   └── styles/                   # Styling
│   │       ├── main.css              # Custom styles
│   │       └── bootstrap-custom.css  # Bootstrap overrides
│   ├── package.json                  # Node.js dependencies
│   ├── package-lock.json
│   ├── vite.config.js               # Vite bundler config
│   ├── index.js                     # App entry point
│   └── Dockerfile                    # Frontend containerization
├── db/                              # Database layer
│   ├── VinUniCircularMarket.sql     # Table schemas & constraints
│   ├── VinUniCircularMarket_Input.sql # Sample data
│   └── VinUniCircularMarket_Functions.sql # Views, procedures, triggers
├── docker/                          # Containerization
│   ├── docker-compose.yml           # Multi-service orchestration
│   ├── docker-compose.dev.yml       # Development setup
│   ├── Dockerfile.backend           # Backend image
│   └── Dockerfile.frontend          # Frontend image
├── docs/                            # Documentation
│   ├── API.md                       # API documentation
│   ├── deployment.md                # Deployment guide
│   └── testing.md                   # Testing instructions
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
└── LICENSE                          # License
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher

### Quick Start

#### 1. Clone and Setup Database

```bash
# Clone the repository
git clone <repository-url>
cd vinuni-circular-market

# Start local MySQL server and open the three files in db/ in MySQLWorkbench
```

#### 2. Setup Database Schema

```bash
# Run SQL scripts in order
# - db/VinUniCircularMarket.sql
# - db/VinUniCircularMarket_Input.sql
# - db/VinUniCircularMarket_Functions.sql
```

#### 3. Start Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will be available at: http://localhost:8010

#### 4. Start Frontend (Vite)

```bash
cd frontend
nvm use
npm install
npm run dev
```

Frontend will be available at: http://localhost:5174

#### 5. Access the Application

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8010
- **Database**: localhost:3306 (VinUniCircularMarket)

### Development Commands

```bash
# Backend
cd backend
mvn clean compile          # Compile
mvn test                   # Run tests
mvn spring-boot:run        # Start with hot reload

# Frontend
cd frontend
npm run dev               # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Architecture Overview

- **Backend (Spring Boot)**: RESTful API with JPA/Hibernate for data persistence
- **Frontend (Node.js + Vite)**: Modern SPA with Bootstrap for responsive design
- **Database (MySQL)**: Relational database with stored procedures and triggers
- **Deployment (Docker)**: Containerized services with docker-compose orchestration

### Development Workflow

1. **Backend**: Spring Boot with Maven, hot reload enabled
2. **Frontend**: Vite dev server with hot module replacement
3. **Database**: Local MySQL instance with migration scripts
4. **Testing**: JUnit for backend, Jest for frontend
5. **Deployment**: Docker containers for production

---

## 1) Problem Statement

At the end of each semester, many students throw away or leave behind underused items (textbooks, electronics, address furniture, etc.). Meanwhile, incoming students need these exact items but struggle to find trusted sellers at fair prices.

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

* Users register using a VinUni email (`@vinuni.edu.vn` domain only) and log in/out securely.
* Passwords are stored using secure hashing.
* Users can update profile information (name, phone, address/area).
* Admin can manage accounts (activate/deactivate) and manage roles (admin/student).
* User ratings are automatically calculated and maintained via database triggers.

### B) Categories & Listings

* Predefined categories include: Electronics, Books, Furniture, Clothing, Dorm Supplies, Stationery, Sports, Kitchen, Bicycles, Home Decor, Course Materials, Lab Equipment, Musical Instruments, Gaming, Phones, Laptops, Tablets, Accessories, Health & Beauty, Others.
* Logged-in users can create listings with:

  * Title, description, condition (`new`/`like_new`/`used`), category
  * Listing type: **sell** or **lend**
  * Price rules:

    * **Sell**: `list_price` is the asking price (≥0).
    * **Lend**: `list_price` can be **0** (free lending) or a small **fee/deposit**.
* Full-text search enabled on title and description fields.
* Users can edit/delete their own listings while status is `available`.

### C) Search, Filter & Sort

* Keyword search by title/description.
* Filter by category, price range, condition, and status.
* Sort listings by newest, lowest price, or highest price.

### D) Orders & Transactions (Sell + Lend)

* A buyer can submit an order/request for an **available** listing with optional offer price.
* **Requested orders do not lock listings.** A listing becomes locked only after the seller confirms via `sp_confirm_order()`.
* The system prevents double-selling using stored procedures with transactions and row-level locking (`SELECT ... FOR UPDATE`).
* Sellers can accept (`sp_confirm_order`) or reject (`sp_reject_order`) incoming requests.
* Buyers can cancel (`sp_cancel_order`) pending requests.
* Order lifecycle: `requested` → `confirmed` → `completed` (or `rejected`/`cancelled`)
* After completion via `sp_complete_order()`:

  * For **sell**: listing status becomes **sold** (permanent).
  * For **lend**: listing returns to **available** after return is recorded (`returned_at` timestamp).

### E) Reviews & Ratings

* After a completed transaction, the buyer can leave one review per order with rating (1–5) and optional comment.
* Seller ratings are automatically calculated and updated via triggers (`trg_review_ai`/`trg_review_ad`).
* Average rating and review count are pre-aggregated in User table for performance.
* Top-rated sellers available via `vw_top_sellers` view.

### F) Comments & Q&A (Message-like)

* Under each listing, logged-in users can post public comments in chronological order.
* Supports threaded discussions with parent/child relationships (`parent_id`).
* Comments are indexed for efficient chronological display.
* Admin can delete inappropriate comments.

### G) Admin & Analytics

* Admin can view overall statistics: number of users, active listings, completed orders.
* Predefined views provide analytics:

  * `vw_active_listings`: Available listings with seller/category details
  * `vw_monthly_orders`: Orders per month with revenue totals
  * `vw_top_sellers`: Top-rated sellers by average rating and review count

---

## 4) Non-functional Requirements

### A) Security & Access Control

* Passwords stored using hashing.
* Role-based access: **admin** vs **student**, least-privilege permissions.
* Prevent SQL injection via parameterized queries / ORM.

### B) Performance

* Typical operations (browse/search/view/create order) respond within **2–3 seconds** under course-scale load.
* Strategic indexing on frequently queried columns:
  - Listing: `(status, category_id, created_at)`, `(status, list_price)`, `(seller_id, created_at)`
  - Order: `(listing_id, status)`, `(buyer_id, order_date)`, `(status, completed_at)`
  - Comment: `(listing_id, created_at)`
* Full-text search on `Listing(title, description)` for keyword search.

### C) Reliability & Data Integrity

* Foreign keys and constraints enforce referential integrity.
* Check constraints prevent invalid data:
  - Prices ≥ 0 (`list_price`, `offer_price`, `final_price`)
  - Ratings 1-5 (`Review.rating`)
  - Email domain validation (`@vinuni.edu.vn`)
* Row-level locking in stored procedures prevents race conditions and double-selling.
* Atomic transactions ensure data consistency during state transitions.

### D) Usability

* Simple, mobile-friendly UI with clear navigation (Home, Browse, My Listings, My Orders).

### E) Maintainability

* Clear separation of concerns: database layer, backend API, and frontend pages.
* Consistent naming conventions and documented SQL/logic.

---

## 5) Data Model (Revised v2)

### Key Design Decision: Listing-Centric Model

To avoid redundancy, the project uses a **listing-centric** schema where a listing includes the item’s descriptive fields (title, description, condition). This simplifies queries and reduces unnecessary joins.

### Core Entities

#### User

* Attributes:

  * `user_id (PK)`, `full_name`, `email (unique)`, `password_hash`, `phone`, `address`,
    `role (admin/student)`, `status (active/inactive)`, `created_at`
* Performance fields:

  * `avg_rating` (DECIMAL(3,2)), `rating_count` (maintained via triggers)

* Relationships:
  * 1–N with Listing (seller)
  * 1–N with Order (buyer)
  * 1–N with Comment

* Integrity constraints:
  * `UNIQUE(email)`
  * Email domain validation via triggers
  * Rating constraints: `avg_rating >= 0.00 AND avg_rating <= 5.00`

```sql
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
```

#### Category

* Attributes:

  * `category_id (PK)`, `name (unique)`, `description`

* Relationships:
  * 1–N with Listing

```sql
CREATE TABLE `Category` (
  category_id   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120)     NOT NULL,
  description   VARCHAR(255)    NULL,

  PRIMARY KEY (category_id),
  UNIQUE KEY uq_category_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

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

```sql
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
```

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
  * 1-1 with Review

* Notes:
  * For **sell**: `completed` means transaction done; listing becomes `sold`.
  * For **lend**: `completed` means item returned (`returned_at` is set); listing returns to `available`.

```sql
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
```

#### Review

* Attributes:

  * `review_id (PK)`, `order_id (FK → Order, UNIQUE)`, `rating (1–5)`, `comment`, `created_at`

* Relationships:

  * 1–1 with Order (connect to seller)

* Notes:

  * One review per order (enforced by `UNIQUE(order_id)`).
  * The reviewed seller is derived via `Order → Listing → seller_id` to avoid redundant seller fields.

```sql
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
```

#### Comment

* Attributes:

  * `comment_id (PK)`, `listing_id (FK → Listing)`, `user_id (FK → User)`, `content`, `created_at`, `parent_id (FK → Comment, nullable)`

* Relationships:
  * N–1 with Listing
  * N–1 with User (sender/receiver)
  * 1–N with Comment (self-relationship via parent_id, for replies)

```sql
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
```

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

### Implemented Indexes

**Listing**

```sql
CREATE INDEX idx_listing_status_category_created
ON `Listing`(status, category_id, created_at);

CREATE INDEX idx_listing_status_price
ON `Listing`(status, list_price);

CREATE INDEX idx_listing_seller_created
ON `Listing`(seller_id, created_at);

ALTER TABLE `Listing`
ADD FULLTEXT INDEX ft_listing_title_desc (title, description);
```

**Order**

```sql
CREATE INDEX idx_order_listing_status
ON `Order`(listing_id, status);

CREATE INDEX idx_order_buyer_date
ON `Order`(buyer_id, order_date);

CREATE INDEX idx_order_status_completed
ON `Order`(status, completed_at);
```

**Comment**

```sql
-- Already defined in table creation
KEY idx_comment_listing_created (listing_id, created_at),
KEY idx_comment_user (user_id),
KEY idx_comment_parent (parent_id)
```

**Review**

```sql
-- Already defined in table creation
UNIQUE KEY uq_review_order (order_id)
```

---

## 8) Stored Procedures, Triggers & Views (Course Requirements)

### Where Rules Are Enforced (DB vs Backend)

* **Critical state transitions** (request/confirm/cancel/complete) are enforced in **stored procedures** using **transactions** and **row locking** (`SELECT ... FOR UPDATE`) to prevent race conditions and double-selling.
* **Triggers** are used for:

  * Maintaining **derived/aggregated fields** (e.g., `User.avg_rating`, `User.rating_count`), and
  * Acting as a lightweight safety net for consistency checks where appropriate.

### Stored Procedures (implemented)

```sql
-- Confirm order and prevent double-selling
CREATE PROCEDURE sp_confirm_order(IN p_order_id BIGINT UNSIGNED)

-- Reject pending order
CREATE PROCEDURE sp_reject_order(IN p_order_id BIGINT UNSIGNED)

-- Cancel pending order
CREATE PROCEDURE sp_cancel_order(IN p_order_id BIGINT UNSIGNED)

-- Complete confirmed order
CREATE PROCEDURE sp_complete_order(IN p_order_id BIGINT UNSIGNED)

-- Refresh seller ratings
CREATE PROCEDURE sp_refresh_seller_rating(IN p_seller_id BIGINT UNSIGNED)
```

### Triggers (implemented)

```sql
-- Auto-refresh seller ratings after review insert/delete
CREATE TRIGGER trg_review_ai AFTER INSERT ON `Review` ...
CREATE TRIGGER trg_review_ad AFTER DELETE ON `Review` ...

-- Enforce VinUni email domain validation
CREATE TRIGGER trg_user_email_vinuni_bi BEFORE INSERT ON `User` ...
CREATE TRIGGER trg_user_email_vinuni_bu BEFORE UPDATE ON `User` ...
```

### Views (implemented)

```sql
-- Active listings for browsing
CREATE VIEW vw_active_listings AS
SELECT l.*, u.full_name AS seller_name, u.email AS seller_email,
       c.name AS category_name
FROM `Listing` l
JOIN `User` u ON u.user_id = l.seller_id
JOIN `Category` c ON c.category_id = l.category_id
WHERE l.status = 'available';

-- Monthly orders analytics
CREATE VIEW vw_monthly_orders AS
SELECT DATE_FORMAT(COALESCE(o.completed_at, o.order_date), '%Y-%m') AS yearmonth,
       COUNT(*) AS completed_orders,
       SUM(COALESCE(o.final_price, 0)) AS total_revenue
FROM `Order` o
WHERE o.status = 'completed'
GROUP BY DATE_FORMAT(COALESCE(o.completed_at, o.order_date), '%Y-%m');

-- Top-rated sellers
CREATE VIEW vw_top_sellers AS
SELECT u.user_id AS seller_id, u.full_name AS seller_name,
       u.email AS seller_email, u.rating_count, u.avg_rating
FROM `User` u
WHERE u.rating_count > 0
ORDER BY u.avg_rating DESC, u.rating_count DESC;
```

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

## 10) Database Implementation

### Database Setup Order

1. **Tables & Constraints**: Run `VinUniCircularMarket.sql`
2. **Sample Data**: Run `VinUniCircularMarket_Input.sql`
3. **Functions & Objects**: Run `VinUniCircularMarket_Functions.sql`

### Key Database Features

* **Dual Transaction Types**: Separate handling for sales (`reserved` → `sold`) vs lending (`borrowed` → `available`)
* **Race Condition Prevention**: Row-level locking in stored procedures prevents double-selling
* **Automatic Rating Updates**: Triggers maintain seller ratings after reviews
* **Email Domain Validation**: Triggers enforce `@vinuni.edu.vn` email requirement
* **Full-Text Search**: Optimized keyword search on listing titles and descriptions
* **Analytics Views**: Pre-aggregated data for performance (active listings, monthly orders, top sellers)

### Sample Usage

```sql
-- Browse available electronics
SELECT * FROM vw_active_listings
WHERE category_name = 'Electronics'
ORDER BY created_at DESC;

-- Search listings
SELECT * FROM Listing
WHERE MATCH(title, description) AGAINST('iPhone' IN NATURAL LANGUAGE MODE);

-- Confirm an order (prevents double-selling)
CALL sp_confirm_order(123);

-- View top sellers
SELECT * FROM vw_top_sellers LIMIT 10;
```

---

## 11) Team Members and Roles

* **Nguyen The An – Database Architect**

  * Requirements, ERD/logical schema, DDL, constraints, indexing strategy, DB coordination.

* **Le Ngoc Bich Phuong – Database Implementation**

  * Implement schema in MySQL, sample data, views/procedures/triggers, query optimization.

* **Phan Nguyen Tuan Anh – Software Engineer**

  * Spring Boot backend + UI integration with MySQL database.

---

## 12) Planned Milestones

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
