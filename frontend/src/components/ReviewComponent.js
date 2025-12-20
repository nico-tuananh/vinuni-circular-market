// Review Component - Display and create reviews
export class ReviewComponent {
    constructor(options = {}) {
        this.reviews = options.reviews || [];
        this.orderId = options.orderId || null;
        this.listingId = options.listingId || null;
        this.canReview = options.canReview || false;
        this.isLoading = false;
        this.showForm = false;
    }

    render() {
        return `
            <div class="reviews-section">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0">Reviews & Ratings</h5>
                    ${this.canReview ? `
                        <button class="btn btn-primary btn-sm" onclick="this.parentElement.parentElement.reviewComponent.toggleReviewForm()">
                            <i class="bi bi-star me-1"></i>Write Review
                        </button>
                    ` : ''}
                </div>

                <!-- Review Form -->
                ${this.showForm ? this.renderReviewForm() : ''}

                <!-- Reviews List -->
                <div class="reviews-list">
                    ${this.reviews.length > 0 ? this.renderReviewsList() : this.renderNoReviews()}
                </div>
            </div>
        `;
    }

    renderReviewForm() {
        const { FormComponent, StarRatingComponent } = window;
        const starRating = StarRatingComponent.input({
            onChange: (rating) => {
                // Store the rating value
                this.formRating = rating;
            }
        });

        const formComponent = new FormComponent({
            fields: [
                {
                    name: 'rating',
                    label: 'Rating',
                    type: 'custom',
                    customHtml: starRating.render()
                },
                {
                    name: 'comment',
                    label: 'Review Comment',
                    type: 'textarea',
                    placeholder: 'Share your experience with this seller/item...',
                    required: true,
                    attributes: { rows: 4 }
                }
            ],
            onSubmit: (event) => this.submitReview(event),
            submitButtonText: 'Submit Review',
            loading: this.isLoading
        });

        return `
            <div class="card mb-4">
                <div class="card-header">
                    <h6 class="mb-0">Write Your Review</h6>
                </div>
                <div class="card-body">
                    ${formComponent.render()}
                </div>
            </div>
        `;
    }

    renderReviewsList() {
        const averageRating = this.calculateAverageRating();
        const totalReviews = this.reviews.length;

        return `
            <!-- Summary -->
            <div class="review-summary mb-4 p-3 bg-light rounded">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="h3 mb-0">${averageRating.toFixed(1)}</div>
                        <div class="star-rating">
                            ${this.renderStarRating(averageRating)}
                        </div>
                    </div>
                    <div class="col">
                        <div class="small text-muted">${totalReviews} review${totalReviews !== 1 ? 's' : ''}</div>
                    </div>
                </div>
            </div>

            <!-- Individual Reviews -->
            <div class="reviews-container">
                ${this.reviews.map(review => this.renderReview(review)).join('')}
            </div>
        `;
    }

    renderReview(review) {
        const { StarRatingComponent } = window;
        const starRating = StarRatingComponent.display(review.rating);

        return `
            <div class="review-item card mb-3">
                <div class="card-body">
                    <div class="d-flex">
                        <div class="flex-shrink-0 me-3">
                            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                 style="width: 40px; height: 40px;">
                                ${this.getInitials(review.reviewer?.fullName || 'Anonymous')}
                            </div>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <strong>${review.reviewer?.fullName || 'Anonymous'}</strong>
                                    <small class="text-muted ms-2">${this.formatTimeAgo(review.createdAt)}</small>
                                </div>
                                <div class="star-rating">
                                    ${starRating.render()}
                                </div>
                            </div>
                            <p class="mb-0">${review.comment || 'No comment provided.'}</p>
                            ${review.order ? `
                                <div class="mt-2">
                                    <small class="text-muted">
                                        Reviewed for: ${review.order.listing?.title || 'Unknown item'}
                                    </small>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderNoReviews() {
        return `
            <div class="text-center py-5">
                <div class="mb-3">
                    <i class="bi bi-star text-muted" style="font-size: 3rem;"></i>
                </div>
                <h6 class="text-muted mb-2">No reviews yet</h6>
                <p class="text-muted small mb-0">Be the first to leave a review!</p>
            </div>
        `;
    }

    renderStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHtml = '';

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="bi bi-star-fill text-warning"></i>';
        }

        if (hasHalfStar) {
            starsHtml += '<i class="bi bi-star-half text-warning"></i>';
        }

        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="bi bi-star text-warning"></i>';
        }

        return starsHtml;
    }

    toggleReviewForm() {
        this.showForm = !this.showForm;
        this.updateDisplay();
    }

    async submitReview(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const { FormComponent } = window;
        const formComponent = new FormComponent({});
        const formData = formComponent.getFormData(event.target);

        if (!this.formRating || this.formRating < 1) {
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Rating Required',
                message: 'Please select a star rating for your review.'
            });
            return;
        }

        this.isLoading = true;
        const { globalState } = window;

        try {
            const { ReviewService } = await import('../services/api.js');

            const reviewData = {
                rating: this.formRating,
                comment: formData.comment
            };

            await ReviewService.createReview(this.orderId, reviewData);

            // Hide form and refresh reviews
            this.showForm = false;
            await this.loadReviews();

            globalState.addNotification({
                type: 'success',
                title: 'Review Submitted',
                message: 'Thank you for your review!'
            });

        } catch {
            globalState.addNotification({
                type: 'error',
                title: 'Review Failed',
                message: 'Failed to submit review. Please try again.'
            });
        } finally {
            this.isLoading = false;
            this.updateDisplay();
        }
    }

    async loadReviews() {
        try {
            const { ReviewService } = await import('../services/api.js');

            if (this.orderId) {
                this.reviews = await ReviewService.getOrderReviews(this.orderId);
            } else if (this.listingId) {
                this.reviews = await ReviewService.getListingReviews(this.listingId);
            }
        } catch (error) {
            console.error('Failed to load reviews:', error);
            this.reviews = [];
        }
    }

    calculateAverageRating() {
        if (!this.reviews.length) return 0;

        const sum = this.reviews.reduce((total, review) => total + (review.rating || 0), 0);
        return sum / this.reviews.length;
    }

    updateDisplay() {
        const container = this.container;
        if (container) {
            container.reviewComponent = this;
            container.innerHTML = this.render();
        }
    }

    mount(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            this.container = container;
            container.reviewComponent = this;
            container.innerHTML = this.render();
        }
        return this;
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

    // Static method to create review component for order
    static forOrder(orderId, canReview = false) {
        return new ReviewComponent({
            orderId,
            canReview
        });
    }

    // Static method to create review component for listing
    static forListing(listingId) {
        return new ReviewComponent({
            listingId
        });
    }
}