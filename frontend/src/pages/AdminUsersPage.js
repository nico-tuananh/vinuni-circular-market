// Admin Users Management Page
export class AdminUsersPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.users = [];
        this.filteredUsers = [];
        this.currentPage = 0;
        this.totalPages = 1;
        this.pageSize = 20;
        this.searchQuery = '';
        this.statusFilter = 'all';
        this.roleFilter = 'all';
        this.selectedUsers = new Set();
        this.isLoading = true;
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

        // Load users data
        await this.loadUsers();

        const content = `
            <!-- Page Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-1">User Management</h1>
                            <p class="text-muted mb-0">Manage user accounts, roles, and permissions</p>
                        </div>
                        <button class="btn btn-primary" onclick="window.currentAdminUsersPage.showCreateUserModal()">
                            <i class="bi bi-person-plus me-2"></i>Add User
                        </button>
                    </div>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div class="row mb-4" id="user-stats">
                ${this.renderUserStats()}
            </div>

            <!-- Filters and Search -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-search"></i></span>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="user-search"
                                    placeholder="Search by name or email..."
                                    value="${this.searchQuery}"
                                >
                            </div>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="status-filter">
                                <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Status</option>
                                <option value="active" ${this.statusFilter === 'active' ? 'selected' : ''}>Active</option>
                                <option value="inactive" ${this.statusFilter === 'inactive' ? 'selected' : ''}>Inactive</option>
                                <option value="suspended" ${this.statusFilter === 'suspended' ? 'selected' : ''}>Suspended</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="role-filter">
                                <option value="all" ${this.roleFilter === 'all' ? 'selected' : ''}>All Roles</option>
                                <option value="STUDENT" ${this.roleFilter === 'STUDENT' ? 'selected' : ''}>Student</option>
                                <option value="admin" ${this.roleFilter === 'admin' ? 'selected' : ''}>Admin</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-outline-secondary w-100" onclick="window.currentAdminUsersPage.clearFilters()">
                                <i class="bi bi-x-circle me-1"></i>Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bulk Actions -->
            <div class="row mb-3" id="bulk-actions" style="display: ${this.selectedUsers.size > 0 ? 'block' : 'none'};">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <strong>${this.selectedUsers.size} user${this.selectedUsers.size !== 1 ? 's' : ''} selected</strong>
                                </div>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-outline-success btn-sm" onclick="window.currentAdminUsersPage.bulkActivate()">
                                        <i class="bi bi-check-circle me-1"></i>Activate
                                    </button>
                                    <button class="btn btn-outline-warning btn-sm" onclick="window.currentAdminUsersPage.bulkDeactivate()">
                                        <i class="bi bi-pause-circle me-1"></i>Deactivate
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm" onclick="window.currentAdminUsersPage.bulkDelete()">
                                        <i class="bi bi-trash me-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Users Table -->
            <div class="card">
                <div class="card-body p-0" id="users-table-container">
                    ${this.renderUsersTable()}
                </div>
            </div>

            <!-- Pagination -->
            ${this.totalPages > 1 ? this.renderPagination() : ''}
        `;

        // Wrap in admin layout
        const { AdminLayoutComponent } = await import('../components/AdminLayoutComponent.js');
        this.container.innerHTML = AdminLayoutComponent.wrap(content);

        // Set page title
        const pageTitle = document.getElementById('admin-page-title');
        if (pageTitle) pageTitle.textContent = 'User Management';

        this.attachEventListeners();

        // Make this instance globally available for callbacks
        window.currentAdminUsersPage = this;
    }

    renderUserStats() {
        const totalUsers = this.users.length;
        const activeUsers = this.users.filter(u => u.status === 'ACTIVE').length;
        const inactiveUsers = this.users.filter(u => u.status === 'INACTIVE').length;
        const adminUsers = this.users.filter(u => u.role === 'admin').length;

        return `
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${totalUsers}</div>
                        <div class="small text-muted">Total Users</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-success">${activeUsers}</div>
                        <div class="small text-muted">Active Users</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-warning">${inactiveUsers}</div>
                        <div class="small text-muted">Inactive Users</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-primary">${adminUsers}</div>
                        <div class="small text-muted">Administrators</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderUsersTable() {
        if (this.isLoading) {
            return '<div class="text-center py-5"><div class="spinner-border" role="status"></div></div>';
        }

        if (!this.filteredUsers.length) {
            return `
                <div class="text-center py-5">
                    <div class="mb-4">
                        <i class="bi bi-people text-muted" style="font-size: 4rem;"></i>
                    </div>
                    <h4 class="text-muted mb-3">No users found</h4>
                    <p class="text-muted">Try adjusting your search or filters</p>
                </div>
            `;
        }

        return `
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th width="40">
                                <input type="checkbox" class="form-check-input" id="select-all" onchange="window.currentAdminUsersPage.toggleSelectAll(this.checked)">
                            </th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.filteredUsers.map(user => this.renderUserRow(user)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderUserRow(user) {
        const isSelected = this.selectedUsers.has(user.userId);
        const statusBadgeClass = this.getStatusBadgeClass(user.status);
        const roleBadgeClass = user.role === 'admin' ? 'bg-danger' : 'bg-info';

        return `
            <tr class="${isSelected ? 'table-active' : ''}">
                <td>
                    <input
                        type="checkbox"
                        class="form-check-input user-checkbox"
                        value="${user.userId}"
                        ${isSelected ? 'checked' : ''}
                        onchange="window.currentAdminUsersPage.toggleUserSelection(${user.userId}, this.checked)"
                    >
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                             style="width: 40px; height: 40px; font-size: 0.9rem;">
                            ${this.getInitials(user.fullName)}
                        </div>
                        <div>
                            <div class="fw-semibold">${user.fullName}</div>
                            <small class="text-muted">@${user.username || 'user'}</small>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="badge ${roleBadgeClass}">${user.role}</span>
                </td>
                <td>
                    <span class="badge ${statusBadgeClass}">${user.status}</span>
                </td>
                <td>${this.formatDate(user.createdAt)}</td>
                <td>${user.lastLogin ? this.formatDate(user.lastLogin) : 'Never'}</td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Actions
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="window.currentAdminUsersPage.viewUserDetails(${user.userId})">
                                <i class="bi bi-eye me-2"></i>View Details
                            </a></li>
                            <li><a class="dropdown-item" href="#" onclick="window.currentAdminUsersPage.editUser(${user.userId})">
                                <i class="bi bi-pencil me-2"></i>Edit User
                            </a></li>
                            <li><hr class="dropdown-divider"></li>
                            ${user.status === 'ACTIVE' ?
                                `<li><a class="dropdown-item" href="#" onclick="window.currentAdminUsersPage.deactivateUser(${user.userId})">
                                    <i class="bi bi-pause-circle me-2"></i>Deactivate
                                </a></li>` :
                                `<li><a class="dropdown-item" href="#" onclick="window.currentAdminUsersPage.activateUser(${user.userId})">
                                    <i class="bi bi-play-circle me-2"></i>Activate
                                </a></li>`
                            }
                            <li><a class="dropdown-item text-danger" href="#" onclick="window.currentAdminUsersPage.deleteUser(${user.userId})">
                                <i class="bi bi-trash me-2"></i>Delete User
                            </a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        `;
    }

    renderPagination() {
        if (this.totalPages <= 1) return '';

        let paginationHtml = '<nav class="mt-4"><ul class="pagination justify-content-center">';

        // Previous button
        paginationHtml += `
            <li class="page-item ${this.currentPage === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="window.currentAdminUsersPage.goToPage(${this.currentPage - 1})">
                    Previous
                </a>
            </li>
        `;

        // Page numbers
        const startPage = Math.max(0, this.currentPage - 2);
        const endPage = Math.min(this.totalPages - 1, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="window.currentAdminUsersPage.goToPage(${i})">${i + 1}</a>
                </li>
            `;
        }

        // Next button
        paginationHtml += `
            <li class="page-item ${this.currentPage === this.totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="window.currentAdminUsersPage.goToPage(${this.currentPage + 1})">
                    Next
                </a>
            </li>
        `;

        paginationHtml += '</ul></nav>';
        return paginationHtml;
    }

    async loadUsers() {
        try {
            this.isLoading = true;

            const { UserService } = await import('../services/api.js');
            const response = await UserService.getAllUsers({
                page: this.currentPage,
                size: this.pageSize,
                sortBy: 'createdAt',
                sortDir: 'desc'
            });

            this.users = response.content || [];
            this.filteredUsers = [...this.users];
            this.totalPages = response.totalPages || 1;

            this.updateUsersTable();
            this.updateUserStats();

        } catch (error) {
            console.error('Failed to load users:', error);
            this.users = [];
            this.filteredUsers = [];
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Failed to Load Users',
                message: 'Unable to load users. Please try again.'
            });
        } finally {
            this.isLoading = false;
        }
    }

    updateUserStats() {
        const statsContainer = document.getElementById('user-stats');
        if (statsContainer) {
            statsContainer.innerHTML = this.renderUserStats();
        }
    }

    attachEventListeners() {
        const searchInput = document.getElementById('user-search');
        const statusFilter = document.getElementById('status-filter');
        const roleFilter = document.getElementById('role-filter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.applyFilters();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.statusFilter = e.target.value;
                this.applyFilters();
            });
        }

        if (roleFilter) {
            roleFilter.addEventListener('change', (e) => {
                this.roleFilter = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.filteredUsers = this.users.filter(user => {
            const matchesSearch = !this.searchQuery ||
                user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(this.searchQuery.toLowerCase());

            const matchesStatus = this.statusFilter === 'all' || user.status === this.statusFilter.toUpperCase();
            const matchesRole = this.roleFilter === 'all' || user.role?.toLowerCase() === this.roleFilter.toLowerCase();

            return matchesSearch && matchesStatus && matchesRole;
        });

        this.updateUsersTable();
    }

    clearFilters() {
        this.searchQuery = '';
        this.statusFilter = 'all';
        this.roleFilter = 'all';

        const searchInput = document.getElementById('user-search');
        const statusFilter = document.getElementById('status-filter');
        const roleFilter = document.getElementById('role-filter');

        if (searchInput) searchInput.value = '';
        if (statusFilter) statusFilter.value = 'all';
        if (roleFilter) roleFilter.value = 'all';

        this.filteredUsers = [...this.users];
        this.updateUsersTable();
    }

    updateUsersTable() {
        const container = document.getElementById('users-table-container');
        if (container) {
            container.innerHTML = this.renderUsersTable();
        }
    }

    toggleSelectAll(checked) {
        if (checked) {
            this.selectedUsers = new Set(this.filteredUsers.map(u => u.userId));
        } else {
            this.selectedUsers.clear();
        }

        // Update checkboxes
        const checkboxes = document.querySelectorAll('.user-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = checked;
        });

        this.updateBulkActions();
    }

    toggleUserSelection(userId, checked) {
        if (checked) {
            this.selectedUsers.add(userId);
        } else {
            this.selectedUsers.delete(userId);
        }

        // Update select all checkbox
        const allCheckbox = document.getElementById('select-all');
        const totalCheckboxes = document.querySelectorAll('.user-checkbox').length;
        if (allCheckbox) {
            allCheckbox.checked = this.selectedUsers.size === totalCheckboxes;
            allCheckbox.indeterminate = this.selectedUsers.size > 0 && this.selectedUsers.size < totalCheckboxes;
        }

        this.updateBulkActions();
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulk-actions');
        if (bulkActions) {
            bulkActions.style.display = this.selectedUsers.size > 0 ? 'block' : 'none';
        }
    }

    async bulkActivate() {
        await this.bulkAction('activate', 'Activate Users', 'activate');
    }

    async bulkDeactivate() {
        await this.bulkAction('deactivate', 'Deactivate Users', 'deactivate');
    }

    async bulkDelete() {
        await this.bulkAction('delete', 'Delete Users', 'delete');
    }

    async bulkAction(action, title, method) {
        if (this.selectedUsers.size === 0) return;

        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: `${title} (${this.selectedUsers.size})`,
            message: `Are you sure you want to ${action} ${this.selectedUsers.size} user${this.selectedUsers.size !== 1 ? 's' : ''}?`,
            confirmText: title,
            confirmVariant: action === 'delete' ? 'danger' : 'primary',
            onConfirm: async () => {
                try {
                    const { UserService } = await import('../services/api.js');

                    const userIds = Array.from(this.selectedUsers);

                    if (method === 'activate') {
                        await UserService.bulkActivate(userIds);
                    } else if (method === 'deactivate') {
                        await UserService.bulkDeactivate(userIds);
                    } else if (method === 'delete') {
                        for (const userId of userIds) {
                            await UserService.deleteUser(userId);
                        }
                    }

                    // Clear selection and reload
                    this.selectedUsers.clear();
                    await this.loadUsers();

                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'success',
                        title: 'Bulk Action Completed',
                        message: `Successfully ${action}d ${this.selectedUsers.size} user${this.selectedUsers.size !== 1 ? 's' : ''}.`
                    });

                } catch (error) {
                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'error',
                        title: 'Bulk Action Failed',
                        message: `Failed to ${action} users. Please try again.`
                    });
                }
            }
        });

        modal.show();
    }

    showCreateUserModal() {
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Coming Soon',
            message: 'User creation functionality will be available soon.'
        });
    }

    viewUserDetails(userId) {
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'User Details',
            message: 'User details view will be available soon.'
        });
    }

    editUser(userId) {
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Edit User',
            message: 'User editing functionality will be available soon.'
        });
    }

    async activateUser(userId) {
        await this.changeUserStatus(userId, 'ACTIVE', 'activate', 'activated');
    }

    async deactivateUser(userId) {
        await this.changeUserStatus(userId, 'INACTIVE', 'deactivate', 'deactivated');
    }

    async changeUserStatus(userId, status, action, pastTense) {
        try {
            const { UserService } = await import('../services/api.js');
            await UserService.updateUserStatus(userId, status);

            await this.loadUsers();

            const { globalState } = window;
            globalState.addNotification({
                type: 'success',
                title: 'Status Updated',
                message: `User has been ${pastTense} successfully.`
            });

        } catch (error) {
            console.error('Failed to update user status:', error);
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Status Update Failed',
                message: error.message || `Failed to ${action} user. Please try again.`
            });
        }
    }

    deleteUser(userId) {
        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Delete User',
            confirmVariant: 'danger',
            onConfirm: async () => {
                try {
                    const { UserService } = await import('../services/api.js');
                    await UserService.deleteUser(userId);

                    await this.loadUsers();

                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'success',
                        title: 'User Deleted',
                        message: 'User has been deleted successfully.'
                    });

                } catch (error) {
                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'error',
                        title: 'Delete Failed',
                        message: 'Failed to delete user. Please try again.'
                    });
                }
            }
        });

        modal.show();
    }

    async goToPage(page) {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            await this.loadUsers();
        }
    }

    getStatusBadgeClass(status) {
        const statusClasses = {
            'ACTIVE': 'bg-success',
            'INACTIVE': 'bg-warning',
            'SUSPENDED': 'bg-danger'
        };
        return statusClasses[status] || 'bg-secondary';
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
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}