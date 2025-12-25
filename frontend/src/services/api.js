// Custom API Error class
export class ApiError extends Error {
    constructor(message, status = 500, code = 'UNKNOWN_ERROR', details = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();

        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            code: this.code,
            details: this.details,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

// API service for making HTTP requests with interceptors
class ApiService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8010/api';
        this.timeout = 10000;
        this.requestInterceptors = [];
        this.responseInterceptors = [];
        this.errorInterceptors = [];
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    // Add request interceptor
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }

    // Add response interceptor
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }

    // Add error interceptor
    addErrorInterceptor(interceptor) {
        this.errorInterceptors.push(interceptor);
    }

    async request(url, options = {}) {
        const startTime = Date.now();

        // Build initial config
        let config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest', // CSRF protection
                ...options.headers
            },
            ...options
        };

        // Apply request interceptors
        for (const interceptor of this.requestInterceptors) {
            config = await interceptor(config, url);
        }

        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Sanitize input data if present (skip for JSON bodies)
        const contentType = config.headers['Content-Type'] || config.headers['content-type'] || '';
        if (config.body && typeof config.body === 'string' && !contentType.toLowerCase().includes('application/json')) {
            config.body = this.sanitizeInput(config.body);
        }

        // Create full URL
        const fullUrl = url.startsWith('http') ? url : this.baseURL + url;

        // Special logging for auth endpoint requests
        if (fullUrl.includes('/auth/')) {
            console.log(`📤 API AUTH REQUEST: ${config.method} ${fullUrl}`);
            if (config.body) {
                try {
                    const bodyData = JSON.parse(config.body);
                    if (bodyData.password) {
                        console.log(`📋 API AUTH REQUEST PAYLOAD:`, { ...bodyData, password: '[REDACTED]' });
                    } else {
                        console.log(`📋 API AUTH REQUEST PAYLOAD:`, bodyData);
                    }
                } catch {
                    console.log(`📋 API AUTH REQUEST BODY:`, config.body);
                }
            }
        }

        // Special logging for orders endpoint requests
        if (fullUrl.includes('/orders') && config.method === 'POST') {
            console.log(`📤 API ORDER REQUEST: ${config.method} ${fullUrl}`);
            if (config.body) {
                try {
                    const bodyData = JSON.parse(config.body);
                    console.log(`📋 API ORDER REQUEST PAYLOAD:`, bodyData);
                } catch {
                    console.log(`📋 API ORDER REQUEST BODY:`, config.body);
                }
            }
            console.log(`📋 API ORDER REQUEST HEADERS:`, config.headers);
        }

        // Special logging for profile update requests
        if (fullUrl.includes('/users/me/profile') && config.method === 'PUT') {
            console.log(`📤 API PROFILE UPDATE REQUEST: ${config.method} ${fullUrl}`);
            if (config.body) {
                try {
                    const bodyData = JSON.parse(config.body);
                    console.log(`📋 API PROFILE UPDATE PAYLOAD:`, bodyData);
                } catch (e) {
                    console.error(`❌ API PROFILE UPDATE BODY PARSE ERROR:`, e);
                    console.log(`📋 API PROFILE UPDATE BODY (raw):`, config.body);
                }
            }
            console.log(`📋 API PROFILE UPDATE HEADERS:`, config.headers);
        }

        // Set timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        let attempt = 0;
        let lastError = null;

        while (attempt < this.retryAttempts) {
            try {
                attempt++;
                config.signal = controller.signal;

                const response = await fetch(fullUrl, config);
                const responseTime = Date.now() - startTime;

                // Log API performance
                this.logApiCall(fullUrl, config.method, response.status, responseTime);

                clearTimeout(timeoutId);

                // Apply response interceptors
                let processedResponse = response;
                for (const interceptor of this.responseInterceptors) {
                    processedResponse = await interceptor(processedResponse, config);
                }

                // Handle unauthorized access
                if (processedResponse.status === 401) {
                    // Parse error message from server before throwing
                    let errorMessage = 'Unauthorized access';
                    try {
                        const errorData = await processedResponse.clone().json();
                        errorMessage = errorData.message || errorMessage;
                    } catch {
                        // If response is not JSON, use default message
                    }
                    this.handleUnauthorized();
                    throw new ApiError(errorMessage, 401, 'AUTH_ERROR');
                }

                // Handle forbidden access
                if (processedResponse.status === 403) {
                    throw new ApiError('Access forbidden', 403, 'FORBIDDEN_ERROR');
                }

                // Check if response is ok
                if (!processedResponse.ok) {
                    const errorData = await processedResponse.json().catch(() => ({}));

                    // Special logging for auth endpoint errors
                    if (fullUrl.includes('/auth/')) {
                        console.error(`❌ API AUTH ERROR: ${config.method} ${fullUrl} -> ${processedResponse.status}`);
                        console.error(`❌ API AUTH ERROR DETAILS:`, errorData);
                    }

                    // Special logging for orders endpoint errors
                    if (fullUrl.includes('/orders')) {
                        console.error(`❌ API ORDER ERROR: ${config.method} ${fullUrl} -> ${processedResponse.status}`);
                        console.error(`❌ API ORDER ERROR DETAILS:`, errorData);
                    }

                    // Special logging for profile update errors
                    if (fullUrl.includes('/users/me/profile')) {
                        console.error(`❌ API PROFILE UPDATE ERROR: ${config.method} ${fullUrl} -> ${processedResponse.status}`);
                        console.error(`❌ API PROFILE UPDATE ERROR DETAILS:`, errorData);
                    }

                    const error = new ApiError(
                        errorData.message || `HTTP ${processedResponse.status}: ${processedResponse.statusText}`,
                        processedResponse.status,
                        errorData.code || 'HTTP_ERROR',
                        errorData.details
                    );

                    // Apply error interceptors
                    for (const interceptor of this.errorInterceptors) {
                        await interceptor(error, config);
                    }

                    throw error;
                }

                // Return JSON response
                const data = await processedResponse.json();

                // Special logging for auth endpoint responses
                if (fullUrl.includes('/auth/')) {
                    console.log(`📥 API AUTH RESPONSE: ${config.method} ${fullUrl} -> Success`);
                    console.log(`📊 API AUTH RESPONSE DATA:`, {
                        hasToken: !!data.token,
                        hasUser: !!data.user,
                        userRole: data.user?.role,
                        userEmail: data.user?.email,
                        userId: data.user?.userId
                    });
                }

                // Special logging for orders endpoint responses
                if (fullUrl.includes('/orders') && config.method === 'POST') {
                    console.log(`📥 API ORDER RESPONSE: ${config.method} ${fullUrl} -> Success (${response.status})`);
                    console.log(`📊 API ORDER RESPONSE DATA:`, data);
                }

                // Special logging for profile update responses
                if (fullUrl.includes('/users/me/profile') && config.method === 'PUT') {
                    console.log(`📥 API PROFILE UPDATE RESPONSE: ${config.method} ${fullUrl} -> Success (${response.status})`);
                    console.log(`📊 API PROFILE UPDATE RESPONSE DATA:`, data);
                }

                return data;

            } catch (error) {
                lastError = error;
                clearTimeout(timeoutId);

                // Apply error interceptors
                for (const interceptor of this.errorInterceptors) {
                    await interceptor(error, config);
                }

                // Don't retry on certain errors
                if (error.name === 'AbortError' ||
                    error.code === 'AUTH_ERROR' ||
                    error.code === 'FORBIDDEN_ERROR' ||
                    error.status >= 400 && error.status < 500) {
                    break;
                }

                // Retry with exponential backoff
                if (attempt < this.retryAttempts) {
                    await this.delay(this.retryDelay * Math.pow(2, attempt - 1));
                }
            }
        }

        // If we get here, all retries failed
        if (lastError.name === 'AbortError') {
            throw new ApiError('Request timeout after retries', 408, 'TIMEOUT_ERROR');
        }

        throw lastError;
    }

    // Sanitize input to prevent XSS
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        // Remove script tags and other dangerous elements
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/<[^>]*>/g, '') // Remove all HTML tags as fallback
            .trim();
    }

    // Handle unauthorized access
    handleUnauthorized() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Update global state
        if (window.globalState) {
            window.globalState.logout();
        }

        // Redirect to login
        if (window.App && window.App.router) {
            window.App.router.navigate('/login');
        }
    }

    // Log API calls for monitoring
    logApiCall(url, method, status, responseTime) {
        const logData = {
            timestamp: new Date().toISOString(),
            url,
            method,
            status,
            responseTime,
            userAgent: navigator.userAgent
        };

        // Special logging for auth endpoints
        if (url.includes('/auth/')) {
            console.log(`🌐 API AUTH CALL: ${method} ${url} -> ${status} (${responseTime}ms)`);
            if (status >= 400) {
                console.error(`❌ API AUTH ERROR: ${method} ${url} returned ${status}`);
            } else {
                console.log(`✅ API AUTH SUCCESS: ${method} ${url} returned ${status}`);
            }
        }

        // Store in localStorage for debugging (in production, send to logging service)
        const logs = JSON.parse(localStorage.getItem('api_logs') || '[]');
        logs.push(logData);

        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.shift();
        }

        localStorage.setItem('api_logs', JSON.stringify(logs));

        if (import.meta.env.DEV && !url.includes('/auth/')) {
            console.log(`API ${method} ${url} - ${status} (${responseTime}ms)`);
        }
    }

    // Utility delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // HTTP method shortcuts
    async get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }

    async post(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }
}

