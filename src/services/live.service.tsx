import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from "@/environment/config";
import { Live } from "@/interfaces/live.interface";

class LiveService {
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

  async findAll(): Promise<Live[]> {
    try {
      const response = await this.axiosInstance.get('/lives/all');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async findOne(liveId: string): Promise<Live> {
    try {
      if (!liveId || typeof liveId !== 'string') {
        throw new Error('Invalid live ID provided');
      }
      const response = await this.axiosInstance.get(`/lives/getById/${liveId.trim()}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async create(liveData: Partial<Live>): Promise<Live> {
    try {
      const response = await this.axiosInstance.post('/lives/create', liveData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async update(liveId: string, liveData: Partial<Live>): Promise<Live> {
    try {
      const response = await this.axiosInstance.put(`/lives/update/${liveId}`, liveData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async remove(liveId: string): Promise<Live> {
    try {
      const response = await this.axiosInstance.delete(`/lives/delete/${liveId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async findZoomLives(): Promise<Live[]> {
    try {
      const allLives = await this.findAll();
      return allLives.filter(live => live.isZoomLive === true);
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

export const liveService = new LiveService();
