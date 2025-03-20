import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, Send, Construction, Clock, FileText, Gauge, Star, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { courseService } from "@/services/course.service";
import { liveService } from "@/services/live.service";
import { Course } from "@/interfaces/course.interface";
import { Live } from "@/interfaces/live.interface";
import { Badge } from "@/components/ui/badge";
import { userService } from "@/services/user.service";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown, Users, VideoIcon } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Add back the mock comments data
const MOCK_COMMENTS = [
  {
    id: 1,
    user: {
      name: "María González",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    message: "¡Excelente explicación! Me ayudó mucho a entender los conceptos básicos.",
    timestamp: "2024-03-28T14:30:00"
  },
  {
    id: 2,
    user: {
      name: "Carlos Ruiz",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
    },
    message: "¿Podrías profundizar un poco más en la parte de las promesas?",
    timestamp: "2024-03-28T15:15:00"
  },
  {
    id: 3,
    user: {
      name: "Ana Silva",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    message: "Me encanta cómo estructuras las explicaciones, muy claro todo.",
    timestamp: "2024-03-28T16:00:00"
  }
];

const getDifficultyColor = (difficulty: string) => {
  const colors = {
    'Principiante': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Intermedio': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'Avanzado': 'bg-red-500/10 text-red-500 border-red-500/20'
  };
  return colors[difficulty as keyof typeof colors] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';
};

const isZoomLink = (url: string): boolean => {
  return url.includes('zoom.us') || url.includes('zoom.') || url.includes('zoom/');
};

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Live[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Live | null>(null);
  const [newComment, setNewComment] = useState("");
  const [instructors, setInstructors] = useState<any[]>([]);
  const [isInstructorsOpen, setIsInstructorsOpen] = useState(false);
  const [isVideoDescriptionOpen, setIsVideoDescriptionOpen] = useState(false);
  const [zoomLinks, setZoomLinks] = useState<Live[]>([]);
  const [regularVideos, setRegularVideos] = useState<Live[]>([]);

  useEffect(() => {
    const fetchCourseAndVideos = async () => {
      try {
        // Get detailed course information
        const courseData = await courseService.findCourseWithDetails(id as string);
        setCourse(courseData);

        // Fetch instructors data - handle both array and single ID cases
        let instructorIds = courseData.docenteId;
        
        // Ensure we have an array of IDs and they are strings
        if (!Array.isArray(instructorIds)) {
          instructorIds = [instructorIds];
        }

        // Filter out any invalid IDs and ensure they're strings
        const validInstructorIds = instructorIds
          .filter(id => id && (typeof id === 'string' || typeof id._id === 'string'))
          .map(id => (typeof id === 'string' ? id : id._id));

        if (validInstructorIds.length > 0) {
          const instructorsPromises = validInstructorIds.map(async (instructorId) => {
            try {
              const instructor = await userService.findOne(instructorId);
              return instructor;
            } catch (error) {
              console.error(`Error fetching instructor ${instructorId}:`, error);
              return null;
            }
          });

          const instructorsData = await Promise.all(instructorsPromises);
          const validInstructors = instructorsData.filter(instructor => instructor !== null);
          setInstructors(validInstructors);
        }

        // Ensure videos array exists and contains valid IDs
        if (Array.isArray(courseData.videos)) {
          const videoPromises = courseData.videos.map(async (videoId: string) => {
            try {
              const video = await liveService.findOne(videoId._id);
              return {
                ...video,
                duration: "--:--"
              };
            } catch (error) {
              console.error(`Error fetching video ${videoId}:`, error);
              return null;
            }
          });
          
          const videoDetails = await Promise.all(videoPromises);
          const validVideos = videoDetails.filter((video): video is Live => video !== null);
          
          // Separar videos de Zoom y videos regulares usando isZoomLive
          const zoomVideos = validVideos.filter(video => video.data.isZoomLive);
          const regularVideos = validVideos.filter(video => !video.data.isZoomLive);
          
          setZoomLinks(zoomVideos);
          setRegularVideos(regularVideos);
          setVideos(validVideos);
          
          if (validVideos.length > 0) {
            setSelectedLesson(validVideos[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Error al cargar el curso");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseAndVideos();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return <div className="container mx-auto py-8 px-4">Curso no encontrado</div>;
  }

  const handleSendComment = () => {
    if (newComment.trim()) {
      toast.success("Comentario enviado con éxito");
      setNewComment("");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player with Title and Description */}
          <div className="space-y-4">
            <div className="aspect-video w-full bg-black rounded-lg relative group overflow-hidden">
              {selectedLesson?.data.url_video ? (
                selectedLesson.data.isZoomLive ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center space-y-4">
                      <VideoIcon className="w-12 h-12 mx-auto text-primary" />
                      <p className="text-lg font-medium">Sesión de Zoom</p>
                      <Button 
                        onClick={() => window.open(selectedLesson.data.url_video, '_blank')}
                        className="gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Unirse a la sesión
                      </Button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={selectedLesson.data.url_video}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                )
              ) : (
                <img 
                  src={selectedLesson?.data.thumbnail || course?.thumbnail} 
                  alt={selectedLesson?.data.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {selectedLesson && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{selectedLesson.data.name}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{course?.duration || "--:--"}</span>
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center gap-1 ${getDifficultyColor(course?.difficulty || 'Básico')}`}
                    >
                      <Gauge className="w-3 h-3" />
                      <span>{course?.difficulty || "Básico"}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{course?.rating || "4.5"}</span>
                    </Badge>
                  </div>
                </div>
                <Separator className="my-4" />
                <Collapsible
                  open={isVideoDescriptionOpen}
                  onOpenChange={setIsVideoDescriptionOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-dashed"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Descripción</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isVideoDescriptionOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        {selectedLesson.data.descripcion}
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>

          {/* Información del curso */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{course?.title}</h1>
            <div className="flex flex-col gap-4">
              <Collapsible
                open={isInstructorsOpen}
                onOpenChange={setIsInstructorsOpen}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-dashed"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {instructors.length > 1 ? 'Docentes' : 'Docente'}
                        {' '}({instructors.length})
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isInstructorsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="space-y-2">
                    {instructors.map((instructor) => (
                      <div
                        key={instructor._id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                      >
                        <UserAvatar 
                          name={instructor.nombre}
                          photoUrl={instructor.foto_perfil}
                          size="md"
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium leading-none truncate">
                            {instructor.nombre}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Nova ID: {instructor.novaId}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Sección de comentarios */}
          <Card className="relative">
            {/* Overlay for comments section */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 rounded-lg">
              <Construction className="w-20 h-20 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold text-primary">Próximamente</h2>
              <p className="text-muted-foreground text-center">Sección de comentarios en desarrollo</p>
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Comentarios</h2>
              <div className="space-y-6 mb-6">
                {MOCK_COMMENTS.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <UserAvatar 
                      name={comment.user.name}
                      photoUrl={comment.user.avatar}
                      size="md"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{comment.user.name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSendComment}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar con lecciones */}
        <Card className="h-fit">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Contenido del curso</h2>
              {zoomLinks.length > 0 && (
                <Select
                  onValueChange={(value) => {
                    if (value === 'zoom') {
                      setSelectedLesson(zoomLinks[0]);
                    } else {
                      setSelectedLesson(regularVideos[0]);
                    }
                  }}
                  defaultValue="regular"
                >
                  <SelectTrigger className="h-8 w-[100px] bg-primary hover:bg-primary/90 text-primary-foreground">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <VideoIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">Zoom</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <div className="p-2">
                      <div className="space-y-1">
                        {zoomLinks.map((video) => (
                          <button
                            key={video.data._id}
                            onClick={() => window.open(video.data.url_video, '_blank')}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-md"
                          >
                            <VideoIcon className="w-4 h-4" />
                            <span className="truncate">{video.data.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-3">
              {regularVideos.map((video) => (
                <button
                  key={video.data._id}
                  onClick={() => setSelectedLesson(video)}
                  className={`w-full p-3 flex items-start gap-3 rounded-lg transition-colors ${
                    selectedLesson?.data._id === video.data._id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary"
                  }`}
                >
                  <div className="w-24 h-16 flex-shrink-0 rounded-md overflow-hidden">
                    <img 
                      src={video.data.thumbnail} 
                      alt={video.data.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium line-clamp-2">{video.data.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                      {video.data.descripcion}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <PlayCircle className="w-4 h-4" />
                      <span>{video.duration}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
