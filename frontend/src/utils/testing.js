// Comprehensive testing utilities for frontend integration and e2e testing
export class TestingUtils {

    // Simulate user login for testing
    static async simulateLogin(email = 'test@vinuni.edu.vn', password = 'password123') {
        const { AuthService } = await import('../services/authService.js');

        try {
            const response = await AuthService.login(email, password);
            if (window.globalState) {
                window.globalState.login(response.user);
            }
            return { success: true, user: response.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Simulate user registration for testing
    static async simulateRegistration(userData = {}) {
        const defaultData = {
            fullName: 'Test User',
            email: `test${Date.now()}@vinuni.edu.vn`,
            password: 'password123',
            phone: '+1234567890',
            address: 'Test Address'
        };

        const data = { ...defaultData, ...userData };
        const { AuthService } = await import('../services/authService.js');

        try {
            const response = await AuthService.register(data);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Simulate navigation for testing
    static simulateNavigation(path) {
        if (window.App && window.App.router) {
            window.App.router.navigate(path);
            return true;
        }
        return false;
    }

    // Wait for element to appear (useful for async operations)
    static async waitForElement(selector, timeout = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
            await this.delay(100);
        }

        throw new Error(`Element ${selector} not found within ${timeout}ms`);
    }

    // Wait for element to disappear
    static async waitForElementToDisappear(selector, timeout = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (!element) {
                return true;
            }
            await this.delay(100);
        }

        throw new Error(`Element ${selector} still visible after ${timeout}ms`);
    }

    // Check if user is authenticated
    static isUserAuthenticated() {
        return window.globalState ? window.globalState.get('isAuthenticated') : false;
    }

    // Get current user
    static getCurrentUser() {
        return window.globalState ? window.globalState.get('user') : null;
    }

    // Clear authentication for testing
    static clearAuthentication() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.globalState) {
            window.globalState.logout();
        }
    }

    // Check API response format
    static validateApiResponse(response, expectedFields = []) {
        if (!response || typeof response !== 'object') {
            return { valid: false, error: 'Response is not an object' };
        }

        for (const field of expectedFields) {
            if (!(field in response)) {
                return { valid: false, error: `Missing required field: ${field}` };
            }
        }

        return { valid: true };
    }

    // Validate form submission
    static async validateFormSubmission(formSelector, formData, expectedSuccess = true) {
        const form = document.querySelector(formSelector);
        if (!form) {
            return { valid: false, error: 'Form not found' };
        }

        // Fill form fields
        for (const [fieldName, value] of Object.entries(formData)) {
            const input = form.querySelector(`[name="${fieldName}"]`);
            if (input) {
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        // Submit form
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
            submitButton.click();
        } else {
            form.dispatchEvent(new Event('submit', { bubbles: true }));
        }

        // Wait for response
        await this.delay(1000);

        // Check for success/error indicators
        const successElements = document.querySelectorAll('.alert-success, .text-success');
        const errorElements = document.querySelectorAll('.alert-danger, .text-danger, .invalid-feedback');

        const hasSuccess = successElements.length > 0;
        const hasError = errorElements.length > 0;

        if (expectedSuccess && !hasSuccess && hasError) {
            return { valid: false, error: 'Expected success but found errors' };
        }

        if (!expectedSuccess && !hasError) {
            return { valid: false, error: 'Expected error but found success' };
        }

        return { valid: true };
    }

    // Test navigation guards
    static async testRouteGuard(route, shouldAllow = true) {
        const initialPath = window.location.pathname;
        this.simulateNavigation(route);

        await this.delay(500); // Wait for navigation

        const currentPath = window.location.pathname;
        const allowed = currentPath === route || (route.startsWith('/') && currentPath.includes(route));

        if (shouldAllow && !allowed) {
            return { valid: false, error: `Expected to navigate to ${route} but stayed at ${currentPath}` };
        }

        if (!shouldAllow && allowed) {
            return { valid: false, error: `Expected to be blocked from ${route} but was allowed` };
        }

        // Reset navigation
        this.simulateNavigation(initialPath);
        return { valid: true };
    }

    // Test API error handling
    static async testApiErrorHandling(endpoint, expectedStatus = 400) {
        const { api } = await import('../services/api.js');

        try {
            await api.get(endpoint);
            return { valid: false, error: 'Expected error but request succeeded' };
        } catch (error) {
            if (error.status === expectedStatus) {
                return { valid: true };
            } else {
                return { valid: false, error: `Expected status ${expectedStatus} but got ${error.status}` };
            }
        }
    }

    // Test state persistence
    static testStatePersistence() {
        const testKey = 'test_key';
        const testValue = { test: 'data', timestamp: Date.now() };

        // Set state
        if (window.globalState) {
            window.globalState.set(testKey, testValue);
        }

        // Reload page (simulate)
        const stored = localStorage.getItem('campuscircle_state');
        if (!stored) {
            return { valid: false, error: 'State not persisted to localStorage' };
        }

        try {
            const parsedState = JSON.parse(stored);
            if (parsedState[testKey] && parsedState[testKey].test === testValue.test) {
                return { valid: true };
            } else {
                return { valid: false, error: 'State data not correctly persisted' };
            }
        } catch (error) {
            return { valid: false, error: 'Invalid JSON in persisted state' };
        }
    }

    // Test notification system
    static testNotificationSystem() {
        if (!window.globalState) {
            return { valid: false, error: 'Global state not available' };
        }

        const notification = {
            type: 'info',
            title: 'Test Notification',
            message: 'This is a test notification'
        };

        const notificationId = window.globalState.addNotification(notification);
        const notifications = window.globalState.get('notifications');

        if (notifications.some(n => n.id === notificationId && n.title === notification.title)) {
            return { valid: true };
        } else {
            return { valid: false, error: 'Notification not added correctly' };
        }
    }

    // Test form validation
    static async testFormValidation(formSelector, invalidData, expectedErrors = []) {
        const result = await this.validateFormSubmission(formSelector, invalidData, false);

        if (!result.valid) {
            return result; // Validation prevented submission as expected
        }

        // Check if expected error messages are shown
        for (const expectedError of expectedErrors) {
            const errorElements = Array.from(document.querySelectorAll('.invalid-feedback, .alert-danger'));
            const hasError = errorElements.some(el =>
                el.textContent.toLowerCase().includes(expectedError.toLowerCase())
            );

            if (!hasError) {
                return { valid: false, error: `Expected error message "${expectedError}" not found` };
            }
        }

        return { valid: true };
    }

    // Test responsive design
    static testResponsiveDesign() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Test mobile breakpoint
        window.resizeTo(375, 667); // iPhone SE size
        const mobileLayout = this.checkLayoutIntegrity();

        // Test tablet breakpoint
        window.resizeTo(768, 1024); // iPad size
        const tabletLayout = this.checkLayoutIntegrity();

        // Test desktop breakpoint
        window.resizeTo(1920, 1080); // Desktop size
        const desktopLayout = this.checkLayoutIntegrity();

        // Reset
        window.resizeTo(viewport.width, viewport.height);

        if (mobileLayout.valid && tabletLayout.valid && desktopLayout.valid) {
            return { valid: true };
        } else {
            return {
                valid: false,
                error: 'Layout issues detected at one or more breakpoints',
                details: { mobileLayout, tabletLayout, desktopLayout }
            };
        }
    }

    // Helper to check layout integrity
    static checkLayoutIntegrity() {
        const criticalElements = [
            '.navbar',
            'main',
            '.card',
            'button',
            'input',
            'select'
        ];

        for (const selector of criticalElements) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const rect = element.getBoundingClientRect();

                // Check if element is visible and has reasonable dimensions
                if (rect.width === 0 || rect.height === 0) {
                    return { valid: false, error: `Element ${selector} has zero dimensions` };
                }

                // Check if element overflows viewport inappropriately
                if (rect.left < -50 || rect.top < -50) {
                    return { valid: false, error: `Element ${selector} is positioned off-screen` };
                }
            }
        }

