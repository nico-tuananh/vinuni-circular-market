// Register Page Component
export class RegisterPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.isLoading = false;
        this.formComponent = null;
    }

    render() {
        if (!this.container) return;

        // Create form component
        const { FormComponent } = window;
        this.formComponent = FormComponent.createRegisterForm(
            (event) => this.handleSubmit(event),
            this.isLoading
        );

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
        if (form) {
            // Remove any existing listeners by cloning the form
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);

            // Attach submit listener
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleSubmit(e);
            }, true);

            // Also attach click listener to button as backup
            const submitButton = newForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    newForm.dispatchEvent(submitEvent);
                }, true);
            } else {
                console.warn('⚠️ Register: Submit button not found');
            }
        } else {
            console.error('❌ Register: Form element not found for event listeners');
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.isLoading) {
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

        if (!formElement) {
            console.error('❌ Register: Could not find form element!');
            this.showError('Form not found. Please refresh the page and try again.');
            return;
        }

        // Get form data using the form component
        const formData = this.formComponent.getFormData(formElement);

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

        const validation = ValidationUtils.validateForm(formData, validationRules);

        if (!validation.isValid) {
            // Set field-specific errors
            Object.entries(validation.errors).forEach(([field, message]) => {
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

            await AuthService.register(registerData);
            console.log('✅ Registration successful for user:', formData.email);

            // Show success notification
            globalState.addNotification({
                type: 'success',
                title: 'Registration Successful',
                message: 'Your account has been created! Please sign in to get started.'
            });

            window.App.router.navigate('/login');
        } catch (error) {
            console.error('❌ Registration failed:', error.message);
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