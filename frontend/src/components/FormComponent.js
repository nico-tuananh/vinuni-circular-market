// Form Component - Reusable form with validation
export class FormComponent {
    constructor(options = {}) {
        this.fields = options.fields || [];
        this.onSubmit = options.onSubmit || null;
        this.submitButtonText = options.submitButtonText || 'Submit';
        this.submitButtonVariant = options.submitButtonVariant || 'primary';
        this.showCancelButton = options.showCancelButton || false;
        this.cancelButtonText = options.cancelButtonText || 'Cancel';
        this.onCancel = options.onCancel || null;
        this.loading = options.loading || false;
        this.classes = options.classes || '';
    }

    render() {
        const formClasses = `needs-validation ${this.classes}`;
        const formId = `form-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        let formHtml = `<form class="${formClasses}" novalidate id="${formId}">`;

        // Render fields
        this.fields.forEach(field => {
            formHtml += this.renderField(field);
        });

        // Render buttons
        formHtml += this.renderButtons();

        formHtml += '</form>';

        // Only attach listeners if no external onSubmit handler is provided
        // (Let parent components like LoginPage/RegisterPage handle their own listeners)
        if (!this.onSubmit) {
            console.log('ℹ️ FormComponent: No onSubmit callback provided, attaching internal listeners');
            // This is for standalone forms that don't have external handlers
            // For now, just log that we would attach listeners here
        } else {
            console.log('ℹ️ FormComponent: onSubmit callback provided, letting parent component handle listeners');
        }

        return formHtml;
    }

    renderField(field) {
        const {
            name,
            label,
            type = 'text',
            placeholder = '',
            required = false,
            value = '',
            options = [],
            helpText = '',
            errorMessage = '',
            classes = '',
            attributes = {}
        } = field;

        const fieldId = `field-${name}`;
        const isInvalid = errorMessage !== '';
        const fieldClasses = `form-control ${isInvalid ? 'is-invalid' : ''} ${classes}`;

        let fieldHtml = `
            <div class="mb-3">
                ${label ? `<label for="${fieldId}" class="form-label">${label}${required ? ' *' : ''}</label>` : ''}
        `;

        // Render different input types
        switch (type) {
            case 'select':
                fieldHtml += `
                    <select class="${fieldClasses}" id="${fieldId}" name="${name}" ${required ? 'required' : ''} ${this.buildAttributes(attributes)}>
                        <option value="">${placeholder || 'Select an option'}</option>
                        ${options.map(option => `<option value="${option.value}" ${option.value === value ? 'selected' : ''}>${option.label}</option>`).join('')}
                    </select>
                `;
                break;

            case 'textarea':
                fieldHtml += `
                    <textarea class="${fieldClasses}" id="${fieldId}" name="${name}" rows="3" placeholder="${placeholder}" ${required ? 'required' : ''} ${this.buildAttributes(attributes)}>${value}</textarea>
                `;
                break;

            case 'checkbox':
                fieldHtml += `
                    <div class="form-check">
                        <input class="form-check-input ${isInvalid ? 'is-invalid' : ''}" type="checkbox" id="${fieldId}" name="${name}" ${value ? 'checked' : ''} ${this.buildAttributes(attributes)}>
                        <label class="form-check-label" for="${fieldId}">
                            ${label}${required ? ' *' : ''}
                        </label>
                    </div>
                `;
                break;

            default:
                fieldHtml += `
                    <input
                        type="${type}"
                        class="${fieldClasses}"
                        id="${fieldId}"
                        name="${name}"
                        placeholder="${placeholder}"
                        value="${value}"
                        ${required ? 'required' : ''}
                        ${this.buildAttributes(attributes)}
                    />
                `;
        }

        // Add help text
        if (helpText) {
            fieldHtml += `<div class="form-text">${helpText}</div>`;
        }

        // Add error message
        if (isInvalid) {
            fieldHtml += `<div class="invalid-feedback">${errorMessage}</div>`;
        }

        fieldHtml += '</div>';
        return fieldHtml;
    }

    renderButtons() {
        let buttonsHtml = '<div class="d-flex gap-2 justify-content-end mt-4">';

        if (this.showCancelButton) {
            buttonsHtml += `
                <button type="button" class="btn btn-outline-secondary" onclick="${this.onCancel || 'history.back()'}">
                    ${this.cancelButtonText}
                </button>
            `;
        }

        const submitButton = this.loading ?
            `<button type="submit" class="btn btn-${this.submitButtonVariant}" disabled>
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
            </button>` :
            `<button type="submit" class="btn btn-${this.submitButtonVariant}">
                ${this.submitButtonText}
            </button>`;

        buttonsHtml += submitButton;
        buttonsHtml += '</div>';

        return buttonsHtml;
    }

    buildAttributes(attributes) {
        return Object.entries(attributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
    }

    // Method to update field errors
    setFieldError(fieldName, errorMessage) {
        const field = this.fields.find(f => f.name === fieldName);
        if (field) {
            field.errorMessage = errorMessage;
        }
    }

    // Method to clear all errors
    clearErrors() {
        this.fields.forEach(field => {
            field.errorMessage = '';
        });
    }

    // Method to get form data
    getFormData(formElement) {
        const formData = new FormData(formElement);
        const data = {};

        this.fields.forEach(field => {
            if (field.type === 'checkbox') {
                data[field.name] = formElement.querySelector(`#field-${field.name}`).checked;
            } else {
                data[field.name] = formData.get(field.name) || '';
            }
        });

        return data;
    }

    // Static method to create login form
    static createLoginForm(onSubmit, loading = false) {
        return new FormComponent({
            fields: [
                {
                    name: 'email',
                    label: 'VinUni Email',
                    type: 'email',
                    placeholder: 'your.email@vinuni.edu.vn',
                    required: true,
                    helpText: 'Only @vinuni.edu.vn emails are accepted'
                },
                {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    required: true
                }
            ],
            onSubmit,
            submitButtonText: 'Login',
            loading
        });
    }

    // Static method to create register form
    static createRegisterForm(onSubmit, loading = false) {
        return new FormComponent({
            fields: [
                {
                    name: 'fullName',
                    label: 'Full Name',
                    type: 'text',
                    required: true
                },
                {
                    name: 'email',
                    label: 'VinUni Email',
                    type: 'email',
                    placeholder: 'your.email@vinuni.edu.vn',
                    required: true,
                    helpText: 'Only @vinuni.edu.vn emails are accepted'
                },
                {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    required: true,
                    helpText: 'Minimum 6 characters'
                },
                {
                    name: 'confirmPassword',
                    label: 'Confirm Password',
                    type: 'password',
                    required: true
                },
                {
                    name: 'phone',
                    label: 'Phone Number',
                    type: 'tel'
                },
                {
                    name: 'address',
                    label: 'Address',
                    type: 'text',
                    placeholder: 'Dorm room, building, etc.'
                }
            ],
            onSubmit,
            submitButtonText: 'Create Account',
            loading
        });
    }
}
