import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FileCheck, AlertCircle, DollarSign, Gauge, BookOpen, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/services/user.service";
import { courseService } from "@/services/course.service";
import { categoryService } from "@/services/category.service";
import { courseBuyService } from "@/services/courseBuy.service";
import UserAvatar from "@/components/UserAvatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { CourseAssignmentUtil } from "@/utils/courseAssignment.util";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const getDifficultyColor = (difficulty: string) => {
  const colors = {
    'Principiante': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Intermedio': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Avanzado': 'bg-red-500/10 text-red-500 border-red-500/20'
  };
  return colors[difficulty as keyof typeof colors] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';
};

interface User {
  _id: string;
  nombre: string;
  email: string;
  novaId: string;
  foto_perfil?: string;
  enrolledCoursesIds?: string[];
}

interface Course {
  _id: string;
  nombre: string;
  descripion: string;
  imageUrl: string;
  difficulty: string;
  duration: string;
  rating: number;
  price: number;
  categoryId: string;
  docenteId: string[];
  videos: any[];
}

interface Category {
  _id: string;
  name: string;
}

interface StudentRenewalDate {
  userId: string;
  renewalDate: Date;
}

export default function AssignCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [studentRenewalDates, setStudentRenewalDates] = useState<StudentRenewalDate[]>([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  });

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Ingresa un Nova ID para buscar");
      return;
    }

    setLoading(true);
    try {
      const user = await userService.findByNovaId(searchTerm);
      if (selectedUsers.some(u => u._id === user._id)) {
        toast.error("Este usuario ya está seleccionado");
        return;
      }
      setSelectedUsers(prev => [...prev, user]);
      
      if (selectedUsers.length === 0) {
        const coursesData = await courseService.findAll();
        setAllCourses(coursesData || []);
        setAvailableCourses(coursesData || []);
      }
      
      setSearchTerm("");
    } catch (error) {
      toast.error("Usuario no encontrado");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user._id !== userId));
    setStudentRenewalDates(prev => prev.filter(date => date.userId !== userId));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.findAll();
        setCategories(response || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filterCourses = () => {
      if (!allCourses.length) return;
      
      if (subjectFilter === "all") {
        setAvailableCourses(allCourses);
      } else {
        const filtered = allCourses.filter(course => course.categoryId === subjectFilter);
        setAvailableCourses(filtered);
      }
    };

    filterCourses();
  }, [subjectFilter, allCourses]);

  const toggleCourseSelection = (course: Course) => {
    setSelectedCourses(prev => {
      const isSelected = prev.some(c => c._id === course._id);
      if (isSelected) {
        return prev.filter(c => c._id !== course._id);
      } else {
        return [...prev, course];
      }
    });
  };

  const handleRenewalDateChange = (userId: string, date: Date | undefined) => {
    if (!date) return;
    setStudentRenewalDates(prev => {
      const existing = prev.find(s => s.userId === userId);
      if (existing) {
        return prev.map(s => s.userId === userId ? { ...s, renewalDate: date } : s);
      }
      return [...prev, { userId, renewalDate: date }];
    });
  };

  const handleAssign = async () => {
    if (selectedUsers.length === 0 || selectedCourses.length === 0) {
      toast.error("Selecciona al menos un usuario y un curso");
      return;
    }

    setLoading(true);
    try {
      const userIds = selectedUsers.map(user => user._id);
      const courseIds = selectedCourses.map(course => course._id);

      if (selectedUsers.length === 1) {
        const renewalDate = studentRenewalDates.find(s => s.userId === userIds[0])?.renewalDate;
        await CourseAssignmentUtil.assignMultipleCoursesToStudent(
          userIds[0],
          courseIds,
          renewalDate ? renewalDate.toISOString() : undefined
        );
        toast.success(`${selectedCourses.length} curso(s) asignado(s) al estudiante`);
      } else {
        await CourseAssignmentUtil.assignMultipleCoursesToMultipleStudents(
          userIds,
          courseIds
        );
        await Promise.all(
          studentRenewalDates.map(async date => {
            const userPurchases = await courseBuyService.findByUser(date.userId);
            return Promise.all(
              userPurchases.map(purchase => 
                courseBuyService.update(purchase._id!, {
                  renovacion: date.renewalDate.toISOString()
                })
              )
            );
          })
        );
        toast.success(`${selectedCourses.length} curso(s) asignado(s) a ${selectedUsers.length} estudiantes`);
      }
      
      setSelectedCourses([]);
      setSelectedUsers([]);
      setStudentRenewalDates([]);
      setShowRenewalDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Error al asignar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleNextStudent = () => {
    if (currentStudentIndex < selectedUsers.length - 1) {
      setCurrentStudentIndex(prev => prev + 1);
    }
  };

  const handlePrevStudent = () => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(prev => prev - 1);
    }
  };

  const currentStudent = selectedUsers[currentStudentIndex];
  const currentRenewalDate = studentRenewalDates.find(s => s.userId === currentStudent?._id)?.renewalDate;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Asignar Cursos</CardTitle>
          <CardDescription>
            Asigna cursos a estudiantes después de confirmar su compra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
            <Input
              placeholder="Buscar por Nova ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button 
              type="submit"
              disabled={loading}
            >
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </form>

          {selectedUsers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Usuarios Seleccionados ({selectedUsers.length})</h3>
              <div className="space-y-2">
                {selectedUsers.map((user) => (
                  <div key={user._id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                    <UserAvatar
                      name={user.nombre || user.novaId}
                      photoUrl={user.foto_perfil}
                      size="sm"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{user.nombre}</h4>
                      <p className="text-sm text-muted-foreground">
                        Nova ID: {user.novaId}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeUser(user._id)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Seleccionar Curso</h3>
                <Select
                  value={subjectFilter}
                  onValueChange={setSubjectFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por materia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las materias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCourses.length > 0 ? (
                  availableCourses.map((course) => (
                    <Card
                      key={course._id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedCourses.some(c => c._id === course._id)
                          ? "ring-2 ring-primary" 
                          : "hover:shadow-md"
                      }`}
                      onClick={() => toggleCourseSelection(course)}
                    >
                      <div className="aspect-video w-full">
                        <img 
                          src={course.imageUrl || '/default-course-image.png'}
                          alt={course.nombre}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium line-clamp-1">{course.nombre}</h4>
                          {selectedCourses.some(c => c._id === course._id) && (
                            <FileCheck className="w-4 h-4 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {course.descripion}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {course.price.toFixed(2)}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`flex items-center gap-1 ${getDifficultyColor(course.difficulty)}`}
                          >
                            <Gauge className="w-3 h-3" />
                            {course.difficulty}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <CardTitle className="text-xl mb-2">
                          No hay cursos disponibles
                        </CardTitle>
                        <CardDescription className="mb-6">
                          {subjectFilter === "all" 
                            ? "No se encontraron cursos para asignar"
                            : "Esta materia no tiene cursos disponibles para asignar"}
                        </CardDescription>
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/gestion/curso/nuevo");
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar nuevo curso
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedUsers.length > 0 && selectedCourses.length > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedCourses.length} curso(s) seleccionado(s) para {selectedUsers.length} usuario(s)
              </p>
              <Dialog open={showRenewalDialog} onOpenChange={setShowRenewalDialog}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setShowRenewalDialog(true)}
                    disabled={selectedUsers.length === 0 || selectedCourses.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Asignando...
                      </>
                    ) : (
                      "Asignar Cursos"
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <div className="flex items-center gap-2">
                      <DialogTitle>Fechas de Renovación</DialogTitle>
                      <Badge variant="outline">
                        {currentStudentIndex + 1} de {selectedUsers.length}
                      </Badge>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handlePrevStudent}
                          disabled={currentStudentIndex === 0}
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center">
                          <Label className="text-lg font-semibold">{currentStudent?.nombre}</Label>
                        </div>
                        <Badge 
                          variant={currentRenewalDate ? "secondary" : "destructive"} 
                          className="mr-8"
                        >
                          {currentRenewalDate 
                            ? format(currentRenewalDate, "PPP", { locale: es })
                            : "Sin fecha de renovación"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleNextStudent}
                          disabled={currentStudentIndex === selectedUsers.length - 1}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <Calendar
                        mode="single"
                        selected={currentRenewalDate}
                        onSelect={(date) => handleRenewalDateChange(currentStudent._id, date)}
                        className="rounded-md border"
                        locale={es}
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        recommendedDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowRenewalDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAssign}>
                      Confirmar Asignación
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {selectedUsers.length === 0 && !loading && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Busca usuarios</h3>
              <p className="text-muted-foreground">
                Ingresa el Nova ID de cada estudiante para asignarles cursos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
