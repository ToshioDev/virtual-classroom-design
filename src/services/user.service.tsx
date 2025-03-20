import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from "@/environment/config";
import { User } from "@/interfaces/user.interface";

class UserService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.API_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add request interceptor to include authorization token
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

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      this.handleError
    );
  }

  // Get token from local storage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Create a new user
  async create(userData: Partial<User>): Promise<{ 
    message: string, 
    user: User, 
    token: string 
  }> {
    try {
      const response = await this.axiosInstance.post('/user/create', userData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get all users
  async findAll(): Promise<User[]> {
    try {
      const response = await this.axiosInstance.get('/user/all');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get user by ID
  async findOne(userId: string): Promise<any> {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID provided');
      }
      const response = await this.axiosInstance.get(`/user/getById/${userId.trim()}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get user by NovaId
  async findByNovaId(novaId: string): Promise<User> {
    try {
      const response = await this.axiosInstance.get(`/user/getByNovaId/${novaId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Update a user
  async update(userId: string, userData: Partial<User> | FormData): Promise<User> {
    try {
      // Check if it's FormData
      if (userData instanceof FormData) {
        const response = await this.axiosInstance.put(`/user/update/${userId}`, userData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      }

      // Regular JSON update
      const response = await this.axiosInstance.put(`/user/update/${userId}`, userData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Delete a user
  async remove(userId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(`/user/delete/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Change password
  async changePassword(userId: string, newPassword: string): Promise<any> {
    try {
      const response = await this.axiosInstance.patch(`/user/change-password/${userId}`, { 
        newPassword 
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Enrolar un usuario en un curso
  async enrollInCourse(userId: string, courseId: string): Promise<User> {
    try {
      const user = await this.findOne(userId);
      const enrolledCourses = [...(user.enrolledCoursesIds || []), courseId];
      const updateData: Partial<User> = {
        enrolledCoursesIds: enrolledCourses
      };
      return await this.update(userId, updateData);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Desenrolar un usuario de un curso
  async unenrollFromCourse(userId: string, courseId: string): Promise<User> {
    try {
      const user = await this.findOne(userId);
      const enrolledCourses = (user.enrolledCoursesIds || []).filter(id => id !== courseId);
      const response = await this.axiosInstance.put(`/user/update/${userId}`, {
        enrolledCoursesIds: enrolledCourses
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Obtener los cursos enrolados de un usuario
  async getEnrolledCourses(userId: string): Promise<string[]> {
    try {
      const user = await this.findOne(userId);
      return user.enrolledCoursesIds || [];
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Verificar si un usuario está enrolado en un curso
  async isEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
    try {
      const user = await this.findOne(userId);
      return (user.enrolledCoursesIds || []).includes(courseId);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Handle errors consistently
  private handleError(error: AxiosError | Error): never {
    if (axios.isAxiosError(error)) {
      // Handle specific axios errors
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Throw a more informative error
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'An unexpected error occurred'
      );
    }
    
    // For non-axios errors
    throw error;
  }
}

export const userService = new UserService();
