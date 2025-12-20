// Header Component
export class HeaderComponent {
    constructor(containerId, user = null) {
        this.containerId = containerId;
        this.user = user;
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="container">
                <a class="navbar-brand" href="#" onclick="window.App.router.navigate('/')">
                    ♻️💰 CampusCircle
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="window.App.router.navigate('/')">Home</a>
                        </li>
                        ${this.user ? `
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="window.App.router.navigate('/listings')">Browse Listings</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="window.App.router.navigate('/my-listings')">My Listings</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" onclick="window.App.router.navigate('/my-orders')">My Orders</a>
                        </li>
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
                                    <li><a class="dropdown-item" href="#" onclick="window.App.router.navigate('/seller-orders')">Seller Dashboard</a></li>
                                    ${this.user.role === 'admin' ? `
                                        <li><a class="dropdown-item" href="#" onclick="window.App.router.navigate('/admin')">Admin Dashboard</a></li>
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
}

// Global logout function
window.handleLogout = async function() {
    if (confirm('Are you sure you want to logout?')) {
        const { AuthService } = await import('../services/authService.js');
        AuthService.logout();
        window.App.router.navigate('/');
    }
};