// Specialized API methods for different resources
export class ListingService {
    // Get all listings with pagination
    static async getListings(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/listings?${queryString}`);
    }

    // Search listings
    static async searchListings(query, params = {}) {
        const queryParams = new URLSearchParams({ query: query, ...params }).toString();
        return api.get(`/listings/search?${queryParams}`);
    }

    // Filter listings
    static async filterListings(filters) {
        const queryString = new URLSearchParams(filters).toString();
        return api.get(`/listings/filter?${queryString}`);
    }

    // Get recent listings
    static async getRecentListings(limit = 10) {
        // Use main listings endpoint with sorting
        return api.get(`/listings?page=0&size=${limit}&sortBy=createdAt&sortDir=desc`);
    }

    // Get listings by category
    static async getListingsByCategory(categoryId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/listings/category/${categoryId}?${queryString}`);
    }

    // Get user's listings
    static async getMyListings() {
        return api.get('/listings/my-listings');
    }

    // Get listing by ID
    static async getListing(listingId) {
        return api.get(`/listings/${listingId}`);
    }

    // Create new listing
    static async createListing(listingData) {
        return api.post('/listings', listingData);
    }

    // Update listing
    static async updateListing(listingId, listingData) {
        return api.put(`/listings/${listingId}`, listingData);
    }

    // Delete listing
    static async deleteListing(listingId) {
        return api.delete(`/listings/${listingId}`);
    }

    // Admin methods
    static async getAllListingsForAdmin(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/listings/admin/all?${queryString}`);
        return {
            content: response.listings || [],
            currentPage: response.currentPage || 0,
            totalItems: response.totalItems || 0,
            totalPages: response.totalPages || 1
        };
    }

    static async deleteListingAsAdmin(listingId) {
        return api.delete(`/listings/admin/${listingId}`);
    }

    static async updateListingStatusAsAdmin(listingId, status) {
        return api.put(`/listings/admin/${listingId}/status`, { status });
    }

    static async getListingsByUser(userId, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return api.get(`/listings/admin/user/${userId}?${queryString}`);
    }
}

export class OrderService {
    // Create new order
    static async createOrder(orderData) {
        return api.post('/orders', orderData);
    }

    // Get order by ID
    static async getOrder(orderId) {
        return api.get(`/orders/${orderId}`);
    }

    // Get user's orders
    static async getMyOrders() {
        return api.get('/orders/my-orders');
    }

    // Get seller's sales
    static async getMySales() {
        return api.get('/orders/sales');
    }

    // Update order status
    static async confirmOrder(orderId) {
        return api.put(`/orders/${orderId}/confirm`);
    }

    static async rejectOrder(orderId) {
        return api.put(`/orders/${orderId}/reject`);
    }

    static async cancelOrder(orderId) {
        return api.put(`/orders/${orderId}/cancel`);
    }

    static async completeOrder(orderId) {
        return api.put(`/orders/${orderId}/complete`);
    }
}

export class ReviewService {
    // Create review for order
    static async createReview(orderId, reviewData) {
        return api.post(`/reviews/orders/${orderId}`, reviewData);
    }

    // Get reviews for order
    static async getOrderReviews(orderId) {
        return api.get(`/reviews/orders/${orderId}`);
    }

    // Get reviews for listing
    static async getListingReviews(listingId) {
        return api.get(`/reviews/listings/${listingId}`);
    }

    // Get user's reviews
    static async getMyReviews() {
        return api.get('/reviews/my-reviews');
    }

    // Get average rating for listing
    static async getListingAverageRating(listingId) {
        return api.get(`/reviews/listings/${listingId}/average-rating`);
    }

    // Get average rating for seller
    static async getSellerAverageRating(sellerId) {
        return api.get(`/reviews/sellers/${sellerId}/average-rating`);
    }

    // Update review
    static async updateReview(reviewId, reviewData) {
        return api.put(`/reviews/${reviewId}`, reviewData);
    }

    // Delete review
    static async deleteReview(reviewId) {
        return api.delete(`/reviews/${reviewId}`);
    }
}

export class CommentService {
    // Get comments for listing
    static async getListingComments(listingId) {
        return api.get(`/comments/listings/${listingId}`);
    }

    // Get top-level comments for listing
    static async getTopLevelComments(listingId) {
        return api.get(`/comments/listings/${listingId}/top-level`);
    }

    // Get replies for comment
    static async getCommentReplies(parentId) {
        return api.get(`/comments/${parentId}/replies`);
    }

    // Create comment
    static async createComment(listingId, commentData) {
        return api.post(`/comments/listings/${listingId}`, commentData);
    }

    // Update comment
    static async updateComment(commentId, commentData) {
        return api.put(`/comments/${commentId}`, commentData);
    }

    // Delete comment
    static async deleteComment(commentId) {
        return api.delete(`/comments/${commentId}`);
    }

    // Get comment count for listing
    static async getCommentCount(listingId) {
        return api.get(`/comments/listings/${listingId}/count`);
    }

    // Admin methods
    static async getAllComments(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/comments/admin/all?${queryString}`);
        return {
            content: response.comments || [],
            currentPage: response.currentPage || 0,
            totalItems: response.totalItems || 0,
            totalPages: response.totalPages || 1
        };
    }

    static async deleteCommentAsAdmin(commentId) {
        return api.delete(`/comments/admin/${commentId}`);
    }

    static async bulkDeleteComments(commentIds) {
        return api.request(`/comments/admin/bulk`, {
            method: 'DELETE',
            body: JSON.stringify({ commentIds })
        });
    }

    static async approveComment() {
        throw new ApiError('Comment approval not implemented. Comments are auto-approved.', 501, 'NOT_IMPLEMENTED');
    }

    static async rejectComment() {
        throw new ApiError('Comment rejection not implemented. Use delete instead.', 501, 'NOT_IMPLEMENTED');
    }
}

