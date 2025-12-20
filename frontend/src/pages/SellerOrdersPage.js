// Seller Orders Page Component (Seller Perspective)
export class SellerOrdersPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.orders = [];
        this.isLoading = true;
        this.currentFilter = 'all';
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

        // Load orders
        await this.loadOrders();

        // Check for overdue items and show notifications
        this.checkOverdueNotifications();

        this.container.innerHTML = `
            <div class="container py-4">
                <div class="row">
                    <div class="col-12">
                        <!-- Header -->
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 class="h3 mb-1">Seller Dashboard</h1>
                                <p class="text-muted mb-0">Manage your sales and customer orders</p>
                            </div>
                            <button class="btn btn-primary" onclick="window.App.router.navigate('/my-listings')">
                                <i class="bi bi-plus-lg me-2"></i>Manage Listings
                            </button>
                        </div>

                        <!-- Stats Cards -->
                        <div class="row mb-4" id="seller-stats">
                            ${this.renderSellerStats()}
                        </div>

                        <!-- Filter Tabs -->
                        <div class="mb-4">
                            <nav>
                                <div class="nav nav-tabs" id="seller-tabs" role="tablist">
                                    <button class="nav-link active" id="all-orders-tab" data-bs-toggle="tab" data-bs-target="#all-orders-panel" type="button" role="tab">
                                        All Orders (${this.orders.length})
                                    </button>
                                    <button class="nav-link" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending-orders" type="button" role="tab">
                                        Pending (${this.getOrdersByStatus(['REQUESTED']).length})
                                    </button>
                                    <button class="nav-link" id="active-sales-tab" data-bs-toggle="tab" data-bs-target="#active-sales" type="button" role="tab">
                                        Active Sales (${this.getOrdersByStatus(['CONFIRMED']).length})
                                    </button>
                                    <button class="nav-link" id="completed-sales-tab" data-bs-toggle="tab" data-bs-target="#completed-sales" type="button" role="tab">
                                        Completed (${this.getOrdersByStatus(['COMPLETED']).length})
                                    </button>
                                </div>
                            </nav>
                        </div>

                        <!-- Orders Content -->
                        <div class="tab-content" id="seller-orders-content">
                            <div class="tab-pane fade show active" id="all-orders-panel" role="tabpanel">
                                ${this.renderOrdersList(this.orders)}
                            </div>
                            <div class="tab-pane fade" id="pending-orders" role="tabpanel">
                                ${this.renderOrdersList(this.getOrdersByStatus(['REQUESTED']))}
                            </div>
                            <div class="tab-pane fade" id="active-sales" role="tabpanel">
                                ${this.renderOrdersList(this.getOrdersByStatus(['CONFIRMED']))}
                            </div>
                            <div class="tab-pane fade" id="completed-sales" role="tabpanel">
                                ${this.renderOrdersList(this.getOrdersByStatus(['COMPLETED']))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();

        // Make this instance globally available for callbacks
        window.currentSellerOrdersPage = this;
    }

    renderSellerStats() {
        const totalOrders = this.orders.length;
        const pendingOrders = this.getOrdersByStatus(['REQUESTED']).length;
        const activeOrders = this.getOrdersByStatus(['CONFIRMED']).length;
        this.getOrdersByStatus(['COMPLETED']).length;
        const totalRevenue = this.orders
            .filter(order => order.status === 'COMPLETED')
            .reduce((sum, order) => sum + (order.finalPrice || order.offerPrice || 0), 0);

        return `
            <div class="col-md-3 mb-3">
                <div class="card bg-primary text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${totalOrders}</div>
                        <div class="small">Total Orders</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-warning text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${pendingOrders}</div>
                        <div class="small">Pending</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-info text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${activeOrders}</div>
                        <div class="small">Active</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-success text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">$${totalRevenue.toFixed(2)}</div>
                        <div class="small">Revenue</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderOrdersList(orders) {
        if (this.isLoading) {
            return '<div class="text-center py-5"><div class="spinner-border" role="status"></div></div>';
        }

        if (!orders.length) {
            return `
                <div class="text-center py-5">
                    <div class="mb-4">
                        <i class="bi bi-graph-up text-muted" style="font-size: 4rem;"></i>
                    </div>
                    <h4 class="text-muted mb-3">No orders in this category</h4>
                    <p class="text-muted">Check back later or create more listings to attract buyers.</p>
                </div>
            `;
        }

        return `
            <div class="row g-4">
                ${orders.map(order => this.renderSellerOrderCard(order)).join('')}
            </div>
        `;
    }

    renderSellerOrderCard(order) {
        const listing = order.listing;
        const buyer = order.buyer;
        const imageUrl = listing?.images && listing.images[0] ? listing.images[0] : '/placeholder-listing.png';
        const statusBadge = this.getStatusBadge(order.status);
        const orderDate = this.formatDate(order.orderDate);
        const price = order.finalPrice || order.offerPrice;

        const canAccept = order.status === 'REQUESTED';
        const canReject = order.status === 'REQUESTED';
        const canComplete = order.status === 'CONFIRMED';

        const isOverdue = this.isOverdue(order.borrowDueDate);

        return `
            <div class="col-lg-6 mb-4">
                <div class="card h-100 shadow-custom seller-order-card ${isOverdue ? 'border-danger' : ''}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <span class="badge ${statusBadge.class} me-2">${statusBadge.text}</span>
                            ${isOverdue ? '<span class="badge bg-danger ms-2">OVERDUE</span>' : ''}
                            <small class="text-muted">Order #${order.orderId}</small>
                        </div>
                        <small class="text-muted">${orderDate}</small>
                    </div>

                    <div class="card-body">
                        <!-- Buyer Info -->
                        <div class="mb-3 p-3 bg-light rounded">
                            <div class="d-flex align-items-center">
                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                     style="width: 40px; height: 40px;">
                                    ${this.getInitials(buyer?.fullName || 'Buyer')}
                                </div>
                                <div>
                                    <div class="fw-semibold">${buyer?.fullName || 'Unknown Buyer'}</div>
                                    <small class="text-muted">${buyer?.email || ''}</small>
                                </div>
                            </div>
                        </div>

                        <!-- Item Info -->
                        <div class="row">
                            <div class="col-auto">
                                <img src="${imageUrl}" alt="${listing?.title}" class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                            </div>
                            <div class="col">
                                <h6 class="mb-1">${listing?.title || 'Unknown Item'}</h6>
                                <p class="small text-muted mb-1">${listing?.category?.name || 'Uncategorized'}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold text-primary">$${price?.toFixed(2) || '0.00'}</span>
                                    <small class="text-muted">${listing?.listingType === 'LEND' ? 'per day' : ''}</small>
                                </div>
                            </div>
                        </div>

                        ${this.renderOrderDetails(order)}
                    </div>

                    <div class="card-footer bg-transparent">
                        <div class="d-flex gap-2 flex-wrap">
                            ${canAccept ? `
                                <button class="btn btn-success btn-sm" onclick="window.currentSellerOrdersPage.acceptOrder(${order.orderId})">
                                    <i class="bi bi-check-circle me-1"></i>Accept
                                </button>
                            ` : ''}

                            ${canReject ? `
                                <button class="btn btn-outline-danger btn-sm" onclick="window.currentSellerOrdersPage.rejectOrder(${order.orderId})">
                                    <i class="bi bi-x-circle me-1"></i>Reject
                                </button>
                            ` : ''}

                            ${canComplete ? `
                                <button class="btn btn-primary btn-sm" onclick="window.currentSellerOrdersPage.completeOrder(${order.orderId})">
                                    <i class="bi bi-check-lg me-1"></i>Mark Complete
                                </button>
                            ` : ''}

                            <button class="btn btn-outline-secondary btn-sm" onclick="window.currentSellerOrdersPage.contactBuyer(${order.orderId})">
                                <i class="bi bi-envelope me-1"></i>Contact Buyer
                            </button>

                            <button class="btn btn-outline-info btn-sm" onclick="window.currentSellerOrdersPage.viewOrderDetails(${order.orderId})">
                                <i class="bi bi-info-circle me-1"></i>Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderOrderDetails(order) {
        const isBorrowing = order.listing?.listingType === 'LEND';

        return `
            <div class="mt-3 small text-muted">
                ${isBorrowing && order.status === 'CONFIRMED' ? `
                    <div class="mb-2">
                        <strong>Due Date:</strong>
                        <span class="${this.isOverdue(order.borrowDueDate) ? 'text-danger fw-bold' : ''}">
                            ${this.formatDate(order.borrowDueDate) || 'Not set'}
                        </span>
                        ${this.isOverdue(order.borrowDueDate) ? '<span class="badge bg-danger ms-2">OVERDUE</span>' : ''}
                    </div>
                ` : ''}

                ${order.status === 'COMPLETED' ? `
                    <div class="mb-2">
                        <strong>Completed:</strong> ${this.formatDate(order.completedAt)}
                    </div>
                ` : ''}

                ${order.status === 'CONFIRMED' ? `
                    <div class="mb-2">
                        <strong>Confirmed:</strong> ${this.formatDate(order.confirmedAt)}
                    </div>
                ` : ''}

                ${order.review ? `
                    <div class="mb-2">
                        <strong>Reviewed:</strong>
                        <div class="d-inline-flex align-items-center ms-2">
                            ${this.renderStarRating(order.review.rating)}
                            <small class="ms-1">(${order.review.rating}/5)</small>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="bi bi-star${i <= rating ? '-fill' : ''} text-warning small"></i>`;
        }
        return stars;
    }

    getOrdersByStatus(statuses) {
        return this.orders.filter(order => statuses.includes(order.status));
    }

    getStatusBadge(status) {
        const statusConfig = {
            'REQUESTED': { class: 'bg-warning', text: 'Pending' },
            'CONFIRMED': { class: 'bg-info', text: 'Active' },
            'REJECTED': { class: 'bg-danger', text: 'Rejected' },
            'CANCELLED': { class: 'bg-secondary', text: 'Cancelled' },
            'COMPLETED': { class: 'bg-success', text: 'Completed' }
        };

        return statusConfig[status] || { class: 'bg-secondary', text: status };
    }

    async loadOrders() {
        try {
            this.isLoading = true;

            const { OrderService } = await import('../services/api.js');
            const ordersData = await OrderService.getMySales();

            this.orders = ordersData || [];

        } catch (error) {
            console.error('Failed to load seller orders:', error);
            this.orders = [];
        } finally {
            this.isLoading = false;
        }
    }

    checkOverdueNotifications() {
        const overdueOrders = this.orders.filter(order =>
            order.listing?.listingType === 'LEND' &&
            order.status === 'CONFIRMED' &&
            this.isOverdue(order.borrowDueDate)
        );

        if (overdueOrders.length > 0) {
            const { globalState } = window;
            globalState.addNotification({
                type: 'warning',
                title: 'Overdue Returns',
                message: `You have ${overdueOrders.length} overdue ${overdueOrders.length === 1 ? 'item' : 'items'} that ${overdueOrders.length === 1 ? 'needs' : 'need'} to be returned by borrowers.`
            });
        }
    }

    attachEventListeners() {
        // Tab change events are handled by Bootstrap
    }

    async acceptOrder(orderId) {
        try {
            const { OrderService } = await import('../services/api.js');
            await OrderService.confirmOrder(orderId);

            // Reload orders
            await this.loadOrders();
            this.render();

            const { globalState } = window;
            globalState.addNotification({
                type: 'success',
                title: 'Order Accepted',
                message: 'The order has been confirmed and the buyer has been notified.'
            });

        } catch {
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Acceptance Failed',
                message: 'Failed to accept order. Please try again.'
            });
        }
    }

    async rejectOrder(orderId) {
        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: 'Reject Order',
            message: 'Are you sure you want to reject this order? The buyer will be notified.',
            confirmText: 'Reject Order',
            confirmVariant: 'danger',
            onConfirm: async () => {
                try {
                    const { OrderService } = await import('../services/api.js');
                    await OrderService.rejectOrder(orderId);

                    // Reload orders
                    await this.loadOrders();
                    this.render();

                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'success',
                        title: 'Order Rejected',
                        message: 'The order has been rejected and the buyer has been notified.'
                    });

                } catch {
                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'error',
                        title: 'Rejection Failed',
                        message: 'Failed to reject order. Please try again.'
                    });
                }
            }
        });

        modal.show();
    }

    async completeOrder(orderId) {
        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: 'Complete Order',
            message: 'Mark this order as completed? The buyer will be able to leave a review.',
            confirmText: 'Mark Complete',
            confirmVariant: 'success',
            onConfirm: async () => {
                try {
                    const { OrderService } = await import('../services/api.js');
                    await OrderService.completeOrder(orderId);

                    // Reload orders
                    await this.loadOrders();
                    this.render();

                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'success',
                        title: 'Order Completed',
                        message: 'The order has been marked as completed.'
                    });

                } catch {
                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'error',
                        title: 'Completion Failed',
                        message: 'Failed to complete order. Please try again.'
                    });
                }
            }
        });

        modal.show();
    }

    contactBuyer() {
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Contact Buyer',
            message: 'Contact buyer functionality will be available soon.'
        });
    }

    viewOrderDetails() {
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Order Details',
            message: 'Detailed order view will be available soon.'
        });
    }

    isOverdue(dueDate) {
        if (!dueDate) return false;
        const now = new Date();
        const due = new Date(dueDate);
        return now > due;
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
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
}