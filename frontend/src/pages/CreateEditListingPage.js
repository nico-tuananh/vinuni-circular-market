// Create/Edit Listing Page Component
export class CreateEditListingPage {
    constructor(params = {}) {
        this.container = document.getElementById('main-content');
        this.listingId = params.id || null; // If editing, this will be set
        this.isEditing = !!this.listingId;
        this.listing = null;
        this.categories = [];
        this.isLoading = false;
        this.uploadedImages = [];
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

        // Load data
        await this.loadData();

        this.container.innerHTML = `
            <div class="container py-4">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="card shadow-custom">
                            <div class="card-header bg-white">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h2 class="mb-0">${this.isEditing ? 'Edit Listing' : 'Create New Listing'}</h2>
                                    <button class="btn btn-outline-secondary" onclick="window.App.router.navigate('/my-listings')">
                                        <i class="bi bi-arrow-left me-2"></i>Back to My Listings
                                    </button>
                                </div>
                            </div>
                            <div class="card-body">
                                <form id="listing-form">
                                    ${this.renderBasicInfoSection()}
                                    ${this.renderDetailsSection()}
                                    ${this.renderImagesSection()}
                                    ${this.renderActionsSection()}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();

        // Make this instance globally available for callbacks
        window.currentCreateEditListingPage = this;
    }

    renderBasicInfoSection() {
        return `
            <div class="row mb-4">
                <div class="col-12">
                    <h4 class="mb-3">Basic Information</h4>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-8 mb-3">
                    <label for="title" class="form-label">
                        Title <span class="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        class="form-control"
                        id="title"
                        name="title"
                        maxlength="200"
                        placeholder="e.g., MacBook Pro 2021, Calculus Textbook, etc."
                        value="${this.listing?.title || ''}"
                        required
                    >
                    <div class="form-text">Be specific and descriptive (max 200 characters)</div>
                </div>

                <div class="col-md-4 mb-3">
                    <label for="category" class="form-label">
                        Category <span class="text-danger">*</span>
                    </label>
                    <select class="form-select" id="category" name="category" required>
                        <option value="">Select a category</option>
                        ${this.renderCategoryOptions()}
                    </select>
                </div>
            </div>

            <div class="mb-3">
                <label for="description" class="form-label">
                    Description <span class="text-danger">*</span>
                </label>
                <textarea
                    class="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    maxlength="5000"
                    placeholder="Describe your item in detail. Include condition, features, and any other relevant information."
                    required
                >${this.listing?.description || ''}</textarea>
                <div class="form-text">Provide detailed information about your item (max 5000 characters)</div>
            </div>
        `;
    }

    renderDetailsSection() {
        const type = this.listing?.listingType || 'SELL';
        const condition = this.listing?.condition || 'USED';

        return `
            <div class="row mb-4">
                <div class="col-12">
                    <h4 class="mb-3">Item Details</h4>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-4 mb-3">
                    <label for="listingType" class="form-label">
                        Listing Type <span class="text-danger">*</span>
                    </label>
                    <select class="form-select" id="listingType" name="listingType" required>
                        <option value="SELL" ${type === 'SELL' ? 'selected' : ''}>For Sale</option>
                        <option value="LEND" ${type === 'LEND' ? 'selected' : ''}>For Lending</option>
                    </select>
                </div>

                <div class="col-md-4 mb-3">
                    <label for="condition" class="form-label">
                        Condition <span class="text-danger">*</span>
                    </label>
                    <select class="form-select" id="condition" name="condition" required>
                        <option value="NEW" ${condition === 'NEW' ? 'selected' : ''}>New</option>
                        <option value="LIKE_NEW" ${condition === 'LIKE_NEW' ? 'selected' : ''}>Like New</option>
                        <option value="USED" ${condition === 'USED' ? 'selected' : ''}>Used</option>
                    </select>
                </div>

                <div class="col-md-4 mb-3">
                    <label for="listPrice" class="form-label">
                        Price <span class="text-danger">*</span>
                    </label>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input
                            type="number"
                            class="form-control"
                            id="listPrice"
                            name="listPrice"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value="${this.listing?.listPrice || ''}"
                            required
                        >
                        <span class="input-group-text" id="price-type-text">${type === 'LEND' ? 'per day' : ''}</span>
                    </div>
                </div>
            </div>

            <!-- Additional options for lending -->
            <div id="lending-options" class="row mb-3" style="display: ${type === 'LEND' ? 'block' : 'none'};">
                <div class="col-md-6 mb-3">
                    <label for="availableFrom" class="form-label">Available From</label>
                    <input
                        type="date"
                        class="form-control"
                        id="availableFrom"
                        name="availableFrom"
                        value="${this.listing?.availableFrom ? this.formatDateForInput(this.listing.availableFrom) : ''}"
                    >
                </div>

                <div class="col-md-6 mb-3">
                    <label for="availableUntil" class="form-label">Available Until</label>
                    <input
                        type="date"
                        class="form-control"
                        id="availableUntil"
                        name="availableUntil"
                        value="${this.listing?.availableUntil ? this.formatDateForInput(this.listing.availableUntil) : ''}"
                    >
                </div>
            </div>

            <!-- Delivery and pickup options -->
            <div class="row mb-3">
                <div class="col-12">
                    <h6 class="mb-2">Delivery & Pickup Options</h6>
                </div>
                <div class="col-md-6">
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="pickupAvailable"
                            name="pickupAvailable"
                            ${this.listing?.pickupAvailable ? 'checked' : ''}
                        >
                        <label class="form-check-label" for="pickupAvailable">
                            Pickup Available
                        </label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            id="deliveryAvailable"
                            name="deliveryAvailable"
                            ${this.listing?.deliveryAvailable ? 'checked' : ''}
                        >
                        <label class="form-check-label" for="deliveryAvailable">
                            Delivery Available
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    renderImagesSection() {
        return `
            <div class="row mb-4">
                <div class="col-12">
                    <h4 class="mb-3">Images</h4>
                    <p class="text-muted small">Upload clear photos of your item. First image will be the main photo.</p>
                </div>
            </div>

            <div class="mb-3">
                <div class="border rounded p-4" id="image-upload-area">
                    <div class="text-center">
                        <div class="mb-3">
                            <i class="bi bi-cloud-upload text-muted" style="font-size: 3rem;"></i>
                        </div>
                        <h6>Drag & drop images here or click to browse</h6>
                        <p class="text-muted small">Supported formats: JPG, PNG, GIF. Maximum 5 images, 5MB each.</p>
                        <input
                            type="file"
                            class="d-none"
                            id="image-input"
                            name="images"
                            accept="image/*"
                            multiple
                        >
                        <button type="button" class="btn btn-outline-primary" onclick="document.getElementById('image-input').click()">
                            <i class="bi bi-folder me-2"></i>Choose Images
                        </button>
                    </div>
                </div>

                <!-- Image Preview Grid -->
                <div id="image-preview" class="row g-3 mt-3">
                    ${this.renderImagePreviews()}
                </div>
            </div>
        `;
    }

    renderActionsSection() {
        return `
            <div class="row">
                <div class="col-12">
                    <hr class="my-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="agreeToTerms" name="agreeToTerms" required>
                            <label class="form-check-label" for="agreeToTerms">
                                I agree to the <a href="#" onclick="event.preventDefault()">Terms of Service</a> and <a href="#" onclick="event.preventDefault()">Community Guidelines</a>
                            </label>
                        </div>

                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-outline-secondary" onclick="window.currentCreateEditListingPage.cancel()">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary" id="submit-btn">
                                <i class="bi bi-${this.isEditing ? 'check-lg' : 'plus-lg'} me-2"></i>
                                ${this.isEditing ? 'Update Listing' : 'Create Listing'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCategoryOptions() {
        return this.categories.map(category => `
            <option value="${category.id}" ${this.listing?.category?.id == category.id ? 'selected' : ''}>
                ${category.name}
            </option>
        `).join('');
    }

    renderImagePreviews() {
        if (!this.uploadedImages.length) return '';

        return this.uploadedImages.map((image, index) => `
            <div class="col-md-3 col-sm-6">
                <div class="card h-100">
                    <div class="position-relative">
                        <img src="${image.preview}" class="card-img-top" alt="Preview ${index + 1}" style="height: 150px; object-fit: cover;">
                        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                onclick="window.currentCreateEditListingPage.removeImage(${index})">
                            <i class="bi bi-x"></i>
                        </button>
                        ${index === 0 ? '<span class="badge bg-primary position-absolute bottom-0 start-0 m-1">Main</span>' : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadData() {
        try {
            this.isLoading = true;

            const { CategoryService, ListingService } = await import('../services/api.js');

            // Load categories
            const categoriesData = await CategoryService.getCategories();
            this.categories = categoriesData.content || categoriesData || [];

            // If editing, load existing listing
            if (this.isEditing) {
                this.listing = await ListingService.getListing(this.listingId);
                if (this.listing && this.listing.images) {
                    this.uploadedImages = this.listing.images.map(url => ({
                        file: null,
                        preview: url,
                        existing: true
                    }));
                }
            }

        } catch (error) {
            console.error('Failed to load data:', error);
            const { globalState } = window;
            globalState.addNotification({
                type: 'error',
                title: 'Loading Failed',
                message: 'Failed to load form data. Please try again.'
            });
        } finally {
            this.isLoading = false;
        }
    }

    attachEventListeners() {
        const form = document.getElementById('listing-form');
        const listingTypeSelect = document.getElementById('listingType');
        const imageInput = document.getElementById('image-input');
        const imageUploadArea = document.getElementById('image-upload-area');

        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        if (listingTypeSelect) {
            listingTypeSelect.addEventListener('change', (e) => this.handleTypeChange(e.target.value));
        }

        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageSelect(e.target.files));
        }

        // Drag and drop for images
        if (imageUploadArea) {
            imageUploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                imageUploadArea.classList.add('border-primary');
            });

            imageUploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                imageUploadArea.classList.remove('border-primary');
            });

            imageUploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                imageUploadArea.classList.remove('border-primary');
                const files = e.dataTransfer.files;
                this.handleImageSelect(files);
            });
        }
    }

    handleTypeChange(type) {
        const priceTypeText = document.getElementById('price-type-text');
        const lendingOptions = document.getElementById('lending-options');

        if (priceTypeText) {
            priceTypeText.textContent = type === 'LEND' ? 'per day' : '';
        }

        if (lendingOptions) {
            lendingOptions.style.display = type === 'LEND' ? 'block' : 'none';
        }
    }

    handleImageSelect(files) {
        const maxFiles = 5;
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

        for (let file of files) {
            if (this.uploadedImages.length >= maxFiles) {
                const { globalState } = window;
                globalState.addNotification({
                    type: 'warning',
                    title: 'Too Many Images',
                    message: `Maximum ${maxFiles} images allowed.`
                });
                break;
            }

            if (!allowedTypes.includes(file.type)) {
                const { globalState } = window;
                globalState.addNotification({
                    type: 'error',
                    title: 'Invalid File Type',
                    message: 'Only JPG, PNG, and GIF images are allowed.'
                });
                continue;
            }

            if (file.size > maxSize) {
                const { globalState } = window;
                globalState.addNotification({
                    type: 'error',
                    title: 'File Too Large',
                    message: 'Image size must be less than 5MB.'
                });
                continue;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.uploadedImages.push({
                    file: file,
                    preview: e.target.result,
                    existing: false
                });
                this.updateImagePreviews();
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage(index) {
        this.uploadedImages.splice(index, 1);
        this.updateImagePreviews();
    }

    updateImagePreviews() {
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            imagePreview.innerHTML = this.renderImagePreviews();
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const formData = new FormData(event.target);
        const { globalState } = window;

        // Comprehensive validation
        const { ValidationUtils } = await import('../utils/validation.js');

        // Build form data object
        const formDataObj = {
            title: formData.get('title')?.trim(),
            description: formData.get('description')?.trim(),
            categoryId: formData.get('category'),
            listingType: formData.get('listingType'),
            condition: formData.get('condition'),
            listPrice: formData.get('listPrice'),
            availableFrom: formData.get('availableFrom') || null,
            availableUntil: formData.get('availableUntil') || null,
            pickupAvailable: formData.get('pickupAvailable') === 'on',
            deliveryAvailable: formData.get('deliveryAvailable') === 'on'
        };

        // Validation rules
        const validationRules = {
            title: { type: 'title', maxLength: 200 },
            description: { type: 'description', maxLength: 5000 },
            categoryId: { type: 'required', label: 'Category' },
            listingType: { type: 'required', label: 'Listing type' },
            condition: { type: 'required', label: 'Condition' },
            listPrice: { type: 'price', min: 0, max: 10000 },
            availableFrom: { type: 'date', allowPast: false },
            availableUntil: { type: 'date', allowPast: false }
        };

        // Add custom validation for lending dates
        if (formDataObj.listingType === 'LEND') {
            validationRules.availableFrom = { type: 'required', label: 'Available from date' };
            validationRules.availableUntil = { type: 'required', label: 'Available until date' };

            // Custom validator for date range
            validationRules.dateRange = {
                type: 'custom',
                validator: (value, formData) => {
                    if (!formData.availableFrom || !formData.availableUntil) {
                        return { valid: true }; // Already validated as required
                    }

                    const fromDate = new Date(formData.availableFrom);
                    const toDate = new Date(formData.availableUntil);

                    if (toDate <= fromDate) {
                        return { valid: false, message: 'Available until date must be after available from date' };
                    }

                    return { valid: true };
                }
            };
        }

        const validation = ValidationUtils.validateForm(formDataObj, validationRules);

        if (!validation.isValid) {
            // Show first error as notification
            const firstError = Object.values(validation.errors)[0];
            globalState.addNotification({
                type: 'error',
                title: 'Validation Error',
                message: firstError
            });
            return;
        }

        this.setLoading(true);

        try {
            const { ListingService } = await import('../services/api.js');

            // Prepare listing data
            const listingData = {
                title: title,
                description: description,
                categoryId: parseInt(categoryId),
                listingType: listingType,
                condition: condition,
                listPrice: listPrice,
                pickupAvailable: formData.get('pickupAvailable') === 'on',
                deliveryAvailable: formData.get('deliveryAvailable') === 'on'
            };

            // Add lending-specific fields
            if (listingType === 'LEND') {
                const availableFrom = formData.get('availableFrom');
                const availableUntil = formData.get('availableUntil');

                if (availableFrom) listingData.availableFrom = availableFrom;
                if (availableUntil) listingData.availableUntil = availableUntil;
            }

            // Handle images (in a real implementation, you'd upload them first)
            if (this.uploadedImages.length > 0) {
                // For now, just include image URLs if they exist
                listingData.images = this.uploadedImages
                    .filter(img => img.existing)
                    .map(img => img.preview);
            }

            let response;
            if (this.isEditing) {
                response = await ListingService.updateListing(this.listingId, listingData);
                globalState.addNotification({
                    type: 'success',
                    title: 'Listing Updated',
                    message: 'Your listing has been updated successfully!'
                });
            } else {
                response = await ListingService.createListing(listingData);
                globalState.addNotification({
                    type: 'success',
                    title: 'Listing Created',
                    message: 'Your listing has been created successfully!'
                });
            }

            // Navigate back to my listings
            window.App.router.navigate('/my-listings');

        } catch (error) {
            globalState.addNotification({
                type: 'error',
                title: 'Submission Failed',
                message: error.message || 'Failed to save listing. Please try again.'
            });
        } finally {
            this.setLoading(false);
        }
    }

    cancel() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            window.App.router.navigate('/my-listings');
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        const submitBtn = document.getElementById('submit-btn');

        if (submitBtn) {
            submitBtn.disabled = loading;
            submitBtn.innerHTML = loading ?
                '<span class="spinner-border spinner-border-sm me-2"></span>Saving...' :
                `<i class="bi bi-${this.isEditing ? 'check-lg' : 'plus-lg'} me-2"></i>${this.isEditing ? 'Update Listing' : 'Create Listing'}`;
        }
    }

    formatDateForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }
}