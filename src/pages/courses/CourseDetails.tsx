import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseService } from '@/services/course.service';
import { Course } from '@/interfaces/course.interface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, BookOpen, Clock, Star, DollarSign } from 'lucide-react';
import Skeleton from '@/components/ui/skeleton';

const CourseDetails: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { courseId } = useParams<{ courseId: string }>();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (courseId) {
        try {
          setIsLoading(true);
          const fetchedCourse = await courseService.findOne(courseId);
          setCourse(fetchedCourse);
        } catch (error) {
          console.error('Error fetching course details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <Skeleton className="aspect-video w-full" />
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-2 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!course) {
    return <div className="container mx-auto py-8 px-4">Course not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={course.imageUrl} 
            alt={course.nombre}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{course.nombre}</CardTitle>
          <CardDescription>{course.descripion}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <User className="w-4 h-4" />
                <span>Docentes: {course.docenteId.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <BookOpen className="w-4 h-4" />
                <span>Dificultad: {course.difficulty}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="w-4 h-4" />
                <span>Duración: {course.duration}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Star className="w-4 h-4" />
                <span>Calificación: {course.rating}/5</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <DollarSign className="w-4 h-4" />
                <span>Precio: ${course.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetails;
