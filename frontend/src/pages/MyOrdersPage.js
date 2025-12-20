// My Orders Page Component (Buyer Perspective)
export class MyOrdersPage {
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
                                <h1 class="h3 mb-1">My Orders</h1>
                                <p class="text-muted mb-0">Track your purchases and borrowing requests</p>
                            </div>
                            <button class="btn btn-primary" onclick="window.App.router.navigate('/listings')">
                                <i class="bi bi-plus-lg me-2"></i>Browse More Items
                            </button>
                        </div>

                        <!-- Stats Cards -->
                        <div class="row mb-4" id="order-stats">
                            ${this.renderOrderStats()}
                        </div>

                        <!-- Filter Tabs -->
                        <div class="mb-4">
                            <nav>
                                <div class="nav nav-tabs" id="order-tabs" role="tablist">
                                    <button class="nav-link active" id="all-tab" data-bs-toggle="tab" data-bs-target="#all-orders" type="button" role="tab">
                                        All Orders (${this.orders.length})
                                    </button>
                                    <button class="nav-link" id="active-tab" data-bs-toggle="tab" data-bs-target="#active-orders" type="button" role="tab">
                                        Active (${this.getOrdersByStatus(['REQUESTED', 'CONFIRMED']).length})
                                    </button>
                                    <button class="nav-link" id="completed-tab" data-bs-toggle="tab" data-bs-target="#completed-orders" type="button" role="tab">
                                        Completed (${this.getOrdersByStatus(['COMPLETED']).length})
                                    </button>
                                    <button class="nav-link" id="cancelled-tab" data-bs-toggle="tab" data-bs-target="#cancelled-orders" type="button" role="tab">
                                        Cancelled (${this.getOrdersByStatus(['REJECTED', 'CANCELLED']).length})
                                    </button>
                                </div>
                            </nav>
                        </div>

                        <!-- Orders Content -->
                        <div class="tab-content" id="orders-content">
                            <div class="tab-pane fade show active" id="all-orders" role="tabpanel">
                                ${this.renderOrdersList(this.orders)}
                            </div>
                            <div class="tab-pane fade" id="active-orders" role="tabpanel">
                                ${this.renderOrdersList(this.getOrdersByStatus(['REQUESTED', 'CONFIRMED']))}
                            </div>
                            <div class="tab-pane fade" id="completed-orders" role="tabpanel">
                                ${this.renderOrdersList(this.getOrdersByStatus(['COMPLETED']))}
                            </div>
                            <div class="tab-pane fade" id="cancelled-orders" role="tabpanel">
                                ${this.renderOrdersList(this.getOrdersByStatus(['REJECTED', 'CANCELLED']))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();

        // Make this instance globally available for callbacks
        window.currentMyOrdersPage = this;
    }