export class CategoryService {
    // Get all categories
    static async getCategories() {
        return api.get('/categories');
    }

    // Get categories with listing counts
    static async getCategoriesWithCounts() {
        return api.get('/categories/with-counts');
    }

    // Get category by ID
    static async getCategory(categoryId) {
        return api.get(`/categories/${categoryId}`);
    }

    // Search categories
    static async searchCategories(query) {
        return api.get(`/categories/search?q=${encodeURIComponent(query)}`);
    }
}

export class UserService {
    // Get user by ID
    static async getUser(userId) {
        return api.get(`/users/${userId}`);
    }

    // Search users
    static async searchUsers(query) {
        return api.get(`/users/search?searchTerm=${encodeURIComponent(query)}`);
    }

    // Update current user's own profile
    static async updateMyProfile(profileData) {
        return api.put('/users/me/profile', profileData);
    }

    // Admin methods
    static async getAllUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await api.get(`/admin/users?${queryString}`);
        return {
            content: response.users || [],
            currentPage: response.currentPage || 0,
            totalItems: response.totalItems || 0,
            totalPages: response.totalPages || 1,
            pageSize: response.pageSize || 10
        };
    }

    static async getUserById(userId) {
        return api.get(`/admin/users/${userId}`);
    }

    static async updateUserStatus(userId, status) {
        return api.put(`/admin/users/${userId}/status`, { status });
    }

    static async updateUserRole(userId, role) {
        return api.put(`/admin/users/${userId}/role`, { role });
    }

    static async deleteUser(userId) {
        return api.delete(`/admin/users/${userId}`);
    }

    static async getStatistics() {
        const stats = await api.get('/admin/users/statistics');
        return {
            total: stats.totalUsers || 0,
            active: stats.activeUsers || 0,
            inactive: stats.inactiveUsers || 0,
            admin: stats.adminUsers || 0
        };
    }

    static async bulkActivate(userIds) {
        return api.post('/admin/users/bulk/activate', { userIds });
    }

    static async bulkDeactivate(userIds) {
        return api.post('/admin/users/bulk/deactivate', { userIds });
    }
}

