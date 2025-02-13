export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  foto_perfil?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
