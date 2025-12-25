// Admin Layout Component - Provides consistent admin interface structure
export class AdminLayoutComponent {
    constructor(content) {
        this.content = content;
        this.user = null;
    }

    render() {
        const { globalState } = window;
        this.user = globalState.get('user');

        if (!this.user || this.user.role !== 'admin') {
            return this.renderAccessDenied();
        }

        return `
            <div class="admin-layout">
                <!-- Admin Sidebar -->
                <nav id="admin-sidebar" class="admin-sidebar">
                    <div class="sidebar-header">
                        <div class="sidebar-brand">
                            <i class="bi bi-shield-check me-2"></i>
                            <span>Admin Panel</span>
                        </div>
                        <button class="sidebar-close d-lg-none" onclick="AdminLayoutComponent.closeSidebar()">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div class="sidebar-menu">
                        <div class="menu-section">
                            <div class="menu-section-title">Dashboard</div>
                            <a href="#" class="menu-item active" onclick="window.App.router.navigate('/admin')">
                                <i class="bi bi-speedometer2 me-2"></i>
                                <span>Overview</span>
                            </a>
                            <a href="#" class="menu-item" onclick="window.App.router.navigate('/admin/analytics')">
                                <i class="bi bi-graph-up me-2"></i>
                                <span>Analytics</span>
                            </a>
                        </div>

                        <div class="menu-section">
                            <div class="menu-section-title">Management</div>
                            <a href="#" class="menu-item" onclick="window.App.router.navigate('/admin/users')">
                                <i class="bi bi-people me-2"></i>
                                <span>Users</span>
                            </a>
                            <a href="#" class="menu-item" onclick="window.App.router.navigate('/admin/listings')">
                                <i class="bi bi-list-ul me-2"></i>
                                <span>Listings</span>
                            </a>
                            <a href="#" class="menu-item" onclick="window.App.router.navigate('/admin/orders')">
                                <i class="bi bi-receipt me-2"></i>
                                <span>Orders</span>
                            </a>
                            <a href="#" class="menu-item" onclick="window.App.router.navigate('/admin/categories')">
                                <i class="bi bi-tags me-2"></i>
                                <span>Categories</span>
                            </a>
                        </div>

                        <div class="menu-section">
                            <div class="menu-section-title">Moderation</div>
                            <a href="#" class="menu-item" onclick="window.App.router.navigate('/admin/comments')">
                                <i class="bi bi-chat-dots me-2"></i>
                                <span>Comments</span>
                                <span class="badge bg-danger ms-auto" id="pending-comments-count">0</span>
                            </a>
                            <a href="#" class="menu-item" onclick="window.App.router.navigate('/admin/reports')">
                                <i class="bi bi-flag me-2"></i>
                                <span>Reports</span>
                                <span class="badge bg-warning ms-auto" id="pending-reports-count">0</span>
                            </a>
                        </div>

                        <div class="menu-section">
                            <div class="menu-section-title">System</div>
                            <a href="#" class="menu-item" onclick="window.App.router.navigate('/admin/settings')">
                                <i class="bi bi-gear me-2"></i>
                                <span>Settings</span>
                            </a>
                            <a href="#" class="menu-item" onclick="window.App.router.navigate('/admin/logs')">
                                <i class="bi bi-journal-text me-2"></i>
                                <span>System Logs</span>
                            </a>
                        </div>
                    </div>

                    <div class="sidebar-footer">
                        <div class="user-info">
                            <div class="user-avatar">
                                <span>${this.getInitials(this.user.fullName)}</span>
                            </div>
                            <div class="user-details">
                                <div class="user-name">${this.user.fullName}</div>
                                <div class="user-role">Administrator</div>
                            </div>
                        </div>
                        <button class="btn btn-outline-light btn-sm" onclick="window.AuthService.logout()">
                            <i class="bi bi-box-arrow-right me-1"></i>
                            Logout
                        </button>
                    </div>
                </nav>

                <!-- Admin Content -->
                <div class="admin-content">
                    <!-- Admin Header -->
                    <header class="admin-header">
                        <div class="header-left">
                            <button class="sidebar-toggle d-lg-none" onclick="AdminLayoutComponent.toggleSidebar()">
                                <i class="bi bi-list"></i>
                            </button>
                            <h1 class="page-title" id="admin-page-title">Dashboard</h1>
                        </div>
                        <div class="header-right">
                            <div class="header-notifications">
                            <button class="btn btn-link position-relative" onclick="AdminLayoutComponent.showNotifications()">
                                <i class="bi bi-bell"></i>
                                <span class="badge bg-danger position-absolute top-0 start-100 translate-middle" id="notification-count" style="display: none;">0</span>
                            </button>
                            </div>
                            <div class="header-user">
                                <span class="text-muted">Welcome, ${this.user.fullName}</span>
                            </div>
                        </div>
                    </header>

                    <!-- Main Content Area -->
                    <main class="admin-main">
                        <div class="container-fluid">
                            ${this.content}
                        </div>
                    </main>
                </div>

                <!-- Sidebar Overlay (Mobile) -->
                <div class="sidebar-overlay d-lg-none" onclick="AdminLayoutComponent.closeSidebar()"></div>
            </div>
        `;
    }

    renderAccessDenied() {
        return `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-md-6 text-center">
                        <div class="mb-4">
                            <i class="bi bi-shield-x text-danger" style="font-size: 4rem;"></i>
                        </div>
                        <h2 class="mb-3">Access Denied</h2>
                        <p class="text-muted mb-4">
                            You don't have permission to access the admin panel. Only administrators can view this page.
                        </p>
                        <button class="btn btn-primary" onclick="window.App.router.navigate('/')">
                            <i class="bi bi-house me-2"></i>Go to Home
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    static toggleSidebar() {
        const sidebar = document.getElementById('admin-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (sidebar && overlay) {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        }
    }

    static closeSidebar() {
        const sidebar = document.getElementById('admin-sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (sidebar && overlay) {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        }
    }

    static showNotifications() {
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Notifications',
            message: 'Admin notifications will be available soon.'
        });
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Static method to wrap content in admin layout
    static wrap(content) {
        const layout = new AdminLayoutComponent(content);
        return layout.render();
    }
}