// My Listings Page Component
export class MyListingsPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.listings = [];
        this.filteredListings = null;
        this.isLoading = true;
        this.currentPage = 0;
        this.totalPages = 1;
        this.user = null;
    }

    async render() {
        if (!this.container) return;

        // Get current user
        const { globalState } = window;
        this.user = globalState.get('user');

        if (!this.user) {
            window.App.router.navigate('/login');
            return;
        }

        // Load listings first
        await this.loadListings();

        this.container.innerHTML = `
            <div class="container py-4">
                <div class="row">
                    <div class="col-12">
                        <!-- Header -->
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 class="h3 mb-1">My Listings</h1>
                                <p class="text-muted mb-0">Manage your active and inactive listings</p>
                            </div>
                            <button class="btn btn-primary" onclick="window.App.router.navigate('/listings/create')">
                                <i class="bi bi-plus-lg me-2"></i>Create New Listing
                            </button>
                        </div>

                        <!-- Stats Cards -->
                        <div class="row mb-4" id="stats-cards">
                            ${this.renderStatsCards()}
                        </div>

                        <!-- Listings Table -->
                        <div class="card">
                            <div class="card-header">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0">Your Listings (${this.listings.length})</h5>
                                    <div class="d-flex gap-2">
                                        <select class="form-select form-select-sm" id="status-filter" style="width: auto;">
                                            <option value="all">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="sold">Sold</option>
                                            <option value="rented">Rented</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-0" id="listings-container">
                                <div class="table-responsive" style="overflow: visible;">
                                    ${this.renderListingsTable()}
                                </div>
                            </div>
                        </div>

                        <!-- Pagination -->
                        ${this.totalPages > 1 ? this.renderPagination() : ''}
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();

        // Make this instance globally available for callbacks
        window.currentMyListingsPage = this;
    }

    renderStatsCards() {
        const activeListings = this.listings.filter(l => {
            const status = l.status?.toUpperCase() || '';
            return status === 'AVAILABLE' || status === 'RESERVED';
        }).length;
        const totalViews = this.listings.reduce((sum, l) => sum + (l.viewCount || 0), 0);
        const totalFavorites = this.listings.reduce((sum, l) => sum + (l.favoriteCount || 0), 0);
        const soldItems = this.listings.filter(l => {
            const status = l.status?.toUpperCase() || '';
            return status === 'SOLD' || status === 'BORROWED';
        }).length;

        return `
            <div class="col-md-3 mb-3">
                <div class="card bg-primary text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${activeListings}</div>
                        <div class="small">Active Listings</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-success text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${totalViews}</div>
                        <div class="small">Total Views</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-warning text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${totalFavorites}</div>
                        <div class="small">Favorites</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-info text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${soldItems}</div>
                        <div class="small">Items Sold/Rented</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderListingsTable() {
        if (this.isLoading) {
            return '<div class="text-center py-5"><div class="spinner-border" role="status"></div></div>';
        }

        if (!this.listings.length) {
            return `
                <div class="text-center py-5">
                    <div class="mb-4">
                        <i class="bi bi-box-seam text-muted" style="font-size: 4rem;"></i>
                    </div>
                    <h4 class="text-muted mb-3">No listings yet</h4>
                    <p class="text-muted mb-4">Create your first listing to start selling or sharing items with the community.</p>
                    <button class="btn btn-primary" onclick="window.App.router.navigate('/listings/create')">
                        <i class="bi bi-plus-lg me-2"></i>Create Your First Listing
                    </button>
                </div>
            `;
        }

        return `
            <table class="table table-hover mb-0">
                <thead class="table-light">
                    <tr>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.listings.map(listing => this.renderListingRow(listing)).join('')}
                </tbody>
            </table>
        `;
    }

    renderListingRow(listing) {
        const imageUrl = listing.images && listing.images[0] ? listing.images[0] : '/placeholder-listing.png';
        const statusBadgeClass = this.getStatusBadgeClass(listing.status);

        return `
            <tr class="listing-row" onclick="window.currentMyListingsPage.viewListing('${listing.id}')">
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${imageUrl}" alt="${listing.title}" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                        <div>
                            <div class="fw-semibold">${listing.title}</div>
                            <small class="text-muted">${listing.category?.name || 'Uncategorized'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-${listing.type === 'Borrow' ? 'info' : 'success'}">${listing.type || 'Sell'}</span>
                </td>
                <td class="fw-semibold">
                    ${listing.price ? `$${listing.price.toFixed(2)}` : 'Free'}
                    ${listing.type === 'Borrow' ? '<small class="text-muted d-block">per day</small>' : ''}
                </td>
                <td>
                    <span class="badge ${statusBadgeClass}">${this.formatStatus(listing.status)}</span>
                </td>
                <td>${listing.viewCount || 0}</td>
                <td>${this.formatDate(listing.createdAt)}</td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-boundary="viewport" data-bs-auto-close="true" onclick="event.stopPropagation()">
                            Actions
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); window.currentMyListingsPage.viewListing('${listing.id}')">
                                <i class="bi bi-eye me-2"></i>View
                            </a></li>
                            <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); window.currentMyListingsPage.editListing('${listing.id}')">
                                <i class="bi bi-pencil me-2"></i>Edit
                            </a></li>
                            <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); window.currentMyListingsPage.duplicateListing('${listing.id}')">
                                <i class="bi bi-files me-2"></i>Duplicate
                            </a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="event.stopPropagation(); window.currentMyListingsPage.deleteListing('${listing.id}')">
                                <i class="bi bi-trash me-2"></i>Delete
                            </a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        `;
    }

    renderPagination() {
        if (this.totalPages <= 1) return '';

        let paginationHtml = '<nav class="mt-4"><ul class="pagination justify-content-center">';

        // Previous button
        paginationHtml += `
            <li class="page-item ${this.currentPage === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="window.currentMyListingsPage.goToPage(${this.currentPage - 1})">
                    Previous
                </a>
            </li>
        `;

        // Page numbers
        const startPage = Math.max(0, this.currentPage - 2);
        const endPage = Math.min(this.totalPages - 1, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="window.currentMyListingsPage.goToPage(${i})">${i + 1}</a>
                </li>
            `;
        }

        // Next button
        paginationHtml += `
            <li class="page-item ${this.currentPage === this.totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="window.currentMyListingsPage.goToPage(${this.currentPage + 1})">
                    Next
                </a>
            </li>
        `;

        paginationHtml += '</ul></nav>';
        return paginationHtml;
    }

    async loadListings() {
        try {
            this.isLoading = true;

            const { ListingService } = await import('../services/api.js');
            const response = await ListingService.getMyListings();

            // Handle paginated response structure
            if (response && response.listings) {
                this.listings = response.listings || [];
                this.totalPages = response.totalPages || 1;
                this.currentPage = response.currentPage || 0;
            } else if (Array.isArray(response)) {
                // Fallback if response is directly an array
                this.listings = response;
                this.totalPages = 1;
            } else {
                this.listings = [];
                this.totalPages = 1;
            }

        } catch (error) {
            console.error('Failed to load listings:', error);
            this.listings = [];
            this.totalPages = 1;
        } finally {
            this.isLoading = false;
        }
    }

    attachEventListeners() {
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterByStatus(e.target.value);
            });
        }
    }

    filterByStatus(status) {
        let displayListings = this.listings;
        
        if (status !== 'all') {
            const statusMap = {
                'active': ['AVAILABLE', 'RESERVED'],
                'inactive': [],
                'sold': ['SOLD'],
                'rented': ['BORROWED']
            };
            const targetStatuses = statusMap[status] || [];
            displayListings = this.listings.filter(l => {
                const listingStatus = (l.status?.toUpperCase() || '');
                return targetStatuses.includes(listingStatus);
            });
        }
        
        const container = document.getElementById('listings-container');
        if (container) {
            const tableContainer = container.querySelector('.table-responsive');
            if (tableContainer) {
                const originalListings = this.listings;
                this.listings = displayListings;
                tableContainer.innerHTML = this.renderListingsTable();
                this.listings = originalListings;
            }
        }
    }

    viewListing(listingId) {
        window.App.router.navigate(`/listings/${listingId}`);
    }

    editListing(listingId) {
        window.App.router.navigate(`/listings/${listingId}/edit`);
    }

    async duplicateListing(listingId) {
        try {
            console.log('Duplicate listing:', listingId);
            const { globalState } = window;
            globalState.addNotification({
                type: 'info',
                title: 'Coming Soon',
                message: 'Duplicate listing functionality will be available soon.'
            });
        } catch (error) {
            console.error('Failed to duplicate listing:', error);
        }
    }

    async deleteListing(listingId) {
        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: 'Delete Listing',
            message: 'Are you sure you want to delete this listing? This action cannot be undone.',
            confirmText: 'Delete Listing',
            confirmVariant: 'danger',
            onConfirm: async () => {
                try {
                    const { ListingService } = await import('../services/api.js');
                    await ListingService.deleteListing(listingId);

                    // Reload listings
                    await this.loadListings();
                    this.render();

                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'success',
                        title: 'Listing Deleted',
                        message: 'Your listing has been deleted successfully.'
                    });

                } catch (error) {
                    console.error('Failed to delete listing:', error);
                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'error',
                        title: 'Delete Failed',
                        message: 'Failed to delete listing. Please try again.'
                    });
                }
            }
        });

        modal.show();
    }

    goToPage(page) {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            this.loadListings();
        }
    }

    getStatusBadgeClass(status) {
        if (!status) return 'bg-secondary';
        const statusUpper = status.toUpperCase();
        const statusClasses = {
            'AVAILABLE': 'bg-success',
            'RESERVED': 'bg-info',
            'SOLD': 'bg-warning',
            'BORROWED': 'bg-primary',
            'ACTIVE': 'bg-success',
            'INACTIVE': 'bg-secondary',
            'RENTED': 'bg-info',
            'EXPIRED': 'bg-danger'
        };
        return statusClasses[statusUpper] || 'bg-secondary';
    }

    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    formatStatus(status) {
        if (!status) return 'Available';
        const statusUpper = status.toUpperCase();
        const statusMap = {
            'AVAILABLE': 'Available',
            'RESERVED': 'Reserved',
            'SOLD': 'Sold',
            'BORROWED': 'Borrowed'
        };
        return statusMap[statusUpper] || status;
    }
}