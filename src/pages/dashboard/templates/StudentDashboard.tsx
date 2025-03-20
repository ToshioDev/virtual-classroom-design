import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, BarChart, Award, GraduationCap, FileText, BookX, PlayCircle, BookMarked, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { courseService } from "@/services/course.service";
import { Course } from "@/interfaces/course.interface";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";

const COURSES_PER_PAGE = 6;

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadEnrolledCourses = async () => {
      try {
        const currentUser = authService.getUser();
        if (!currentUser) return;

        // Obtener los IDs de los cursos enrolados del usuario
        const enrolledCourseIds = await userService.getEnrolledCourses(currentUser._id);
        
        if (enrolledCourseIds.length > 0) {
          // Obtener la información de los cursos directamente
          const courses = await Promise.all(
            enrolledCourseIds.map(id => courseService.findOne(id))
          );
          
          setEnrolledCourses(courses.filter(course => course !== null) as Course[]);
        }
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEnrolledCourses();
  }, []);

  const totalPages = Math.ceil(enrolledCourses.length / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const currentCourses = enrolledCourses.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard del Estudiante</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Inscritos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              Cursos activos
            </p>
          </CardContent>
        </Card>

        <Card className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <GraduationCap className="h-12 w-12 text-white mb-2" />
            <span className="text-white font-semibold text-lg">En Desarrollo</span>
            <span className="text-white/80 text-sm mt-1">Próximamente disponible</span>
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo de Estudio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">
              +5h desde la última semana
            </p>
          </CardContent>
        </Card>

        <Card className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <GraduationCap className="h-12 w-12 text-white mb-2" />
            <span className="text-white font-semibold text-lg">En Desarrollo</span>
            <span className="text-white/80 text-sm mt-1">Próximamente disponible</span>
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">
              +5% desde la última semana
            </p>
          </CardContent>
        </Card>

        <Card className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <GraduationCap className="h-12 w-12 text-white mb-2" />
            <span className="text-white font-semibold text-lg">En Desarrollo</span>
            <span className="text-white/80 text-sm mt-1">Próximamente disponible</span>
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5</div>
            <p className="text-xs text-muted-foreground">
              +0.2 desde el último mes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Mis Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : enrolledCourses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCourses.map((course) => (
                    <Card key={course.data._id} className="hover:shadow-lg transition-shadow overflow-hidden group">
                      <div className="relative h-48">
                        <img 
                          src={course.data.imageUrl || "https://placehold.co/600x400"} 
                          alt={course.data.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/course/${course.data._id}`)}>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Continuar
                          </Button>
                        </div>
                      </div>
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-lg line-clamp-1">{course.data.nombre}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.data.descripion}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${course.data.difficulty === 'Principiante' ? 'bg-green-100 text-green-800' :
                              course.data.difficulty === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
                              course.data.difficulty === 'Avanzado' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {course.data.difficulty ? course.data.difficulty.charAt(0).toUpperCase() + course.data.difficulty.slice(1) : 'N/A'}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <BookMarked className="h-3 w-3 mr-1" />
                            {course.data.videos?.length || 0} videos
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Calendar className="h-3 w-3 mr-1" />
                            {course.data.duration || 'N/A'}
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <BookX className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No tienes cursos inscritos</p>
                <p className="text-sm text-muted-foreground mt-2">Explora nuestra oferta de cursos y comienza tu aprendizaje</p>
                <Button className="mt-4" onClick={() => navigate("/topics")}>
                  Explorar Cursos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Boletines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Aquí irían los boletines del estudiante */}
              <div className="text-sm text-muted-foreground">
                No hay boletines disponibles
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 