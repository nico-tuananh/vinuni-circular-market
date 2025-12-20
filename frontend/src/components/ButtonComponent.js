// Button Component - Reusable button with consistent styling
export class ButtonComponent {
    constructor(options = {}) {
        this.text = options.text || '';
        this.type = options.type || 'button';
        this.variant = options.variant || 'primary'; // primary, secondary, outline-primary, outline-secondary, danger
        this.size = options.size || 'md'; // sm, md, lg
        this.disabled = options.disabled || false;
        this.loading = options.loading || false;
        this.onClick = options.onClick || null;
        this.classes = options.classes || '';
        this.icon = options.icon || null; // Bootstrap icon class
        this.fullWidth = options.fullWidth || false;
    }

    render() {
        const baseClasses = ['btn'];
        const sizeClasses = {
            sm: 'btn-sm',
            md: '',
            lg: 'btn-lg'
        };
        const variantClasses = {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            'outline-primary': 'btn-outline-primary',
            'outline-secondary': 'btn-outline-secondary',
            danger: 'btn-danger',
            success: 'btn-success'
        };

        baseClasses.push(variantClasses[this.variant] || 'btn-primary');
        baseClasses.push(sizeClasses[this.size] || '');

        if (this.fullWidth) {
            baseClasses.push('w-100');
        }

        if (this.classes) {
            baseClasses.push(this.classes);
        }

        const isDisabled = this.disabled || this.loading;
        const buttonClasses = baseClasses.join(' ');

        let buttonContent = '';
        if (this.loading) {
            buttonContent = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
            `;
        } else {
            buttonContent = this.icon ? `<i class="bi ${this.icon} me-2"></i>${this.text}` : this.text;
        }

        return `
            <button
                type="${this.type}"
                class="${buttonClasses}"
                ${isDisabled ? 'disabled' : ''}
                ${this.onClick ? `onclick="${this.onClick}"` : ''}
            >
                ${buttonContent}
            </button>
        `;
    }

    // Static method to create common button types
    static primary(text, options = {}) {
        return new ButtonComponent({ ...options, text, variant: 'primary' });
    }

    static secondary(text, options = {}) {
        return new ButtonComponent({ ...options, text, variant: 'secondary' });
    }

    static outlinePrimary(text, options = {}) {
        return new ButtonComponent({ ...options, text, variant: 'outline-primary' });
    }

    static danger(text, options = {}) {
        return new ButtonComponent({ ...options, text, variant: 'danger' });
    }

    static loading(text = 'Loading...', options = {}) {
        return new ButtonComponent({ ...options, text, loading: true, disabled: true });
    }
}
