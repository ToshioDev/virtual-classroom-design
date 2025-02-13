export interface LoginResponse {
    token: string;
    user: {
      id: string;
      nombre: string;
      email: string;
      telefono: string;
      rol: string;
    };
  }
  