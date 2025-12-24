// Login Page Component
export class LoginPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.isLoading = false;
        this.formComponent = null;
    }

    render() {
        if (!this.container) return;

        // Create form component
        const { FormComponent } = window;
        this.formComponent = FormComponent.createLoginForm(
            (event) => this.handleSubmit(event),
            this.isLoading
        );

        this.container.innerHTML = `
            <div class="container py-5">
                <div class="row justify-content-center">
                    <div class="col-md-6 col-lg-5">
                        <div class="card shadow-custom">
                            <div class="card-body p-4 p-md-5">
                                <div class="text-center mb-4">
                                    <h2 class="card-title mb-2">Welcome Back</h2>
                                    <p class="text-muted">Sign in to your CampusCircle account</p>
                                </div>

                                <div id="login-error" class="alert alert-danger" style="display: none;" role="alert"></div>

                                ${this.formComponent.render()}

                                <div class="text-center mt-4">
                                    <p class="mb-0">
                                        Don't have an account?
                                        <a href="#" onclick="window.App.router.navigate('/register')" class="text-decoration-none">
                                            Create one here
                                        </a>
                                    </p>
                                </div>

                                <hr class="my-4">

                                <div class="text-center">
                                    <small class="text-muted">
                                        By signing in, you agree to our Terms of Service and Privacy Policy
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
                console.warn('⚠️ Login: Submit button not found');
            }
        } else {
            console.error('❌ Login: Form element not found for event listeners');
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
            console.error('❌ Login: Could not find form element!');
            this.showError('Form not found. Please refresh the page and try again.');
            return;
        }

        // Get form data using the form component
        const formData = this.formComponent.getFormData(formElement);
        const email = formData.email;
        const password = formData.password;

        // Client-side validation
        const { AuthService } = await import('../services/authService.js');
        const { ValidationUtils } = await import('../utils/validation.js');
        const { globalState } = window;

        // Clear previous errors
        this.formComponent.clearErrors();
        this.hideError();

        // Comprehensive validation
        const validationRules = {
            email: { type: 'email', requireVinUni: true },
            password: { type: 'required', label: 'Password' }
        };

        const validation = ValidationUtils.validateForm({ email, password }, validationRules);

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
            const response = await AuthService.login(email, password);

            console.log('✅ Login successful for user:', response.user.email);

            // Show success notification
            globalState.addNotification({
                type: 'success',
                title: 'Login Successful',
                message: `Welcome back, ${response.user.fullName || response.user.email}!`
            });

            // Redirect based on role
            if (response.user.role === 'admin') {
                window.App.router.navigate('/admin');
            } else {
                window.App.router.navigate('/');
            }
        } catch (error) {
            console.error('❌ Login failed:', error.message);
            this.showError(error.message || 'Login failed. Please check your credentials and try again.');
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
                // Re-attach listeners after re-rendering
                setTimeout(() => {
                    this.attachEventListeners();
                }, 50);
            }
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    hideError() {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
}