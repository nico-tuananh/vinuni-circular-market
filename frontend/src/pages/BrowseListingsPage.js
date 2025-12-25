// Browse Listings Page Component
export class BrowseListingsPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.listings = [];
        this.categories = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.totalItems = 0;
        this.isLoading = false;
        this.searchQuery = '';
        this.filters = {
            category: '',
            type: '',
            condition: '',
            minPrice: '',
            maxPrice: '',
            sort: 'newest'
        };
    }

    async render() {
        if (!this.container) {
            console.error('BrowseListingsPage: Container not found');
            return;
        }

        this.isLoading = true;
        this.parseUrlParams();
        this.container.innerHTML = `
            <div class="container-fluid py-4">
                <div class="row">
                    <!-- Sidebar Filters -->
                    <div class="col-lg-3 col-xl-2">
                        <div class="bg-light rounded p-4 sticky-top" style="top: 20px;">
                            <h5 class="mb-4 fw-bold">Filters</h5>

                            <!-- Category Filter -->
                            <div class="mb-4">
                                <label class="form-label fw-semibold">Category</label>
                                <select class="form-select" id="category-filter">
                                    <option value="">All Categories</option>
                                    ${this.renderCategoryOptions()}
                                </select>
                            </div>

                            <!-- Type Filter -->
                            <div class="mb-4">
                                <label class="form-label fw-semibold">Type</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="type" id="type-all" value="" checked>
                                    <label class="form-check-label" for="type-all">All Types</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="type" id="type-sell" value="SELL">
                                    <label class="form-check-label" for="type-sell">For Sale</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="type" id="type-lend" value="LEND">
                                    <label class="form-check-label" for="type-lend">For Lend</label>
                                </div>
                            </div>

                            <!-- Condition Filter -->
                            <div class="mb-4">
                                <label class="form-label fw-semibold">Condition</label>
                                <select class="form-select" id="condition-filter">
                                    <option value="">Any Condition</option>
                                    <option value="NEW">New</option>
                                    <option value="LIKE_NEW">Like New</option>
                                    <option value="USED">Used</option>
                                </select>
                            </div>

                            <!-- Price Range -->
                            <div class="mb-4">
                                <label class="form-label fw-semibold">Price Range ($)</label>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <input type="number" class="form-control" id="min-price" placeholder="Min" min="0">
                                    </div>
                                    <div class="col-6">
                                        <input type="number" class="form-control" id="max-price" placeholder="Max" min="0">
                                    </div>
                                </div>
                            </div>

                            <!-- Apply Filters Button -->
                            <div class="d-grid">
                                <button class="btn btn-primary" id="apply-filters">
                                    <i class="bi bi-funnel me-2"></i>Apply Filters
                                </button>
                                <button class="btn btn-outline-secondary btn-sm mt-2" id="clear-filters">
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div class="col-lg-9 col-xl-10">
                        <!-- Search and Sort Bar -->
                        <div class="card mb-4">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-6">
                                        <div class="input-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                id="search-input"
                                                placeholder="Search listings..."
                                                value="${this.searchQuery}"
                                            >
                                            <button class="btn btn-outline-primary" id="search-btn">
                                                <i class="bi bi-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="d-flex justify-content-end align-items-center gap-3">
                                            <label class="form-label mb-0 fw-semibold">Sort by:</label>
                                            <select class="form-select form-select-sm" id="sort-select" style="width: auto;">
                                                <option value="newest" ${this.filters.sort === 'newest' ? 'selected' : ''}>Newest First</option>
                                                <option value="oldest" ${this.filters.sort === 'oldest' ? 'selected' : ''}>Oldest First</option>
                                                <option value="price_low" ${this.filters.sort === 'price_low' ? 'selected' : ''}>Price: Low to High</option>
                                                <option value="price_high" ${this.filters.sort === 'price_high' ? 'selected' : ''}>Price: High to Low</option>
                                                <option value="rating" ${this.filters.sort === 'rating' ? 'selected' : ''}>Highest Rated</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Results Header -->
                        <div class="d-flex justify-content-between align-items-center mb-3" id="results-header">
                            ${this.renderResultsHeader()}
                        </div>

                        <!-- Listings Grid -->
                        <div class="row g-4" id="listings-grid">
                            ${this.renderListings()}
                        </div>

                        <!-- Pagination -->
                        <div class="d-flex justify-content-center mt-5" id="pagination">
                            ${this.renderPagination()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        await this.loadData();
        this.attachEventListeners();
        this.updateFilterUI();
        window.currentBrowsePage = this;
    }

    attachEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        this.updateSearchInputValue();

        // Filter functionality
        const applyFiltersBtn = document.getElementById('apply-filters');
        const clearFiltersBtn = document.getElementById('clear-filters');
        const sortSelect = document.getElementById('sort-select');

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.currentPage = 1; // Reset to first page when sort changes
                this.loadListings();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        // Type filter
        const typeRadios = document.querySelectorAll('input[name="type"]');
        typeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.type = e.target.value;
                this.applyFilters();
            });
        });

        // Condition filter
        const conditionFilter = document.getElementById('condition-filter');
        if (conditionFilter) {
            conditionFilter.addEventListener('change', (e) => {
                this.filters.condition = e.target.value;
                this.applyFilters();
            });
        }
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);

        this.searchQuery = urlParams.get('q') || '';
        this.filters.category = urlParams.get('category') || '';
        this.filters.type = urlParams.get('type') || '';
        this.filters.condition = urlParams.get('condition') || '';
        this.filters.minPrice = urlParams.get('minPrice') || '';
        this.filters.maxPrice = urlParams.get('maxPrice') || '';
        this.filters.sort = urlParams.get('sort') || 'newest';
        this.currentPage = parseInt(urlParams.get('page')) || 1;
    }

    updateUrlParams() {
        const params = new URLSearchParams();

        if (this.searchQuery) params.set('q', this.searchQuery);
        if (this.filters.category) params.set('category', this.filters.category);
        if (this.filters.type) params.set('type', this.filters.type);
        if (this.filters.condition) params.set('condition', this.filters.condition);
        if (this.filters.minPrice) params.set('minPrice', this.filters.minPrice);
        if (this.filters.maxPrice) params.set('maxPrice', this.filters.maxPrice);
        if (this.filters.sort !== 'newest') params.set('sort', this.filters.sort);
        if (this.currentPage > 1) params.set('page', this.currentPage.toString());

        const newUrl = `/listings${params.toString() ? '?' + params.toString() : ''}`;
        // Use scrollRestoration to prevent browser from restoring scroll position
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.history.replaceState({}, '', newUrl);
    }

    async loadData() {
        try {
            this.isLoading = true;
            const { CategoryService } = await import('../services/api.js');
            const categoriesData = await CategoryService.getCategories();
            this.categories = categoriesData.content || categoriesData || [];
            await this.loadListings();
        } catch (error) {
            console.error('BrowseListingsPage: loadData() failed:', error);
            this.categories = [];
            this.listings = [];
            this.isLoading = false;
            this.updateListingsGrid();
        } finally {
            this.isLoading = false;
        }
    }

    getSortParams() {
        // Map frontend sort values to backend sortBy and sortDir
        const sortMap = {
            'newest': { sortBy: 'createdAt', sortDir: 'desc' },
            'oldest': { sortBy: 'createdAt', sortDir: 'asc' },
            'price_low': { sortBy: 'listPrice', sortDir: 'asc' },
            'price_high': { sortBy: 'listPrice', sortDir: 'desc' },
            'rating': { sortBy: 'createdAt', sortDir: 'desc' } // Rating not available, fallback to newest
        };

        const sortValue = this.filters.sort || 'newest';
        return sortMap[sortValue] || sortMap['newest'];
    }

    async loadListings() {
        try {
            this.isLoading = true;
            const { ListingService } = await import('../services/api.js');

            let response;
            let apiMethod = 'unknown';

            const sortParams = this.getSortParams();

            // Build query parameters
            const params = {
                page: this.currentPage - 1, // Backend uses 0-based pagination
                size: 9,
                sortBy: sortParams.sortBy,
                sortDir: sortParams.sortDir
            };

            // Add filter parameters
            if (this.filters.category) {
                params.categoryId = this.filters.category;
            }
            if (this.filters.type) {
                params.listingTypeStr = this.filters.type;
            }
            if (this.filters.condition) {
                params.conditionStr = this.filters.condition;
            }
            if (this.filters.minPrice) {
                params.minPrice = this.filters.minPrice;
            }
            if (this.filters.maxPrice) {
                params.maxPrice = this.filters.maxPrice;
            }

            // Determine which API method to call
            if (this.searchQuery) {
                apiMethod = 'searchListings';
                response = await ListingService.searchListings(this.searchQuery, params);
            } else if (Object.keys(this.filters).some(key => this.filters[key] && key !== 'sort')) {
                apiMethod = 'filterListings';
                response = await ListingService.filterListings(params);
            } else {
                apiMethod = 'getListings';
                response = await ListingService.getListings(params);
            }

            // Process response data
            this.listings = response.listings || response.content || [];
            this.totalPages = response.totalPages || 1;
            this.totalItems = response.totalItems || response.totalElements || this.listings.length;

            const backendPage = response.currentPage !== undefined ? response.currentPage : (response.number !== undefined ? response.number : 0);
            this.currentPage = backendPage + 1;

            this.isLoading = false;
            this.updateResultsHeader();
            this.updateListingsGrid();
            this.updatePagination();
            this.updateUrlParams();
            this.updateSearchInputValue();

            // Scroll to top after DOM updates complete
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });

        } catch (error) {
            console.error('BrowseListingsPage: loadListings() failed:', error);
            this.listings = [];
            this.isLoading = false;
            this.updateResultsHeader();
            this.updateListingsGrid();
        }
    }

    performSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            this.searchQuery = searchInput.value.trim();
            this.currentPage = 1;
            this.loadListings();
        }
    }

    updateSearchInputValue() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = this.searchQuery || '';
        }
    }

    applyFilters() {
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');

        this.filters.minPrice = minPriceInput ? minPriceInput.value : '';
        this.filters.maxPrice = maxPriceInput ? maxPriceInput.value : '';
        this.currentPage = 1;
        this.loadListings();
    }

    clearFilters() {
        this.filters = {
            category: '',
            type: '',
            condition: '',
            minPrice: '',
            maxPrice: '',
            sort: 'newest'
        };
        this.searchQuery = '';
        this.currentPage = 1;
        this.totalItems = 0;

        // Reset UI elements
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const conditionFilter = document.getElementById('condition-filter');
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        const sortSelect = document.getElementById('sort-select');
        const typeAllRadio = document.getElementById('type-all');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (conditionFilter) conditionFilter.value = '';
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';
        if (sortSelect) sortSelect.value = 'newest';
        if (typeAllRadio) typeAllRadio.checked = true;

        this.loadListings();
    }

    updateFilterUI() {
        // Update category dropdown options
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            const currentValue = categoryFilter.value;
            categoryFilter.innerHTML = '<option value="">All Categories</option>' + this.renderCategoryOptions();
            categoryFilter.value = currentValue || this.filters.category;
        }

        // Set filter values in UI
        const conditionFilter = document.getElementById('condition-filter');
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');

        if (conditionFilter) conditionFilter.value = this.filters.condition;
        if (minPriceInput) minPriceInput.value = this.filters.minPrice;
        if (maxPriceInput) maxPriceInput.value = this.filters.maxPrice;

        // Set type radio button
        const typeRadio = document.getElementById(`type-${this.filters.type.toLowerCase()}`) ||
                         document.getElementById('type-all');
        if (typeRadio) typeRadio.checked = true;
    }

    renderCategoryOptions() {
        if (!this.categories || !Array.isArray(this.categories) || this.categories.length === 0) {
            return '';
        }
        return this.categories.map(category => {
            const categoryId = category.categoryId || category.id;
            if (!categoryId || !category.name) return '';
            return `
                <option value="${categoryId}" ${this.filters.category === categoryId.toString() ? 'selected' : ''}>
                ${category.name}
            </option>
            `;
        }).join('');
    }

    renderResultsHeader() {
        if (this.isLoading) {
            return '<div class="spinner-border spinner-border-sm" role="status"></div>';
        }

        const totalResults = this.totalItems || 0;
        let headerText = `Found ${totalResults} listing${totalResults !== 1 ? 's' : ''}`;

        if (this.searchQuery) {
            headerText += ` for "${this.searchQuery}"`;
        }

        return `<h5 class="mb-0 text-muted">${headerText}</h5>`;
    }

    renderListings() {
        if (this.isLoading) {
            return '<div class="col-12 text-center py-5"><div class="spinner-border" role="status"></div></div>';
        }

        if (!this.listings.length) {
            return `
                <div class="col-12 text-center py-5">
                    <div class="mb-4">
                        <i class="bi bi-search text-muted" style="font-size: 4rem;"></i>
                    </div>
                    <h4 class="text-muted">No listings found</h4>
                    <p class="text-muted">Try adjusting your search or filters</p>
                    <button class="btn btn-primary" onclick="window.currentBrowsePage.clearFilters()">
                        Clear Filters
                    </button>
                </div>
            `;
        }

        return this.listings.map(listing => this.renderListingCard(listing)).join('');
    }

    renderListingCard(listing) {
        const imageUrl = listing.images && listing.images[0] ? listing.images[0] : '/image-not-available.png';
        const priceValue = listing.listPrice || listing.price || 0;
        const price = priceValue > 0 ? `$${priceValue.toFixed(2)}` : 'Free';
        const condition = this.formatCondition(listing.condition);
        const listingType = listing.listingType || listing.type || 'SELL';
        const type = this.formatType(listingType);
        
        const listingId = listing.listingId || listing.id;

        const description = listing.description || '';
        const maxLength = 80;
        const truncatedDescription = description.length > maxLength 
            ? description.substring(0, maxLength) + '...' 
            : description;

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card h-100 shadow-custom listing-card" onclick="window.App.router.navigate('/listings/${listingId}')">
                    <div class="position-relative">
                        <img src="${imageUrl}" class="card-img-top" alt="${listing.title}" style="height: 200px; object-fit: cover;">
                        <div class="position-absolute top-0 end-0 m-2">
                            <span class="badge bg-${listingType === 'LEND' ? 'info' : 'success'}">${type}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h6 class="card-title mb-2 text-truncate">${listing.title}</h6>
                        <p class="card-text text-muted small mb-2">${truncatedDescription}</p>
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

    renderPagination() {
        if (this.totalPages <= 1) return '';

        let paginationHtml = '<nav><ul class="pagination justify-content-center">';

        // Previous button
        const prevDisabled = this.currentPage === 1;
        paginationHtml += `
            <li class="page-item ${prevDisabled ? 'disabled' : ''}">
                <a class="page-link" href="#" ${prevDisabled ? '' : `onclick="event.preventDefault(); if (window.currentBrowsePage) window.currentBrowsePage.goToPage(${this.currentPage - 1});"`}>
                    Previous
                </a>
            </li>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === this.currentPage;
            paginationHtml += `
                <li class="page-item ${isActive ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="event.preventDefault(); if (window.currentBrowsePage && !${isActive}) window.currentBrowsePage.goToPage(${i});">${i}</a>
                </li>
            `;
        }

        // Next button
        const nextDisabled = this.currentPage === this.totalPages;
        paginationHtml += `
            <li class="page-item ${nextDisabled ? 'disabled' : ''}">
                <a class="page-link" href="#" ${nextDisabled ? '' : `onclick="event.preventDefault(); if (window.currentBrowsePage) window.currentBrowsePage.goToPage(${this.currentPage + 1});"`}>
                    Next
                </a>
            </li>
        `;

        paginationHtml += '</ul></nav>';
        return paginationHtml;
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadListings();
        }
    }

    updateResultsHeader() {
        const resultsHeader = document.getElementById('results-header');
        if (resultsHeader) {
            resultsHeader.innerHTML = this.renderResultsHeader();
        }
    }

    updateListingsGrid() {
        const listingsGrid = document.getElementById('listings-grid');
        if (listingsGrid) {
            listingsGrid.innerHTML = this.renderListings();
        }
    }

    updatePagination() {
        const pagination = document.getElementById('pagination');
        if (pagination) {
            pagination.innerHTML = this.renderPagination();
        }
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

    formatCondition(condition) {
        if (!condition) return 'Used';
        const conditionMap = {
            'NEW': 'New',
            'LIKE_NEW': 'Like New',
            'USED': 'Used'
        };
        return conditionMap[condition] || condition;
    }

    formatType(type) {
        if (!type) return 'Sell';
        const typeMap = {
            'SELL': 'Sell',
            'LEND': 'Borrow'
        };
        return typeMap[type] || type;
    }
}