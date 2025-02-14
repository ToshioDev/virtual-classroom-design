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
    if (error.response?.status === 401) {
      this.logout();
      window.location.href = '/login';
    }
    throw error;
  }

}

export const authService = new AuthService();
