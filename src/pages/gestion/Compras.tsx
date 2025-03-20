import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseBuyService } from "@/services/courseBuy.service";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { FileText, Search, Eye, Pencil, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Compras() {
  const [compras, setCompras] = useState<CourseBuy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [novaIds, setNovaIds] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadCompras = async () => {
      try {
        const response = await courseBuyService.findAll();
        setCompras(Array.isArray(response.data) ? response.data : []);
        
        // Obtener los NovaIds de los estudiantes
        const uniqueStudentIds = [...new Set(response.data.map(compra => compra.estudianteId))];
        const novaIdsMap: { [key: string]: string } = {};
        for (const studentId of uniqueStudentIds as string[]) {
          try {
            const userResponse = await userService.findOne(studentId);
            if (userResponse && typeof studentId === 'string') {
              novaIdsMap[studentId] = userResponse.novaId;
            }
          } catch (error) {
            console.error(`Error al obtener NovaId para estudiante ${studentId}:`, error);
          }
        }
        
        setNovaIds(novaIdsMap);
      } catch (error) {
        console.error("Error al cargar las compras:", error);
        setCompras([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompras();
  }, []);

  const filteredCompras = compras.filter(compra => {
    const searchTermLower = searchTerm.toLowerCase();
    const novaId = novaIds[compra.estudianteId]?.toLowerCase() || "";
    
    return (
      compra.estudianteId.toLowerCase().includes(searchTermLower) ||
      compra.courseId.toLowerCase().includes(searchTermLower) ||
      novaId.includes(searchTermLower)
    );
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Configuración de la página
    doc.setFontSize(20);
    doc.text("Reporte de Compras", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generado el ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}`, 14, 22);

    // Datos de la tabla con IDs completos
    const tableData = compras.map(compra => [
      compra._id, // ID completo de la compra
      novaIds[compra.estudianteId] || "No disponible",
      compra.courseId,
      format(new Date(compra.fecha_adquisicion), "dd/MM/yyyy", { locale: es }),
      compra.renovacion ? format(new Date(compra.renovacion), "dd/MM/yyyy", { locale: es }) : "No aplica",
      compra.subscriptionId || "No aplica"
    ]);

    // Configuración de la tabla
    autoTable(doc, {
      head: [["ID", "Nova ID", "ID de Curso", "Fecha Adquisición", "Fecha Renovación", "ID Suscripción"]],
      body: tableData,
      startY: 30,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak"
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 9,
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 30, left: 14, right: 14 },
      didDrawPage: (data: any) => {
        // Pie de página
        doc.setFontSize(8);
        doc.text(
          `Página ${doc.internal.getCurrentPageInfo().pageNumber}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      }
    });

    // Guardar el PDF
    doc.save(`reporte-compras-${format(new Date(), "dd-MM-yyyy")}.pdf`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Compras</h1>
        <Button onClick={exportToPDF}>
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Historial de Compras
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por Nova ID, ID de estudiante o curso..."
                  className="pl-8 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
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
                    <TableHead>ID</TableHead>
                    <TableHead>Nova ID</TableHead>
                    <TableHead>ID de Curso</TableHead>
                    <TableHead>Fecha de Adquisición</TableHead>
                    <TableHead>Fecha de Renovación</TableHead>
                    <TableHead>ID de Suscripción</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompras.map((compra) => (
                    <TableRow key={compra._id}>
                      <TableCell className="font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-pointer">
                                {compra._id.slice(0, 8)}...
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex items-center gap-2">
                                <span>{compra._id}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => navigator.clipboard.writeText(compra._id)}
                                >
                                  <FileText className="h-3 w-3" />
                                </Button>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        {novaIds[compra.estudianteId] || "Cargando..."}
                      </TableCell>
                      <TableCell>{compra.courseId}</TableCell>
                      <TableCell>
                        {format(new Date(compra.fecha_adquisicion), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        {compra.renovacion ? 
                          format(new Date(compra.renovacion), "dd 'de' MMMM 'de' yyyy", { locale: es }) : 
                          "No aplica"}
                      </TableCell>
                      <TableCell>
                        {compra.subscriptionId || "No aplica"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver detalles</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
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