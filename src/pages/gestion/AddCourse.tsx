import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { courseService } from "@/services/course.service";
import { categoryService } from "@/services/category.service";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Category } from '@/interfaces/category.interface';
import { Course } from '@/interfaces/course.interface';

const AddCourse: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [difficulty, setDifficulty] = useState<Course['difficulty']>('Principiante');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await categoryService.findAll();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('No se pudieron cargar las categorías', {
          description: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!nombre.trim()) {
      toast.error('El nombre del curso es obligatorio');
      return;
    }

    if (!categoryId) {
      toast.error('Debe seleccionar una categoría');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare course data with strict type checking
      const newCourse: Omit<Course, '_id'> = {
        nombre: nombre.trim(),
        descripion: descripcion.trim(),
        difficulty: difficulty,
        price: parseFloat(price) || 0,
        duration: duration || 'Sin especificar',
        categoryId: categoryId,
        imageUrl: imageUrl.trim() || 'https://via.placeholder.com/400x250.png?text=Nuevo+Curso',
        docenteId: [], // TODO: Add docente logic
        videos: [], // TODO: Add video management
        rating: 0 // Default rating
      };

      // Call service to create course
      const createdCourse = await courseService.create(newCourse);

      // Show success toast
      toast.success(`Curso "${createdCourse.nombre}" creado exitosamente`);

      // Reset form
      setNombre('');
      setDescripcion('');
      setDifficulty('Principiante');
      setPrice('');
      setDuration('');
      setCategoryId('');
      setImageUrl('');

      // Navigate back to courses list
      navigate('/gestion/categorias');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Error al crear el curso', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/gestion')}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold flex-grow">Nuevo Curso</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Crear Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del Curso</Label>
              <Input 
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Introducción a Python, Diseño UX/UI"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="descripcion">Descripción del Curso</Label>
              <Textarea 
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción detallada del curso"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="difficulty">Nivel de Dificultad</Label>
                <Select 
                  value={difficulty} 
                  onValueChange={(value: Course['difficulty']) => setDifficulty(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar dificultad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Principiante">Principiante</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="categoryId">Categoría</Label>
                <Select 
                  value={categoryId} 
                  onValueChange={setCategoryId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem 
                        key={category._id} 
                        value={category._id}
                      >
                        {category.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input 
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Precio del curso"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duración</Label>
                <Input 
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ej. 4 semanas, 40 horas"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="imageUrl">URL de Imagen del Curso</Label>
              <Input 
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL de una imagen representativa (opcional)"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/gestion/categorias')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? 'Creando...' : 'Crear Curso'}
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCourse;
