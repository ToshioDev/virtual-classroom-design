import { User } from './user.interface';
import { Live } from './live.interface';

export interface Course {
 
  _id?: string;
  nombre: string;
  descripion: string;
  imageUrl?: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: string;
  rating: number;
  price: number;
  categoryId: string;
  docenteId: User[];
  videos?: Live[];
}