        return { valid: true };
    }

    // Test accessibility
    static testAccessibility() {
        const issues = [];

        // Check for missing alt text on images
        const images = document.querySelectorAll('img:not([alt])');
        if (images.length > 0) {
            issues.push(`${images.length} images missing alt text`);
        }

        // Check for missing labels on form inputs
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        const unlabeledInputs = Array.from(inputs).filter(input => {
            const id = input.id;
            return !id || !document.querySelector(`label[for="${id}"]`);
        });

        if (unlabeledInputs.length > 0) {
            issues.push(`${unlabeledInputs.length} form inputs missing labels`);
        }

        // Check for sufficient color contrast (basic check)
        const textElements = document.querySelectorAll('*');
        // This would require a more sophisticated color analysis library

        // Check for keyboard navigation
        const focusableElements = document.querySelectorAll('button, a, input, select, textarea');
        if (focusableElements.length === 0) {
            issues.push('No keyboard-focusable elements found');
        }

        return {
            valid: issues.length === 0,
            issues: issues,
            message: issues.length === 0 ? 'Accessibility check passed' : `Found ${issues.length} accessibility issues`
        };
    }

    // Performance monitoring
    static startPerformanceMonitoring() {
        if (!window.performanceMonitor) {
            window.performanceMonitor = {
                startTime: Date.now(),
                marks: {},
                measures: {}
            };
        }

        // Mark page load start
        performance.mark('page-load-start');
    }

    static recordPerformanceMark(name) {
        if (window.performanceMonitor) {
            performance.mark(name);
            window.performanceMonitor.marks[name] = Date.now();
        }
    }

    static measurePerformance(name, startMark, endMark) {
        if (window.performanceMonitor) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];
                window.performanceMonitor.measures[name] = measure.duration;
                return measure.duration;
            } catch (error) {
                console.warn('Performance measurement failed:', error);
                return null;
            }
        }
        return null;
    }

    static getPerformanceReport() {
        if (!window.performanceMonitor) {
            return null;
        }

        const monitor = window.performanceMonitor;
        const loadTime = Date.now() - monitor.startTime;

        return {
            totalLoadTime: loadTime,
            marks: monitor.marks,
            measures: monitor.measures,
            apiLogs: this.getApiLogs()
        };
    }

    static getApiLogs() {
        try {
            return JSON.parse(localStorage.getItem('api_logs') || '[]');
        } catch {
            return [];
        }
    }

    // Utility delay function
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Generate test data
    static generateTestData(type) {
        const generators = {
            user: () => ({
                fullName: `Test User ${Date.now()}`,
                email: `test${Date.now()}@vinuni.edu.vn`,
                password: 'password123',
                phone: '+1234567890',
                address: 'Test Address, VinUniversity'
            }),

            listing: () => ({
                title: `Test Listing ${Date.now()}`,
                description: 'This is a test listing for automated testing purposes.',
                categoryId: 1,
                listingType: 'SELL',
                condition: 'NEW',
                listPrice: 29.99,
                pickupAvailable: true,
                deliveryAvailable: false
            }),

            order: () => ({
                listingId: 1,
                offerPrice: 25.00,
                message: 'Test order message'
            })
        };

        return generators[type] ? generators[type]() : null;
    }
}

// Global testing helper for easy access in browser console
window.TestingUtils = TestingUtils;