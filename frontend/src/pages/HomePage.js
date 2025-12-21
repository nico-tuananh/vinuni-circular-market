// Home Page Component
export class HomePage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.featuredListings = [];
        this.recentListings = [];
        this.categories = [];
        this.isLoading = true;
    }

    get isAuthenticated() {
        const { globalState } = window;
        return globalState && !!globalState.get('user');
    }

    async render() {
        if (!this.container) return;

        // Load initial data
        await this.loadData();

        this.container.innerHTML = `
            <!-- Hero Section with Search -->
            <div class="bg-primary text-white py-5">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <h1 class="display-4 fw-bold mb-4">
                                ♻️💰 Welcome to CampusCircle
                            </h1>
                            <p class="lead mb-4">
                                VinUni's student-exclusive marketplace for buying, selling, and sharing.
                                Connect with fellow students for sustainable campus living.
                            </p>

                            <!-- Search Bar -->
                            <div class="mb-4">
                                <div class="input-group input-group-lg">
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="hero-search"
                                        placeholder="Search for textbooks, electronics, furniture..."
                                        aria-label="Search listings"
                                    >
                                    <button class="btn btn-light" type="button" id="hero-search-btn">
                                        <i class="bi bi-search me-2"></i>Search
                                    </button>
                                </div>
                            </div>

                            <div class="d-flex gap-3 flex-wrap">
                                <button class="btn btn-light btn-lg" onclick="window.App.router.navigate('/listings')">
                                    <i class="bi bi-grid me-2"></i>Browse All
                                </button>
                                ${!this.isAuthenticated ? `
                                <button class="btn btn-outline-light btn-lg" onclick="window.App.router.navigate('/register')">
                                    <i class="bi bi-person-plus me-2"></i>Join Community
                                </button>
                                ` : ''}
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="text-center">
                                <div class="bg-white bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center"
                                     style="width: 200px; height: 200px;">
                                    <span style="font-size: 4rem;">🎓</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Category Navigation -->
            <div class="bg-light py-4">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <h5 class="mb-3 fw-bold">Browse by Category</h5>
                            <div class="d-flex gap-3 overflow-auto pb-2" id="category-nav">
                                ${this.renderCategoryNavigation()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Featured Listings -->
            <div class="container py-5">
                <div class="row mb-4">
                    <div class="col-12 d-flex justify-content-between align-items-center">
                        <h2 class="display-6 fw-bold mb-0">Featured Listings</h2>
                        <button class="btn btn-outline-primary" onclick="window.App.router.navigate('/listings')">
                            View All <i class="bi bi-arrow-right ms-2"></i>
                        </button>
                    </div>
                </div>
                <div class="row g-4" id="featured-listings">
                    ${this.renderFeaturedListings()}
                </div>
            </div>

            <!-- Recent Listings -->
            <div class="bg-light py-5">
                <div class="container">
                    <div class="row mb-4">
                        <div class="col-12 d-flex justify-content-between align-items-center">
                            <h2 class="display-6 fw-bold mb-0">Recently Added</h2>
                            <button class="btn btn-outline-primary" onclick="window.App.router.navigate('/listings?sort=newest')">
                                View All <i class="bi bi-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </div>
                    <div class="row g-4" id="recent-listings">
                        ${this.renderRecentListings()}
                    </div>
                </div>
            </div>

            <!-- Features Section -->
            <div class="container py-5">
                <div class="row text-center mb-5">
                    <h2 class="display-5 fw-bold">Why Choose CampusCircle?</h2>
                    <p class="lead text-muted">Built specifically for VinUni students</p>
                </div>

                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body text-center">
                                <div class="mb-3">
                                    <span style="font-size: 3rem;">🔒</span>
                                </div>
                                <h5 class="card-title">Student-Only Community</h5>
                                <p class="card-text text-muted">
                                    Exclusive access for VinUni students with @vinuni.edu.vn email verification
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body text-center">
                                <div class="mb-3">
                                    <span style="font-size: 3rem;">♻️</span>
                                </div>
                                <h5 class="card-title">Circular Economy</h5>
                                <p class="card-text text-muted">
                                    Buy, sell, or borrow items to reduce waste and save money
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-body text-center">
                                <div class="mb-3">
                                    <span style="font-size: 3rem;">⭐</span>
                                </div>
                                <h5 class="card-title">Trusted Reviews</h5>
                                <p class="card-text text-muted">
                                    Rate sellers and build trust within the community
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            ${!this.isAuthenticated ? `
            <!-- CTA Section -->
            <div class="bg-light py-5">
                <div class="container text-center">
                    <h3 class="mb-4">Ready to get started?</h3>
                    <p class="lead mb-4">
                        Join thousands of VinUni students in our circular marketplace
                    </p>
                    <button class="btn btn-primary btn-lg px-5" onclick="window.App.router.navigate('/register')">
                        Create Your Account
                    </button>
                </div>
            </div>
            ` : ''}
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('hero-search');
        const searchBtn = document.getElementById('hero-search-btn');

        if (searchInput && searchBtn) {
            const performSearch = () => {
                const query = searchInput.value.trim();
                if (query) {
                    window.App.router.navigate(`/listings?q=${encodeURIComponent(query)}`);
                } else {
                    window.App.router.navigate('/listings');
                }
            };

            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }

    async loadData() {
        try {
            this.isLoading = true;

            // Load categories
            const { CategoryService, ListingService } = await import('../services/api.js');
            const [categoriesData, recentListingsData] = await Promise.all([
                CategoryService.getCategories(),
                ListingService.getRecentListings(8)
            ]);

            this.categories = categoriesData.content || categoriesData || [];
            this.recentListings = recentListingsData.listings || recentListingsData.content || (Array.isArray(recentListingsData) ? recentListingsData : []);
            this.featuredListings = Array.isArray(this.recentListings) ? this.recentListings.slice(0, 4) : [];

        } catch (error) {
            console.error('Failed to load home page data:', error);
            // Use empty arrays as fallback
            this.categories = [];
            this.featuredListings = [];
            this.recentListings = [];
        } finally {
            this.isLoading = false;
        }
    }

    renderCategoryNavigation() {
        if (this.isLoading) {
            return '<div class="text-center py-3"><div class="spinner-border spinner-border-sm" role="status"></div></div>';
        }

        if (!this.categories.length) {
            return '<p class="text-muted mb-0">No categories available</p>';
        }

        return this.categories.slice(0, 8).map(category => `
            <button class="btn btn-outline-primary category-btn" onclick="window.App.router.navigate('/listings?category=${category.id}')">
                <i class="bi bi-tag me-2"></i>${category.name}
            </button>
        `).join('');
    }

    renderFeaturedListings() {
        if (this.isLoading) {
            return '<div class="col-12 text-center py-5"><div class="spinner-border" role="status"></div></div>';
        }

        if (!this.featuredListings.length) {
            return '<div class="col-12 text-center py-5"><p class="text-muted">No featured listings available</p></div>';
        }

        return this.featuredListings.map(listing => this.renderListingCard(listing, 'col-lg-3 col-md-6')).join('');
    }

    renderRecentListings() {
        if (this.isLoading) {
            return '<div class="col-12 text-center py-4"><div class="spinner-border" role="status"></div></div>';
        }

        if (!this.recentListings.length) {
            return '<div class="col-12 text-center py-4"><p class="text-muted">No recent listings available</p></div>';
        }

        return this.recentListings.slice(0, 4).map(listing => this.renderListingCard(listing, 'col-lg-3 col-md-6')).join('');
    }

    renderListingCard(listing, colClass = 'col-md-4') {
        const imageUrl = listing.images && listing.images[0] ? listing.images[0] : '/placeholder-listing.png';
        const price = listing.price ? `$${listing.price.toFixed(2)}` : 'Free';
        const condition = listing.condition || 'Used';
        const type = listing.type || 'Sell';

        return `
            <div class="${colClass} mb-4">
                <div class="card h-100 shadow-custom listing-card" onclick="window.App.router.navigate('/listings/${listing.id}')">
                    <div class="position-relative">
                        <img src="${imageUrl}" class="card-img-top" alt="${listing.title}" style="height: 200px; object-fit: cover;">
                        <div class="position-absolute top-0 end-0 m-2">
                            <span class="badge bg-${type === 'Borrow' ? 'info' : 'success'}">${type}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title mb-2 text-truncate">${listing.title}</h6>
                        <p class="card-text text-muted small mb-2">${listing.description ? listing.description.substring(0, 80) + '...' : ''}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-bold text-primary">${price}</span>
                            <small class="text-muted">${condition}</small>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <small class="text-muted">
                            <i class="bi bi-clock me-1"></i>${this.formatTimeAgo(listing.createdAt)}
                        </small>
                    </div>
                </div>
            </div>
        `;
    }

    formatTimeAgo(dateString) {
        if (!dateString) return 'Recently';

        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return date.toLocaleDateString();
    }
}