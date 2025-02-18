import React, { useState, useEffect, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Filter, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { courseService } from '@/services/course.service';
import { categoryService } from '@/services/category.service';
import { Course } from '@/interfaces/course.interface';
import { Category } from '@/interfaces/category.interface';
import { toast } from 'sonner';

const ManageCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{key: keyof Course, direction: 'asc' | 'desc'}>({
    key: 'nombre',
    direction: 'asc'
  });

  // Fetch courses and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching courses and categories...');
        const [fetchedCourses, fetchedCategories] = await Promise.all([
          courseService.findAll(),
          categoryService.findAll()
        ]);
        console.log('Fetched Courses:', fetchedCourses);
        console.log('Fetched Categories:', fetchedCategories);
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

  // Filtered and sorted courses
  const processedCourses = useMemo(() => {
    let result = [...courses];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(course => 
        course.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.descripion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory) {
      result = result.filter(course => 
        course.categoryId === filterCategory
      );
    }

    // Sort courses
    result.sort((a, b) => {
      const key = sortConfig.key;
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [courses, searchTerm, filterCategory, sortConfig]);

  // Handle course deletion
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await courseService.remove(courseId);
      setCourses(courses.filter(course => course._id !== courseId));
      toast.success('Curso eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Error al eliminar el curso', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  // Handle sorting
  const handleSort = (key: keyof Course) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Render sorting icon
  const renderSortIcon = (key: keyof Course) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />;
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando Cursos...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestión de Cursos</CardTitle>
            <CardDescription>Administra y organiza tus cursos</CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {/* Open course creation modal */}}
          >
            <Plus className="w-4 h-4" /> Nuevo Curso
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                onClick={() => handleSort('nombre')} 
                className="cursor-pointer hover:bg-gray-100"
              >
                Nombre {renderSortIcon('nombre')}
              </TableHead>
              <TableHead 
                onClick={() => handleSort('descripion')} 
                className="cursor-pointer hover:bg-gray-100"
              >
                Descripción {renderSortIcon('descripion')}
              </TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Dificultad</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedCourses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.nombre}</TableCell>
                <TableCell>{course.descripion}</TableCell>
                <TableCell>
                  {course.categoryId 
                    ? categories.find(cat => cat._id === course.categoryId)?.nombre 
                    : 'Sin categoría'}
                </TableCell>
                <TableCell>{course.difficulty}</TableCell>
                <TableCell>{course.price}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {/* Edit course */}}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
