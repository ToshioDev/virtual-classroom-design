import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from "@/environment/config";
import { LoginResponse, User } from "@/interfaces/user.interface";

class AuthService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.API_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      response => response,
      this.handleError
    );
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const response = await this.axiosInstance.get(`/user/getById/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.axiosInstance.post('/user/login', { email, password });
      const { token, user } = response.data;
      this.setToken(token);
      this.setUser(user);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      const response = await this.axiosInstance.put(`/user/${userId}`, data);
      const updatedUser = response.data;
      this.setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      await this.axiosInstance.post(`/user/${userId}/change-password`, {
        oldPassword,
        newPassword
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getNovaId(): string | null {
    const user = this.getUser();
    return user ? user.novaId : null;
  }

  getCountryCode(): string | null {
    const user = this.getUser();
    return user ? user.countryCode : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.axiosInstance.defaults.headers.common['Authorization'] = '';
  }

  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      const user = this.getUser();

      // If no token or user, consider it invalid
      if (!token || !user) return false;

      // Make a test request to a safe endpoint that requires authentication
      const response = await this.axiosInstance.get('/user/validate-token');
      
      // If the request is successful, the token is valid
      return response.status === 200;
    } catch (error) {
      // If the request fails with 401, the token is invalid
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return false;
        }
      }
      
      // For other errors, log and consider the token potentially invalid
      console.error('Token validation error:', error);
      return false;
    }
  }

  startTokenValidation() {
    // Check token every 10 minutes
    const VALIDATION_INTERVAL = 10 * 60 * 1000; // 10 minutes
    const GRACE_PERIOD = 5 * 60 * 1000; // 5 minutes grace period
    
    // Flag to prevent multiple concurrent validations
    let isValidating = false;
    let lastValidationTime: number | null = null;

    const validateAndRedirect = async () => {
      // Prevent concurrent validations
      if (isValidating) return;

      // Check if enough time has passed since last validation
      const now = Date.now();
      if (lastValidationTime && now - lastValidationTime < VALIDATION_INTERVAL) return;

      try {
        isValidating = true;
        lastValidationTime = now;

        const isValid = await this.validateToken();
        
        if (!isValid) {
          // Check if we're past the grace period
          const token = this.getToken();
          const user = this.getUser();

          if (token && user) {
            // Token is invalid, logout and redirect
            this.logout();
            
            // Use window.location to force full page reload and redirect to login
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Token validation error:', error);
      } finally {
        isValidating = false;
      }
    };

    // Initial check after a short delay to avoid immediate validation on page load
    const initialCheckTimeout = setTimeout(() => {
      validateAndRedirect();
    }, GRACE_PERIOD);

    // Set up periodic validation
    const intervalId = setInterval(validateAndRedirect, VALIDATION_INTERVAL);

    // Return a cleanup function to stop validation
    return () => {
      clearTimeout(initialCheckTimeout);
      clearInterval(intervalId);
    };
  }

  private handleError(error: AxiosError): never {
    if (error.response?.status === 401) {
      this.logout();
      window.location.href = '/login';
    }
    throw error;
  }

}

export const authService = new AuthService();
