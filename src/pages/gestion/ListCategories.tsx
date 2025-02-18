import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose,
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, Plus } from 'lucide-react';
import { categoryService } from '@/services/category.service';
import { Category } from '@/interfaces/category.interface';
import { toast } from 'sonner';

const ListCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await categoryService.findAll();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error al cargar categorías', {
          description: error instanceof Error ? error.message : 'Error desconocido'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories
  const filteredCategories = categories.filter(category => 
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open delete dialog
  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
  };

  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await categoryService.remove(selectedCategory._id);
      setCategories(categories.filter(cat => cat._id !== selectedCategory._id));
      toast.success('Categoría eliminada exitosamente');
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar la categoría', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <Input 
          placeholder="Buscar categorías..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button 
          onClick={() => navigate('/gestion/categoria/nueva')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nueva Categoría
        </Button>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No se encontraron categorías
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map(category => (
            <Card key={category._id} className="hover:shadow-lg transition-shadow duration-300">
              {category.imagen_referencia && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={category.imagen_referencia} 
                    alt={category.nombre} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{category.nombre}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Optional additional content */}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate(`/gestion/categoria/editar/${category._id}`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => openDeleteDialog(category)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Eliminar Categoría</DialogTitle>
                      <DialogDescription>
                        ¿Estás seguro de que deseas eliminar la categoría "{selectedCategory?.nombre}"?
                        Esta acción no se puede deshacer.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteCategory}
                      >
                        Eliminar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListCategories;
