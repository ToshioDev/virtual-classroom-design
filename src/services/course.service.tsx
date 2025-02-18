import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from "@/environment/config";
import { Course } from "@/interfaces/course.interface";

class CourseService {
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

  // Get all courses
  async findAll(): Promise<Course[]> {
    try {
      const response = await this.axiosInstance.get('/courses/all');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get course by ID
  async findOne(courseId: string): Promise<Course> {
    try {
      const response = await this.axiosInstance.get(`/courses/getById/${courseId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get course details with related information
  async findCourseWithDetails(courseId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/courses/view-details/${courseId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Create a new course
  async create(courseData: Partial<Course>): Promise<Course> {
    try {
      const response = await this.axiosInstance.post('/courses/create', courseData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Update a course
  async update(courseId: string, courseData: Partial<Course>): Promise<Course> {
    try {
      const response = await this.axiosInstance.put(`/courses/update/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Delete a course
  async remove(courseId: string): Promise<Course> {
    try {
      const response = await this.axiosInstance.delete(`/courses/delete/${courseId}`);
      return response.data;
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

export const courseService = new CourseService();
