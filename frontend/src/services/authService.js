// Authentication service
export class AuthService {
    static TOKEN_KEY = 'token';
    static USER_KEY = 'user';

    static async login(email, password) {
        const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8010/api'}/auth/login`;

        const requestBody = { email, password };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            let errorMessage = 'Login failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        this.setToken(data.token);
        this.setUser(data.user);

        console.log('✅ Login successful for user:', email);
        return data;
    }

    static async register(userData) {
        const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8010/api'}/auth/register`;

        const requestBody = {
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirmPassword,
            phone: userData.phone || null,
            address: userData.address || null
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            let errorMessage = 'Registration failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('✅ Registration successful for user:', userData.email);
        return data;
    }

    static logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        // Update global state
        const { globalState } = window;
        if (globalState) {
            globalState.logout();
        }
        // Update app instance
        if (window.App) {
            window.App.updateUser(null);
        }
    }

    static getCurrentUser() {
        const userJson = localStorage.getItem(this.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static setUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        // Update global state
        const { globalState } = window;
        if (globalState) {
            globalState.login(user);
        }
        // Update app instance
        if (window.App) {
            window.App.updateUser(user);
        }
    }

    static isAuthenticated() {
        return !!this.getToken() && !!this.getCurrentUser();
    }

    static validateVinUniEmail(email) {
        return email.endsWith('@vinuni.edu.vn');
    }
}