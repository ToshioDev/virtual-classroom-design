import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Trash2, Edit, Plus } from 'lucide-react';
import { courseService } from '@/services/course.service';
import { categoryService } from '@/services/category.service';
import { Course } from '@/interfaces/course.interface';
import { Category } from '@/interfaces/category.interface';
import { toast } from 'sonner';

const ListCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const navigate = useNavigate();

  // Fetch courses and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedCourses, fetchedCategories] = await Promise.all([
          courseService.findAll(),
          categoryService.findAll()
        ]);
        setCourses(fetchedCourses);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error al cargar cursos y categorías', {
          description: error instanceof Error ? error.message : 'Error desconocido'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses
  const filteredCourses = courses.filter(course => 
    (course.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
     course.descripion.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory ? course.categoryId === filterCategory : true)
  );

  // Handle course deletion
  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      await courseService.remove(selectedCourse._id!);
      setCourses(courses.filter(course => course._id !== selectedCourse._id));
      toast.success('Curso eliminado exitosamente');
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Error al eliminar el curso', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  // Open delete dialog
  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
        <Button 
          onClick={() => navigate('/gestion/curso/nuevo')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo Curso
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input 
          placeholder="Buscar cursos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select 
          value={filterCategory} 
          onValueChange={setFilterCategory}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por Categoría">
              {filterCategory 
                ? categories.find(cat => cat._id === filterCategory)?.nombre 
                : 'Todas las Categorías'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las Categorías</SelectItem>
            {categories.map(category => (
              <SelectItem key={category._id} value={category._id}>
                {category.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredCourses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Sin Cursos</CardTitle>
            <CardDescription>
              No se encontraron cursos. Crea un nuevo curso para comenzar.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map(course => (
            <Card key={course._id} className="hover:shadow-lg transition-shadow duration-300">
              {course.imageUrl && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.nombre} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{course.nombre}</CardTitle>
                <CardDescription>{course.descripion}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold">Dificultad:</span> {course.difficulty}
                  </div>
                  <div>
                    <span className="font-semibold">Precio:</span> ${course.price.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-semibold">Categoría:</span>{' '}
                    {categories.find(cat => cat._id === course.categoryId)?.nombre || 'Sin categoría'}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate(`/gestion/curso/editar/${course._id}`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => openDeleteDialog(course)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={!!selectedCourse} 
        onOpenChange={() => setSelectedCourse(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Curso</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el curso "{selectedCourse?.nombre}"?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCourse}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListCourses;
