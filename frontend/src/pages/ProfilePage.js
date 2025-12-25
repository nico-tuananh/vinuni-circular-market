// Profile Page Component
export class ProfilePage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.isLoading = false;
        this.isEditing = false;
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

        this.container.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="card shadow-custom">
                            <div class="card-header bg-white">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h3 class="mb-0">My Profile</h3>
                                    <button id="edit-btn" class="btn btn-outline-primary" onclick="window.currentProfilePage.toggleEdit()">
                                        <i class="bi bi-pencil me-2"></i>Edit Profile
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div id="profile-content">
                                    ${this.renderProfileView()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Make this instance globally available for button callbacks
        window.currentProfilePage = this;
    }

    renderProfileView() {
        return `
            <div class="row">
                <div class="col-md-4 text-center mb-4 mb-md-0">
                    <div class="mb-3">
                        <div class="bg-primary-custom text-white rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 100px; height: 100px; font-size: 2rem;">
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

                    <hr class="my-4">

                    <div class="d-flex gap-2">
                        <button class="btn btn-primary" onclick="window.App.router.navigate('/settings')">
                            <i class="bi bi-gear me-2"></i>Account Settings
                        </button>
                        <button class="btn btn-outline-danger" onclick="window.currentProfilePage.showDeleteConfirm()">
                            <i class="bi bi-trash me-2"></i>Delete Account
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderProfileEdit() {
        const { FormComponent } = window;
        const formComponent = new FormComponent({
            fields: [
                {
                    name: 'fullName',
                    label: 'Full Name',
                    type: 'text',
                    value: this.user.fullName,
                    required: true
                },
                {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    value: this.user.email,
                    required: true,
                    attributes: { readonly: true }
                },
                {
                    name: 'phone',
                    label: 'Phone Number',
                    type: 'tel',
                    value: this.user.phone || ''
                },
                {
                    name: 'address',
                    label: 'Address',
                    type: 'text',
                    value: this.user.address || '',
                    placeholder: 'Dorm room, building, etc.'
                }
            ],
            onSubmit: (event) => this.handleProfileUpdate(event),
            submitButtonText: 'Save Changes',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            loading: this.isLoading
        });

        return `
            <div class="row">
                <div class="col-12">
                    <div id="edit-error" class="alert alert-danger" style="display: none;" role="alert"></div>
                    ${formComponent.render()}
                </div>
            </div>
        `;
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        const contentElement = document.getElementById('profile-content');
        const editBtn = document.getElementById('edit-btn');

        if (this.isEditing) {
            contentElement.innerHTML = this.renderProfileEdit();
            editBtn.innerHTML = '<i class="bi bi-x me-2"></i>Cancel Edit';
            editBtn.className = 'btn btn-outline-secondary';
        } else {
            contentElement.innerHTML = this.renderProfileView();
            editBtn.innerHTML = '<i class="bi bi-pencil me-2"></i>Edit Profile';
            editBtn.className = 'btn btn-outline-primary';
        }
    }

    async handleProfileUpdate(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const { FormComponent } = window;
        const formComponent = new FormComponent({}); // Temporary instance for data extraction
        const formData = formComponent.getFormData(event.target);

        // Clear previous errors
        this.hideError();

        // Validate required fields
        if (!formData.fullName.trim()) {
            this.showError('Full name is required');
            return;
        }

        this.setLoading(true);
        const { globalState } = window;

        try {
            const { UserService } = await import('../services/api.js');
            
            const profileData = {
                fullName: formData.fullName.trim(),
                phone: formData.phone?.trim() || null,
                address: formData.address?.trim() || null
            };

            const updatedUser = await UserService.updateMyProfile(profileData);

            // Update global state with the response from backend
            globalState.login(updatedUser);
            this.user = updatedUser;

            // Update header to reflect name change
            if (window.App && window.App.header) {
                window.App.header.updateUser(updatedUser);
            }

            // Show success notification
            globalState.addNotification({
                type: 'success',
                title: 'Profile Updated',
                message: 'Your profile has been updated successfully!'
            });

            // Exit edit mode and re-render
            this.isEditing = false;
            this.render();

        } catch (error) {
            console.error('Failed to update profile:', error);
            let errorMessage = 'Failed to update profile. Please try again.';
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response) {
                errorMessage = error.response.message || errorMessage;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            
            this.showError(errorMessage);
            
            // Also show notification
            globalState.addNotification({
                type: 'error',
                title: 'Profile Update Failed',
                message: errorMessage
            });
        } finally {
            this.setLoading(false);
        }
    }

    showDeleteConfirm() {
        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: 'Delete Account',
            message: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
            confirmText: 'Delete Account',
            confirmVariant: 'danger',
            onConfirm: () => this.deleteAccount()
        });

        modal.show();
    }

    async deleteAccount() {
        const { globalState } = window;

        // Here you would make an API call to delete the account
        // For now, we'll simulate the deletion
        globalState.addNotification({
            type: 'info',
            title: 'Account Deletion',
            message: 'Account deletion functionality will be implemented soon.'
        });
    }

    setLoading(loading) {
        this.isLoading = loading;
        // If in edit mode, re-render the form
        if (this.isEditing) {
            this.toggleEdit();
            this.toggleEdit(); // Toggle twice to refresh
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('edit-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    hideError() {
        const errorDiv = document.getElementById('edit-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
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
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}