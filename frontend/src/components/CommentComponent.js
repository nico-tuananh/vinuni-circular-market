// Comment Component for displaying and managing comments
export class CommentComponent {
    constructor(containerId, listingId) {
        this.containerId = containerId;
        this.listingId = listingId;
        this.comments = [];
        this.commentCount = 0;
    }

    async init() {
        await this.loadComments();
        this.render();
        this.bindEvents();
    }

    async loadComments() {
        try {
            const data = await api.get(`/comments/listings/${this.listingId}`);
            this.comments = data || [];
            this.commentCount = await this.getCommentCount();
        } catch (error) {
            console.error('Failed to load comments:', error);
            this.showError('Failed to load comments');
        }
    }

    async getCommentCount() {
        try {
            const data = await api.get(`/comments/listings/${this.listingId}/count`);
            return data.commentCount || 0;
        } catch (error) {
            return 0;
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="comments-section">
                <div class="comments-header mb-4">
                    <h4>Comments & Questions</h4>
                    <span class="text-muted">(${this.commentCount} comments)</span>
                </div>

                <div class="add-comment-section mb-4">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex">
                                <div class="flex-grow-1">
                                    <textarea class="form-control" id="new-comment-text" rows="3"
                                              placeholder="Ask a question or leave a comment..." maxlength="500"></textarea>
                                    <div class="form-text">Maximum 500 characters</div>
                                </div>
                                <div class="ms-3">
                                    <button class="btn btn-primary" id="post-comment-btn">Post</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="comments-list">
                    ${this.comments.length > 0 ?
                        this.comments.map(comment => this.renderComment(comment)).join('') :
                        '<p class="text-muted text-center py-4">No comments yet. Be the first to ask a question or leave a comment!</p>'
                    }
                </div>
            </div>
        `;
    }

    renderComment(comment) {
        const timeAgo = this.getTimeAgo(comment.createdAt);
        const isOwner = this.isCommentOwner(comment);
        const canEdit = isOwner && this.canEditComment(comment);

        return `
            <div class="comment-card card mb-3" data-comment-id="${comment.commentId}">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-shrink-0">
                            <div class="avatar-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                ${this.getInitials(comment.user.fullName)}
                            </div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <div class="comment-header d-flex justify-content-between align-items-start">
                                <div>
                                    <strong>${this.escapeHtml(comment.user.fullName)}</strong>
                                    <small class="text-muted ms-2">${timeAgo}</small>
                                </div>
                                ${canEdit ? `
                                    <div class="comment-actions">
                                        <button class="btn btn-sm btn-outline-primary me-2 edit-comment-btn" data-comment-id="${comment.commentId}">
                                            Edit
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger delete-comment-btn" data-comment-id="${comment.commentId}">
                                            Delete
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="comment-content mt-2">
                                <p class="mb-0">${this.escapeHtml(comment.content)}</p>
                            </div>
                            ${comment.replies && comment.replies.length > 0 ? `
                                <div class="comment-replies mt-3">
                                    ${comment.replies.map(reply => this.renderReply(reply)).join('')}
                                </div>
                            ` : ''}
                            <div class="comment-footer mt-2">
                                <button class="btn btn-sm btn-link reply-btn" data-comment-id="${comment.commentId}">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Reply form (hidden by default) -->
                    <div class="reply-form mt-3 d-none" id="reply-form-${comment.commentId}">
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <textarea class="form-control" id="reply-text-${comment.commentId}" rows="2"
                                          placeholder="Write a reply..." maxlength="500"></textarea>
                            </div>
                            <div class="ms-3">
                                <button class="btn btn-sm btn-outline-secondary me-2 cancel-reply-btn" data-comment-id="${comment.commentId}">Cancel</button>
                                <button class="btn btn-sm btn-primary post-reply-btn" data-comment-id="${comment.commentId}">Reply</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderReply(reply) {
        const timeAgo = this.getTimeAgo(reply.createdAt);
        const isOwner = this.isCommentOwner(reply);
        const canEdit = isOwner && this.canEditComment(reply);

        return `
            <div class="reply-card border-start border-primary ps-3 ms-4 mt-2" data-comment-id="${reply.commentId}">
                <div class="d-flex">
                    <div class="flex-shrink-0">
                        <div class="avatar-circle bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; font-size: 0.8em;">
                            ${this.getInitials(reply.user.fullName)}
                        </div>
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <div class="reply-header d-flex justify-content-between align-items-start">
                            <div>
                                <strong>${this.escapeHtml(reply.user.fullName)}</strong>
                                <small class="text-muted ms-2">${timeAgo}</small>
                            </div>
                            ${canEdit ? `
                                <div class="reply-actions">
                                    <button class="btn btn-sm btn-outline-primary me-2 edit-reply-btn" data-comment-id="${reply.commentId}">
                                        Edit
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger delete-reply-btn" data-comment-id="${reply.commentId}">
                                        Delete
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                        <div class="reply-content">
                            <p class="mb-0">${this.escapeHtml(reply.content)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    isCommentOwner(comment) {
        const currentUser = AuthService.getCurrentUser();
        return currentUser && comment.user.userId === currentUser.userId;
    }

    canEditComment(comment) {
        const commentDate = new Date(comment.createdAt);
        const now = new Date();
        const hoursDiff = (now - commentDate) / (1000 * 60 * 60);
        return hoursDiff <= 15; // 15 minutes limit
    }

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    bindEvents() {
        // Post new comment
        const postBtn = document.getElementById('post-comment-btn');
        if (postBtn) {
            postBtn.addEventListener('click', () => this.postComment());
        }

        // Reply buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('reply-btn')) {
                const commentId = e.target.dataset.commentId;
                this.showReplyForm(commentId);
            }
        });

        // Cancel reply buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cancel-reply-btn')) {
                const commentId = e.target.dataset.commentId;
                this.hideReplyForm(commentId);
            }
        });

        // Post reply buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('post-reply-btn')) {
                const commentId = e.target.dataset.commentId;
                this.postReply(commentId);
            }
        });

        // Edit comment buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-comment-btn') || e.target.classList.contains('edit-reply-btn')) {
                const commentId = e.target.dataset.commentId;
                this.editComment(commentId);
            }
        });

        // Delete comment buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-comment-btn') || e.target.classList.contains('delete-reply-btn')) {
                const commentId = e.target.dataset.commentId;
                this.deleteComment(commentId);
            }
        });
    }

    async postComment() {
        const textArea = document.getElementById('new-comment-text');
        const content = textArea.value.trim();

        if (!content) {
            this.showError('Please enter a comment');
            return;
        }

        try {
            await api.post(`/comments/listings/${this.listingId}`, { content });

            // Reset form and refresh comments
            textArea.value = '';
            await this.loadComments();
            this.render();

            this.showSuccess('Comment posted successfully!');

        } catch (error) {
            console.error('Failed to post comment:', error);
            this.showError(error.message || 'Failed to post comment');
        }
    }

    showReplyForm(commentId) {
        const form = document.getElementById(`reply-form-${commentId}`);
        if (form) {
            form.classList.remove('d-none');
        }
    }

    hideReplyForm(commentId) {
        const form = document.getElementById(`reply-form-${commentId}`);
        if (form) {
            form.classList.add('d-none');
            const textArea = document.getElementById(`reply-text-${commentId}`);
            if (textArea) textArea.value = '';
        }
    }

    async postReply(commentId) {
        const textArea = document.getElementById(`reply-text-${commentId}`);
        const content = textArea.value.trim();

        if (!content) {
            this.showError('Please enter a reply');
            return;
        }

        try {
            await api.post(`/comments/listings/${this.listingId}`, {
                content,
                parentId: parseInt(commentId)
            });

            // Hide form and refresh comments
            this.hideReplyForm(commentId);
            await this.loadComments();
            this.render();

            this.showSuccess('Reply posted successfully!');

        } catch (error) {
            console.error('Failed to post reply:', error);
            this.showError(error.message || 'Failed to post reply');
        }
    }

    async editComment(commentId) {
        const comment = this.findCommentById(commentId);
        if (!comment) return;

        const newContent = prompt('Edit your comment:', comment.content);
        if (newContent && newContent.trim() !== comment.content) {
            try {
                await api.put(`/comments/${commentId}`, { content: newContent.trim() });
                await this.loadComments();
                this.render();
                this.showSuccess('Comment updated successfully!');
            } catch (error) {
                console.error('Failed to update comment:', error);
                this.showError(error.message || 'Failed to update comment');
            }
        }
    }

    async deleteComment(commentId) {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            await api.delete(`/comments/${commentId}`);
            await this.loadComments();
            this.render();
            this.showSuccess('Comment deleted successfully!');
        } catch (error) {
            console.error('Failed to delete comment:', error);
            this.showError(error.message || 'Failed to delete comment');
        }
    }

    findCommentById(commentId) {
        // Search in main comments
        for (const comment of this.comments) {
            if (comment.commentId.toString() === commentId.toString()) {
                return comment;
            }
            // Search in replies
            if (comment.replies) {
                for (const reply of comment.replies) {
                    if (reply.commentId.toString() === commentId.toString()) {
                        return reply;
                    }
                }
            }
        }
        return null;
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInHours / 24;

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hours ago`;
        } else if (diffInDays < 30) {
            return `${Math.floor(diffInDays)} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    showSuccess(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}