// Create singleton instance with default interceptors
const api = new ApiService();

// Default request interceptor - add CSRF token and validate request
api.addRequestInterceptor(async (config) => {
    // Add request ID for tracking
    config.headers['X-Request-ID'] = Date.now().toString() + Math.random().toString(36).substring(2, 11);

    // Add timestamp for performance monitoring
    config.headers['X-Request-Time'] = Date.now().toString();

    // Validate request data
    if (config.body && typeof config.body === 'string') {
        try {
            JSON.parse(config.body); // Validate JSON
        } catch {
            throw new ApiError('Invalid JSON in request body', 400, 'INVALID_JSON');
        }
    }

    return config;
});

// Default response interceptor - validate response
api.addResponseInterceptor(async (response) => {
    return response;
});

// Default error interceptor - handle common error patterns
api.addErrorInterceptor(async (error) => {
    // Log errors for monitoring
    console.error('API Error:', error.toJSON ? error.toJSON() : error);

    // Handle rate limiting
    if (error.status === 429) {
        // Show user-friendly rate limit message
        if (window.globalState) {
            window.globalState.addNotification({
                type: 'warning',
                title: 'Too Many Requests',
                message: 'Please wait a moment before trying again.'
            });
        }
    }

    // Handle network errors (TypeError from fetch, NetworkError, or AbortError)
    if (error.name === 'TypeError' || 
        error.name === 'NetworkError' || 
        error.message?.includes('fetch') ||
        error.message?.includes('network') ||
        error.message?.includes('Failed to fetch')) {
        error = new ApiError('Network connection error. Please check your internet connection.', 0, 'NETWORK_ERROR');
    }

    // Handle timeout errors
    if (error.code === 'TIMEOUT_ERROR') {
        if (window.globalState) {
            window.globalState.addNotification({
                type: 'error',
                title: 'Request Timeout',
                message: 'The request took too long. Please try again.'
            });
        }
    }
});

