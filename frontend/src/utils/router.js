// Simple client-side router with protected routes
export class Router {
    constructor(routes, contentElementId) {
        this.routes = routes;
        this.contentElementId = contentElementId;
        this.currentPage = null;
        this.currentPath = '/';
        this.routeGuards = {};
    }

    navigate(path, updateHistory = true) {
        // Remove leading slash if present
        const cleanPath = path.startsWith('/') ? path : '/' + path;
        
        // Store current path
        this.currentPath = cleanPath;

        // Find matching route
        let routeHandler = this.routes[cleanPath];
        let params = {};

        // If no exact match, try parameterized routes
        if (!routeHandler) {
            const routeMatch = this.findRouteMatch(cleanPath);
            if (routeMatch) {
                routeHandler = routeMatch.handler;
                params = routeMatch.params;
            }
        }

        routeHandler = routeHandler || this.routes['/404'];

        if (routeHandler) {
            // Check route guard
            if (!this.checkRouteGuard(cleanPath)) {
                return; // Guard prevented navigation
            }

            // Update browser history
            if (updateHistory) {
                window.history.pushState({}, '', cleanPath);
            }

            // Update header with current path
            if (window.App && window.App.header) {
                window.App.header.updatePath(cleanPath);
            }

            // Scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Clear current content
            const contentElement = document.getElementById(this.contentElementId);
            if (contentElement) {
                contentElement.innerHTML = '<div class="text-center py-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
            }

            // Execute route handler with params
            routeHandler(params);
        } else {
            console.warn(`No route found for: ${cleanPath}`);
            this.navigate('/404');
        }
    }

    // Method to programmatically navigate
    goTo(path) {
        this.navigate(path, true);
    }

    // Method to replace current history entry
    replace(path) {
        this.navigate(path, false);
    }

    // Find matching route for parameterized paths
    findRouteMatch(path) {
        for (const routePattern in this.routes) {
            const params = this.matchRoute(routePattern, path);
            if (params !== null) {
                return {
                    handler: this.routes[routePattern],
                    params
                };
            }
        }
        return null;
    }

    // Match route pattern with actual path
    matchRoute(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');

        if (patternParts.length !== pathParts.length) {
            return null;
        }

        const params = {};

        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathPart = pathParts[i];

            if (patternPart.startsWith(':')) {
                // Parameter
                const paramName = patternPart.slice(1);
                params[paramName] = pathPart;
            } else if (patternPart !== pathPart) {
                // Not a match
                return null;
            }
        }

        return params;
    }

    // Add route guard
    addRouteGuard(path, guardFunction) {
        this.routeGuards[path] = guardFunction;
    }

    // Check route guard
    checkRouteGuard(path) {
        const guard = this.routeGuards[path];
        if (!guard) return true; // No guard, allow navigation

        try {
            return guard(path);
        } catch (error) {
            console.error('Route guard error:', error);
            return false;
        }
    }

    // Helper method to create auth guard
    createAuthGuard(requireAuth = true, redirectTo = '/login') {
        return () => {
            const { globalState } = window;
            const isAuthenticated = globalState ? globalState.get('isAuthenticated') : false;

            if (requireAuth && !isAuthenticated) {
                // Need to be logged in but not authenticated
                this.navigate(redirectTo);
                return false;
            }

            if (!requireAuth && isAuthenticated) {
                // Should not be logged in but is authenticated
                this.navigate('/');
                return false;
            }

            return true;
        };
    }

    // Helper method to create role guard
    createRoleGuard(requiredRole, redirectTo = '/') {
        return () => {
            const { globalState } = window;
            const user = globalState ? globalState.get('user') : null;

            if (!user) {
                this.navigate('/login');
                return false;
            }

            if (user.role !== requiredRole) {
                this.navigate(redirectTo);
                return false;
            }

            return true;
        };
    }
}