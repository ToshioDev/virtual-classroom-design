import React, { useState } from 'react';
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
import { UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { generateNovaId } from '@/utils/novaId.generator'; // We'll create this utility

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

const COUNTRY_CODES = LATIN_AMERICAN_COUNTRIES;

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'teacher', label: 'Profesor' },
  { value: 'student', label: 'Estudiante' }
];

const AddUser: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    novaId: '',
    countryCode: '',
    rol: '',
    foto_perfil: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'countryCode') {
      // Find the selected country
      const selectedCountry = LATIN_AMERICAN_COUNTRIES.find(c => c.code === value);
      
      setFormData(prev => ({
        ...prev,
        [name]: value, // Store original country code
        telefono: selectedCountry ? selectedCountry.phoneCode : '' // Set phone code
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected country to get the phone code
    const selectedCountry = LATIN_AMERICAN_COUNTRIES.find(c => c.code === formData.countryCode);
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      // Override countryCode with phoneCode
      countryCode: selectedCountry ? selectedCountry.phoneCode : '',
      // Ensure telefono includes the phone code if not already added
      telefono: selectedCountry 
        ? (formData.telefono.startsWith(selectedCountry.phoneCode) 
          ? formData.telefono 
          : `${selectedCountry.phoneCode}${formData.telefono}`)
        : formData.telefono
    };

    // Validation
    const requiredFields = ['nombre', 'email', 'password', 'telefono', 'novaId', 'countryCode', 'rol'];
    const missingFields = requiredFields.filter(field => !submissionData[field]);

    if (missingFields.length > 0) {
      toast.error(`Por favor complete los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      const result = await userService.create(submissionData);
      
      toast.success(`Usuario ${result.user.nombre} creado exitosamente`);
      
      // Reset form
      setFormData({
        nombre: '',
        email: '',
        password: '',
        telefono: '',
        novaId: '',
        countryCode: '',
        rol: '',
        foto_perfil: ''
      });

      // Navigate to user list or stay on the same page
      navigate('/gestion/usuarios');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('No se pudo crear el usuario. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-4"
          onClick={() => navigate('/gestion')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <UserPlus className="w-8 h-8 mr-4 text-primary" />
        <h1 className="text-3xl font-bold">Registrar Nuevo Usuario</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Usuario</CardTitle>
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
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Contraseña segura"
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+52 1234567890"
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

              <div>
                <Label htmlFor="countryCode">País</Label>
                <Select 
                  value={formData.countryCode} 
                  onValueChange={(value) => {
                    // Find the selected country to get the phone code
                    const selectedCountry = LATIN_AMERICAN_COUNTRIES.find(c => c.code === value);
                    handleSelectChange('countryCode', value);
                    
                    // Automatically update phone code if not already set
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

              <div className="md:col-span-2">
                <Label htmlFor="foto_perfil">URL de Foto de Perfil (Opcional)</Label>
                <Input 
                  id="foto_perfil"
                  name="foto_perfil"
                  value={formData.foto_perfil}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/foto-perfil.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/gestion')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Registrar Usuario'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUser;
