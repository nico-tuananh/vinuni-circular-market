// Settings Page Component
export class SettingsPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.isLoading = false;
        this.activeTab = 'password';
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
                                <h3 class="mb-0">Account Settings</h3>
                            </div>
                            <div class="card-body">
                                <!-- Settings Tabs -->
                                <ul class="nav nav-tabs mb-4" id="settings-tabs" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link active" id="password-tab" data-bs-toggle="tab" data-bs-target="#password-panel" type="button" role="tab">
                                            <i class="bi bi-lock me-2"></i>Change Password
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="notifications-tab" data-bs-toggle="tab" data-bs-target="#notifications-panel" type="button" role="tab">
                                            <i class="bi bi-bell me-2"></i>Notifications
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="privacy-tab" data-bs-toggle="tab" data-bs-target="#privacy-panel" type="button" role="tab">
                                            <i class="bi bi-shield me-2"></i>Privacy
                                        </button>
                                    </li>
                                </ul>

                                <!-- Tab Content -->
                                <div class="tab-content" id="settings-content">
                                    <div class="tab-pane fade show active" id="password-panel" role="tabpanel">
                                        ${this.renderPasswordTab()}
                                    </div>
                                    <div class="tab-pane fade" id="notifications-panel" role="tabpanel">
                                        ${this.renderNotificationsTab()}
                                    </div>
                                    <div class="tab-pane fade" id="privacy-panel" role="tabpanel">
                                        ${this.renderPrivacyTab()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Make this instance globally available for button callbacks
        window.currentSettingsPage = this;
    }

    renderPasswordTab() {
        const { FormComponent } = window;
        const formComponent = new FormComponent({
            fields: [
                {
                    name: 'currentPassword',
                    label: 'Current Password',
                    type: 'password',
                    required: true
                },
                {
                    name: 'newPassword',
                    label: 'New Password',
                    type: 'password',
                    required: true,
                    helpText: 'Minimum 6 characters'
                },
                {
                    name: 'confirmPassword',
                    label: 'Confirm New Password',
                    type: 'password',
                    required: true
                }
            ],
            onSubmit: (event) => this.handlePasswordChange(event),
            submitButtonText: 'Change Password',
            loading: this.isLoading
        });

        return `
            <div>
                <h5 class="mb-3">Change Your Password</h5>
                <p class="text-muted mb-4">Ensure your account is using a strong, unique password.</p>

                <div id="password-error" class="alert alert-danger" style="display: none;" role="alert"></div>
                <div id="password-success" class="alert alert-success" style="display: none;" role="alert"></div>

                ${formComponent.render()}
            </div>
        `;
    }

    renderNotificationsTab() {
        return `
            <div>
                <h5 class="mb-3">Notification Preferences</h5>
                <p class="text-muted mb-4">Choose how you want to be notified about activity on CampusCircle.</p>

                <form id="notifications-form">
                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="email-notifications" checked>
                            <label class="form-check-label" for="email-notifications">
                                Email notifications for new messages and offers
                            </label>
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="listing-updates" checked>
                            <label class="form-check-label" for="listing-updates">
                                Updates about my listings (views, offers, etc.)
                            </label>
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="marketing-emails">
                            <label class="form-check-label" for="marketing-emails">
                                Marketing emails and newsletters
                            </label>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        Save Preferences
                    </button>
                </form>
            </div>
        `;
    }

    renderPrivacyTab() {
        return `
            <div>
                <h5 class="mb-3">Privacy Settings</h5>
                <p class="text-muted mb-4">Control your privacy and data sharing preferences.</p>

                <form id="privacy-form">
                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="profile-visibility" checked>
                            <label class="form-check-label" for="profile-visibility">
                                Make my profile visible to other students
                            </label>
                        </div>
                        <div class="form-text">Uncheck to hide your profile from search results</div>
                    </div>

                    <div class="mb-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="contact-info">
                            <label class="form-check-label" for="contact-info">
                                Show contact information on my listings
                            </label>
                        </div>
                        <div class="form-text">Display your email/phone on listings you create</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Data Export</label>
                        <p class="form-text mb-2">Download a copy of your data</p>
                        <button type="button" class="btn btn-outline-primary" onclick="window.currentSettingsPage.exportData()">
                            <i class="bi bi-download me-2"></i>Export My Data
                        </button>
                    </div>

                    <hr class="my-4">

                    <div class="mb-3">
                        <label class="form-label text-danger">Danger Zone</label>
                        <p class="form-text mb-2">Permanently delete your account and all associated data</p>
                        <button type="button" class="btn btn-outline-danger" onclick="window.currentSettingsPage.showDeleteConfirm()">
                            <i class="bi bi-trash me-2"></i>Delete Account
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    async handlePasswordChange(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const { FormComponent } = window;
        const formComponent = new FormComponent({}); // Temporary instance for data extraction
        const formData = formComponent.getFormData(event.target);

        // Clear previous messages
        this.hideMessages();

        // Validate passwords
        if (!formData.currentPassword) {
            this.showError('Current password is required');
            return;
        }

        if (formData.newPassword.length < 6) {
            this.showError('New password must be at least 6 characters long');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            this.showError('New passwords do not match');
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            this.showError('New password must be different from current password');
            return;
        }

        this.setLoading(true);
        const { globalState } = window;

        try {
            // Here you would make an API call to change the password
            // For now, we'll simulate the change
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

            this.showSuccess('Password changed successfully!');

            // Clear the form
            event.target.reset();

        } catch (error) {
            this.showError(error.message || 'Failed to change password. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    async exportData() {
        const { globalState } = window;

        // Here you would make an API call to export user data
        // For now, we'll show a notification
        globalState.addNotification({
            type: 'info',
            title: 'Data Export',
            message: 'Your data export is being prepared. You will receive an email when it\'s ready.'
        });
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
        // For now, we'll show a notification
        globalState.addNotification({
            type: 'info',
            title: 'Account Deletion',
            message: 'Account deletion request submitted. You will be contacted for confirmation.'
        });
    }

    setLoading(loading) {
        this.isLoading = loading;
        // Re-render the password tab if needed
        if (this.activeTab === 'password') {
            const passwordPanel = document.getElementById('password-panel');
            if (passwordPanel) {
                passwordPanel.innerHTML = this.renderPasswordTab();
            }
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('password-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    showSuccess(message) {
        const successDiv = document.getElementById('password-success');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    }

    hideMessages() {
        const errorDiv = document.getElementById('password-error');
        const successDiv = document.getElementById('password-success');

        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    }
}