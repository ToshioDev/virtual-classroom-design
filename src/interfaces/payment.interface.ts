export interface PaymentData {
    _id: string; // ID del pago
    monto: number; // Monto del pago
    razon: string; // Razón del pago
    fecha_pago: Date; // Fecha de pago
    fecha_expiracion: Date; // Fecha de expiración
    estado: 'Pendiente' | 'Aprobado' | 'Rechazado'; // Estado del pago
    voucher?: {
        data: Blob; // Datos del voucher
        contentType: string; // Tipo de contenido del voucher
    };
    ip_transaccion: string; // Dirección IP de la transacción
    dispositivo: string; // Tipo de dispositivo
    detalles_adicionales?: string; // Detalles adicionales
}

// Nueva interfaz PaymentQuery
export interface PaymentQuery {
    estudianteId: string;
    ip_transaccion: string; // Dirección IP de la transacción
    dispositivo: string; // Tipo de dispositivo
    detalles_adicionales?: string; // Detalles adicionales
    voucher: {
        data: File; // Archivo del voucher
        contentType: string; // Tipo de contenido del voucher
    };
} 