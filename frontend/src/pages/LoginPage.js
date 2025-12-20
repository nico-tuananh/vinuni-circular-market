// Login Page Component
export class LoginPage {
    constructor() {
        this.container = document.getElementById('main-content');
        this.isLoading = false;
        this.formComponent = null;
    }

    render() {
        if (!this.container) return;

        console.log('🎨 Rendering LoginPage...');

        // Create form component
        const { FormComponent } = window;
        console.log('📝 FormComponent available:', !!FormComponent);
        this.formComponent = FormComponent.createLoginForm(
            (event) => this.handleSubmit(event),
            this.isLoading
        );
        console.log('✅ Login form created:', !!this.formComponent);

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
        console.log('🔗 Login: Attaching form submit listener to:', form);
        if (form) {
            // Remove any existing listeners by cloning the form
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);

            console.log('🔗 Login: Form cloned and replaced, attaching listeners');

            // Attach submit listener
            newForm.addEventListener('submit', (e) => {
                console.log('🎯 Login: Form submit event triggered');
                e.preventDefault();
                e.stopPropagation();
                this.handleSubmit(e);
            }, true);

            // Also attach click listener to button as backup
            const submitButton = newForm.querySelector('button[type="submit"]');
            if (submitButton) {
                console.log('🔗 Login: Found submit button, attaching click listener');
                submitButton.addEventListener('click', (e) => {
                    console.log('🔘 Login: Submit button clicked directly');
                    e.preventDefault();
                    e.stopPropagation();
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    newForm.dispatchEvent(submitEvent);
                }, true);
            } else {
                console.warn('⚠️ Login: Submit button not found');
            }

            console.log('✅ Login: Event listeners attached successfully');
        } else {
            console.error('❌ Login: Form element not found for event listeners');
        }
    }

    async handleSubmit(event) {
        console.log('🎯 LoginPage: handleSubmit called with event:', event);
        event.preventDefault();

        if (this.isLoading) {
            console.log('⚠️ LoginPage: Form is loading, ignoring submit');
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
        
        console.log('📝 Login: Form element found:', formElement);
        console.log('📝 Login: FormComponent available:', !!this.formComponent);

        if (!formElement) {
            console.error('❌ Login: Could not find form element!');
            this.showError('Form not found. Please refresh the page and try again.');
            return;
        }

        // Get form data using the form component
        console.log('📝 Login: Extracting form data from form element');
        const formData = this.formComponent.getFormData(formElement);
        const email = formData.email;
        const password = formData.password;
        console.log('📋 Login: Extracted form data keys:', Object.keys(formData));
        console.log('📋 Login: Extracted form data:', { email: email ? 'present' : 'empty', password: password ? 'present' : 'empty' });

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

        console.log('🔍 Login: Starting validation with rules:', Object.keys(validationRules));
        console.log('🔍 Login: Form data values:', { email: email || 'empty', password: password ? '***' : 'empty' });
        const validation = ValidationUtils.validateForm({ email, password }, validationRules);
        console.log('🔍 Login: Validation result - isValid:', validation.isValid);
        console.log('🔍 Login: Validation errors:', validation.errors);

        if (!validation.isValid) {
            console.warn('❌ Login: Validation failed, errors:', validation.errors);
            // Set field-specific errors
            Object.entries(validation.errors).forEach(([field, message]) => {
                console.log(`❌ Login: Setting error for field ${field}: ${message}`);
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

        console.log('✅ Login: Validation passed, proceeding with login');

        this.setLoading(true);
        globalState.setLoading(true);

        try {
            const response = await AuthService.login(email, password);

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