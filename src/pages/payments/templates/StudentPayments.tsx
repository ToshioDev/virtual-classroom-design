import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, Wallet, Upload, Banknote, CreditCard as CreditCardIcon, Building2, AlertCircle, CheckCircle } from "lucide-react";
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
import { paymentService } from "@/services/payment.service";
import { authService } from "@/services/auth.service";
import { PaymentData } from "@/interfaces/payment.interface";
import { PaymentQuery } from "@/interfaces/payment.interface";

export default function StudentPayments() {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [detallesAdicionales, setDetallesAdicionales] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const [animating, setAnimating] = useState(false);

  const loadPayments = async () => {
    try {
      const user = authService.getUser();
      const userId = user ? user._id : "";

      const fetchedPayments = await paymentService.findAll();
      console.log("Pagos obtenidos:", fetchedPayments);

      const userPayments = fetchedPayments.data.filter(payment => payment.estudianteId === userId);
      setPayments(userPayments);
    } catch (error) {
      console.error("Error al cargar los pagos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
  const handleUploadClick = async () => {
    if (uploadComplete || uploading) return;

    setAnimating(true);
    try {
      await handleVoucherUpload();
      // Si la carga fue exitosa, mantén la animación
      setUploadComplete(true);
    } catch (error) {
      // Si ocurre un error, restablece la animación
      setAnimating(false);
      setTimeout(() => setAnimating(false), 250);  // Se restablece el estado del botón después de un error
    }
  };

  const handleVoucherUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const userIp = ipData.ip;
      const deviceType = navigator.userAgent;
      const user = authService.getUser();
      const estudianteId = user ? user._id : "";

      const response = await paymentService.processPaymentImage({
        estudianteId: estudianteId,
        ip_transaccion: userIp,
        dispositivo: deviceType,
        detalles_adicionales: detallesAdicionales,
        voucher: {
          data: selectedFile,
          contentType: selectedFile.type
        }
      });

      // Simula el progreso de la carga
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadComplete(true);
            return 100;
          }
          return Math.min(prev + 10, 100);
        });
      }, 200);

      console.log("Respuesta del servidor:", response);

      // After successful upload, reload payments
      await loadPayments();  // Reload the payments

      // Reset state after successful upload
      setSelectedFile(null);
      setVoucherPreview(null);
      setDetallesAdicionales("");

    } catch (error) {
      console.error("Error al subir el voucher:", error);
      throw error;  // Lanzamos el error para que se maneje en el click del botón
    } finally {
      setUploading(false);
    }
  };

  const handleMercadoPago = () => {
    console.log("Iniciar pago con MercadoPago");
  };

  const handleStripe = () => {
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
                  <Label>Detalles Adicionales</Label>
                  <Input
                    type="text"
                    value={detallesAdicionales}
                    onChange={(e) => setDetallesAdicionales(e.target.value)}
                    placeholder="Ingresa detalles adicionales"
                    disabled={uploadComplete}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Voucher de Pago</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="voucher-upload"
                      disabled={uploading || uploadComplete}
                    />
                    <Button
                      id="upload-button"
                      variant="outline"
                      onClick={() => document.getElementById("voucher-upload")?.click()}
                      className={`w-full ${uploading ? "uploading" : ""}`}
                      disabled={uploading || uploadComplete}
                    >

                      <Upload className="mr-2 h-4 w-4" />
                      Seleccionar Voucher

                    </Button>
                  </div>
                  {voucherPreview && (
                    <div className="mt-2 flex justify-center">
                      <img
                        src={voucherPreview}
                        alt="Voucher Preview"
                        className="max-h-40 object-contain rounded-md mx-auto"
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Nuestro sistema validará automáticamente el voucher de pago.
                    Por favor, asegúrate de que la imagen sea clara y legible.
                  </p>
                </div>
                <Button
                  className="w-full relative overflow-hidden bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                  onClick={handleUploadClick}
                  disabled={!selectedFile || uploading || uploadComplete}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {uploadComplete ? <CheckCircle className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                    {uploadComplete ? "" : "Subir Voucher"}
                  </span>
                  <span
                    className={`absolute top-0 left-0 h-full bg-purple-500 transition-all ease-linear duration-700 ${animating ? "w-full" : "w-0"}`}
                  />
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
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Aún no has realizado ningún pago.
              </p>
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