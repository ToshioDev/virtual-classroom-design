import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { userService } from "@/services/user.service";
import { UserPlus, ArrowLeft, ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from 'react-router-dom';
import { generateNovaId } from '@/utils/novaId.generator';
import UserAvatar from '@/components/UserAvatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { User } from "@/interfaces/user.interface";
import Spinner from "@/components/ui/Spinner";

const LATIN_AMERICAN_COUNTRIES = [
  { code: 'MX', name: 'México', flag: '🇲🇽', phoneCode: '+52' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', phoneCode: '+502' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', phoneCode: '+503' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', phoneCode: '+504' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', phoneCode: '+505' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', phoneCode: '+506' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦', phoneCode: '+507' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', phoneCode: '+57' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', phoneCode: '+58' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', phoneCode: '+593' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪', phoneCode: '+51' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', phoneCode: '+591' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', phoneCode: '+56' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', phoneCode: '+54' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', phoneCode: '+598' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', phoneCode: '+595' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', phoneCode: '+55' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴', phoneCode: '+1-809' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', phoneCode: '+53' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', phoneCode: '+1-787' }
];

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'teacher', label: 'Profesor' },
  { value: 'student', label: 'Estudiante' }
];

type UserFormData = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  novaId: string;
  countryCode: string;
  rol: string;
  foto_perfil: string;
}

const EditUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserFormData>({
    id: userId || '',  
    nombre: '',
    email: '',
    telefono: '',
    novaId: '',
    countryCode: '',
    rol: '',
    foto_perfil: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [previewProfileImage, setPreviewProfileImage] = useState<string>('');

  const fetchUserData = async () => {
    if (!userId) {
      toast.error('ID de usuario no proporcionado');
      navigate('/gestion/usuarios');
      return;
    }

    try {
      setIsDataLoading(true);
      const userData = await userService.findOne(userId);
      
      // Convert phone code to country code
      const matchedCountry = LATIN_AMERICAN_COUNTRIES.find(
        country => country.phoneCode === userData.countryCode
      );

      setFormData({
        id: userData._id,  
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono,  
        novaId: userData.novaId,
        // Use matched country code or default to empty string
        countryCode: matchedCountry ? matchedCountry.code : '',
        rol: userData.rol,
        foto_perfil: userData.foto_perfil || ''
      });
    } catch (error) {
      toast.error('No se pudo cargar la información del usuario');
      navigate('/gestion/usuarios');
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'countryCode') {
      const selectedCountry = LATIN_AMERICAN_COUNTRIES.find(c => c.code === value);
      
      setFormData(prev => ({
        ...prev,
        [name]: value, 
        telefono: selectedCountry ? selectedCountry.phoneCode : '' 
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const generateAutomaticNovaId = () => {
    const newNovaId = generateNovaId({
      nombre: formData.nombre,
      email: formData.email
    });
    setFormData(prev => ({
      ...prev,
      novaId: newNovaId
    }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleUpdateProfilePreview = () => {
    // Update preview only when user clicks the button
    if (imageUrl) {
      // Update the form data's foto_perfil to trigger UserAvatar update
      setFormData(prev => ({
        ...prev,
        foto_perfil: imageUrl
      }));
      toast.success('Vista previa de imagen actualizada');
    } else {
      toast.error('Ingrese una URL de imagen válida');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id) {
      toast.error('ID de usuario no válido');
      return;
    }

    // Prepare data for submission
    const submissionData: Partial<User> = { 
      ...formData,
      // Add image URL if provided
      ...(imageUrl && { foto_perfil: imageUrl })
    };
    
    // Find the selected country to get the phone code
    const selectedCountry = LATIN_AMERICAN_COUNTRIES.find(c => c.code === formData.countryCode);
    submissionData.countryCode = selectedCountry ? selectedCountry.phoneCode : '';

    setIsLoading(true);

    try {
      const result = await userService.update(formData.id, submissionData);
      
      toast.success(`El usuario ${result.nombre} ha sido actualizado exitosamente`);
      
      navigate('/gestion/usuarios');
    } catch (error) {
      toast.error('No se pudo actualizar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4"
          onClick={() => navigate('/gestion/usuarios')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <UserPlus className="w-8 h-8 mr-4 text-primary" />
        <h1 className="text-3xl font-bold">Editar Usuario</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-4">
            <UserAvatar 
              name={formData.nombre} 
              photoUrl={formData.foto_perfil} 
              size="lg" 
            />
            <span>Detalles del Usuario</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input 
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre y apellido"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="rol">Rol</Label>
                <Select 
                  value={formData.rol}
                  onValueChange={(value) => handleSelectChange('rol', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="countryCode">País</Label>
                <Select 
                  value={formData.countryCode} 
                  onValueChange={(value) => {
                    const selectedCountry = LATIN_AMERICAN_COUNTRIES.find(c => c.code === value);
                    handleSelectChange('countryCode', value);
                    
                    if (selectedCountry && (!formData.telefono || formData.telefono.trim() === '')) {
                      setFormData(prev => ({
                        ...prev,
                        telefono: selectedCountry.phoneCode
                      }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un país" />
                  </SelectTrigger>
                  <SelectContent>
                    {LATIN_AMERICAN_COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{country.flag}</span>
                          <span>{country.name} ({country.phoneCode})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  required
                />
              </div>

              <div>
                <Label htmlFor="novaId">Nova ID</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="novaId"
                    name="novaId"
                    value={formData.novaId}
                    onChange={handleInputChange}
                    placeholder="Nova ID"
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={generateAutomaticNovaId}
                  >
                    Generar
                  </Button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Label>URL de Foto de Perfil</Label>
              <div className="flex space-x-2">
                <Input 
                  type="url" 
                  placeholder="Ingrese la URL de la imagen" 
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleUpdateProfilePreview}
                >
                  Previsualizar
                </Button>
              </div>
              
            </div>

            <div className="mt-6">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar Usuario'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUser;
