import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { categoryService } from "@/services/category.service";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const AddCategory: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [description, setDescription] = useState('');
  const [imagenReferencia, setImagenReferencia] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!nombre.trim()) {
      toast.error('El nombre de la categoría es obligatorio');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare category data
      const newCategory = {
        nombre: nombre.trim(),
        description: description.trim(),
        imagen_referencia: imagenReferencia.trim() || 'https://via.placeholder.com/400x250.png?text=Nueva+Categoría'
      };

      // Call service to create category
      const createdCategory = await categoryService.create(newCategory);

      // Show success toast
      toast.success(`Categoría "${createdCategory.nombre}" creada exitosamente`);

      // Reset form
      setNombre('');
      setDescription('');
      setImagenReferencia('');

      // Navigate back to management panel or category list
      navigate('/gestion/categorias');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error al crear la categoría', {
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
        <h1 className="text-3xl font-bold flex-grow">Nueva Categoría</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Crear Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>
            <div>
              <Label htmlFor="imagenReferencia">URL de Imagen de Referencia</Label>
              <Input 
                id="imagenReferencia"
                value={imagenReferencia}
                onChange={(e) => setImagenReferencia(e.target.value)}
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
                {isLoading ? 'Creando...' : 'Crear Categoría'}
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
