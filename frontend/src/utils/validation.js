// Comprehensive validation utilities for frontend testing
export class ValidationUtils {

    // Email validation with VinUni domain check
    static validateEmail(email, requireVinUni = false) {
        if (!email || typeof email !== 'string') {
            return { valid: false, message: 'Email is required' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }

        if (requireVinUni && !email.endsWith('@vinuni.edu.vn')) {
            return { valid: false, message: 'Only @vinuni.edu.vn emails are accepted' };
        }

        return { valid: true };
    }

    // Password validation
    static validatePassword(password, minLength = 6) {
        if (!password || typeof password !== 'string') {
            return { valid: false, message: 'Password is required' };
        }

        if (password.length < minLength) {
            return { valid: false, message: `Password must be at least ${minLength} characters long` };
        }

        // Check for basic complexity
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            return {
                valid: false,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            };
        }

        return { valid: true };
    }

    // Confirm password validation
    static validateConfirmPassword(password, confirmPassword) {
        if (!confirmPassword) {
            return { valid: false, message: 'Please confirm your password' };
        }

        if (password !== confirmPassword) {
            return { valid: false, message: 'Passwords do not match' };
        }

        return { valid: true };
    }

    // Full name validation
    static validateFullName(fullName) {
        if (!fullName || typeof fullName !== 'string') {
            return { valid: false, message: 'Full name is required' };
        }

        const trimmed = fullName.trim();
        if (trimmed.length < 2) {
            return { valid: false, message: 'Full name must be at least 2 characters long' };
        }

        if (trimmed.length > 100) {
            return { valid: false, message: 'Full name must not exceed 100 characters' };
        }

        // Check for valid characters (letters including international/unicode, spaces, hyphens, apostrophes)
        // Allow Unicode letter characters to support international names (Vietnamese, Chinese, etc.)
        const nameRegex = /^[\p{L}\s\-']+$/u;
        if (!nameRegex.test(trimmed)) {
            return { valid: false, message: 'Full name contains invalid characters' };
        }

        return { valid: true };
    }

    // Phone number validation
    static validatePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return { valid: true }; // Phone is optional
        }

        // Remove common formatting characters
        const cleaned = phone.replace(/[\s\-().]/g, '');
        
        // More flexible regex: allows + prefix, allows starting with 0 (common in many countries),
        // and validates length between 7-15 digits (international standard)
        const phoneRegex = /^[+]?[0-9]{7,15}$/;
        if (!phoneRegex.test(cleaned)) {
            return { valid: false, message: 'Please enter a valid phone number (7-15 digits)' };
        }

        return { valid: true };
    }

    // Price validation
    static validatePrice(price, min = 0, max = 10000) {
        if (price === null || price === undefined || price === '') {
            return { valid: false, message: 'Price is required' };
        }

        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) {
            return { valid: false, message: 'Please enter a valid price' };
        }

        if (numPrice < min) {
            return { valid: false, message: `Price must be at least ${min}` };
        }

        if (numPrice > max) {
            return { valid: false, message: `Price must not exceed ${max}` };
        }

        // Check decimal places (max 2) - use string-based check to avoid floating point precision issues
        const priceStr = numPrice.toString();
        const decimalParts = priceStr.split('.');
        if (decimalParts.length > 1 && decimalParts[1].length > 2) {
            return { valid: false, message: 'Price can have at most 2 decimal places' };
        }

        return { valid: true };
    }

    // Rating validation
    static validateRating(rating) {
        if (rating === null || rating === undefined) {
            return { valid: false, message: 'Rating is required' };
        }

        const numRating = parseFloat(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
            return { valid: false, message: 'Rating must be between 1 and 5' };
        }

        return { valid: true };
    }

    // Title validation
    static validateTitle(title, maxLength = 200) {
        if (!title || typeof title !== 'string') {
            return { valid: false, message: 'Title is required' };
        }

        const trimmed = title.trim();
        if (trimmed.length < 3) {
            return { valid: false, message: 'Title must be at least 3 characters long' };
        }

        if (trimmed.length > maxLength) {
            return { valid: false, message: `Title must not exceed ${maxLength} characters` };
        }

        return { valid: true };
    }

    // Description validation
    static validateDescription(description, maxLength = 5000) {
        if (!description || typeof description !== 'string') {
            return { valid: false, message: 'Description is required' };
        }

        const trimmed = description.trim();
        if (trimmed.length < 10) {
            return { valid: false, message: 'Description must be at least 10 characters long' };
        }

        if (trimmed.length > maxLength) {
            return { valid: false, message: `Description must not exceed ${maxLength} characters` };
        }

        return { valid: true };
    }

    // Address validation
    static validateAddress(address) {
        if (!address || typeof address !== 'string') {
            return { valid: true }; // Address is optional
        }

        const trimmed = address.trim();
        if (trimmed.length > 200) {
            return { valid: false, message: 'Address must not exceed 200 characters' };
        }

        return { valid: true };
    }

    // Date validation
    static validateDate(dateString, allowPast = true) {
        if (!dateString) {
            return { valid: true }; // Date is optional
        }

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return { valid: false, message: 'Please enter a valid date' };
        }

        if (!allowPast && date < new Date()) {
            return { valid: false, message: 'Date cannot be in the past' };
        }

        return { valid: true };
    }

    // URL validation
    static validateUrl(url) {
        if (!url || typeof url !== 'string') {
            return { valid: true }; // URL is optional
        }

        try {
            new URL(url);
            return { valid: true };
        } catch {
            return { valid: false, message: 'Please enter a valid URL' };
        }
    }

    // Sanitize input for XSS protection
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .trim();
    }

    // Validate form data comprehensively
    static validateForm(formData, rules) {
        const errors = {};
        let isValid = true;

        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            let result = { valid: true };

            switch (rule.type) {
                case 'email':
                    result = this.validateEmail(value, rule.requireVinUni);
                    break;
                case 'password':
                    result = this.validatePassword(value, rule.minLength);
                    break;
                case 'confirmPassword':
                    result = this.validateConfirmPassword(formData[rule.compareField], value);
                    break;
                case 'fullName':
                    result = this.validateFullName(value);
                    break;
                case 'phone':
                    result = this.validatePhone(value);
                    break;
                case 'price':
                    result = this.validatePrice(value, rule.min, rule.max);
                    break;
                case 'rating':
                    result = this.validateRating(value);
                    break;
                case 'title':
                    result = this.validateTitle(value, rule.maxLength);
                    break;
                case 'description':
                    result = this.validateDescription(value, rule.maxLength);
                    break;
                case 'address':
                    result = this.validateAddress(value);
                    break;
                case 'date':
                    result = this.validateDate(value, rule.allowPast);
                    break;
                case 'url':
                    result = this.validateUrl(value);
                    break;
                case 'required':
                    if (!value || (typeof value === 'string' && value.trim() === '')) {
                        result = { valid: false, message: `${rule.label || field} is required` };
                    }
                    break;
                case 'custom':
                    if (rule.validator) {
                        result = rule.validator(value, formData);
                    }
                    break;
            }

            if (!result.valid) {
                errors[field] = result.message;
                isValid = false;
            }
        }

        return { isValid, errors };
    }
}