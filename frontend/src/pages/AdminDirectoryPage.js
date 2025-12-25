// Admin Directory Page - Central hub for all admin functionality
export class AdminDirectoryPage {
    constructor() {
        this.container = document.getElementById('main-content');
    }

    async render() {
        if (!this.container) return;

        // Check admin access
        const { globalState } = window;
        const currentUser = globalState.get('user');

        if (!currentUser || currentUser.role !== 'admin') {
            window.App.router.navigate('/login');
            return;
        }

        this.container.innerHTML = `
            <div class="container py-5">
                <!-- Page Header -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                 style="width: 60px; height: 60px;">
                                <i class="bi bi-shield-check fs-3"></i>
                            </div>
                            <div>
                                <h1 class="h2 mb-1">Admin Directory</h1>
                                <p class="text-muted mb-0">Manage all aspects of the platform</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dashboard & Analytics -->
                <div class="row mb-4">
                    <div class="col-12">
                        <h3 class="h5 mb-3 text-muted">Dashboard & Analytics</h3>
                    </div>
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style="width: 48px; height: 48px;">
                                        <i class="bi bi-speedometer2 fs-5"></i>
                                    </div>
                                    <h5 class="card-title mb-0">Dashboard Overview</h5>
                                </div>
                                <p class="card-text text-muted small">View comprehensive platform statistics and metrics</p>
                                <button class="btn btn-primary w-100" onclick="window.App.router.navigate('/admin')">
                                    <i class="bi bi-arrow-right me-2"></i>Go to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style="width: 48px; height: 48px;">
                                        <i class="bi bi-graph-up fs-5"></i>
                                    </div>
                                    <h5 class="card-title mb-0">Analytics</h5>
                                </div>
                                <p class="card-text text-muted small">Detailed analytics and performance metrics</p>
                                <div class="alert alert-info small mb-2">
                                    <i class="bi bi-info-circle me-1"></i>Available in Dashboard
                                </div>
                                <button class="btn btn-outline-info w-100" onclick="window.App.router.navigate('/admin')">
                                    <i class="bi bi-arrow-right me-2"></i>View in Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Management -->
                <div class="row mb-4">
                    <div class="col-12">
                        <h3 class="h5 mb-3 text-muted">User Management</h3>
                    </div>
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style="width: 48px; height: 48px;">
                                        <i class="bi bi-people fs-5"></i>
                                    </div>
                                    <h5 class="card-title mb-0">Manage Users</h5>
                                </div>
                                <p class="card-text text-muted small">View, edit, activate/deactivate, and manage user accounts</p>
                                <ul class="list-unstyled small text-muted mb-3">
                                    <li><i class="bi bi-check-circle me-2"></i>View all users</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Update user status</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Change user roles</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Bulk operations</li>
                                </ul>
                                <button class="btn btn-success w-100" onclick="window.App.router.navigate('/admin/users')">
                                    <i class="bi bi-arrow-right me-2"></i>Manage Users
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content Management -->
                <div class="row mb-4">
                    <div class="col-12">
                        <h3 class="h5 mb-3 text-muted">Content Management</h3>
                    </div>
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style="width: 48px; height: 48px;">
                                        <i class="bi bi-list-ul fs-5"></i>
                                    </div>
                                    <h5 class="card-title mb-0">Manage Listings</h5>
                                </div>
                                <p class="card-text text-muted small">View, moderate, and manage all platform listings</p>
                                <ul class="list-unstyled small text-muted mb-3">
                                    <li><i class="bi bi-check-circle me-2"></i>View all listings</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Delete any listing</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Update listing status</li>
                                    <li><i class="bi bi-check-circle me-2"></i>View by user</li>
                                </ul>
                                <div class="alert alert-info small mb-2">
                                    <i class="bi bi-info-circle me-1"></i>Delete listings from listing detail pages
                                </div>
                                <button class="btn btn-warning w-100" onclick="window.App.router.navigate('/listings')">
                                    <i class="bi bi-arrow-right me-2"></i>Browse Listings
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style="width: 48px; height: 48px;">
                                        <i class="bi bi-chat-dots fs-5"></i>
                                    </div>
                                    <h5 class="card-title mb-0">Moderate Comments</h5>
                                </div>
                                <p class="card-text text-muted small">Review and moderate user comments and reviews</p>
                                <ul class="list-unstyled small text-muted mb-3">
                                    <li><i class="bi bi-check-circle me-2"></i>View all comments</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Delete inappropriate content</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Bulk delete operations</li>
                                </ul>
                                <button class="btn btn-danger w-100" onclick="window.App.router.navigate('/admin/comments')">
                                    <i class="bi bi-arrow-right me-2"></i>Moderate Comments
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style="width: 48px; height: 48px;">
                                        <i class="bi bi-tags fs-5"></i>
                                    </div>
                                    <h5 class="card-title mb-0">Manage Categories</h5>
                                </div>
                                <p class="card-text text-muted small">Create, update, and delete product categories</p>
                                <ul class="list-unstyled small text-muted mb-3">
                                    <li><i class="bi bi-check-circle me-2"></i>Create categories</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Update categories</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Delete categories</li>
                                </ul>
                                <button class="btn btn-secondary w-100" onclick="window.App.router.navigate('/admin/categories')">
                                    <i class="bi bi-arrow-right me-2"></i>Manage Categories
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Management -->
                <div class="row mb-4">
                    <div class="col-12">
                        <h3 class="h5 mb-3 text-muted">Order Management</h3>
                    </div>
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                         style="width: 48px; height: 48px;">
                                        <i class="bi bi-receipt fs-5"></i>
                                    </div>
                                    <h5 class="card-title mb-0">Manage Orders</h5>
                                </div>
                                <p class="card-text text-muted small">View and manage all platform orders</p>
                                <ul class="list-unstyled small text-muted mb-3">
                                    <li><i class="bi bi-check-circle me-2"></i>View all orders</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Process overdue orders</li>
                                    <li><i class="bi bi-check-circle me-2"></i>Order analytics</li>
                                </ul>
                                <div class="alert alert-info small mb-2">
                                    <i class="bi bi-info-circle me-1"></i>Order management coming soon
                                </div>
                                <button class="btn btn-outline-primary w-100 disabled">
                                    <i class="bi bi-clock me-2"></i>Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="row">
                    <div class="col-12">
                        <div class="card bg-light">
                            <div class="card-body">
                                <h5 class="card-title mb-3">
                                    <i class="bi bi-lightning-charge me-2"></i>Quick Actions
                                </h5>
                                <div class="row g-2">
                                    <div class="col-md-3">
                                        <button class="btn btn-outline-primary w-100" onclick="window.App.router.navigate('/admin/users')">
                                            <i class="bi bi-people me-2"></i>Users
                                        </button>
                                    </div>
                                    <div class="col-md-3">
                                        <button class="btn btn-outline-warning w-100" onclick="window.App.router.navigate('/listings')">
                                            <i class="bi bi-list-ul me-2"></i>Listings
                                        </button>
                                    </div>
                                    <div class="col-md-3">
                                        <button class="btn btn-outline-danger w-100" onclick="window.App.router.navigate('/admin/comments')">
                                            <i class="bi bi-chat-dots me-2"></i>Comments
                                        </button>
                                    </div>
                                    <div class="col-md-3">
                                        <button class="btn btn-outline-info w-100" onclick="window.App.router.navigate('/admin')">
                                            <i class="bi bi-graph-up me-2"></i>Analytics
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}