export class AnalyticsController {
    static async getDashboardAnalytics() {
        return api.get('/admin/analytics/dashboard');
    }

    static async getUserRegistrationStats(startDate, endDate) {
        const params = new URLSearchParams({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
        return api.get(`/admin/analytics/users/registrations?${params}`);
    }

    static async getOrderStats(startDate, endDate) {
        const params = new URLSearchParams({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
        return api.get(`/admin/analytics/orders/stats?${params}`);
    }

    static async getRevenueStats(startDate, endDate) {
        const params = new URLSearchParams({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
        return api.get(`/admin/analytics/revenue/stats?${params}`);
    }

    static async getOrderStatsSummary() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        const stats = await this.getOrderStats(startDate, endDate);
        
        let total = 0;
        let pending = 0;
        
        if (Array.isArray(stats)) {
            stats.forEach(stat => {
                if (Array.isArray(stat) && stat.length >= 2) {
                    total += parseInt(stat[1]) || 0;
                    if (stat[0] === 'REQUESTED' || stat[0] === 'PENDING') {
                        pending += parseInt(stat[1]) || 0;
                    }
                }
            });
        }
        
        return { total, pending };
    }

    static async getRevenueStatsSummary() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        const stats = await this.getRevenueStats(startDate, endDate);
        
        let total = 0;
        let monthly = 0;
        
        if (Array.isArray(stats)) {
            stats.forEach(stat => {
                if (Array.isArray(stat) && stat.length >= 2) {
                    const amount = parseFloat(stat[1]) || 0;
                    total += amount;
                    monthly += amount;
                }
            });
        }
        
        return { total, monthly };
    }

    static async getSystemHealth() {
        return api.get('/admin/analytics/system/health');
    }
}

// Export singleton instance and classes
export { api, ApiService };