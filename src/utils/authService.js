import store from '../store';
import { setUser, logout } from '../features/userSlice';
import { api } from './apiService';

class AuthService {
  constructor() {
    this.isChecking = false;
    this.checkPromise = null;
  }

  async checkAuth() {
    // If already checking, return the existing promise
    if (this.isChecking && this.checkPromise) {
      return this.checkPromise;
    }

    this.isChecking = true;
    this.checkPromise = this._performAuthCheck();

    try {
      const result = await this.checkPromise;
      return result;
    } finally {
      this.isChecking = false;
      this.checkPromise = null;
    }
  }

  async _performAuthCheck() {
    try {
      const response = await api.get('/api/auth/me');
      store.dispatch(setUser(response.data.user));
      return { isAuthenticated: true, user: response.data.user };
    } catch (error) {
      console.error('Auth check failed:', error);
      store.dispatch(logout());
      return { isAuthenticated: false, user: null };
    }
  }

  async login(email, password) {
    try {
      const response = await api.post('/api/auth/login', { email, password });

      // Check auth to get user data
      await this.checkAuth();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.data?.errors && error.response.data.errors[0]?.msg) ||
        'Authentication failed.';
      return { success: false, error: errorMessage };
    }
  }

  async signup(name, email, password, organization = '') {
    try {
      const response = await api.post('/api/auth/signup', {
        name,
        email,
        password,
        organization,
      });

      // Check auth to get user data
      await this.checkAuth();
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.data?.errors && error.response.data.errors[0]?.msg) ||
        'Authentication failed.';
      return { success: false, error: errorMessage };
    }
  }

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }

    store.dispatch(logout());
  }
}

export const authService = new AuthService();
export default authService;
