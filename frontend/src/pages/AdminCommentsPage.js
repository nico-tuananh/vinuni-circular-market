// Admin Comments Moderation Page
export class AdminCommentsPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.comments = [];
        this.filteredComments = [];
        this.currentPage = 0;
        this.totalPages = 1;
        this.pageSize = 20;
        this.statusFilter = 'all';
        this.searchQuery = '';
        this.typeFilter = 'all';
        this.selectedComments = new Set();
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
                                <option value="recent" ${this.statusFilter === 'recent' ? 'selected' : ''}>Recent (24h)</option>
                                <option value="top-level" ${this.statusFilter === 'top-level' ? 'selected' : ''}>Top-Level Only</option>
                                <option value="replies" ${this.statusFilter === 'replies' ? 'selected' : ''}>Replies Only</option>
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
                                    <button class="btn btn-outline-danger btn-sm" onclick="window.currentAdminCommentsPage.bulkDelete()">
                                        <i class="bi bi-trash me-1"></i>Delete Selected
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
        const recentComments = this.comments.filter(c => {
            const createdAt = new Date(c.createdAt);
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return createdAt > dayAgo;
        }).length;
        const topLevelComments = this.comments.filter(c => !c.parentId).length;
        const replies = this.comments.filter(c => c.parentId).length;

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
                        <div class="h4 mb-1 text-primary">${recentComments}</div>
                        <div class="small text-muted">Last 24 Hours</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-info">${topLevelComments}</div>
                        <div class="small text-muted">Top-Level</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-secondary">${replies}</div>
                        <div class="small text-muted">Replies</div>
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
        const isReply = comment.parentId !== null && comment.parentId !== undefined;

        return `
            <div class="list-group-item ${isSelected ? 'bg-light' : ''}">
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
                                ${isReply ? '<span class="badge bg-secondary">Reply</span>' : '<span class="badge bg-info">Top-Level</span>'}
                            </div>
                        </div>

                        <!-- Comment Text -->
                        <div class="mb-2">
                            <p class="mb-1">${this.escapeHtml(comment.content)}</p>
                            ${comment.listing ? `
                                <small class="text-muted">
                                    On listing: <a href="#" onclick="window.App.router.navigate('/listings/${comment.listing.listingId || comment.listingId}')" class="text-decoration-none">
                                        ${comment.listing.title || 'View Listing'}
                                    </a>
                                </small>
                            ` : comment.listingId ? `
                                <small class="text-muted">
                                    Listing ID: ${comment.listingId}
                                </small>
                            ` : ''}
                        </div>

                        <!-- Action Buttons -->
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-danger" onclick="window.currentAdminCommentsPage.deleteComment(${comment.commentId})">
                                <i class="bi bi-trash me-1"></i>Delete
                            </button>
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
                size: this.pageSize
            });

            this.comments = response.content || [];
            this.filteredComments = [...this.comments];
            this.totalPages = response.totalPages || 1;

            this.updateCommentsList();
            this.updateCommentStats();

        } catch (error) {
            console.error('Failed to load comments:', error);
            this.comments = [];
            this.filteredComments = [];
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Failed to Load Comments',
                message: 'Unable to load comments. Please try again.'
            });
        } finally {
            this.isLoading = false;
        }
    }

    updateCommentStats() {
        const statsContainer = document.getElementById('comment-stats');
        if (statsContainer) {
            statsContainer.innerHTML = this.renderCommentStats();
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
                comment.user?.fullName?.toLowerCase().includes(this.searchQuery.toLowerCase());

            let matchesStatus = true;
            if (this.statusFilter === 'recent') {
                const createdAt = new Date(comment.createdAt);
                const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                matchesStatus = createdAt > dayAgo;
            } else if (this.statusFilter === 'top-level') {
                matchesStatus = !comment.parentId;
            } else if (this.statusFilter === 'replies') {
                matchesStatus = comment.parentId !== null && comment.parentId !== undefined;
            }

            const matchesType = !this.typeFilter || this.typeFilter === 'all' ||
                (this.typeFilter === 'review' && comment.rating !== undefined) ||
                (this.typeFilter === 'comment' && comment.rating === undefined);

            return matchesSearch && matchesStatus && matchesType;
        });

        this.updateCommentsList();
    }

    clearFilters() {
        this.searchQuery = '';
        this.statusFilter = 'all';
        this.typeFilter = 'all';

        const searchInput = document.getElementById('comment-search');
        const statusFilter = document.getElementById('status-filter');
        const typeFilter = document.getElementById('type-filter');

        if (searchInput) searchInput.value = '';
        if (statusFilter) statusFilter.value = 'all';
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

    async bulkDelete() {
        if (this.selectedComments.size === 0) return;

        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: `Delete Comments (${this.selectedComments.size})`,
            message: `Are you sure you want to delete ${this.selectedComments.size} comment${this.selectedComments.size !== 1 ? 's' : ''}? This action cannot be undone.`,
            confirmText: 'Delete Comments',
            confirmVariant: 'danger',
            onConfirm: async () => {
                try {
                    const { CommentService } = await import('../services/api.js');
                    const commentIds = Array.from(this.selectedComments);
                    await CommentService.bulkDeleteComments(commentIds);

                    // Clear selection and reload
                    this.selectedComments.clear();
                    await this.loadComments();

                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'success',
                        title: 'Bulk Delete Completed',
                        message: `Successfully deleted ${commentIds.length} comment${commentIds.length !== 1 ? 's' : ''}.`
                    });

                } catch (error) {
                    console.error('Bulk delete failed:', error);
                    const { globalState } = window;
                    globalState.addNotification({
                        type: 'error',
                        title: 'Bulk Delete Failed',
                        message: error.message || 'Failed to delete comments. Please try again.'
                    });
                }
            }
        });

        modal.show();
    }

    async deleteComment(commentId) {
        const { ModalComponent } = window;
        const modal = ModalComponent.createConfirmation({
            title: 'Delete Comment',
            message: 'Are you sure you want to delete this comment? This action cannot be undone.',
            confirmText: 'Delete Comment',
            confirmVariant: 'danger',
            onConfirm: async () => {
        try {
            const { CommentService } = await import('../services/api.js');
                    await CommentService.deleteCommentAsAdmin(commentId);

                await this.loadComments();

                const { globalState } = window;
                globalState.addNotification({
                    type: 'success',
                    title: 'Comment Deleted',
                    message: 'The comment has been permanently deleted.'
                });

        } catch (error) {
                    console.error('Delete comment failed:', error);
                const { globalState } = window;
                globalState.addNotification({
                    type: 'error',
                    title: 'Delete Failed',
                        message: error.message || 'Failed to delete comment. Please try again.'
                });
            }
        }
        });

        modal.show();
    }

    async refreshComments() {
        await this.loadComments();
    }

    async goToPage(page) {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            await this.loadComments();
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