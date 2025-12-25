// Admin Dashboard Page - Enhanced with proper layout and analytics
export class AdminDashboard {
    constructor() {
        this.analytics = null;
        this.charts = {};
        this.metrics = {
            totalUsers: 0,
            activeUsers: 0,
            totalListings: 0,
            activeListings: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0,
            monthlyRevenue: 0
        };
        this.recentActivity = [];
        this.topSellers = [];
    }

    async render() {
        // Check if user is admin
        const { globalState } = window;
        const currentUser = globalState.get('user');

        if (!currentUser || currentUser.role !== 'admin') {
            window.App.router.navigate('/login');
            return;
        }

        const mainContent = document.getElementById('main-content');

        // Create dashboard content
        const dashboardContent = `
            <!-- Key Metrics Cards -->
            <div class="row mb-4" id="metrics-cards">
                ${this.renderMetricsCards()}
            </div>

            <!-- Charts and Analytics -->
            <div class="row mb-4">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">Activity Overview</h5>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-secondary active" onclick="window.currentAdminDashboard.changeChartPeriod('7d')">7D</button>
                                <button class="btn btn-outline-secondary" onclick="window.currentAdminDashboard.changeChartPeriod('30d')">30D</button>
                                <button class="btn btn-outline-secondary" onclick="window.currentAdminDashboard.changeChartPeriod('90d')">90D</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <canvas id="activityChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Top Sellers</h5>
                        </div>
                        <div class="card-body" id="top-sellers-list">
                            ${this.renderTopSellers()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Revenue and Orders -->
            <div class="row mb-4">
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Revenue Trends</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="revenueChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Order Status Distribution</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="ordersChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity and System Health -->
            <div class="row">
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Recent Activity</h5>
                        </div>
                        <div class="card-body" id="recent-activity">
                            ${this.renderRecentActivity()}
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">System Health</h5>
                        </div>
                        <div class="card-body" id="system-health">
                            ${this.renderSystemHealth()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Quick Actions</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-3">
                                    <button class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center" onclick="window.App.router.navigate('/admin/users')">
                                        <i class="bi bi-people me-2"></i>
                                        <span>Manage Users</span>
                                    </button>
                                </div>
                                <div class="col-md-3">
                                    <button class="btn btn-outline-success w-100 d-flex align-items-center justify-content-center" onclick="window.App.router.navigate('/admin/listings')">
                                        <i class="bi bi-list-ul me-2"></i>
                                        <span>Manage Listings</span>
                                    </button>
                                </div>
                                <div class="col-md-3">
                                    <button class="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center" onclick="window.App.router.navigate('/admin/comments')">
                                        <i class="bi bi-chat-dots me-2"></i>
                                        <span>Moderate Comments</span>
                                    </button>
                                </div>
                                <div class="col-md-3">
                                    <button class="btn btn-outline-info w-100 d-flex align-items-center justify-content-center" onclick="window.App.router.navigate('/admin/analytics')">
                                        <i class="bi bi-graph-up me-2"></i>
                                        <span>View Analytics</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Wrap in admin layout
        const { AdminLayoutComponent } = await import('../components/AdminLayoutComponent.js');
        mainContent.innerHTML = AdminLayoutComponent.wrap(dashboardContent);

        // Set page title
        const pageTitle = document.getElementById('admin-page-title');
        if (pageTitle) pageTitle.textContent = 'Dashboard Overview';

        // Load dashboard data
        await this.loadDashboardData();

        // Make this instance globally available for callbacks
        window.currentAdminDashboard = this;
    }

    renderMetricsCards() {
        return `
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                                    <i class="bi bi-people fs-4"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="card-title mb-1">Total Users</h6>
                                <h4 class="mb-0" id="total-users">${this.metrics.totalUsers}</h4>
                                <small class="text-muted" id="active-users">${this.metrics.activeUsers} active</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <div class="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                                    <i class="bi bi-list-ul fs-4"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="card-title mb-1">Active Listings</h6>
                                <h4 class="mb-0" id="active-listings">${this.metrics.activeListings}</h4>
                                <small class="text-muted" id="total-listings">${this.metrics.totalListings} total</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <div class="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                                    <i class="bi bi-receipt fs-4"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="card-title mb-1">Pending Orders</h6>
                                <h4 class="mb-0" id="pending-orders">${this.metrics.pendingOrders}</h4>
                                <small class="text-muted" id="total-orders">${this.metrics.totalOrders} total</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                <div class="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                                    <i class="bi bi-currency-dollar fs-4"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="card-title mb-1">Monthly Revenue</h6>
                                <h4 class="mb-0" id="monthly-revenue">$${this.metrics.monthlyRevenue.toFixed(2)}</h4>
                                <small class="text-muted" id="total-revenue">$${this.metrics.totalRevenue.toFixed(2)} total</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTopSellers() {
        if (!this.topSellers.length) {
            return '<p class="text-muted mb-0">No seller data available</p>';
        }

        return this.topSellers.slice(0, 5).map((seller, index) => `
            <div class="d-flex align-items-center mb-3 ${index < this.topSellers.length - 1 ? 'border-bottom pb-3' : ''}">
                <div class="flex-shrink-0 me-3">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; font-size: 0.8rem;">
                        ${this.getInitials(seller.name)}
                    </div>
                </div>
                <div class="flex-grow-1">
                    <div class="fw-semibold small">${seller.name}</div>
                    <div class="text-muted small">${seller.listings} listings • $${seller.revenue.toFixed(2)} earned</div>
                </div>
                <div class="flex-shrink-0">
                    <span class="badge bg-success">#${index + 1}</span>
                </div>
            </div>
        `).join('');
    }

    renderRecentActivity() {
        if (!this.recentActivity.length) {
            return '<p class="text-muted mb-0">No recent activity</p>';
        }

        return this.recentActivity.slice(0, 10).map(activity => `
            <div class="d-flex align-items-start mb-3">
                <div class="flex-shrink-0 me-3">
                    <div class="bg-${activity.type === 'user' ? 'primary' : activity.type === 'listing' ? 'success' : 'warning'} bg-opacity-10 text-${activity.type === 'user' ? 'primary' : activity.type === 'listing' ? 'success' : 'warning'} rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                        <i class="bi bi-${activity.icon} fs-6"></i>
                    </div>
                </div>
                <div class="flex-grow-1">
                    <div class="small">${activity.description}</div>
                    <div class="text-muted small">${this.formatTimeAgo(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    renderSystemHealth() {
        const healthStatus = {
            database: { status: 'healthy', message: 'Connected' },
            api: { status: 'healthy', message: 'Responding' },
            storage: { status: 'healthy', message: 'Available' },
            email: { status: 'warning', message: 'Rate limited' }
        };

        return Object.entries(healthStatus).map(([service, info]) => `
            <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="d-flex align-items-center">
                    <i class="bi bi-${info.status === 'healthy' ? 'check-circle-fill text-success' : 'exclamation-triangle-fill text-warning'} me-2"></i>
                    <span class="text-capitalize">${service}</span>
                </div>
                <small class="text-${info.status === 'healthy' ? 'success' : 'warning'}">${info.message}</small>
            </div>
        `).join('');
    }

    async loadDashboardData() {
        try {
            // Load various metrics
            const [userStats, listingStats, orderStats, revenueStats] = await Promise.all([
                this.loadUserStats(),
                this.loadListingStats(),
                this.loadOrderStats(),
                this.loadRevenueStats()
            ]);

            // Update metrics
            this.metrics = {
                totalUsers: userStats.total || 0,
                activeUsers: userStats.active || 0,
                totalListings: listingStats.total || 0,
                activeListings: listingStats.active || 0,
                totalOrders: orderStats.total || 0,
                pendingOrders: orderStats.pending || 0,
                totalRevenue: revenueStats.total || 0,
                monthlyRevenue: revenueStats.monthly || 0
            };

            // Load top sellers
            this.topSellers = await this.loadTopSellers();

            // Generate recent activity
            this.recentActivity = await this.generateRecentActivity();

            // Update UI
            this.updateMetricsDisplay();
            this.updateTopSellers();
            this.updateRecentActivity();

            // Initialize charts
            await this.initializeCharts();

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Dashboard Error',
                message: 'Failed to load dashboard data. Please refresh the page.'
            });
        }
    }

    async loadUserStats() {
        try {
            const { UserService } = await import('../services/api.js');
            const stats = await UserService.getStatistics();
            return stats;
        } catch {
            return { total: 0, active: 0 };
        }
    }

    async loadListingStats() {
        try {
            const { ListingService } = await import('../services/api.js');
            const response = await ListingService.getListings({ page: 0, size: 1 });
            const total = response.totalItems || 0;
            const active = response.content?.filter(l => l.status === 'AVAILABLE').length || 0;
            return {
                total,
                active,
                inactive: total - active
            };
        } catch {
            return { total: 0, active: 0 };
        }
    }

    async loadOrderStats() {
        try {
            const { AnalyticsController } = await import('../services/api.js');
            const stats = await AnalyticsController.getOrderStatsSummary();
            return stats || { total: 0, pending: 0 };
        } catch (error) {
            console.error('Failed to load order stats:', error);
            return { total: 0, pending: 0 };
        }
    }

    async loadRevenueStats() {
        try {
            const { AnalyticsController } = await import('../services/api.js');
            const stats = await AnalyticsController.getRevenueStatsSummary();
            return stats || { total: 0, monthly: 0 };
        } catch (error) {
            console.error('Failed to load revenue stats:', error);
            return { total: 0, monthly: 0 };
        }
    }

    async loadTopSellers() {
        try {
            const { OrderService } = await import('../services/api.js');
            const sales = await OrderService.getMySales();
            
            const sellerMap = new Map();
            
            if (Array.isArray(sales)) {
                sales.forEach(order => {
                    if (order.seller && order.status === 'COMPLETED') {
                        const sellerId = order.seller.userId;
                        const sellerName = order.seller.fullName || 'Unknown';
                        
                        if (!sellerMap.has(sellerId)) {
                            sellerMap.set(sellerId, {
                                name: sellerName,
                                listings: 0,
                                revenue: 0
                            });
                        }
                        
                        const seller = sellerMap.get(sellerId);
                        seller.listings += 1;
                        seller.revenue += parseFloat(order.totalPrice || 0);
                    }
                });
            }
            
            return Array.from(sellerMap.values())
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);
        } catch {
            return [];
        }
    }

    async generateRecentActivity() {
        try {
            const activities = [];
            
            // Get recent users
            const { UserService } = await import('../services/api.js');
            const recentUsers = await UserService.getAllUsers({ page: 0, size: 5, sortBy: 'createdAt', sortDir: 'desc' });
            if (recentUsers.content) {
                recentUsers.content.slice(0, 3).forEach(user => {
                    activities.push({
                        type: 'user',
                        icon: 'person-plus',
                        description: `New user registered: ${user.email}`,
                        timestamp: new Date(user.createdAt)
                    });
                });
            }
            
            // Get recent listings
            const { ListingService } = await import('../services/api.js');
            const recentListings = await ListingService.getRecentListings(3);
            if (recentListings.content) {
                recentListings.content.forEach(listing => {
                    activities.push({
                        type: 'listing',
                        icon: 'plus-circle',
                        description: `New listing created: "${listing.title}"`,
                        timestamp: new Date(listing.createdAt)
                    });
                });
            }
            
            // Get recent orders
            const { OrderService } = await import('../services/api.js');
            const recentOrders = await OrderService.getMyOrders();
            if (Array.isArray(recentOrders) && recentOrders.length > 0) {
                recentOrders.slice(0, 2).forEach(order => {
                    activities.push({
                        type: 'order',
                        icon: 'cart',
                        description: `Order #${order.orderId} placed`,
                        timestamp: new Date(order.createdAt)
                    });
                });
            }
            
            return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
        } catch (error) {
            console.error('Failed to generate recent activity:', error);
            return [];
        }
    }

    updateMetricsDisplay() {
        // Update metric cards
        const totalUsers = document.getElementById('total-users');
        const activeUsers = document.getElementById('active-users');
        const activeListings = document.getElementById('active-listings');
        const totalListings = document.getElementById('total-listings');
        const pendingOrders = document.getElementById('pending-orders');
        const totalOrders = document.getElementById('total-orders');
        const monthlyRevenue = document.getElementById('monthly-revenue');
        const totalRevenue = document.getElementById('total-revenue');

        if (totalUsers) totalUsers.textContent = this.metrics.totalUsers;
        if (activeUsers) activeUsers.textContent = `${this.metrics.activeUsers} active`;
        if (activeListings) activeListings.textContent = this.metrics.activeListings;
        if (totalListings) totalListings.textContent = `${this.metrics.totalListings} total`;
        if (pendingOrders) pendingOrders.textContent = this.metrics.pendingOrders;
        if (totalOrders) totalOrders.textContent = `${this.metrics.totalOrders} total`;
        if (monthlyRevenue) monthlyRevenue.textContent = `$${this.metrics.monthlyRevenue.toFixed(2)}`;
        if (totalRevenue) totalRevenue.textContent = `$${this.metrics.totalRevenue.toFixed(2)} total`;
    }

    updateTopSellers() {
        const topSellersList = document.getElementById('top-sellers-list');
        if (topSellersList) {
            topSellersList.innerHTML = this.renderTopSellers();
        }
    }

    updateRecentActivity() {
        const recentActivity = document.getElementById('recent-activity');
        if (recentActivity) {
            recentActivity.innerHTML = this.renderRecentActivity();
        }
    }

    async initializeCharts() {
        // Initialize Chart.js if available (loaded via CDN, accessible via window.Chart)
        if (typeof window.Chart !== 'undefined') {
            await this.createActivityChart();
            await this.createRevenueChart();
            await this.createOrdersChart();
        }
    }

    async createActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        // Mock data for activity chart
        const labels = [];
        const usersData = [];
        const listingsData = [];
        const ordersData = [];

        // Generate last 7 days of data
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

            usersData.push(Math.floor(Math.random() * 10) + 5);
            listingsData.push(Math.floor(Math.random() * 8) + 3);
            ordersData.push(Math.floor(Math.random() * 6) + 2);
        }

        new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'New Users',
                        data: usersData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'New Listings',
                        data: listingsData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'New Orders',
                        data: ordersData,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    async createRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        // Mock revenue data
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const data = [1200, 1900, 1500, 2500, 2200, 3000];

        new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue ($)',
                    data: data,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10b981',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    async createOrdersChart() {
        const ctx = document.getElementById('ordersChart');
        if (!ctx) return;

        // Mock order status distribution
        const data = {
            labels: ['Completed', 'Confirmed', 'Requested', 'Rejected'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderWidth: 1
            }]
        };

        new window.Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    changeChartPeriod(period) {
        console.log('Changing chart period to:', period);

        const buttons = document.querySelectorAll('.btn-group .btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.trim() === period.toUpperCase()) {
                btn.classList.add('active');
            }
        });

        this.chartPeriod = period;
        this.initializeCharts();
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }
}