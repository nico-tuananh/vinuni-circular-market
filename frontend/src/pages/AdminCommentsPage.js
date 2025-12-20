// Admin Comments Moderation Page
export class AdminCommentsPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.comments = [];
        this.filteredComments = [];
        this.currentPage = 0;
        this.totalPages = 1;
        this.pageSize = 20;
        this.statusFilter = 'pending';
        this.searchQuery = '';
        this.selectedComments = new Set();
        this.isLoading = true;
    }

    async render() {
        if (!this.container) return;

        // Check admin access
        const { globalState } = window;
        const currentUser = globalState.get('user');

        if (!currentUser || currentUser.role !== 'ADMIN') {
            window.App.router.navigate('/login');
            return;
        }

        // Load comments data
        await this.loadComments();

        const content = `
            <!-- Page Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-1">Comment Moderation</h1>
                            <p class="text-muted mb-0">Review and moderate user comments and reviews</p>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary" onclick="window.currentAdminCommentsPage.refreshComments()">
                                <i class="bi bi-arrow-clockwise me-2"></i>Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div class="row mb-4" id="comment-stats">
                ${this.renderCommentStats()}
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
                                    id="comment-search"
                                    placeholder="Search comments..."
                                    value="${this.searchQuery}"
                                >
                            </div>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="status-filter">
                                <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Comments</option>
                                <option value="pending" ${this.statusFilter === 'pending' ? 'selected' : ''}>Pending Review</option>
                                <option value="approved" ${this.statusFilter === 'approved' ? 'selected' : ''}>Approved</option>
                                <option value="rejected" ${this.statusFilter === 'rejected' ? 'selected' : ''}>Rejected</option>
                                <option value="flagged" ${this.statusFilter === 'flagged' ? 'selected' : ''}>Flagged</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="type-filter">
                                <option value="all">All Types</option>
                                <option value="comment">Comments</option>
                                <option value="review">Reviews</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-outline-secondary w-100" onclick="window.currentAdminCommentsPage.clearFilters()">
                                <i class="bi bi-x-circle me-1"></i>Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bulk Actions -->
            <div class="row mb-3" id="bulk-actions" style="display: ${this.selectedComments.size > 0 ? 'block' : 'none'};">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <strong>${this.selectedComments.size} comment${this.selectedComments.size !== 1 ? 's' : ''} selected</strong>
                                </div>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-outline-success btn-sm" onclick="window.currentAdminCommentsPage.bulkApprove()">
                                        <i class="bi bi-check-circle me-1"></i>Approve
                                    </button>
                                    <button class="btn btn-outline-warning btn-sm" onclick="window.currentAdminCommentsPage.bulkReject()">
                                        <i class="bi bi-x-circle me-1"></i>Reject
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm" onclick="window.currentAdminCommentsPage.bulkDelete()">
                                        <i class="bi bi-trash me-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Comments List -->
            <div class="card">
                <div class="card-body p-0" id="comments-container">
                    ${this.renderCommentsList()}
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
        if (pageTitle) pageTitle.textContent = 'Comment Moderation';

        this.attachEventListeners();

        // Make this instance globally available for callbacks
        window.currentAdminCommentsPage = this;
    }

    renderCommentStats() {
        const totalComments = this.comments.length;
        const pendingComments = this.comments.filter(c => c.status === 'PENDING').length;
        const approvedComments = this.comments.filter(c => c.status === 'APPROVED').length;
        const rejectedComments = this.comments.filter(c => c.status === 'REJECTED').length;
        const flaggedComments = this.comments.filter(c => c.flagged).length;

        return `
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1">${totalComments}</div>
                        <div class="small text-muted">Total Comments</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-warning">${pendingComments}</div>
                        <div class="small text-muted">Pending Review</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-success">${approvedComments}</div>
                        <div class="small text-muted">Approved</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-danger">${flaggedComments}</div>
                        <div class="small text-muted">Flagged</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCommentsList() {
        if (this.isLoading) {
            return '<div class="text-center py-5"><div class="spinner-border" role="status"></div></div>';
        }

        if (!this.filteredComments.length) {
            return `
                <div class="text-center py-5">
                    <div class="mb-4">
                        <i class="bi bi-chat-dots text-muted" style="font-size: 4rem;"></i>
                    </div>
                    <h4 class="text-muted mb-3">No comments found</h4>
                    <p class="text-muted">Try adjusting your search or filters</p>
                </div>
            `;
        }

        return `
            <div class="list-group list-group-flush">
                ${this.filteredComments.map(comment => this.renderCommentItem(comment)).join('')}
            </div>
        `;
    }

    renderCommentItem(comment) {
        const isSelected = this.selectedComments.has(comment.commentId);
        const statusBadgeClass = this.getStatusBadgeClass(comment.status);
        const isFlagged = comment.flagged || false;
        const isReview = comment.rating !== undefined;

        return `
            <div class="list-group-item ${isSelected ? 'bg-light' : ''} ${isFlagged ? 'border-danger' : ''}">
                <div class="d-flex">
                    <!-- Selection Checkbox -->
                    <div class="flex-shrink-0 me-3">
                        <input
                            type="checkbox"
                            class="form-check-input comment-checkbox"
                            value="${comment.commentId}"
                            ${isSelected ? 'checked' : ''}
                            onchange="window.currentAdminCommentsPage.toggleCommentSelection(${comment.commentId}, this.checked)"
                        >
                    </div>

                    <!-- Comment Content -->
                    <div class="flex-grow-1">
                        <!-- Comment Header -->
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div class="d-flex align-items-center">
                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                     style="width: 32px; height: 32px; font-size: 0.8rem;">
                                    ${this.getInitials(comment.user?.fullName || 'User')}
                                </div>
                                <div>
                                    <div class="fw-semibold small">${comment.user?.fullName || 'Anonymous'}</div>
                                    <div class="text-muted small">${this.formatDate(comment.createdAt)}</div>
                                </div>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                ${isReview ? `<div class="star-rating">${this.renderStarRating(comment.rating)}</div>` : ''}
                                <span class="badge ${statusBadgeClass}">${comment.status}</span>
                                ${isFlagged ? '<i class="bi bi-flag-fill text-danger" title="Flagged for review"></i>' : ''}
                            </div>
                        </div>

                        <!-- Comment Text -->
                        <div class="mb-2">
                            <p class="mb-1">${this.escapeHtml(comment.content)}</p>
                            ${comment.listing ? `
                                <small class="text-muted">
                                    On listing: <a href="#" onclick="window.App.router.navigate('/listings/${comment.listing.listingId}')" class="text-decoration-none">
                                        ${comment.listing.title}
                                    </a>
                                </small>
                            ` : ''}
                        </div>

                        <!-- Action Buttons -->
                        <div class="d-flex gap-2">
                            ${comment.status === 'PENDING' ? `
                                <button class="btn btn-sm btn-outline-success" onclick="window.currentAdminCommentsPage.approveComment(${comment.commentId})">
                                    <i class="bi bi-check me-1"></i>Approve
                                </button>
                                <button class="btn btn-sm btn-outline-warning" onclick="window.currentAdminCommentsPage.rejectComment(${comment.commentId})">
                                    <i class="bi bi-x me-1"></i>Reject
                                </button>
                            ` : ''}
                            <button class="btn btn-sm btn-outline-danger" onclick="window.currentAdminCommentsPage.deleteComment(${comment.commentId})">
                                <i class="bi bi-trash me-1"></i>Delete
                            </button>
                            ${!isFlagged ? `
                                <button class="btn btn-sm btn-outline-secondary" onclick="window.currentAdminCommentsPage.flagComment(${comment.commentId})">
                                    <i class="bi bi-flag me-1"></i>Flag
                                </button>
                            ` : `
                                <button class="btn btn-sm btn-outline-secondary" onclick="window.currentAdminCommentsPage.unflagComment(${comment.commentId})">
                                    <i class="bi bi-flag-fill me-1"></i>Unflag
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderPagination() {
        if (this.totalPages <= 1) return '';

        let paginationHtml = '<nav class="mt-4"><ul class="pagination justify-content-center">';

        // Previous button
        paginationHtml += `
            <li class="page-item ${this.currentPage === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="window.currentAdminCommentsPage.goToPage(${this.currentPage - 1})">
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
                    <a class="page-link" href="#" onclick="window.currentAdminCommentsPage.goToPage(${i})">${i + 1}</a>
                </li>
            `;
        }

        // Next button
        paginationHtml += `
            <li class="page-item ${this.currentPage === this.totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="window.currentAdminCommentsPage.goToPage(${this.currentPage + 1})">
                    Next
                </a>
            </li>
        `;

        paginationHtml += '</ul></nav>';
        return paginationHtml;
    }

    renderStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="bi bi-star${i <= rating ? '-fill' : ''} text-warning small"></i>`;
        }
        return stars;
    }

    async loadComments() {
        try {
            this.isLoading = true;

            const { CommentService } = await import('../services/api.js');
            const response = await CommentService.getAllComments({
                page: this.currentPage,
                size: this.pageSize,
                status: this.statusFilter !== 'all' ? this.statusFilter.toUpperCase() : undefined
            });

            this.comments = response.content || [];
            this.filteredComments = [...this.comments];
            this.totalPages = response.totalPages || 1;

            // Update pending count in sidebar
            this.updatePendingCount();

        } catch (error) {
            console.error('Failed to load comments:', error);
            this.comments = [];
            this.filteredComments = [];
        } finally {
            this.isLoading = false;
        }
    }

    updatePendingCount() {
        const pendingCount = this.comments.filter(c => c.status === 'PENDING').length;
        const badge = document.getElementById('pending-comments-count');
        if (badge) {
            badge.textContent = pendingCount;
            badge.style.display = pendingCount > 0 ? 'inline' : 'none';
        }
    }

    attachEventListeners() {
        const searchInput = document.getElementById('comment-search');
        const statusFilter = document.getElementById('status-filter');
        const typeFilter = document.getElementById('type-filter');

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

        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.typeFilter = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.filteredComments = this.comments.filter(comment => {
            const matchesSearch = !this.searchQuery ||
                comment.content.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                comment.user?.fullName.toLowerCase().includes(this.searchQuery.toLowerCase());

            const matchesStatus = this.statusFilter === 'all' || comment.status.toLowerCase() === this.statusFilter;
            const matchesType = this.typeFilter === 'all' ||
                (this.typeFilter === 'review' && comment.rating !== undefined) ||
                (this.typeFilter === 'comment' && comment.rating === undefined);

            return matchesSearch && matchesStatus && matchesType;
        });

        this.updateCommentsList();
    }

    clearFilters() {
        this.searchQuery = '';
        this.statusFilter = 'pending';
        this.typeFilter = 'all';

        const searchInput = document.getElementById('comment-search');
        const statusFilter = document.getElementById('status-filter');
        const typeFilter = document.getElementById('type-filter');

        if (searchInput) searchInput.value = '';
        if (statusFilter) statusFilter.value = 'pending';
        if (typeFilter) typeFilter.value = 'all';

        this.filteredComments = [...this.comments];
        this.updateCommentsList();
    }

    updateCommentsList() {
        const container = document.getElementById('comments-container');
        if (container) {
            container.innerHTML = this.renderCommentsList();
        }
    }

    toggleCommentSelection(commentId, checked) {
        if (checked) {
            this.selectedComments.add(commentId);
        } else {
            this.selectedComments.delete(commentId);
        }

        // Update select all checkbox
        const totalCheckboxes = document.querySelectorAll('.comment-checkbox').length;
        const checkedBoxes = document.querySelectorAll('.comment-checkbox:checked').length;

        this.updateBulkActions();
    }

    updateBulkActions() {
        const bulkActions = document.getElementById('bulk-actions');
        if (bulkActions) {
            bulkActions.style.display = this.selectedComments.size > 0 ? 'block' : 'none';
        }
    }

    async bulkApprove() {
        await this.bulkAction('approve', 'Approve Comments', 'approved');
    }

    async bulkReject() {
        await this.bulkAction('reject', 'Reject Comments', 'rejected');
    }

    async bulkDelete() {
        await this.bulkAction('delete', 'Delete Comments', 'deleted');
    }

    async bulkAction(action, title, pastTense) {
        if (this.selectedComments.size === 0) return;

        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: `${title} (${this.selectedComments.size})`,
            message: `Are you sure you want to ${action} ${this.selectedComments.size} comment${this.selectedComments.size !== 1 ? 's' : ''}?`,
            confirmText: title,
            confirmVariant: action === 'delete' ? 'danger' : 'primary',
            onConfirm: async () => {
                try {
                    // Bulk operations - would need backend support
                    for (const commentId of this.selectedComments) {
                        if (action === 'approve') {
                            await this.approveComment(commentId, false);
                        } else if (action === 'reject') {
                            await this.rejectComment(commentId, false);
                        } else if (action === 'delete') {
                            await this.deleteComment(commentId, false);
                        }
                    }

                    // Clear selection and reload
                    this.selectedComments.clear();
                    await this.loadComments();
                    this.render();

                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'success',
                        title: 'Bulk Action Completed',
                        message: `Successfully ${pastTense} ${this.selectedComments.size} comment${this.selectedComments.size !== 1 ? 's' : ''}.`
                    });

                } catch (error) {
                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'error',
                        title: 'Bulk Action Failed',
                        message: `Failed to ${action} comments. Please try again.`
                    });
                }
            }
        });

        modal.show();
    }

    async approveComment(commentId, showNotification = true) {
        try {
            const { CommentService } = await import('../services/api.js');
            await CommentService.approveComment(commentId);

            if (showNotification) {
                await this.loadComments();
                this.render();

                const { globalState } = window;
                globalState.addNotification({
                    type: 'success',
                    title: 'Comment Approved',
                    message: 'The comment has been approved and is now visible.'
                });
            }

        } catch (error) {
            if (showNotification) {
                const { globalState } = window;
                globalState.addNotification({
                    type: 'error',
                    title: 'Approval Failed',
                    message: 'Failed to approve comment. Please try again.'
                });
            }
        }
    }

    async rejectComment(commentId, showNotification = true) {
        try {
            const { CommentService } = await import('../services/api.js');
            await CommentService.rejectComment(commentId);

            if (showNotification) {
                await this.loadComments();
                this.render();

                const { globalState } = window;
                globalState.addNotification({
                    type: 'success',
                    title: 'Comment Rejected',
                    message: 'The comment has been rejected and hidden.'
                });
            }

        } catch (error) {
            if (showNotification) {
                const { globalState } = window;
                globalState.addNotification({
                    type: 'error',
                    title: 'Rejection Failed',
                    message: 'Failed to reject comment. Please try again.'
                });
            }
        }
    }

    async deleteComment(commentId, showNotification = true) {
        try {
            const { CommentService } = await import('../services/api.js');
            await CommentService.deleteComment(commentId);

            if (showNotification) {
                await this.loadComments();
                this.render();

                const { globalState } = window;
                globalState.addNotification({
                    type: 'success',
                    title: 'Comment Deleted',
                    message: 'The comment has been permanently deleted.'
                });
            }

        } catch (error) {
            if (showNotification) {
                const { globalState } = window;
                globalState.addNotification({
                    type: 'error',
                    title: 'Delete Failed',
                    message: 'Failed to delete comment. Please try again.'
                });
            }
        }
    }

    async flagComment(commentId) {
        // Implementation for flagging comments
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Comment Flagged',
            message: 'Comment has been flagged for additional review.'
        });
    }

    async unflagComment(commentId) {
        // Implementation for unflagging comments
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Comment Unflagged',
            message: 'Comment flag has been removed.'
        });
    }

    refreshComments() {
        this.loadComments();
    }

    goToPage(page) {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            this.loadComments();
        }
    }

    getStatusBadgeClass(status) {
        const statusClasses = {
            'PENDING': 'bg-warning',
            'APPROVED': 'bg-success',
            'REJECTED': 'bg-danger',
            'FLAGGED': 'bg-danger'
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
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}