// Main application entry point
import { Router } from './utils/router.js';
import { AuthService } from './services/authService.js';
import { HeaderComponent } from './components/HeaderComponent.js';
import { FooterComponent } from './components/FooterComponent.js';
import { ButtonComponent } from './components/ButtonComponent.js';
import { FormComponent } from './components/FormComponent.js';
import { ModalComponent } from './components/ModalComponent.js';
import { StarRatingComponent } from './components/StarRatingComponent.js';
import { ReviewComponent } from './components/ReviewComponent.js';
import { AdminLayoutComponent } from './components/AdminLayoutComponent.js';
import { globalState } from './utils/stateManager.js';

// Initialize the application
class App {
    constructor() {
        this.router = null;
        this.header = null;
        this.footer = null;
        this.currentUser = null;
        this.currentPage = null;
        this.notificationContainer = null;
    }

    async init() {
        try {
            // Initialize services
            await this.initializeServices();

            // Initialize components
            this.initializeComponents();

            // Initialize router
            this.initializeRouter();

            // Initialize notifications
            this.initializeNotifications();

            // Load initial page
            this.router.navigate(window.location.pathname || '/');

        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }

    async initializeServices() {
        // Check if user is logged in and update global state
        this.currentUser = AuthService.getCurrentUser();
        if (this.currentUser) {
            globalState.login(this.currentUser);
        }

        // Subscribe to authentication state changes
        globalState.subscribe('user', (user) => {
            this.currentUser = user;
            if (this.header) {
                this.header.updateUser(user);
            }
        });
    }

    initializeComponents() {
        // Initialize header
        const currentPath = window.location.pathname || '/';
        this.header = new HeaderComponent('header-nav', this.currentUser, currentPath);
        this.header.render();

        // Initialize footer
        this.footer = new FooterComponent('footer');
        this.footer.render();
    }

    initializeNotifications() {
        // Create notification container
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.id = 'notification-container';
        this.notificationContainer.className = 'position-fixed top-0 end-0 p-3';
        this.notificationContainer.style.zIndex = '9999';
        document.body.appendChild(this.notificationContainer);

        // Subscribe to notification state changes
        globalState.subscribe('notifications', (notifications) => {
            this.renderNotifications(notifications);
        });
    }

    initializeRouter() {
        // Define routes
        const routes = {
            '/': () => this.loadPage('HomePage'),
            '/login': () => this.loadPage('LoginPage'),
            '/register': () => this.loadPage('RegisterPage'),
            '/about': () => this.loadPage('AboutPage'),
            '/terms-of-service': () => this.loadPage('TermsOfServicePage'),
            '/privacy-policy': () => this.loadPage('PrivacyPolicyPage'),
            '/admin-directory': () => this.loadPage('AdminDirectoryPage'),
            '/admin': () => this.loadPage('AdminDashboard'),
            '/admin/users': () => this.loadPage('AdminUsersPage'),
            '/admin/comments': () => this.loadPage('AdminCommentsPage'),
            '/profile': () => this.loadPage('ProfilePage'),
            '/users/:id': (params) => this.loadPage('UserProfilePage', params),
            '/settings': () => this.loadPage('SettingsPage'),
            '/listings': () => this.loadPage('BrowseListingsPage'),
            '/listings/:id': (params) => this.loadPage('ListingDetailPage', params),
            '/listings/:id/edit': (params) => this.loadPage('CreateEditListingPage', params),
            '/listings/create': () => this.loadPage('CreateEditListingPage'),
            '/my-listings': () => this.loadPage('MyListingsPage'),
            '/my-orders': () => this.loadPage('MyOrdersPage'),
            '/seller-orders': () => this.loadPage('SellerOrdersPage'),
            '/404': () => this.loadPage('NotFoundPage')
        };

        this.router = new Router(routes, 'main-content');

        // Add route guards
        const adminRoutes = ['/admin-directory', '/admin', '/admin/users', '/admin/comments'];
        adminRoutes.forEach(route => {
            this.router.addRouteGuard(route, this.router.createRoleGuard('admin'));
        });

        this.router.addRouteGuard('/profile', this.router.createAuthGuard(true));
        this.router.addRouteGuard('/settings', this.router.createAuthGuard(true));
        this.router.addRouteGuard('/my-listings', this.router.createAuthGuard(true));
        this.router.addRouteGuard('/my-orders', this.router.createAuthGuard(true));
        this.router.addRouteGuard('/seller-orders', this.router.createAuthGuard(true));
        this.router.addRouteGuard('/listings/create', this.router.createAuthGuard(true));
        this.router.addRouteGuard('/login', this.router.createAuthGuard(false, '/'));
        this.router.addRouteGuard('/register', this.router.createAuthGuard(false, '/'));
    }

    async loadPage(pageName, params = {}) {
        try {
            // Clean up current page before loading new one
            if (this.currentPage && typeof this.currentPage.destroy === 'function') {
                this.currentPage.destroy();
            }

            const module = await import(`./pages/${pageName}.js`);
            const PageClass = module[pageName];

            if (PageClass) {
                this.currentPage = new PageClass(params);
                this.currentPage.render();
            } else {
                console.error(`Page class ${pageName} not found`);
                this.router.navigate('/404');
            }
        } catch (error) {
            console.error(`Failed to load page ${pageName}:`, error);
            this.router.navigate('/404');
        }
    }

    showError(message) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="container py-5">
                    <div class="row justify-content-center">
                        <div class="col-md-6 text-center">
                            <div class="alert alert-danger" role="alert">
                                <h4 class="alert-heading">Error!</h4>
                                <p>${message}</p>
                                <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Method to update user state (called after login/logout)
    updateUser(user) {
        this.currentUser = user;
        if (user) {
            globalState.login(user);
        } else {
            globalState.logout();
        }
    }

    // Render notifications
    renderNotifications(notifications) {
        if (!this.notificationContainer) return;

        this.notificationContainer.innerHTML = notifications.map(notification => `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-${notification.type || 'primary'} text-white">
                    <strong class="me-auto">${notification.title || 'Notification'}</strong>
                    <button type="button" class="btn-close btn-close-white" onclick="window.App.removeNotification(${notification.id})"></button>
                </div>
                <div class="toast-body">
                    ${notification.message}
                </div>
            </div>
        `).join('');

        // Auto-hide notifications after 5 seconds
        notifications.forEach(notification => {
            setTimeout(() => {
                globalState.removeNotification(notification.id);
            }, 5000);
        });
    }

    // Remove notification
    removeNotification(id) {
        globalState.removeNotification(id);
    }
}

// Make components globally available
window.ButtonComponent = ButtonComponent;
window.FormComponent = FormComponent;
window.ModalComponent = ModalComponent;
window.StarRatingComponent = StarRatingComponent;
window.ReviewComponent = ReviewComponent;
window.AdminLayoutComponent = AdminLayoutComponent;
window.globalState = globalState;

// Load testing utilities in development
if (import.meta.env.DEV) {
    import('./utils/testing.js').then(({ TestingUtils }) => {
        window.TestingUtils = TestingUtils;
        console.log('🧪 Testing utilities loaded. Use window.TestingUtils for testing helpers.');
    });
}

// Global app instance
window.App = new App();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    if (window.App.router) {
        window.App.router.navigate(window.location.pathname, false);
    }
});