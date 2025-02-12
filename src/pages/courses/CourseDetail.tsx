
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, PauseCircle, Volume2, VolumeX, Maximize2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

// Datos mockeados para el curso
const MOCK_COURSE = {
  id: 1,
  title: "Desarrollo Web Full Stack",
  description: "Aprende a crear aplicaciones web completas desde cero. Este curso cubre tanto el frontend como el backend, utilizando las tecnologías más demandadas en el mercado.",
  instructor: "Ana García",
  duration: "40 horas",
  price: 199.99,
  image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  purchased: false,
  lessons: [
    {
      id: 1,
      title: "Introducción al Desarrollo Web",
      duration: "15:30",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      completed: false
    },
    {
      id: 2,
      title: "HTML5 y CSS3 Fundamentals",
      duration: "25:45",
      thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      completed: false
    },
    {
      id: 3,
      title: "JavaScript Moderno",
      duration: "30:20",
      thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      completed: false
    }
  ]
};

// Datos mockeados para los comentarios
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

export default function CourseDetail() {
  const [selectedLesson, setSelectedLesson] = useState(MOCK_COURSE.lessons[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleEnroll = () => {
    toast.success("¡Inscripción exitosa! Bienvenido al curso.");
  };

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
        {/* Contenido Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="aspect-video w-full bg-black rounded-lg relative group">
            <img 
              src={selectedLesson.thumbnail} 
              alt={selectedLesson.title}
              className="w-full h-full object-cover"
            />
            {/* Controles del video */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-primary transition-colors"
                  >
                    {isPlaying ? 
                      <PauseCircle className="w-8 h-8" /> : 
                      <PlayCircle className="w-8 h-8" />
                    }
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-primary transition-colors"
                  >
                    {isMuted ? 
                      <VolumeX className="w-6 h-6" /> : 
                      <Volume2 className="w-6 h-6" />
                    }
                  </button>
                </div>
                <button className="hover:text-primary transition-colors">
                  <Maximize2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Información del curso y botón de inscripción */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{MOCK_COURSE.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Instructor: {MOCK_COURSE.instructor}</span>
              <span>Duración: {MOCK_COURSE.duration}</span>
            </div>
            <p className="text-muted-foreground">{MOCK_COURSE.description}</p>
            
            {!MOCK_COURSE.purchased && (
              <Button size="lg" onClick={handleEnroll}>
                Inscribirse por ${MOCK_COURSE.price}
              </Button>
            )}
          </div>

          {/* Sección de comentarios */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Comentarios</h2>
              <div className="space-y-6 mb-6">
                {MOCK_COMMENTS.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                    </Avatar>
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
            <h2 className="text-xl font-semibold mb-4">Contenido del curso</h2>
            <div className="space-y-3">
              {MOCK_COURSE.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full p-3 flex items-start gap-3 rounded-lg transition-colors ${
                    selectedLesson.id === lesson.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary"
                  }`}
                >
                  <div className="w-24 h-16 flex-shrink-0 rounded-md overflow-hidden">
                    <img 
                      src={lesson.thumbnail} 
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium line-clamp-2">{lesson.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <PlayCircle className="w-4 h-4" />
                      <span>{lesson.duration}</span>
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
