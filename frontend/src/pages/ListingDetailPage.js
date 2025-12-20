// Listing Detail Page Component
export class ListingDetailPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.listingId = null;
        this.listing = null;
        this.seller = null;
        this.comments = [];
        this.reviews = [];
        this.averageRating = 0;
        this.isLoading = true;
        this.user = null;
    }

    async render() {
        if (!this.container) return;

        // Get listing ID from URL
        const pathParts = window.location.pathname.split('/');
        this.listingId = pathParts[pathParts.length - 1];

        if (!this.listingId) {
            window.App.router.navigate('/404');
            return;
        }

        // Get current user
        const { globalState } = window;
        this.user = globalState.get('user');

        // Load listing data
        await this.loadData();

        if (!this.listing) {
            this.renderNotFound();
            return;
        }

        this.container.innerHTML = `
            <div class="container py-4">
                <div class="row">
                    <!-- Main Content -->
                    <div class="col-lg-8">
                        ${this.renderListingHeader()}
                        ${this.renderImageGallery()}
                        ${this.renderListingDetails()}
                        ${this.renderCommentsSection()}
                    </div>

                    <!-- Sidebar -->
                    <div class="col-lg-4">
                        ${this.renderSellerCard()}
                        ${this.renderActionCard()}
                        ${this.renderListingStats()}
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();

        // Make this instance globally available for callbacks
        window.currentListingPage = this;
    }

    renderNotFound() {
        this.container.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-md-6 text-center">
                        <div class="mb-4">
                            <i class="bi bi-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
                        </div>
                        <h2 class="mb-3">Listing Not Found</h2>
                        <p class="text-muted mb-4">The listing you're looking for doesn't exist or has been removed.</p>
                        <button class="btn btn-primary" onclick="window.App.router.navigate('/listings')">
                            Browse Other Listings
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderListingHeader() {
        const type = this.listing.type || 'Sell';
        const status = this.listing.status || 'Active';

        return `
            <div class="card mb-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h1 class="h3 mb-2">${this.listing.title}</h1>
                            <div class="d-flex gap-2 mb-2 flex-wrap">
                                <span class="badge ${type === 'LEND' ? 'borrowing-badge' : 'bg-success'}">${type === 'LEND' ? 'Available for Borrow' : type}</span>
                                <span class="badge bg-secondary">${this.listing.condition || 'Used'}</span>
                                <span class="badge bg-${status === 'Active' ? 'success' : 'warning'}">${status}</span>
                                ${type === 'LEND' ? this.renderBorrowingInfo() : ''}
                            </div>
                        </div>
                        <div class="text-end">
                            <div class="h4 text-primary mb-0">
                                ${this.listing.price ? `$${this.listing.price.toFixed(2)}` : 'Free'}
                            </div>
                            ${type === 'Borrow' ? '<small class="text-muted">per day</small>' : ''}
                        </div>
                    </div>
                    <div class="d-flex align-items-center text-muted small">
                        <i class="bi bi-geo-alt me-1"></i>
                        <span>VinUniversity Campus</span>
                        <span class="mx-2">•</span>
                        <i class="bi bi-clock me-1"></i>
                        <span>Posted ${this.formatTimeAgo(this.listing.createdAt)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderImageGallery() {
        const images = this.listing.images || [];
        const mainImage = images.length > 0 ? images[0] : '/placeholder-listing.png';

        if (images.length <= 1) {
            return `
                <div class="card mb-4">
                    <img src="${mainImage}" class="card-img-top" alt="${this.listing.title}" style="max-height: 400px; object-fit: cover;">
                </div>
            `;
        }

        return `
            <div class="card mb-4">
                <div id="listing-carousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${images.map((image, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${image}" class="d-block w-100" alt="${this.listing.title}" style="max-height: 400px; object-fit: cover;">
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#listing-carousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#listing-carousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
                <div class="card-body">
                    <div class="row g-2">
                        ${images.map((image, index) => `
                            <div class="col-auto">
                                <img src="${image}" class="img-thumbnail" alt="Thumbnail ${index + 1}"
                                     style="width: 60px; height: 60px; object-fit: cover; cursor: pointer;"
                                     onclick="document.querySelector('#listing-carousel').carousel(${index})">
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderListingDetails() {
        return `
            <div class="card mb-4">
                <div class="card-header">
                    <h5 class="mb-0">Details</h5>
                </div>
                <div class="card-body">
                    <p class="mb-4">${this.listing.description || 'No description provided.'}</p>

                    <div class="row">
                        <div class="col-md-6">
                            <h6>Item Details</h6>
                            <table class="table table-sm">
                                <tbody>
                                    <tr>
                                        <td class="text-muted">Category:</td>
                                        <td>${this.listing.category?.name || 'Uncategorized'}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Condition:</td>
                                        <td>${this.listing.condition || 'Not specified'}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Type:</td>
                                        <td>${this.listing.type || 'Sell'}</td>
                                    </tr>
                                    ${this.listing.type === 'Borrow' ? `
                                        <tr>
                                            <td class="text-muted">Available from:</td>
                                            <td>${this.formatDate(this.listing.availableFrom) || 'Not specified'}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-muted">Available until:</td>
                                            <td>${this.formatDate(this.listing.availableUntil) || 'Not specified'}</td>
                                        </tr>
                                    ` : ''}
                                </tbody>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <h6>Location & Contact</h6>
                            <table class="table table-sm">
                                <tbody>
                                    <tr>
                                        <td class="text-muted">Location:</td>
                                        <td>VinUniversity Campus</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Pickup:</td>
                                        <td>${this.listing.pickupAvailable ? 'Available' : 'Not available'}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted">Delivery:</td>
                                        <td>${this.listing.deliveryAvailable ? 'Available' : 'Not available'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCommentsSection() {
        const canComment = this.user && this.user.id !== this.seller?.id;

        return `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Questions & Comments (${this.comments.length})</h5>
                    ${canComment ? '<button class="btn btn-sm btn-outline-primary" onclick="window.currentListingPage.showCommentModal()">Ask a Question</button>' : ''}
                </div>
                <div class="card-body" id="comments-container">
                    ${this.renderComments()}
                </div>
            </div>
        `;
    }

    renderComments() {
        if (!this.comments.length) {
            return '<p class="text-muted text-center py-4">No comments yet. Be the first to ask a question!</p>';
        }

        return this.comments.map(comment => this.renderComment(comment)).join('');
    }

    renderComment(comment) {
        const isOwner = this.user && comment.userId === this.user.id;
        const canReply = this.user && !comment.parentId;
        const hasReplies = comment.replies && comment.replies.length > 0;

        return `
            <div class="comment mb-3 ${comment.parentId ? 'ms-4 border-start border-secondary' : ''}" data-comment-id="${comment.id}">
                <div class="d-flex">
                    <div class="flex-shrink-0 me-3">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                             style="width: 40px; height: 40px; font-size: 0.8rem;">
                            ${this.getInitials(comment.user?.fullName || 'User')}
                        </div>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <div>
                                <strong>${comment.user?.fullName || 'Anonymous'}</strong>
                                <small class="text-muted ms-2">${this.formatTimeAgo(comment.createdAt)}</small>
                                ${isOwner ? '<span class="badge bg-primary ms-2">You</span>' : ''}
                            </div>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    ${canReply ? `<li><a class="dropdown-item" href="#" onclick="window.currentListingPage.replyToComment(${comment.id})">Reply</a></li>` : ''}
                                    ${isOwner ? `<li><a class="dropdown-item" href="#" onclick="window.currentListingPage.editComment(${comment.id})">Edit</a></li>` : ''}
                                    ${isOwner ? `<li><a class="dropdown-item text-danger" href="#" onclick="window.currentListingPage.deleteComment(${comment.id})">Delete</a></li>` : ''}
                                </ul>
                            </div>
                        </div>
                        <p class="mb-2">${comment.content}</p>
                        ${!comment.parentId && canReply ? `<button class="btn btn-sm btn-link p-0" onclick="window.currentListingPage.replyToComment(${comment.id})">Reply</button>` : ''}
                    </div>
                </div>
                ${hasReplies ? `
                    <div class="replies mt-3">
                        ${comment.replies.map(reply => this.renderComment(reply)).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderSellerCard() {
        if (!this.seller) return '';

        const rating = this.averageRating > 0 ? this.averageRating.toFixed(1) : 'No ratings';
        const reviewCount = this.reviews.length;

        return `
            <div class="card mb-4">
                <div class="card-header">
                    <h6 class="mb-0">Seller Information</h6>
                </div>
                <div class="card-body text-center">
                    <div class="mb-3">
                        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                             style="width: 60px; height: 60px; font-size: 1.2rem;">
                            ${this.getInitials(this.seller.fullName)}
                        </div>
                    </div>
                    <h6 class="mb-1">${this.seller.fullName}</h6>
                    <p class="text-muted small mb-2">${this.seller.email}</p>
                    <div class="mb-2">
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            ${this.renderStarRating(this.averageRating)}
                            <span class="ms-2">${rating}</span>
                        </div>
                        <small class="text-muted">${reviewCount} review${reviewCount !== 1 ? 's' : ''}</small>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm flex-fill" onclick="window.currentListingPage.contactSeller()">
                            <i class="bi bi-envelope me-1"></i>Message
                        </button>
                        <button class="btn btn-outline-secondary btn-sm flex-fill" onclick="window.currentListingPage.viewSellerProfile()">
                            <i class="bi bi-person me-1"></i>Profile
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderActionCard() {
        if (!this.user) {
            return `
                <div class="card mb-4">
                    <div class="card-body text-center">
                        <p class="text-muted mb-3">Sign in to make an offer or ask questions</p>
                        <button class="btn btn-primary w-100" onclick="window.App.router.navigate('/login')">
                            Sign In
                        </button>
                    </div>
                </div>
            `;
        }

        if (this.user.id === this.seller?.id) {
            return `
                <div class="card mb-4">
                    <div class="card-body text-center">
                        <p class="text-muted mb-3">This is your listing</p>
                        <button class="btn btn-primary w-100" onclick="window.App.router.navigate('/listings/${this.listingId}/edit')">
                            <i class="bi bi-pencil me-2"></i>Edit Listing
                        </button>
                    </div>
                </div>
            `;
        }

        const type = this.listing.type || 'SELL';
        const buttonText = type === 'LEND' ? 'Request to Borrow' : 'Make an Offer';
        const buttonIcon = type === 'LEND' ? 'bi-calendar-check' : 'bi-hand-thumbs-up';

        return `
            <div class="card mb-4">
                <div class="card-body">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-lg" onclick="window.currentListingPage.makeOffer()">
                            <i class="bi ${buttonIcon} me-2"></i>${buttonText}
                        </button>
                        <button class="btn btn-outline-primary" onclick="window.currentListingPage.addToWishlist()">
                            <i class="bi bi-heart me-2"></i>Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderListingStats() {
        return `
            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0">Listing Stats</h6>
                </div>
                <div class="card-body">
                    <div class="row text-center">
                        <div class="col-4">
                            <div class="h5 mb-1">${this.listing.viewCount || 0}</div>
                            <small class="text-muted">Views</small>
                        </div>
                        <div class="col-4">
                            <div class="h5 mb-1">${this.comments.length}</div>
                            <small class="text-muted">Questions</small>
                        </div>
                        <div class="col-4">
                            <div class="h5 mb-1">${this.listing.favoriteCount || 0}</div>
                            <small class="text-muted">Favorites</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHtml = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="bi bi-star-fill text-warning"></i>';
        }

        // Half star
        if (hasHalfStar) {
            starsHtml += '<i class="bi bi-star-half text-warning"></i>';
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="bi bi-star text-warning"></i>';
        }

        return starsHtml;
    }

    async loadData() {
        try {
            this.isLoading = true;

            const { ListingService, CommentService, ReviewService } = await import('../services/api.js');

            // Load listing details
            this.listing = await ListingService.getListing(this.listingId);

            if (this.listing) {
                // Load seller info (assuming it's included in the listing response)
                this.seller = this.listing.seller || this.listing.user;

                // Load comments
                const commentsData = await CommentService.getListingComments(this.listingId);
                this.comments = commentsData || [];

                // Load reviews for seller
                if (this.seller) {
                    const reviewsData = await ReviewService.getSellerAverageRating(this.seller.id);
                    this.averageRating = reviewsData.averageRating || 0;

                    const sellerReviews = await ReviewService.getListingReviews(this.listingId);
                    this.reviews = sellerReviews || [];
                }
            }

        } catch (error) {
            console.error('Failed to load listing details:', error);
            this.listing = null;
        } finally {
            this.isLoading = false;
        }
    }

    attachEventListeners() {
        // Add any additional event listeners here
    }

    showCommentModal(parentId = null) {
        const isReply = parentId !== null;
        const title = isReply ? 'Reply to Comment' : 'Ask a Question';

        const modalContent = `
            <form id="comment-form">
                <div class="mb-3">
                    <label for="comment-content" class="form-label">${isReply ? 'Your Reply' : 'Your Question'}</label>
                    <textarea class="form-control" id="comment-content" rows="4" placeholder="${isReply ? 'Write your reply...' : 'Ask a question about this listing...'}" required></textarea>
                </div>
            </form>
        `;

        const footerContent = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="window.currentListingPage.submitComment(${parentId})">Submit</button>
        `;

        const { ModalComponent } = window;
        const modal = new ModalComponent({
            title,
            content: modalContent,
            footerContent,
            size: 'md'
        });

        modal.show();
    }

    async submitComment(parentId = null) {
        const content = document.getElementById('comment-content')?.value?.trim();

        if (!content) {
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Error',
                message: 'Please enter a comment.'
            });
            return;
        }

        try {
            const { CommentService } = await import('../services/api.js');

            const commentData = {
                content,
                parentId
            };

            await CommentService.createComment(this.listingId, commentData);

            // Close modal and reload comments
            const modalElement = document.querySelector('.modal');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }

            // Reload comments
            await this.loadComments();

            const { globalState } = window;
            globalState.addNotification({
                type: 'success',
                title: 'Comment Posted',
                message: 'Your comment has been posted successfully.'
            });

        } catch (error) {
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Error',
                message: 'Failed to post comment. Please try again.'
            });
        }
    }

    async loadComments() {
        try {
            const { CommentService } = await import('../services/api.js');
            const commentsData = await CommentService.getListingComments(this.listingId);
            this.comments = commentsData || [];
            this.updateCommentsSection();
        } catch (error) {
            console.error('Failed to load comments:', error);
        }
    }

    updateCommentsSection() {
        const commentsContainer = document.getElementById('comments-container');
        if (commentsContainer) {
            commentsContainer.innerHTML = this.renderComments();
        }
    }

    makeOffer() {
        const type = this.listing.type || 'Sell';
        const modalTitle = type === 'Borrow' ? 'Request to Borrow' : 'Make an Offer';

        const modalContent = `
            <form id="offer-form">
                ${type === 'Sell' ? `
                    <div class="mb-3">
                        <label for="offer-price" class="form-label">Your Offer Price</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control" id="offer-price" min="0" step="0.01" placeholder="${this.listing.price || '0.00'}" required>
                        </div>
                        <div class="form-text">Original price: $${this.listing.price?.toFixed(2) || '0.00'}</div>
                    </div>
                ` : `
                    <div class="mb-3">
                        <label for="borrow-from" class="form-label">Borrow From Date</label>
                        <input type="date" class="form-control" id="borrow-from" required>
                    </div>
                    <div class="mb-3">
                        <label for="borrow-to" class="form-label">Borrow Until Date</label>
                        <input type="date" class="form-control" id="borrow-to" required>
                    </div>
                `}
                <div class="mb-3">
                    <label for="offer-message" class="form-label">Message to Seller</label>
                    <textarea class="form-control" id="offer-message" rows="3" placeholder="Introduce yourself and explain your interest..."></textarea>
                </div>
            </form>
        `;

        const footerContent = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="window.currentListingPage.submitOffer()">Submit ${type === 'Borrow' ? 'Request' : 'Offer'}</button>
        `;

        const { ModalComponent } = window;
        const modal = new ModalComponent({
            title: modalTitle,
            content: modalContent,
            footerContent,
            size: 'md'
        });

        modal.show();
    }

    async submitOffer() {
        const type = this.listing.type || 'SELL';
        const { globalState } = window;

        if (type === 'LEND') {
            // For borrowing, show date selection modal
            this.showBorrowingModal();
        } else {
            // For selling, show regular offer modal
            globalState.addNotification({
                type: 'info',
                title: 'Coming Soon',
                message: 'The purchase offer system is currently under development.'
            });
        }
    }

    showBorrowingModal() {
        const { ModalComponent } = window;
        const modalContent = `
            <form id="borrowing-form">
                <div class="mb-3">
                    <label for="borrow-from-date" class="form-label">Borrow From Date</label>
                    <input type="date" class="form-control" id="borrow-from-date" required>
                    <div class="form-text">When would you like to start borrowing?</div>
                </div>
                <div class="mb-3">
                    <label for="borrow-to-date" class="form-label">Borrow Until Date</label>
                    <input type="date" class="form-control" id="borrow-to-date" required>
                    <div class="form-text">When will you return the item?</div>
                </div>
                <div class="mb-3">
                    <label for="borrow-message" class="form-label">Message to Owner</label>
                    <textarea class="form-control" id="borrow-message" rows="3" placeholder="Explain why you want to borrow this item and how you'll take care of it..."></textarea>
                </div>
            </form>
        `;

        const footerContent = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="window.currentListingPage.submitBorrowingRequest()">Submit Request</button>
        `;

        const modal = new ModalComponent({
            title: 'Request to Borrow',
            content: modalContent,
            footerContent,
            size: 'md'
        });

        modal.show();

        // Set min dates to today and available dates
        const today = new Date().toISOString().split('T')[0];
        const fromInput = document.getElementById('borrow-from-date');
        const toInput = document.getElementById('borrow-to-date');

        if (fromInput) {
            fromInput.min = today;
            if (this.listing.availableFrom) {
                const availableFrom = new Date(this.listing.availableFrom).toISOString().split('T')[0];
                if (availableFrom > today) {
                    fromInput.min = availableFrom;
                }
            }
        }

        if (toInput) {
            toInput.min = today;
        }
    }

    async submitBorrowingRequest() {
        const fromDate = document.getElementById('borrow-from-date')?.value;
        const toDate = document.getElementById('borrow-to-date')?.value;
        const message = document.getElementById('borrow-message')?.value;

        if (!fromDate || !toDate) {
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Validation Error',
                message: 'Please select both start and end dates.'
            });
            return;
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);
        const today = new Date();

        if (from < today) {
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Invalid Date',
                message: 'Borrow from date cannot be in the past.'
            });
            return;
        }

        if (to <= from) {
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Invalid Date Range',
                message: 'Return date must be after the borrow date.'
            });
            return;
        }

        // Check against available dates if specified
        if (this.listing.availableFrom) {
            const availableFrom = new Date(this.listing.availableFrom);
            if (from < availableFrom) {
                const { globalState } = window;
                globalState.addNotification({
                    type: 'error',
                    title: 'Not Available',
                    message: `This item is not available until ${availableFrom.toLocaleDateString()}.`
                });
                return;
            }
        }

        if (this.listing.availableUntil) {
            const availableUntil = new Date(this.listing.availableUntil);
            if (to > availableUntil) {
                const { globalState } = window;
                globalState.addNotification({
                    type: 'error',
                    title: 'Not Available',
                    message: `This item is only available until ${availableUntil.toLocaleDateString()}.`
                });
                return;
            }
        }

        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Coming Soon',
            message: 'The borrowing request system is currently under development.'
        });

        // Close modal
        const modalElement = document.querySelector('.modal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
    }

    addToWishlist() {
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Coming Soon',
            message: 'Wishlist functionality will be available soon.'
        });
    }

    contactSeller() {
        // Open a modal for contacting the seller
        this.showCommentModal();
    }

    viewSellerProfile() {
        if (this.seller) {
            window.App.router.navigate(`/users/${this.seller.id}`);
        }
    }

    replyToComment(commentId) {
        this.showCommentModal(commentId);
    }

    editComment(commentId) {
        // Implementation for editing comments
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Coming Soon',
            message: 'Comment editing will be available soon.'
        });
    }

    deleteComment(commentId) {
        // Implementation for deleting comments
        const { globalState } = window;
        globalState.addNotification({
            type: 'info',
            title: 'Coming Soon',
            message: 'Comment deletion will be available soon.'
        });
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    formatTimeAgo(dateString) {
        if (!dateString) return 'Recently';

        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return date.toLocaleDateString();
    }

    renderBorrowingInfo() {
        const availableFrom = this.listing.availableFrom;
        const availableUntil = this.listing.availableUntil;

        if (!availableFrom && !availableUntil) return '';

        return `
            <div class="borrow-dates mt-2">
                ${availableFrom ? `
                    <div class="date-item">
                        <small class="text-muted d-block">Available from</small>
                        <strong>${this.formatDate(availableFrom)}</strong>
                    </div>
                ` : ''}
                ${availableUntil ? `
                    <div class="date-item">
                        <small class="text-muted d-block">Available until</small>
                        <strong>${this.formatDate(availableUntil)}</strong>
                    </div>
                ` : ''}
            </div>
        `;
    }

    formatDate(dateString) {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString();
    }
}