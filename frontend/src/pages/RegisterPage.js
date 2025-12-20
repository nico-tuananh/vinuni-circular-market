// Register Page Component
export class RegisterPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.isLoading = false;
        this.formComponent = null;
    }

    render() {
        if (!this.container) return;

        console.log('🎨 Rendering RegisterPage...');

        // Create form component
        const { FormComponent } = window;
        console.log('📝 FormComponent available:', !!FormComponent);
        this.formComponent = FormComponent.createRegisterForm(
            (event) => this.handleSubmit(event),
            this.isLoading
        );
        console.log('✅ Register form created:', !!this.formComponent);

        this.container.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-md-10 col-lg-8">
                        <div class="card shadow-custom">
                            <div class="card-body p-4 p-md-5">
                                <div class="text-center mb-4">
                                    <h2 class="card-title mb-2">Join CampusCircle</h2>
                                    <p class="text-muted">
                                        Create your account to start buying, selling, and sharing sustainably
                                    </p>
                                </div>

                                <div id="register-error" class="alert alert-danger" style="display: none;" role="alert"></div>

                                ${this.formComponent.render()}

                                <div class="text-center mt-4">
                                    <p class="mb-0">
                                        Already have an account?
                                        <a href="#" onclick="window.App.router.navigate('/login')" class="text-decoration-none">
                                            Sign in here
                                        </a>
                                    </p>
                                </div>

                                <hr class="my-4">

                                <div class="text-center">
                                    <small class="text-muted">
                                        By creating an account, you agree to our Terms of Service and Privacy Policy
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Wait a bit for DOM to be ready, then attach listeners
        setTimeout(() => {
            this.attachEventListeners();
        }, 50);
    }

    attachEventListeners() {
        const form = document.querySelector('#main-content form');
        console.log('🔗 Register: Attaching form submit listener to:', form);
        if (form) {
            // Remove any existing listeners by cloning the form
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);

            console.log('🔗 Register: Form cloned and replaced, attaching listeners');

            // Attach submit listener
            newForm.addEventListener('submit', (e) => {
                console.log('🎯 Register: Form submit event triggered');
                e.preventDefault();
                e.stopPropagation();
                this.handleSubmit(e);
            }, true);

            // Also attach click listener to button as backup
            const submitButton = newForm.querySelector('button[type="submit"]');
            if (submitButton) {
                console.log('🔗 Register: Found submit button, attaching click listener');
                submitButton.addEventListener('click', (e) => {
                    console.log('🔘 Register: Submit button clicked directly');
                    e.preventDefault();
                    e.stopPropagation();
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    newForm.dispatchEvent(submitEvent);
                }, true);
            } else {
                console.warn('⚠️ Register: Submit button not found');
            }

            console.log('✅ Register: Event listeners attached successfully');
        } else {
            console.error('❌ Register: Form element not found for event listeners');
        }
    }

    async handleSubmit(event) {
        console.log('🎯 RegisterPage: handleSubmit called with event:', event);
        console.log('🎯 RegisterPage: event.target:', event.target);
        console.log('🎯 RegisterPage: event.currentTarget:', event.currentTarget);
        event.preventDefault();

        if (this.isLoading) {
            console.log('⚠️ RegisterPage: Form is loading, ignoring submit');
            return;
        }

        // Get the form element - try multiple ways
        let formElement = event.target;
        if (!formElement || formElement.tagName !== 'FORM') {
            formElement = event.currentTarget;
        }
        if (!formElement || formElement.tagName !== 'FORM') {
            formElement = document.querySelector('#main-content form');
        }
        
        console.log('📝 Register: Form element found:', formElement);
        console.log('📝 Register: FormComponent available:', !!this.formComponent);

        if (!formElement) {
            console.error('❌ Register: Could not find form element!');
            this.showError('Form not found. Please refresh the page and try again.');
            return;
        }

        // Get form data using the form component
        console.log('📝 Register: Extracting form data from form element');
        const formData = this.formComponent.getFormData(formElement);
        console.log('📋 Register: Extracted form data keys:', Object.keys(formData));
        console.log('📋 Register: Extracted form data:', Object.keys(formData).reduce((acc, key) => {
            acc[key] = key === 'password' || key === 'confirmPassword' ? '***' : formData[key];
            return acc;
        }, {}));

        // Client-side validation
        const { AuthService } = await import('../services/authService.js');
        const { ValidationUtils } = await import('../utils/validation.js');
        const { globalState } = window;

        // Clear previous errors
        this.formComponent.clearErrors();
        this.hideError();

        // Comprehensive validation rules
        const validationRules = {
            fullName: { type: 'fullName' },
            email: { type: 'email', requireVinUni: true },
            password: { type: 'password' },
            confirmPassword: { type: 'confirmPassword', compareField: 'password' },
            phone: { type: 'phone' },
            address: { type: 'address' }
        };

        console.log('🔍 Register: Starting validation with rules:', Object.keys(validationRules));
        const validation = ValidationUtils.validateForm(formData, validationRules);
        console.log('🔍 Register: Validation result - isValid:', validation.isValid);
        console.log('🔍 Register: Validation errors:', validation.errors);

        if (!validation.isValid) {
            console.warn('❌ Register: Validation failed, errors:', validation.errors);
            // Set field-specific errors
            Object.entries(validation.errors).forEach(([field, message]) => {
                console.log(`❌ Register: Setting error for field ${field}: ${message}`);
                this.formComponent.setFieldError(field, message);
            });
            // Re-render form to show errors
            const formContainer = document.querySelector('.card-body form');
            if (formContainer && this.formComponent) {
                const newFormHtml = this.formComponent.render();
                formContainer.outerHTML = newFormHtml;
                this.attachEventListeners();
            }
            return;
        }

        console.log('✅ Register: Validation passed, proceeding with registration');

        this.setLoading(true);
        globalState.setLoading(true);

        try {
            const registerData = {
                fullName: formData.fullName.trim(),
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                phone: formData.phone || null,
                address: formData.address || null
            };

            console.log('🚀 Register: Making API call...');
            await AuthService.register(registerData);
            console.log('✅ Register: API call successful');

            // Show success notification
            globalState.addNotification({
                type: 'success',
                title: 'Registration Successful',
                message: 'Your account has been created! Please sign in to get started.'
            });

            window.App.router.navigate('/login');
        } catch (error) {
            console.error('❌ Register: Registration failed:', error);
            this.showError(error.message || 'Registration failed. Please try again.');
        } finally {
            this.setLoading(false);
            globalState.setLoading(false);
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        // Re-render the form with updated loading state
        if (this.formComponent) {
            this.formComponent.loading = loading;
            const formContainer = document.querySelector('.card-body form');
            if (formContainer) {
                const newFormHtml = this.formComponent.render();
                formContainer.outerHTML = newFormHtml;
                this.attachEventListeners();
            }
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('register-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    hideError() {
        const errorDiv = document.getElementById('register-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

}