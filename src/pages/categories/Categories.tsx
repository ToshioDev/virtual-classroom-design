import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Skeleton from "@/components/ui/skeleton";
import { Category } from "@/interfaces/category.interface";
import { categoryService } from "@/services/category.service";
import { AlertCircle } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.findAll();

        if (response && response.data && Array.isArray(response.data)) {
          const categoriesData = response.data.map((item) => ({
            _id: item._id,
            nombre: item.nombre,
            description: item.description,
            imagen_referencia: item.imagen_referencia,
            cursosId: item.cursosId
          }));
          setCategories(categoriesData);
        } else {
          console.error("Received invalid data format:", response);
          setError("Error: Formato de datos inválido");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("No se pudieron cargar las materias");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:pb-0 pb-20">
        <h1 className="text-3xl font-bold mb-8">Explora nuestras materias</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((_, index) => (
            <Card key={index} className="h-full">
              <Skeleton className="w-full h-48" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <div>
              <h2 className="text-xl font-semibold text-destructive mb-1">Error al cargar las materias</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm text-primary hover:underline"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-8">Explora nuestras materias</h1>
        <p className="text-xl text-muted-foreground">
          No se tienen materias disponibles en este momento
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:pb-0 pb-20">
      <h1 className="text-3xl font-bold mb-8">Explora nuestras materias</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(categories) && categories.map((category) => (
          <Link to={`/topics/${category._id}`} key={category._id}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={category.imagen_referencia}
                  alt={category.nombre}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle>{category.nombre}</CardTitle>
                <CardDescription>{`${category.cursosId.length} cursos disponibles`}</CardDescription>
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
