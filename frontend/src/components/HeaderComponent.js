// Header Component
export class HeaderComponent {
    constructor(containerId, user = null, currentPath = '/') {
        this.containerId = containerId;
        this.user = user;
        this.currentPath = currentPath;
        this.container = document.getElementById(containerId);
    }

    isActive(path) {
        if (path === '/') {
            return this.currentPath === '/';
        }
        
        // Special handling for /listings - should match browse and detail pages, but not create/edit
        if (path === '/listings') {
            // Exact match for browse page
            if (this.currentPath === '/listings') {
                return true;
            }
            // Match detail pages like /listings/123, but not /listings/create or /listings/123/edit
            if (this.currentPath.startsWith('/listings/')) {
                // Check if it's a create or edit page
                if (this.currentPath === '/listings/create' || this.currentPath.match(/^\/listings\/\d+\/edit$/)) {
                    return false;
                }
                // Otherwise it's likely a detail page (numeric ID)
                return this.currentPath.match(/^\/listings\/\d+$/);
            }
            return false;
        }
        
        // /my-listings should also be active for create/edit listing pages
        if (path === '/my-listings') {
            return this.currentPath === '/my-listings' ||
                   this.currentPath === '/listings/create' ||
                   this.currentPath.match(/^\/listings\/\d+\/edit$/);
        }
        
        return this.currentPath.startsWith(path);
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="container">
                <a class="navbar-brand" href="#" onclick="window.App.router.navigate('/')">
                    CampusCircle
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('/') ? 'active' : ''}" href="#" onclick="window.App.router.navigate('/')">Home</a>
                        </li>
                        ${this.user ? `
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('/listings') ? 'active' : ''}" href="#" onclick="window.App.router.navigate('/listings')">Browse Listings</a>
                        </li>
                        ${this.user.role === 'admin' ? `
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('/admin-directory') ? 'active' : ''}" href="#" onclick="window.App.router.navigate('/admin-directory')">
                                Admin Directory
                            </a>
                        </li>
                        ` : `
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('/my-listings') ? 'active' : ''}" href="#" onclick="window.App.router.navigate('/my-listings')">My Listings</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('/my-orders') ? 'active' : ''}" href="#" onclick="window.App.router.navigate('/my-orders')">My Orders</a>
                        </li>
                        `}
                        ` : ''}
                    </ul>

                    <ul class="navbar-nav">
                        ${this.user ? `
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Welcome, ${this.user.fullName || this.user.email}
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="#" onclick="window.App.router.navigate('/profile')">Profile</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="window.App.router.navigate('/settings')">Settings</a></li>
                                    ${this.user.role !== 'admin' ? `
                                    <li><a class="dropdown-item" href="#" onclick="window.App.router.navigate('/seller-orders')">Seller Dashboard</a></li>
                                    ` : ''}
                                    ${this.user.role === 'admin' ? `
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item" href="#" onclick="window.App.router.navigate('/admin')">
                                            <i class="bi bi-speedometer2 me-2"></i>Admin Dashboard
                                        </a></li>
                                    ` : ''}
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="#" onclick="handleLogout()">Logout</a></li>
                                </ul>
                            </li>
                        ` : `
                            <li class="nav-item">
                                <a class="nav-link" href="#" onclick="window.App.router.navigate('/login')">Login</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" onclick="window.App.router.navigate('/register')">Register</a>
                            </li>
                        `}
                    </ul>
                </div>
            </div>
        `;
    }

    updateUser(user) {
        this.user = user;
        this.render();
    }

    updatePath(path) {
        this.currentPath = path;
        this.render();
    }
}

// Global logout function
window.handleLogout = async function() {
    if (confirm('Are you sure you want to logout?')) {
        const { AuthService } = await import('../services/authService.js');
        AuthService.logout();
        window.App.router.navigate('/');
    }
};