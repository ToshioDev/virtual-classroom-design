import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { categoryService } from "@/services/category.service";
import { Category } from "@/interfaces/category.interface";
import { Edit, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from 'react-router-dom';

const EditCategory: React.FC = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [nombre, setNombre] = useState('');
  const [description, setDescription] = useState('');
  const [imagenReferencia, setImagenReferencia] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    if (!categoryId) {
      toast.error('ID de categoría no proporcionado');
      navigate('/gestion/categorias');
      return;
    }

    try {
      setIsFetching(true);
      const fetchedCategory = await categoryService.findOne(categoryId);
      
      if (!fetchedCategory) {
        toast.error('Categoría no encontrada');
        navigate('/gestion/categorias');
        return;
      }

      setCategory(fetchedCategory);
      setNombre(fetchedCategory.nombre);
      setDescription(fetchedCategory.description || '');
      setImagenReferencia(fetchedCategory.imagen_referencia || '');
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('No se pudo cargar la categoría');
      navigate('/gestion/categorias');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!nombre.trim()) {
      toast.error('El nombre de la categoría es obligatorio');
      return;
    }

    if (!category) return;

    setIsLoading(true);

    try {
      // Prepare updated category data
      const updatedCategory = {
        ...category,
        nombre: nombre.trim(),
        description: description.trim(),
        imagen_referencia: imagenReferencia.trim() || 'https://via.placeholder.com/400x250.png?text=Categoría'
      };

      // Call service to update category
      const result = await categoryService.update(category._id, updatedCategory);

      // Show success toast
      toast.success(`Categoría "${result.nombre}" actualizada exitosamente`);

      // Navigate back to category list
      navigate('/gestion/categorias');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('No se pudo actualizar la categoría. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center">
        <div className="text-center">
          <span className="loading-spinner">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4"
          onClick={() => navigate('/gestion/categorias')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Edit className="w-8 h-8 mr-4 text-primary" />
        <h1 className="text-3xl font-bold">Editar Categoría</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nombre">Nombre de la Categoría</Label>
              <Input 
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Programación, Diseño, Marketing"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción breve de la categoría"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="imagen">URL de Imagen de Referencia (Opcional)</Label>
              <Input 
                id="imagen"
                type="url"
                value={imagenReferencia}
                onChange={(e) => setImagenReferencia(e.target.value)}
                placeholder="https://ejemplo.com/imagen-categoria.jpg"
              />
              {imagenReferencia && (
                <div className="mt-4">
                  <Label>Vista Previa de Imagen</Label>
                  <img 
                    src={imagenReferencia} 
                    alt="Vista previa" 
                    className="max-w-full h-auto mt-2 rounded-md border"
                  />
                </div>
              )}
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
              >
                {isLoading ? 'Actualizando...' : 'Actualizar Categoría'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
