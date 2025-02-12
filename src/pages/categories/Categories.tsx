
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Datos mockeados para las categorías
const MOCK_CATEGORIES = [
  {
    id: 1,
    name: "Desarrollo Web",
    description: "Aprende las últimas tecnologías web como React, Node.js y más",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    courseCount: 12
  },
  {
    id: 2,
    name: "Diseño UX/UI",
    description: "Domina el arte del diseño de interfaces y experiencia de usuario",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    courseCount: 8
  },
  {
    id: 3,
    name: "Marketing Digital",
    description: "Estrategias efectivas para el marketing en línea",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    courseCount: 6
  },
  {
    id: 4,
    name: "Data Science",
    description: "Análisis de datos, machine learning e inteligencia artificial",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    courseCount: 9
  }
];

export default function Categories() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Explora nuestras categorías</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CATEGORIES.map((category) => (
          <Link to={`/category/${category.id}`} key={category.id}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{`${category.courseCount} cursos disponibles`}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
