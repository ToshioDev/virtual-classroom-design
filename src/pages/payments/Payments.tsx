
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

// Datos mockeados para el historial de pagos
const MOCK_PAYMENTS = [
  {
    id: 1,
    amount: 199.99,
    reason: "Curso de Desarrollo Web Full Stack",
    paymentDate: "2024-03-15",
    expirationDate: "2024-04-15",
    method: "Transferencia Bancaria",
    status: "paid"
  },
  {
    id: 2,
    amount: 149.99,
    reason: "Curso de Diseño UX/UI Avanzado",
    paymentDate: "2024-02-28",
    expirationDate: "2024-03-28",
    method: "Tarjeta de Crédito",
    status: "expired"
  },
  {
    id: 3,
    amount: 99.99,
    reason: "Curso de JavaScript Moderno",
    paymentDate: "2024-03-01",
    expirationDate: "2024-04-01",
    method: "PayPal",
    status: "paid"
  }
];

export default function Payments() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      toast.success("Comprobante de pago enviado con éxito");
      setSelectedFile(null);
    } else {
      toast.error("Por favor, adjunta un comprobante de pago");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "expired":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Historial de Pagos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Razón</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha de Pago</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PAYMENTS.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.reason}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                      <TableCell>{formatDate(payment.expirationDate)}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status === "paid" ? "Pagado" : "Vencido"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Formulario de Pago */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Subir Comprobante de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Comprobante de Pago</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Archivo seleccionado: {selectedFile.name}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Enviar Comprobante
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
