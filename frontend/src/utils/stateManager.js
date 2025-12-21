// Simple Global State Management
export class StateManager {
    constructor() {
        this.state = {
            user: null,
            isAuthenticated: false,
            loading: false,
            notifications: [],
            appSettings: {
                theme: 'light',
                language: 'en'
            }
        };
        this.listeners = {};
        this.storageKey = 'campuscircle_state';

        // Load state from localStorage
        this.loadFromStorage();
    }

    // Get current state
    getState() {
        return { ...this.state };
    }

    // Get specific state value
    get(key) {
        return this.state[key];
    }

    // Set state value
    set(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;

        // Notify listeners
        this.notifyListeners(key, value, oldValue);

        // Save to localStorage for persistence
        this.saveToStorage();

        return this;
    }

    // Update multiple state values
    update(updates) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...updates };

        // Notify listeners for each updated key
        Object.keys(updates).forEach(key => {
            this.notifyListeners(key, this.state[key], oldState[key]);
        });

        // Save to localStorage
        this.saveToStorage();

        return this;
    }

    // Subscribe to state changes
    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);

        // Return unsubscribe function
        return () => {
            const index = this.listeners[key].indexOf(callback);
            if (index > -1) {
                this.listeners[key].splice(index, 1);
            }
        };
    }

    // Subscribe to any state change
    subscribeAll(callback) {
        return this.subscribe('*', callback);
    }

    // Notify listeners
    notifyListeners(key, newValue, oldValue) {
        // Notify specific key listeners
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => callback(newValue, oldValue, key));
        }

        // Notify global listeners
        if (this.listeners['*']) {
            this.listeners['*'].forEach(callback => callback(this.state, { [key]: oldValue }, key));
        }
    }

    // Load state from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsedState = JSON.parse(stored);
                // Only load specific persistent keys
                if (parsedState.user) this.state.user = parsedState.user;
                if (parsedState.appSettings) this.state.appSettings = { ...this.state.appSettings, ...parsedState.appSettings };
                this.state.isAuthenticated = !!this.state.user;
            }
        } catch (error) {
            console.warn('Failed to load state from localStorage:', error);
        }
    }

    // Save state to localStorage
    saveToStorage() {
        try {
            const toSave = {
                user: this.state.user,
                appSettings: this.state.appSettings
            };
            localStorage.setItem(this.storageKey, JSON.stringify(toSave));
        } catch (error) {
            console.warn('Failed to save state to localStorage:', error);
        }
    }

    // Clear all state
    clear() {
        const oldState = { ...this.state };
        this.state = {
            user: null,
            isAuthenticated: false,
            loading: false,
            notifications: [],
            appSettings: {
                theme: 'light',
                language: 'en'
            }
        };

        // Notify all listeners
        Object.keys(oldState).forEach(key => {
            this.notifyListeners(key, this.state[key], oldState[key]);
        });

        // Clear localStorage
        localStorage.removeItem(this.storageKey);

        return this;
    }

    // Authentication helpers
    login(user) {
        this.update({
            user: user,
            isAuthenticated: true
        });
    }

    logout() {
        this.clear();
    }

    // Loading state
    setLoading(loading) {
        this.set('loading', loading);
    }

    // Notifications
    addNotification(notification) {
        const notifications = [...this.state.notifications];
        const id = Date.now();
        notifications.push({ id, ...notification });
        this.set('notifications', notifications);

        // Auto-remove after duration
        if (notification.duration !== 0) {
            setTimeout(() => {
                this.removeNotification(id);
            }, notification.duration || 3000);
        }

        return id;
    }

    removeNotification(id) {
        const notifications = this.state.notifications.filter(n => n.id !== id);
        this.set('notifications', notifications);
    }

    // App settings
    updateSettings(settings) {
        const appSettings = { ...this.state.appSettings, ...settings };
        this.set('appSettings', appSettings);
    }
}

// Global state instance
export const globalState = new StateManager();

// Helper functions for common operations
export const useState = (key) => {
    const [value, setValue] = [globalState.get(key), (newValue) => globalState.set(key, newValue)];
    return [value, setValue];
};

export const useAuth = () => {
    return {
        user: globalState.get('user'),
        isAuthenticated: globalState.get('isAuthenticated'),
        login: (user) => globalState.login(user),
        logout: () => globalState.logout()
    };
};

export const useLoading = () => {
    return {
        loading: globalState.get('loading'),
        setLoading: (loading) => globalState.setLoading(loading)
    };
};

export const useNotifications = () => {
    return {
        notifications: globalState.get('notifications'),
        addNotification: (notification) => globalState.addNotification(notification),
        removeNotification: (id) => globalState.removeNotification(id)
    };
};