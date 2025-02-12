
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

export default function CourseDetail() {
  const [selectedLesson, setSelectedLesson] = useState(MOCK_COURSE.lessons[0]);

  const handleEnroll = () => {
    toast.success("¡Inscripción exitosa! Bienvenido al curso.");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img 
              src={MOCK_COURSE.image} 
              alt={MOCK_COURSE.title}
              className="w-full h-full object-cover"
            />
          </div>
          
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
