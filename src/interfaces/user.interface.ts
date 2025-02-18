export interface User {
  _id: string;
  novaId: string;
  nombre: string;
  email: string;
  countryCode: string;
  telefono: string;
  rol: string;
  foto_perfil?: string;
  createdAt: Date;
}

export interface LoginResponse {
  token: string;
  user: User;
}
