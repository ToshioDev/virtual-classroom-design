import axios, { AxiosError, AxiosInstance } from 'axios';
import { env } from "@/environment/config";
import { PaymentData, PaymentQuery } from '../interfaces/payment.interface'; // Asegúrate de crear este archivo para la interfaz

class PaymentService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: env.API_URL,
            timeout: 5000,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
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

    async findAll(): Promise<PaymentData[]> {
        try {
            const response = await this.axiosInstance.get('/payments/all');
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }
      
    async findOne(paymentId: string): Promise<PaymentData> {
        try {
          if (!paymentId || typeof paymentId !== 'string') {
            throw new Error('Invalid payment ID provided');
          }
          const response = await this.axiosInstance.get(`/payments/getById/${paymentId.trim()}`);
          return response.data;
        } catch (error) {
          this.handleError(error);
          throw error;
        }
    }

    async processPaymentImage(paymentQuery: PaymentQuery) {
        const formData = new FormData();
        formData.append('file', paymentQuery.voucher.data);
        formData.append('estudianteId', paymentQuery.estudianteId);
        formData.append('ip_transaccion', paymentQuery.ip_transaccion);
        formData.append('dispositivo', paymentQuery.dispositivo);
        formData.append('detalles_adicionales', paymentQuery.detalles_adicionales);

        try {
            const response = await this.axiosInstance.post('/payments/process-payment-image', formData);
            return response.data;
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
                'Ocurrió un error inesperado'
            );
        }
        throw error;
    }
}

export const paymentService = new PaymentService(); 