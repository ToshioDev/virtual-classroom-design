import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from "@/environment/config";

interface CourseBuy {
  _id?: string;
  subscriptionId?: string | null;
  fecha_adquisicion: string;
  renovacion: string;
  estudianteId: string;
  courseId: string;
}

class CourseBuyService {
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

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener todas las compras de cursos
  async findAll(): Promise<CourseBuy[]> {
    try {
      const response = await this.axiosInstance.get('/courses-buyded/all');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Obtener una compra específica
  async findOne(id: string): Promise<CourseBuy> {
    try {
      const response = await this.axiosInstance.get(`/courses-buyded/getById/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Crear una nueva compra
  async create(courseBuyData: Omit<CourseBuy, '_id'>): Promise<CourseBuy> {
    try {
      const response = await this.axiosInstance.post('/courses-buyded/create', courseBuyData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Actualizar una compra
  async update(id: string, courseBuyData: Partial<CourseBuy>): Promise<CourseBuy> {
    try {
      const response = await this.axiosInstance.put(`/courses-buyded/update/${id}`, courseBuyData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Eliminar una compra
  async delete(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/courses-buyded/delete/${id}`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Obtener compras por usuario
  async findByUser(userId: string): Promise<CourseBuy[]> {
    try {
      const response = await this.axiosInstance.get('/courses-buyded/all');
      const allPurchases = Array.isArray(response.data) ? response.data : [];
      return allPurchases.filter(purchase => purchase.estudianteId === userId);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Obtener compras por curso
  async findByCourse(courseId: string): Promise<CourseBuy[]> {
    try {
      const response = await this.axiosInstance.get('/courses-buyded/all');
      const allPurchases = Array.isArray(response.data) ? response.data : [];
      return allPurchases.filter(purchase => purchase.courseId === courseId);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }


  private handleError(error: AxiosError | Error): never {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'An unexpected error occurred'
      );
    }
    
    throw error;
  }
}

export const courseBuyService = new CourseBuyService();
