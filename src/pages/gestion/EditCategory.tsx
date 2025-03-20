import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { categoryService } from "@/services/category.service";
import { courseService } from "@/services/course.service";
import { Category } from "@/interfaces/category.interface";
import { Edit, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from "@/components/ui/Spinner";

const EditCategory: React.FC = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [nombre, setNombre] = useState('');
  const [description, setDescription] = useState('');
  const [imagenReferencia, setImagenReferencia] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  useEffect(() => {
    fetchCategoryAndCourses();
  }, [categoryId]);

  const fetchCategoryAndCourses = async () => {
    if (!categoryId) {
      toast.error('ID de categoría no proporcionado');
      navigate('/gestion/categorias');
      return;
    }

    try {
      setIsFetching(true);
      const [categoryResponse, coursesResponse] = await Promise.all([
        categoryService.findOne(categoryId),
        courseService.findAll()
      ]);
      
      if (categoryResponse && categoryResponse.data) {
        const fetchedCategory = categoryResponse.data;
        
        // Ensure coursesResponse.data exists and is an array before filtering
        const courses = coursesResponse && coursesResponse.data && Array.isArray(coursesResponse.data) 
          ? coursesResponse.data 
          : [];

        // Filter courses by categoryId and store the full course objects
        const categoryCourses = courses.filter(course => 
          course.categoryId === categoryId
        );
        
        // Update category with both cursosId and the full course objects
        fetchedCategory.cursosId = categoryCourses.map(course => course._id);
        fetchedCategory.courses = categoryCourses;
        
        setCategory(fetchedCategory);
        setNombre(fetchedCategory.nombre || '');
        setDescription(fetchedCategory.description || '');
        setImagenReferencia(fetchedCategory.imagen_referencia || '');
      } else {
        toast.error('Categoría no encontrada');
        navigate('/gestion/categorias');
      }
    } catch (error) {
      console.error('Error fetching category and courses:', error);
      toast.error('No se pudo cargar la categoría y sus cursos');
      navigate('/gestion/categorias');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSyncCourses = async () => {
    if (!category || !categoryId) return;

    setIsSyncing(true);
    try {
      const coursesResponse = await courseService.findAll();
      
      if (coursesResponse && coursesResponse.data && Array.isArray(coursesResponse.data)) {
        const categoryCourses = coursesResponse.data.filter(course => 
          course.categoryId === categoryId
        );
        
        const updatedCategory = {
          ...category,
          cursosId: categoryCourses.map(course => course._id)
        };

        await categoryService.update(category._id, updatedCategory);
        setCategory(updatedCategory);
        toast.success('Lista de cursos sincronizada exitosamente');
      }
    } catch (error) {
      console.error('Error syncing courses:', error);
      toast.error('Error al sincronizar los cursos');
    } finally {
      setIsSyncing(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6 md:mb-8 gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="shrink-0 hover:bg-accent"
            onClick={() => navigate('/gestion/categorias')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Edit className="w-7 h-7 text-primary shrink-0" />
            <h1 className="text-2xl md:text-3xl font-bold">Editar Categoría</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg overflow-hidden">
              <div className="relative h-[300px] group">
                <img 
                  src={imagenReferencia || 'https://via.placeholder.com/1200x400.png?text=Imagen+de+Categoría'} 
                  alt={nombre || 'Imagen de categoría'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-4">
                  <div className="w-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all"
                      onClick={() => setIsEditingImage(!isEditingImage)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {isEditingImage && (
                      <Input
                        type="url"
                        value={imagenReferencia}
                        onChange={(e) => setImagenReferencia(e.target.value)}
                        placeholder="https://ejemplo.com/imagen-categoria.jpg"
                        className="mt-2 bg-background/80 backdrop-blur-sm border-2 focus-visible:ring-2 focus-visible:ring-primary h-11 w-[300px]"
                      />
                    )}
                  </div>
                </div>
              </div>
              <CardHeader className="border-b bg-muted/50">
                <CardTitle className="text-xl md:text-2xl">Detalles de la Categoría</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-base font-medium">
                      Nombre de la Categoría
                    </Label>
                    <Input 
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Programación, Diseño, Marketing"
                      className="h-11 bg-background border-2 focus-visible:ring-2 focus-visible:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">
                      Descripción
                    </Label>
                    <Textarea 
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descripción breve de la categoría"
                      className="min-h-[120px] bg-background border-2 focus-visible:ring-2 focus-visible:ring-primary"
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/gestion/categorias')}
                      className="bg-background hover:bg-accent"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar
                      </span>
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent"></div>
                          Actualizando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          Actualizar Categoría
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Cursos Vinculados</CardTitle>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleSyncCourses}
                    disabled={isSyncing}
                    className="h-8 px-2 bg-background hover:bg-accent"
                  >
                    {isSyncing ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent"></div>
                        <span className="text-sm">Sincronizando...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-sm">Sincronizar</span>
                      </span>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {category.cursosId && category.cursosId.length > 0 ? (
                  <div className="space-y-3">
                    {category.cursosId.map((courseId, index) => {
                      const course = category.courses?.find(c => c._id === courseId);
                      return course ? (
                        <div 
                          key={courseId}
                          className="relative h-32 rounded-lg border bg-card overflow-hidden flex"
                        >
                          <div 
                            className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-center opacity-20" 
                            style={{
                              backgroundImage: `url(${course.imageUrl || 'https://via.placeholder.com/400x250.png?text=Curso'})`
                            }}
                          />
                          <div className="relative w-full pl-[50%] p-3 flex flex-col justify-between z-10">
                            <div>
                              <div className="font-medium text-sm">{course.nombre}</div>
                              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {course.descripion}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-sm">
                              <span className="text-muted-foreground">
                                {course.difficulty === 'Principiante' && '🟢'}
                                {course.difficulty === 'Intermedio' && '🟡'}
                                {course.difficulty === 'Avanzado' && '🔴'}
                                {course.difficulty}
                              </span>
                              <span className="text-muted-foreground">{course.duration}</span>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No hay cursos vinculados a esta categoría.</p>
                    <p className="text-sm mt-2">Los cursos se vincularán automáticamente cuando se asignen a esta categoría.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
