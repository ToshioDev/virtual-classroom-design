import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseService } from "@/services/course.service";
import { categoryService } from "@/services/category.service";
import { userService } from "@/services/user.service";
import {
  Edit,
  ArrowLeft,
  Plus,
  Trash2,
  Video,
  Users,
  Search,
  UserPlus,
  UserMinus,
  Link2, VideoIcon, MonitorPlay 
} from "lucide-react";
import { toast } from "sonner";
import { Category } from '@/interfaces/category.interface';
import { Course } from '@/interfaces/course.interface';
import { User } from '@/interfaces/user.interface';
import { Live } from '@/interfaces/live.interface';
import UserAvatar from '@/components/UserAvatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import { liveService } from '@/services/live.service';
import { Switch } from "@/components/ui/switch";
import Spinner from "@/components/ui/Spinner";

const EditCourse: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [difficulty, setDifficulty] = useState<Course['difficulty']>('Principiante');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [videos, setVideos] = useState<Live[]>([]);
  const [newVideo, setNewVideo] = useState<Partial<Live>>({
    name: '',
    url_video: '',
    thumbnail: '',
    isZoomLive: false,
    descripcion: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTeacherTerm, setSearchTeacherTerm] = useState('');
  const [availableTeachers, setAvailableTeachers] = useState<User[]>([]);
  const [assignedTeachers, setAssignedTeachers] = useState<User[]>([]);
  const [createdLiveVideo, setCreatedLiveVideo] = useState<Live | null>(null);
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher =>
      teacher.nombre.toLowerCase().includes(searchTeacherTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTeacherTerm.toLowerCase())
    );
  }, [teachers, searchTeacherTerm]);

  // Add this helper function
  const isTeacherAssigned = (teacherId: string) => {
    return assignedTeachers.some(teacher => teacher._id === teacherId);
  };

  useEffect(() => {
    fetchCourseAndData();
  }, [courseId]);

  const fetchTeacherData = async () => {
    try {
      const allTeachersResponse = await userService.findAll();
      if (allTeachersResponse) {
        const allTeachers = allTeachersResponse.filter(user => user.rol === 'teacher');
        
        // Split teachers into assigned and available
        const assigned = [];
        const available = [];
        
        for (const teacher of allTeachers) {
          if (selectedTeachers.includes(teacher._id)) {
            assigned.push(teacher);
          } else {
            available.push(teacher);
          }
        }
        
        setAssignedTeachers(assigned);
        setTeachers(allTeachers); // Keep all teachers for filtering
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchCourseAndData = async () => {
    if (!courseId) {
      toast.error('ID de curso no proporcionado');
      navigate('/gestion/cursos');
      return;
    }

    try {
      setIsFetching(true);
      const courseResponse = await courseService.findOne(courseId);

      if (courseResponse && courseResponse.data) {
        const fetchedCourse = courseResponse.data;
        setCourse(fetchedCourse);
        
        // Set basic course data
        setNombre(fetchedCourse.nombre || '');
        setDescripcion(fetchedCourse.descripion || '');
        setDifficulty(fetchedCourse.difficulty || 'Principiante');
        setPrice(fetchedCourse.price?.toString() || '');
        setDuration(fetchedCourse.duration || '');
        setCategoryId(fetchedCourse.categoryId || '');
        setImageUrl(fetchedCourse.imageUrl || '');

        // Fetch videos using their IDs
        if (fetchedCourse.videos && fetchedCourse.videos.length > 0) {
          try {
            const videoPromises = fetchedCourse.videos.map(videoId => 
              liveService.findOne(videoId)
            );
            const fetchedVideos = await Promise.all(videoPromises);
            const validVideos = fetchedVideos.filter(Boolean);
            setVideos(validVideos);
          } catch (error) {
            console.error('Error fetching videos:', error);
            toast.error('Error al cargar los videos');
          }
        } else {
          setVideos([]);
        }
        console.log("Videos", videos);
        // Handle teacher IDs from docenteId array
        const teacherIds = Array.isArray(fetchedCourse.docenteId) 
          ? fetchedCourse.docenteId.map(id => typeof id === 'string' ? id : id._id)
          : [];
        
        setSelectedTeachers(teacherIds);

        // Fetch assigned teachers individually
        if (teacherIds.length > 0) {
          const teacherPromises = teacherIds.map(id => userService.findOne(id));
          const fetchedTeachers = await Promise.all(teacherPromises);
          const validTeachers = fetchedTeachers.filter(Boolean);
          setAssignedTeachers(validTeachers);
        }

        // Fetch available teachers
        await fetchTeacherData();
      }

      // Fetch categories
      const categoriesResponse = await categoryService.findAll();
      if (categoriesResponse && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('No se pudo cargar el curso');
      navigate('/gestion/cursos');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddVideo = async () => {
    if (!newVideo.name || !newVideo.url_video || !newVideo.thumbnail || !newVideo.descripcion) {
      toast.error('Por favor complete todos los campos del video');
      return;
    }

    try {
      // Create a properly typed Live object
      const liveVideo: Omit<Live, '_id'> = {
        name: newVideo.name,
        thumbnail: newVideo.thumbnail,
        url_video: newVideo.url_video,
        isZoomLive: newVideo.isZoomLive || false,
        descripcion: newVideo.descripcion
      };

      // Create the live video with proper typing
      const createdVideo = await liveService.create(liveVideo);
      console.log('Created video:', createdVideo.data._id);
      
      if (!createdVideo.data._id || !course?._id) {
        throw new Error('Error al crear el video');
      }

      // Create the course update with the new video ID
      const courseUpdate: Partial<Course> = {
        ...course,
        videos: [...(course.videos || []), createdVideo.data._id]
      };

      // Update course in database with typed data
      await courseService.update(course._id, courseUpdate);
      
      // Update local states with full video object
      setVideos(prev => [...prev, createdVideo]);
      setCourse(prevCourse => prevCourse ? {
        ...prevCourse,
        videos: [...(prevCourse.videos || []), createdVideo.data._id]
      } : null);

      // Reset form
      setNewVideo({
        name: '',
        url_video: '',
        thumbnail: '',
        isZoomLive: false,
        descripcion: ''
      });
      
      toast.success('Video agregado exitosamente');
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Error al agregar el video');
    }
  };

  const handleRemoveVideo = async (video: Live, index: number) => {
    try {
      if (!course || !video._id) return;

      // Remove video from Live service
      await liveService.remove(video._id);

      // Update course to remove video ID from videos array
      const updatedCourse = {
        ...course,
        videos: course.videos.filter(id => id !== video._id)
      };

      // Update course in database
      await courseService.update(course._id, updatedCourse);

      // Update local states
      setVideos(prev => prev.filter((_, i) => i !== index));
      setCourse(updatedCourse);

      toast.success('Video eliminado exitosamente');
    } catch (error) {
      console.error('Error removing video:', error);
      toast.error('Error al eliminar el video');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!course) return;

    if (!nombre.trim()) {
      toast.error('El nombre del curso es obligatorio');
      return;
    }

    if (!categoryId) {
      toast.error('Debe seleccionar una categoría');
      return;
    }

    setIsLoading(true);

    try {
      const selectedTeachersData = teachers.filter(teacher =>
        selectedTeachers.includes(teacher._id)
      );

      const updatedCourse: Course = {
        ...course,
        nombre: nombre.trim(),
        descripion: descripcion.trim(),
        difficulty: difficulty,
        price: parseFloat(price) || 0,
        duration: duration || 'Sin especificar',
        categoryId: categoryId,
        imageUrl: imageUrl.trim() || 'https://via.placeholder.com/400x250.png?text=Curso',
        docenteId: selectedTeachersData,
        videos: videos
      };

      const result = await courseService.update(course._id, updatedCourse);
      toast.success(`Curso "${result.nombre}" actualizado exitosamente`);
      navigate('/gestion/cursos');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Error al actualizar el curso', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTeacherLists = async () => {
    try {
      // Get all teachers
      const allTeachersResponse = await userService.findAll();
      const allTeachers = allTeachersResponse?.filter(user => user.rol === 'teacher') || [];

      // Get assigned teachers
      const assignedTeacherPromises = selectedTeachers.map(id => userService.findOne(id));
      const assignedTeacherResponses = await Promise.all(assignedTeacherPromises);
      const validAssignedTeachers = assignedTeacherResponses.filter(Boolean);

      // Update states
      setAssignedTeachers(validAssignedTeachers);
      setTeachers(allTeachers); // Show all teachers in the list
    } catch (error) {
      console.error('Error refreshing teacher lists:', error);
    }
  };

  const handleTeacherToggle = async (teacherId: string) => {
    try {
      setIsLoading(true);
      const isRemoving = selectedTeachers.includes(teacherId);
      const updatedSelectedTeachers = isRemoving
        ? selectedTeachers.filter(id => id !== teacherId)
        : [...selectedTeachers, teacherId];

      // Update course in backend
      const updatedCourse = {
        ...course!,
        docenteId: updatedSelectedTeachers
      };
      await courseService.update(courseId!, updatedCourse);

      // Update local state immediately
      setSelectedTeachers(updatedSelectedTeachers);

      // Move teacher between lists
      const teacherToMove = teachers.find(t => t._id === teacherId);
      if (teacherToMove) {
        if (isRemoving) {
          setAssignedTeachers(prev => prev.filter(t => t._id !== teacherId));
        } else {
          setAssignedTeachers(prev => [...prev, teacherToMove]);
        }
      }

      toast.success(
        isRemoving ? 'Docente removido exitosamente' : 'Docente asignado exitosamente'
      );
    } catch (error) {
      console.error('Error updating course teachers:', error);
      toast.error('Error al actualizar los docentes');
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

  if (!course) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-8">
        <Button
          variant="outline"
          size="icon"
          className="mr-4"
          onClick={() => navigate('/gestion/cursos')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Edit className="w-8 h-8 mr-4 text-primary" />
        <h1 className="text-3xl font-bold">Editar Curso</h1>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Edit className="w-4 h-4" /> Detalles
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="w-4 h-4" /> Videos
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Docentes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Curso</Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Introducción a Python, Diseño UX/UI"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción del Curso</Label>
                  <Textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción detallada del curso"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Nivel de Dificultad</Label>
                    <Select
                      value={difficulty}
                      onValueChange={(value: Course['difficulty']) => setDifficulty(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar dificultad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Principiante">Principiante</SelectItem>
                        <SelectItem value="Intermedio">Intermedio</SelectItem>
                        <SelectItem value="Avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="categoryId">Categoría</Label>
                    <Select
                      value={categoryId}
                      onValueChange={setCategoryId}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem
                            key={category._id}
                            value={category._id}
                          >
                            {category.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Precio del curso"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duración</Label>
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Ej. 4 semanas, 40 horas"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl">URL de Imagen del Curso</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL de una imagen representativa (opcional)"
                  />
                  {imageUrl && (
                    <div className="mt-4">
                      <Label>Vista Previa de Imagen</Label>
                      <img
                        src={imageUrl}
                        alt="Vista previa"
                        className="max-w-full h-auto mt-2 rounded-md border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/gestion/cursos')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Actualizando...' : 'Actualizar Curso'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-[1fr,400px] gap-6">
            {/* Videos Grid - Main Content */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Videos del Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  {videos.length === 0 ? (
                    <div className="text-center py-8">
                      <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No hay videos agregados aún.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {videos.map((video, index) => (
                        <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                          <div className="relative aspect-video">
                            <img
                              src={video.data.thumbnail}
                              alt={`Miniatura del video ${index + 1}`}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveVideo(video, index)}
                                className="absolute bottom-2 right-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="absolute top-2 left-2 flex items-center gap-2">
                              <Badge 
                                variant="secondary" 
                                className={`${video.data.isZoomLive ? 'bg-blue-500' : 'bg-orange-500'} text-white flex items-center gap-1.5`}
                              >
                                {video.data.isZoomLive ? (
                                  <>
                                    <MonitorPlay className="w-3.5 h-3.5" />
                                    Zoom
                                  </>
                                ) : (
                                  <>
                                    <VideoIcon className="w-3.5 h-3.5" />
                                    Video
                                  </>
                                )}
                              </Badge>
                              <Badge 
                                variant="secondary" 
                                className={`flex items-center gap-1.5 ${video.data.url_video ? 'bg-green-500' : 'bg-red-500'} text-white`}
                              >
                                <Link2 className="w-3.5 h-3.5" />
                                {video.data.url_video ? 'Con Link' : 'Sin Link'}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <p className="font-medium mb-1">{video.data.name || `Video ${index + 1}`}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {video.data.descripcion}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Video Management - Sidebar */}
            <div className="space-y-4">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Agregar Nuevo Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-4 mb-6">
                      <div>
                        <Label htmlFor="videoName">Nombre del Video</Label>
                        <Input
                          id="videoName"
                          value={newVideo.name}
                          onChange={(e) => setNewVideo({ ...newVideo, name: e.target.value })}
                          placeholder="Nombre o título del video"
                        />
                      </div>
                      <div>
                        <Label htmlFor="videoUrl">URL del Video</Label>
                        <Input
                          id="videoUrl"
                          value={newVideo.url_video}
                          onChange={(e) => setNewVideo({ ...newVideo, url_video: e.target.value })}
                          placeholder="URL del video"
                        />
                      </div>
                      <div>
                        <Label htmlFor="thumbnailUrl">URL de la Miniatura</Label>
                        <Input
                          id="thumbnailUrl"
                          value={newVideo.thumbnail}
                          onChange={(e) => setNewVideo({ ...newVideo, thumbnail: e.target.value })}
                          placeholder="URL de la miniatura del video"
                        />
                      </div>
                      <div>
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                          id="descripcion"
                          value={newVideo.descripcion}
                          onChange={(e) => setNewVideo(prev => ({ ...prev, descripcion: e.target.value }))}
                          placeholder="Descripción del video"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 px-2 rounded-lg bg-muted/50">
                      <div className="space-y-0.5">
                        <Label htmlFor="isZoomLive" className="text-base">Tipo de Video</Label>
                        <p className="text-sm text-muted-foreground">
                          {newVideo.isZoomLive ? 'Clase en vivo por Zoom' : 'Video pregrabado'}
                        </p>
                      </div>
                      <Switch
                        id="isZoomLive"
                        checked={newVideo.isZoomLive}
                        onCheckedChange={(checked) => 
                          setNewVideo(prev => ({ ...prev, isZoomLive: checked }))
                        }
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddVideo}
                      className="w-full mt-6"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Agregar Video
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Docentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar docentes por nombre o email..."
                  value={searchTeacherTerm}
                  onChange={(e) => setSearchTeacherTerm(e.target.value)}
                  className="flex-1"
                />
              </div>

              {teachers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No hay docentes disponibles
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Docentes Disponibles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Perfil</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Acción</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTeachers.map((teacher) => (
                            <TableRow key={teacher._id}>
                              <TableCell>
                                <UserAvatar
                                  name={teacher.nombre}
                                  photoUrl={teacher.foto_perfil}
                                  size="md"
                                />
                              </TableCell>
                              <TableCell>{teacher.nombre}</TableCell>
                              <TableCell>{teacher.email}</TableCell>
                              <TableCell>
                                {isTeacherAssigned(teacher._id) ? (
                                  <Badge className="bg-green-500" variant="secondary">
                                    Asignado
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleTeacherToggle(teacher._id)}
                                    className="flex items-center gap-1"
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <span className="loading-spinner"></span>
                                    ) : (
                                      <>
                                        <UserPlus className="w-4 h-4" />
                                        Asignar
                                      </>
                                    )}
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Docentes Asignados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assignedTeachers.length === 0 ? (
                        <div className="text-center text-muted-foreground py-4">
                          <Users className="w-6 h-6 mx-auto mb-2" />
                          No hay docentes asignados a este curso
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          {assignedTeachers.map(teacher => (
                            <div key={teacher._id} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <UserAvatar
                                  name={teacher.nombre}
                                  photoUrl={teacher.foto_perfil}
                                  size="sm"
                                />
                                <div>
                                  <p className="font-medium">{teacher.nombre}</p>
                                  <p className="text-sm text-muted-foreground">{teacher.email}</p>
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleTeacherToggle(teacher._id)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <span className="loading-spinner"></span>
                                ) : (
                                  <>
                                    <UserMinus className="w-4 h-4 mr-1" />
                                    Quitar
                                  </>
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditCourse;