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
import { Trash2, Edit, Plus, BookOpen, DollarSign, Clock, BarChart3, Folder, FileText, Users } from 'lucide-react';
import { courseService } from '@/services/course.service';
import { categoryService } from '@/services/category.service';
import { Course } from '@/interfaces/course.interface';
import { Category } from '@/interfaces/category.interface';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

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
        const [coursesResponse, categoriesResponse] = await Promise.all([
          courseService.findAll(),
          categoryService.findAll()
        ]);

        if (coursesResponse && coursesResponse.data && Array.isArray(coursesResponse.data)) {
          const coursesData = coursesResponse.data.map(item => ({
            _id: item._id,
            nombre: item.nombre,
            descripion: item.descripion,
            difficulty: item.difficulty,
            price: item.price,
            duration: item.duration,
            categoryId: item.categoryId,
            imageUrl: item.imageUrl,
            docenteId: item.docenteId,
            videos: item.videos,
            rating: item.rating
          }));
          setCourses(coursesData);
        }

        if (categoriesResponse && categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          const categoriesData = categoriesResponse.data.map(item => ({
            _id: item._id,
            nombre: item.nombre,
            description: item.description,
            imagen_referencia: item.imagen_referencia,
            cursosId: item.cursosId
          }));
          setCategories(categoriesData);
        }
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
    (filterCategory === 'all' || filterCategory === '' ? true : course.categoryId === filterCategory)
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
            <SelectItem value="all">Todas las Categorías</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card 
              key={course._id} 
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 bg-card border-border"
            >
              <div className="relative">
                <img
                  src={course.imageUrl || '/placeholder-course.jpg'}
                  alt={course.nombre}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold line-clamp-2 flex items-center gap-2 h-[3.5rem]">
                    <BookOpen className="w-5 h-5 text-primary shrink-0" />
                    {course.nombre}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`flex items-center gap-2 ${
                        course.difficulty === 'Principiante' ? 'bg-emerald-100 text-emerald-700' :
                        course.difficulty === 'Intermedio' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      {course.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 bg-green-100 text-green-700">
                      <DollarSign className="w-4 h-4" />
                      ${course.price}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 bg-blue-100 text-blue-700">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-2 bg-amber-100 text-amber-700">
                      <Folder className="w-4 h-4" />
                      {categories.find(cat => cat._id === course.categoryId)?.nombre || 'Sin categoría'}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4 mt-1 shrink-0" />
                    <p className="text-sm line-clamp-2 h-[2.5rem]">
                      {course.descripion}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {course.docenteId?.length || 0} Docentes
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/gestion/curso/editar/${course._id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(course)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
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