    renderOrderStats() {
        const totalOrders = this.orders.length;
        const activeOrders = this.getOrdersByStatus(['REQUESTED', 'CONFIRMED']).length;
        const completedOrders = this.getOrdersByStatus(['COMPLETED']).length;
        const totalSpent = this.orders
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
                <div class="card bg-info text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${activeOrders}</div>
                        <div class="small">Active Orders</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-success text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${completedOrders}</div>
                        <div class="small">Completed</div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="card bg-warning text-white h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">$${totalSpent.toFixed(2)}</div>
                        <div class="small">Total Spent</div>
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
                        <i class="bi bi-receipt text-muted" style="font-size: 4rem;"></i>
                    </div>
                    <h4 class="text-muted mb-3">No orders found</h4>
                    <p class="text-muted mb-4">You haven't made any orders yet. Start browsing items to make your first purchase!</p>
                    <button class="btn btn-primary" onclick="window.App.router.navigate('/listings')">
                        <i class="bi bi-search me-2"></i>Browse Listings
                    </button>
                </div>
            `;
        }

        return `
            <div class="row g-4">
                ${orders.map(order => this.renderOrderCard(order)).join('')}
            </div>
        `;
    }

    renderOrderCard(order) {
        const listing = order.listing;
        const seller = listing?.seller;
        const imageUrl = listing?.images && listing.images[0] ? listing.images[0] : '/placeholder-listing.png';
        const statusBadge = this.getStatusBadge(order.status);
        const orderDate = this.formatDate(order.orderDate);
        const price = order.finalPrice || order.offerPrice;

        const canCancel = ['REQUESTED', 'CONFIRMED'].includes(order.status);
        const canReview = order.status === 'COMPLETED' && !order.review;
        const isBorrowing = listing?.listingType === 'LEND';
        const isOverdue = isBorrowing && order.status === 'CONFIRMED' && this.isOverdue(order.borrowDueDate);

        return `
            <div class="col-lg-6 mb-4">
                <div class="card h-100 shadow-custom order-card ${isOverdue ? 'border-danger' : ''}">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <span class="badge ${statusBadge.class} me-2">${statusBadge.text}</span>
                            ${isOverdue ? '<span class="badge bg-danger ms-2">OVERDUE</span>' : ''}
                            <small class="text-muted">Order #${order.orderId}</small>
                        </div>
                        <small class="text-muted">${orderDate}</small>
                    </div>

                    <div class="card-body">
                        <div class="row">
                            <div class="col-auto">
                                <img src="${imageUrl}" alt="${listing?.title}" class="rounded" style="width: 80px; height: 80px; object-fit: cover;">
                            </div>
                            <div class="col">
                                <h6 class="card-title mb-1">
                                    <a href="#" onclick="window.App.router.navigate('/listings/${listing?.listingId}')" class="text-decoration-none">
                                        ${listing?.title || 'Unknown Item'}
                                    </a>
                                </h6>
                                <p class="card-text small text-muted mb-2">
                                    Sold by ${seller?.fullName || 'Unknown Seller'}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold text-primary">$${price?.toFixed(2) || '0.00'}</span>
                                    <small class="text-muted">${listing?.listingType === 'LEND' ? 'per day' : ''}</small>
                                </div>
                            </div>
                        </div>

                        ${this.renderOrderTimeline(order)}
                    </div>

                    <div class="card-footer bg-transparent">
                        <div class="d-flex gap-2">
                            ${canCancel ? `
                                <button class="btn btn-outline-danger btn-sm" onclick="window.currentMyOrdersPage.cancelOrder(${order.orderId})">
                                    <i class="bi bi-x-circle me-1"></i>Cancel
                                </button>
                            ` : ''}

                            ${canReview ? `
                                <button class="btn btn-outline-primary btn-sm" onclick="window.currentMyOrdersPage.writeReview(${order.orderId})">
                                    <i class="bi bi-star me-1"></i>Review
                                </button>
                            ` : ''}

                            <button class="btn btn-outline-secondary btn-sm" onclick="window.currentMyOrdersPage.contactSeller(${order.orderId})">
                                <i class="bi bi-envelope me-1"></i>Contact Seller
                            </button>

                            ${isBorrowing && order.status === 'CONFIRMED' && order.borrowDueDate ? `
                                <button class="btn ${isOverdue ? 'btn-danger return-button' : 'btn-outline-success'} btn-sm" onclick="window.currentMyOrdersPage.returnItem(${order.orderId})">
                                    <i class="bi bi-arrow-return-left me-1"></i>${isOverdue ? 'Return Overdue Item' : 'Return Item'}
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderOrderTimeline(order) {
        const timeline = [];

        // Order placed
        timeline.push({
            status: 'Order Placed',
            date: order.orderDate,
            completed: true
        });

        // Order confirmed/rejected
        if (order.status === 'CONFIRMED') {
            timeline.push({
                status: 'Order Confirmed',
                date: order.confirmedAt,
                completed: true
            });
        } else if (order.status === 'REJECTED') {
            timeline.push({
                status: 'Order Rejected',
                date: order.confirmedAt,
                completed: true,
                error: true
            });
        }

        // Order completed
        if (order.status === 'COMPLETED') {
            timeline.push({
                status: 'Order Completed',
                date: order.completedAt,
                completed: true
            });
        }

        // For borrowing orders
        if (order.listing?.listingType === 'LEND' && order.status === 'CONFIRMED') {
            timeline.push({
                status: 'Due Date',
                date: order.borrowDueDate,
                completed: false,
                due: true
            });

            if (order.returnedAt) {
                timeline.push({
                    status: 'Item Returned',
                    date: order.returnedAt,
                    completed: true
                });
            }
        }

        if (timeline.length <= 1) return '';

        return `
            <div class="mt-3">
                <h6 class="small text-muted mb-2">Order Timeline</h6>
                <div class="timeline">
                    ${timeline.map((step, index) => `
                        <div class="timeline-item ${step.completed ? 'completed' : ''} ${step.error ? 'error' : ''} ${step.due ? 'due' : ''}">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <small class="fw-semibold">${step.status}</small>
                                ${step.date ? `<br><small class="text-muted">${this.formatDate(step.date)}</small>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getOrdersByStatus(statuses) {
        return this.orders.filter(order => statuses.includes(order.status));
    }

    getStatusBadge(status) {
        const statusConfig = {
            'REQUESTED': { class: 'bg-warning', text: 'Requested' },
            'CONFIRMED': { class: 'bg-info', text: 'Confirmed' },
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
            const ordersData = await OrderService.getMyOrders();

            this.orders = ordersData || [];

        } catch (error) {
            console.error('Failed to load orders:', error);
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
                title: 'Overdue Items',
                message: `You have ${overdueOrders.length} overdue ${overdueOrders.length === 1 ? 'item' : 'items'} that need to be returned immediately.`
            });
        }
    }

    attachEventListeners() {
        // Tab change events are handled by Bootstrap
    }

    async cancelOrder(orderId) {
        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: 'Cancel Order',
            message: 'Are you sure you want to cancel this order? This action cannot be undone.',
            confirmText: 'Cancel Order',
            confirmVariant: 'danger',
            onConfirm: async () => {
                try {
                    const { OrderService } = await import('../services/api.js');
                    await OrderService.cancelOrder(orderId);

                    // Reload orders
                    await this.loadOrders();
                    this.render();

                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'success',
                        title: 'Order Cancelled',
                        message: 'Your order has been cancelled successfully.'
                    });

                } catch (error) {
                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'error',
                        title: 'Cancellation Failed',
                        message: 'Failed to cancel order. Please try again.'
                    });
                }
            }
        });

        modal.show();
    }

    writeReview(orderId) {
        // Find the order
        const order = this.orders.find(o => o.orderId === orderId);
        if (!order) return;

        // Navigate to listing detail page with review modal
        window.App.router.navigate(`/listings/${order.listing.listingId}?review=${orderId}`);
    }

    contactSeller(orderId) {
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Contact Seller',
            message: 'Contact seller functionality will be available soon.'
        });
    }

    async returnItem(orderId) {
        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: 'Return Item',
            message: 'Confirm that you have returned the borrowed item to the seller.',
            confirmText: 'Confirm Return',
            confirmVariant: 'success',
            onConfirm: async () => {
                try {
                    // In a real implementation, this would call an API to mark the item as returned
                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'success',
                        title: 'Item Returned',
                        message: 'Thank you for returning the item. The seller will confirm receipt.'
                    });

                    // Reload orders
                    await this.loadOrders();
                    this.render();

                } catch (error) {
                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'error',
                        title: 'Return Failed',
                        message: 'Failed to process return. Please contact the seller directly.'
                    });
                }
            }
        });

        modal.show();
    }

    isOverdue(dueDate) {
        if (!dueDate) return false;
        const now = new Date();
        const due = new Date(dueDate);
        return now > due;
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