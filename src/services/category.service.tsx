import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from "@/environment/config";
import { Category } from "@/interfaces/category.interface";

class CategoryService {
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

  // Method to get all categories
  async findAll(): Promise<Category[]> {
    try {
      const response = await this.axiosInstance.get('/category-courses/all');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Method to get a single category by ID
  async findOne(categoryId: string): Promise<Category> {
    try {
      const response = await this.axiosInstance.get(`/category-courses/getById/${categoryId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Method to create a new category
  async create(category: Partial<Category>): Promise<Category> {
    try {
      const response = await this.axiosInstance.post('/category-courses/create', category);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Method to update an existing category
  async update(categoryId: string, category: Partial<Category>): Promise<Category> {
    try {
      const response = await this.axiosInstance.put(`/category-courses/update/${categoryId}`, category);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Method to delete a category
  async remove(categoryId: string): Promise<Category> {
    try {
      const response = await this.axiosInstance.delete(`/category-courses/delete/${categoryId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Token management methods (similar to auth service)
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Error handling method
  private handleError = (error: AxiosError | Error): never => {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
      }
    } else {
      // Handle generic errors
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

export const categoryService = new CategoryService();
