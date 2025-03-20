import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, Wallet, Upload, Banknote, CreditCard as CreditCardIcon, Building2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Payment {
  _id: string;
  monto: number;
  razon: string;
  fecha_pago: Date;
  fecha_expiracion: Date;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  voucher?: {
    data: Blob;
    contentType: string;
  };
}

// Mock data para el dashboard del estudiante
const mockPayments: Payment[] = [
  {
    _id: "1",
    monto: 299.99,
    razon: "Pago de curso - Desarrollo Web Full Stack",
    fecha_pago: new Date("2024-03-15"),
    fecha_expiracion: new Date("2024-04-15"),
    estado: "Aprobado"
  },
  {
    _id: "2",
    monto: 199.99,
    razon: "Pago de curso - Diseño UI/UX",
    fecha_pago: new Date("2024-03-10"),
    fecha_expiracion: new Date("2024-04-10"),
    estado: "Pendiente"
  },
  {
    _id: "3",
    monto: 399.99,
    razon: "Pago de curso - Desarrollo Mobile",
    fecha_pago: new Date("2024-03-05"),
    fecha_expiracion: new Date("2024-04-05"),
    estado: "Rechazado"
  }
];

export default function StudentPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPayments(mockPayments);
      } catch (error) {
        console.error("Error al cargar los pagos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setVoucherPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoucherUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);

      // Convertir el archivo a Blob
      const blob = new Blob([selectedFile], { type: selectedFile.type });

      // Crear el objeto de pago con el voucher
      const paymentData = {
        monto: 0, // Este valor debería venir de la lógica de negocio
        razon: "Pago de curso", // Este valor debería venir de la lógica de negocio
        fecha_pago: new Date(),
        fecha_expiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        estado: "Pendiente" as const,
        voucher: {
          data: blob,
          contentType: selectedFile.type
        }
      };

      // Aquí iría la llamada a tu API para guardar el pago
      // await paymentService.create(paymentData);
      
      console.log("Voucher convertido a blob:", {
        size: blob.size,
        type: blob.type,
        paymentData
      });

      // Limpiar el formulario
      setSelectedFile(null);
      setVoucherPreview(null);

      // Mostrar mensaje de éxito
      // toast.success("Voucher subido exitosamente");

    } catch (error) {
      console.error("Error al subir el voucher:", error);
      // toast.error("Error al subir el voucher");
    } finally {
      setUploading(false);
    }
  };

  const handleMercadoPago = () => {
    // Implementar integración con MercadoPago
    console.log("Iniciar pago con MercadoPago");
  };

  const handleStripe = () => {
    // Implementar integración con Stripe
    console.log("Iniciar pago con Stripe");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mis Pagos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Realizar Pago
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Realizar Pago</DialogTitle>
              <DialogDescription>
                Selecciona el método de pago que prefieras
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="efectivo" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="efectivo" className="flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Efectivo
                </TabsTrigger>
                <TabsTrigger value="mercadopago" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  MercadoPago
                </TabsTrigger>
                <TabsTrigger value="stripe" className="flex items-center gap-2">
                  <CreditCardIcon className="h-4 w-4" />
                  Stripe
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="efectivo" className="space-y-4">
                <div className="space-y-2">
                  <Label>Voucher de Pago</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="voucher-upload"
                      disabled={uploading}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById("voucher-upload")?.click()}
                      className="w-full"
                      disabled={uploading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? "Subiendo..." : "Seleccionar Voucher"}
                    </Button>
                  </div>
                  {voucherPreview && (
                    <div className="mt-2">
                      <img 
                        src={voucherPreview} 
                        alt="Voucher Preview" 
                        className="max-h-40 object-contain rounded-md"
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Nuestro sistema validará automáticamente el voucher de pago. 
                    Por favor, asegúrate de que la imagen sea clara y legible.
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleVoucherUpload}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? "Subiendo..." : "Subir Voucher"}
                </Button>
              </TabsContent>

              <TabsContent value="mercadopago" className="space-y-4 relative">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Building2 className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Próximamente disponible</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Monto a Pagar</Label>
                  <Input type="number" placeholder="0.00" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Razón del Pago</Label>
                  <Input placeholder="Ej: Pago de curso - Desarrollo Web" disabled />
                </div>
                <Button className="w-full" disabled>
                  Pagar con MercadoPago
                </Button>
              </TabsContent>

              <TabsContent value="stripe" className="space-y-4 relative">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <CreditCardIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Próximamente disponible</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Monto a Pagar</Label>
                  <Input type="number" placeholder="0.00" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Razón del Pago</Label>
                  <Input placeholder="Ej: Pago de curso - Desarrollo Web" disabled />
                </div>
                <Button className="w-full" disabled>
                  Pagar con Stripe
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Historial de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Razón</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha de Pago</TableHead>
                    <TableHead>Fecha de Expiración</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>{payment.razon}</TableCell>
                      <TableCell>${payment.monto.toFixed(2)}</TableCell>
                      <TableCell>
                        {format(new Date(payment.fecha_pago), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(payment.fecha_expiracion), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            payment.estado === 'Aprobado' ? 'default' :
                            payment.estado === 'Rechazado' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {payment.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 