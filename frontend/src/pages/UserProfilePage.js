// User Profile Page Component (View other users' profiles)
export class UserProfilePage {
    constructor(params = {}) {
        this.container = document.getElementById('main-content');
        this.isLoading = false;
        this.user = null;
        this.userId = params.id || null;
    }

    async render() {
        if (!this.container) return;

        // Get user ID from params or URL
        if (!this.userId) {
            const pathParts = window.location.pathname.split('/').filter(part => part);
            const usersIndex = pathParts.indexOf('users');
            
            if (usersIndex !== -1 && usersIndex < pathParts.length - 1) {
                this.userId = pathParts[usersIndex + 1];
            }
        }

        // Validate user ID
        if (!this.userId || this.userId === 'undefined' || this.userId === 'null' || isNaN(this.userId)) {
            console.error('Invalid user ID from URL:', this.userId, 'Path:', window.location.pathname);
            window.App.router.navigate('/404');
            return;
        }

        // Load user data
        await this.loadUserData();

        if (!this.user) {
            this.renderNotFound();
            return;
        }

        this.container.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="card shadow-custom">
                            <div class="card-header bg-white">
                                <h3 class="mb-0">User Profile</h3>
                            </div>
                            <div class="card-body">
                                ${this.renderProfileView()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderNotFound() {
        this.container.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-md-6 text-center">
                        <div class="mb-4">
                            <i class="bi bi-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
                        </div>
                        <h2 class="mb-3">User Not Found</h2>
                        <p class="text-muted mb-4">The user profile you're looking for doesn't exist or has been removed.</p>
                        <button class="btn btn-primary" onclick="window.App.router.navigate('/listings')">
                            Browse Listings
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderProfileView() {
        if (this.isLoading) {
            return '<div class="text-center py-5"><div class="spinner-border" role="status"></div></div>';
        }

        return `
            <div class="row">
                <div class="col-md-4 text-center mb-4 mb-md-0">
                    <div class="mb-3">
                        <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 100px; height: 100px; font-size: 2rem;">
                            ${this.getInitials(this.user.fullName)}
                        </div>
                    </div>
                    <h5 class="mb-1">${this.user.fullName}</h5>
                    <p class="text-muted mb-0">${this.user.email}</p>
                    <span class="badge bg-secondary mt-2">${this.user.role || 'Student'}</span>
                </div>

                <div class="col-md-8">
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <label class="form-label fw-bold">Full Name</label>
                            <p class="mb-0">${this.user.fullName}</p>
                        </div>

                        <div class="col-sm-6">
                            <label class="form-label fw-bold">Email</label>
                            <p class="mb-0">${this.user.email}</p>
                        </div>

                        <div class="col-sm-6">
                            <label class="form-label fw-bold">Phone Number</label>
                            <p class="mb-0">${this.user.phone && this.user.phone.trim() ? this.user.phone : 'Not provided'}</p>
                        </div>

                        <div class="col-sm-6">
                            <label class="form-label fw-bold">Address</label>
                            <p class="mb-0">${this.user.address && this.user.address.trim() ? this.user.address : 'Not provided'}</p>
                        </div>

                        <div class="col-sm-6">
                            <label class="form-label fw-bold">Member Since</label>
                            <p class="mb-0">${this.formatDate(this.user.createdAt || new Date())}</p>
                        </div>

                        <div class="col-sm-6">
                            <label class="form-label fw-bold">Account Status</label>
                            <p class="mb-0">
                                <span class="badge ${this.user.status === 'active' ? 'bg-success' : 'bg-warning'}">${this.user.status || 'Active'}</span>
                            </p>
                        </div>

                        <div class="col-sm-6">
                            <label class="form-label fw-bold">Average Rating</label>
                            <p class="mb-0">
                                ${this.user.avgRating ? `${this.user.avgRating}/5.0` : 'No ratings yet'}
                                ${this.user.ratingCount ? ` (${this.user.ratingCount} reviews)` : ''}
                            </p>
                        </div>

                        <div class="col-sm-6">
                            <label class="form-label fw-bold">Rating Count</label>
                            <p class="mb-0">${this.user.ratingCount || 0} reviews</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadUserData() {
        try {
            this.isLoading = true;

            const { UserService } = await import('../services/api.js');
            this.user = await UserService.getUser(this.userId);

        } catch (error) {
            console.error('Failed to load user profile:', error);
            this.user = null;
        } finally {
            this.isLoading = false;
        }
    }

    getInitials(name) {
        if (!name) return '??';
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
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

