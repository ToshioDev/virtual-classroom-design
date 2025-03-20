import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from "@/environment/config";
import { LoginResponse, User } from "@/interfaces/user.interface";

class AuthService {
  private axiosInstance: AxiosInstance;
  private isPublicRoute: boolean = false;

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

  setPublicRoute(isPublic: boolean) {
    this.isPublicRoute = isPublic;
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

  private handleError(error: AxiosError): never {
    if (error.response?.status === 401 && !this.isPublicRoute) {
      this.logout();
      if (window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    throw error;
  }

  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      const user = this.getUser();

      if (!token || !user) return false;

      const response = await this.axiosInstance.get('/user/validate-token/' + user._id);
      
      return response.status === 200;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          this.logout();
          if (window.location.pathname !== '/') {
            window.location.href = '/login';
          }
          return false;
        }
      }
      
      console.error('Error de validación de token:', error);
      return false;
    }
  }

  startTokenValidation() {
    const VALIDATION_INTERVAL = 10 * 60 * 1000; // 10 minutos
    const GRACE_PERIOD = 5 * 60 * 1000; // 5 minutos de gracia
    
    let isValidating = false;
    let lastValidationTime: number | null = null;

    const validateAndRedirect = async () => {
      if (isValidating) return;

      const now = Date.now();
      if (lastValidationTime && now - lastValidationTime < VALIDATION_INTERVAL) return;

      try {
        isValidating = true;
        lastValidationTime = now;

        const isValid = await this.validateToken();
        
        if (!isValid && !this.isPublicRoute) {
          if (window.location.pathname !== '/') {
            this.logout();
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Error de validación de token:', error);
      } finally {
        isValidating = false;
      }
    };

    const initialCheckTimeout = setTimeout(() => {
      validateAndRedirect();
    }, GRACE_PERIOD);

    const intervalId = setInterval(validateAndRedirect, VALIDATION_INTERVAL);

    return () => {
      clearTimeout(initialCheckTimeout);
      clearInterval(intervalId);
    };
  }
}

export const authService = new AuthService();
