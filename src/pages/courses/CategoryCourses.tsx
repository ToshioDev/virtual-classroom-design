import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { courseService } from '@/services/course.service';
import { categoryService } from '@/services/category.service';
import { Course } from '@/interfaces/course.interface';
import { Category } from '@/interfaces/category.interface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Clock, PlayCircle, Gauge, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getDifficultyColor = (difficulty: string) => {
  const colors = {
    'Principiante': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Intermedio': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Avanzado': 'bg-red-500/10 text-red-500 border-red-500/20'
  };
  return colors[difficulty as keyof typeof colors] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';
};

const CategoryCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { categoryId } = useParams<{ categoryId: string }>();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!categoryId) {
        setError('Categoría no especificada');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch category details using categoryService
        const fetchedCategory = await categoryService.findOne(categoryId);
        setCategory(fetchedCategory);
        // Fetch courses for the category
        const response = await courseService.findAll();
        const categoryWithCourses = response.data.filter(course => course.categoryId === categoryId);
        setCourses(categoryWithCourses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('No se pudieron cargar los cursos');
        toast.error('Error al cargar cursos', {
          description: error instanceof Error ? error.message : 'Error desconocido'
        });
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Cursos de {category?.data.nombre || 'Categoría no encontrada'}
      </h1>
      <div className="grid md:grid-cols-3 gap-4">
        {courses.length === 0 
          ? (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Sin Cursos</CardTitle>
                <CardDescription>
                  No encontramos cursos en esta categoría.
                </CardDescription>
              </CardHeader>
            </Card>
          )
          : courses.map(course => (
              <Link to={`/course/${course._id}`} key={course._id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                  {/* Price ribbon */}
                  <div className="absolute top-4 -right-8 rotate-45 z-10">
                    <div className="bg-primary/90 text-primary-foreground py-1 px-12 text-sm font-semibold shadow-sm">
                      ${course.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Rest of card content */}
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={course.imageUrl || '/default-course-image.png'} 
                      alt={course.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{course.nombre}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.descripion}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge 
                          variant="outline" 
                          className={`flex items-center gap-1 ${getDifficultyColor(course.difficulty)}`}
                        >
                          <Gauge className="w-3 h-3" />
                          {course.difficulty}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration || "--:--"}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <PlayCircle className="w-3 h-3" />
                          {course.videos?.length || 0} videos
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs text-muted-foreground flex-1">
                          * Al pagar quedarás inscrito automáticamente
                        </p>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <DollarSign className="w-3 h-3" />
                          Pagar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default CategoryCourses;
