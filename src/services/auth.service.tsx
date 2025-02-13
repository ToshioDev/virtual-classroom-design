import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from "../environment/config"; 
import { LoginResponse } from "../interfaces/user.interface"; 

class AuthService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.API_URL,
      timeout: 5000,
    });

    this.axiosInstance.interceptors.response.use(
      response => response,
      error => this.handleError(error)
    );
  }

  async login<T = LoginResponse>(url: string, data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post(url, data);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getUser(): { id: string; nombre: string; email: string; telefono: string; rol: string } | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      console.error('Error en la respuesta del servidor:', error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }

    throw error;
  }
}

export default new AuthService();
