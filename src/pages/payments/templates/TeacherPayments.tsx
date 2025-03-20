import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Building2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TeacherPayment {
  _id: string;
  courseName: string;
  amount: number;
  paymentDate: Date;
  status: 'Completed' | 'Pending' | 'Failed';
  paymentMethod: 'Transfer' | 'Cash' | 'Digital';
  transactionId?: string;
}

interface TeacherEarnings {
  totalEarnings: number;
  availableToWithdraw: number;
  pendingEarnings: number;
  commission: number;
  lastWithdrawal: Date;
}

// Mock data para el dashboard del profesor
const mockPayments: TeacherPayment[] = [
  {
    _id: "1",
    courseName: "Desarrollo Web Full Stack",
    amount: 299.99,
    paymentDate: new Date("2024-03-15"),
    status: "Completed",
    paymentMethod: "Digital",
    transactionId: "TRX-123456"
  },
  {
    _id: "2",
    courseName: "Desarrollo Web Full Stack",
    amount: 299.99,
    paymentDate: new Date("2024-03-14"),
    status: "Completed",
    paymentMethod: "Transfer",
    transactionId: "TRX-123457"
  },
  {
    _id: "3",
    courseName: "Desarrollo Web Full Stack",
    amount: 299.99,
    paymentDate: new Date("2024-03-13"),
    status: "Pending",
    paymentMethod: "Cash"
  },
  {
    _id: "4",
    courseName: "Desarrollo Web Full Stack",
    amount: 299.99,
    paymentDate: new Date("2024-03-12"),
    status: "Failed",
    paymentMethod: "Digital",
    transactionId: "TRX-123458"
  }
];

const mockEarnings: TeacherEarnings = {
  totalEarnings: 15000.00,
  availableToWithdraw: 12000.00,
  pendingEarnings: 3000.00,
  commission: 20, // 20% de comisión
  lastWithdrawal: new Date("2024-03-10")
};

export default function TeacherPayments() {
  const [payments, setPayments] = useState<TeacherPayment[]>(mockPayments);
  const [earnings, setEarnings] = useState<TeacherEarnings>(mockEarnings);
  const [loading, setLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  const handleWithdraw = () => {
    // Implementar lógica de retiro
    console.log("Retirar:", withdrawAmount);
  };

  const handleExport = () => {
    // Implementar lógica de exportación
    console.log("Exportar pagos");
  };

  const getStatusColor = (status: TeacherPayment['status']) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mis Ganancias</h1>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +${(earnings.totalEarnings - earnings.pendingEarnings).toFixed(2)} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponible para Retirar</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.availableToWithdraw.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Después de comisión ({earnings.commission}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias Pendientes</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.pendingEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Próximo pago: {format(new Date(earnings.lastWithdrawal), "dd 'de' MMMM", { locale: es })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Retiro</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(earnings.lastWithdrawal), "dd 'de' MMMM", { locale: es })}
            </div>
            <p className="text-xs text-muted-foreground">
              Hace {Math.floor((new Date().getTime() - earnings.lastWithdrawal.getTime()) / (1000 * 60 * 60 * 24))} días
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botón de Retiro */}
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Building2 className="mr-2 h-4 w-4" />
              Retirar Fondos
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Retirar Fondos</DialogTitle>
              <DialogDescription>
                Ingresa el monto que deseas retirar. Disponible: ${earnings.availableToWithdraw.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto a Retirar</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  max={earnings.availableToWithdraw}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Comisión: {earnings.commission}% ({((earnings.commission / 100) * Number(withdrawAmount || 0)).toFixed(2)})
              </div>
              <Button 
                className="w-full"
                onClick={handleWithdraw}
                disabled={!withdrawAmount || Number(withdrawAmount) > earnings.availableToWithdraw}
              >
                Confirmar Retiro
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de Historial */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
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
                    <TableHead>Curso</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>ID Transacción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>{payment.courseName}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {format(new Date(payment.paymentDate), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          {payment.paymentMethod === 'Digital' ? '💳' : 
                           payment.paymentMethod === 'Transfer' ? '🏦' : '💵'}
                          {payment.paymentMethod}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.transactionId || "N/A"}
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