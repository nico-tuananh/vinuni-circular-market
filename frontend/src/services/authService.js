// Authentication service
export class AuthService {
    static TOKEN_KEY = 'token';
    static USER_KEY = 'user';

    static async login(email, password) {
        console.log('🔐 LOGIN START: AuthService.login called with email:', email);

        const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8010/api'}/auth/login`;
        console.log('🌐 LOGIN STEP 1: Making request to:', url);

        const requestBody = { email, password };
        console.log('📤 LOGIN STEP 2: Request payload:', { email: email, password: password ? '[REDACTED]' : 'empty' });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('📡 LOGIN STEP 3: Response status:', response.status);
        console.log('📡 LOGIN STEP 3: Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error('❌ LOGIN STEP 4: Response not ok, status:', response.status);

            let errorMessage = 'Login failed';
            try {
                const errorData = await response.json();
                console.error('❌ LOGIN STEP 4: Error response body:', errorData);
                errorMessage = errorData.message || errorMessage;
            } catch (parseError) {
                console.error('❌ LOGIN STEP 4: Could not parse error response:', parseError);
                const errorText = await response.text();
                console.error('❌ LOGIN STEP 4: Raw error response:', errorText);
            }

            throw new Error(errorMessage);
        }

        console.log('✅ LOGIN STEP 4: Response OK, parsing JSON...');
        const data = await response.json();
        console.log('✅ LOGIN STEP 5: Response data received:', {
            hasToken: !!data.token,
            hasUser: !!data.user,
            userRole: data.user?.role,
            userEmail: data.user?.email
        });

        console.log('💾 LOGIN STEP 6: Setting token and user in localStorage');
        this.setToken(data.token);
        this.setUser(data.user);

        console.log('🎉 LOGIN SUCCESS: Login process completed successfully');
        return data;
    }

    static async register(userData) {
        console.log('🔐 REGISTER START: AuthService.register called with data:', {
            fullName: userData.fullName,
            email: userData.email,
            hasPassword: !!userData.password,
            hasConfirmPassword: !!userData.confirmPassword,
            hasPhone: !!userData.phone,
            hasAddress: !!userData.address
        });

        const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8010/api'}/auth/register`;
        console.log('🌐 REGISTER STEP 1: Making request to:', url);

        const requestBody = {
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirmPassword,
            phone: userData.phone || null,
            address: userData.address || null
        };
        console.log('📤 REGISTER STEP 2: Request payload:', {
            fullName: requestBody.fullName,
            email: requestBody.email,
            password: requestBody.password ? '[REDACTED]' : 'empty',
            confirmPassword: requestBody.confirmPassword ? '[REDACTED]' : 'empty',
            phone: requestBody.phone,
            address: requestBody.address
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log('📡 REGISTER STEP 3: Response status:', response.status);
        console.log('📡 REGISTER STEP 3: Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error('❌ REGISTER STEP 4: Response not ok, status:', response.status);

            let errorMessage = 'Registration failed';
            try {
                const errorData = await response.json();
                console.error('❌ REGISTER STEP 4: Error response body:', errorData);
                errorMessage = errorData.message || errorMessage;
            } catch (parseError) {
                console.error('❌ REGISTER STEP 4: Could not parse error response:', parseError);
                const errorText = await response.text();
                console.error('❌ REGISTER STEP 4: Raw error response:', errorText);
            }

            throw new Error(errorMessage);
        }

        console.log('✅ REGISTER STEP 4: Response OK, parsing JSON...');
        const data = await response.json();
        console.log('✅ REGISTER STEP 5: Response data received:', {
            hasToken: !!data.token,
            hasUser: !!data.user,
            userRole: data.user?.role,
            userEmail: data.user?.email,
            userId: data.user?.userId
        });

        console.log('🎉 REGISTER SUCCESS: Registration process completed successfully');
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