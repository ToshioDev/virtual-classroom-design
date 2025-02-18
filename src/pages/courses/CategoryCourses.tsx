import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { courseService } from '@/services/course.service';
import { categoryService } from '@/services/category.service';
import { Course } from '@/interfaces/course.interface';
import { Category } from '@/interfaces/category.interface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Skeleton from '@/components/ui/skeleton';
import { toast } from 'sonner';

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

        // Fetch category details
        const fetchedCategory = await categoryService.findOne(categoryId);
        setCategory(fetchedCategory);

        // Fetch all courses
        const allCourses = await courseService.findAll();
        
        // Filter courses by categoryId
        const filteredCourses = allCourses.filter(course => 
          course.categoryId === categoryId
        );

        setCourses(filteredCourses);
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
        Cursos de {category?.nombre || categoryId}
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
              <Link to={`/topics/${categoryId}/course/${course._id}`} key={course._id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {course.difficulty}
                      </span>
                      <span className="font-bold">
                        ${course.price.toFixed(2)}
                      </span>
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
