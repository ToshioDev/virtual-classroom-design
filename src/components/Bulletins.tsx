import { useState } from "react";
import { Bell, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Datos mockeados para los boletines
const MOCK_BULLETINS = [
  {
    id: 1,
    title: "Nuevo Curso de React",
    content: "Nos complace anunciar el lanzamiento de nuestro nuevo curso de React. ¡Inscríbete ahora!",
    date: "2024-03-29"
  },
  {
    id: 2,
    title: "Actualización de la Plataforma",
    content: "Hemos realizado una actualización en nuestra plataforma para mejorar la experiencia del usuario.",
    date: "2024-03-28"
  },
  {
    id: 3,
    title: "Recordatorio de Pago",
    content: "Recuerda que el próximo pago de tu suscripción vence el 1 de abril.",
    date: "2024-03-27"
  }
];

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const Bulletins = ({ bulletin }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 cursor-pointer">
          <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{bulletin.title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(bulletin.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{bulletin.title}</DialogTitle>
        <DialogDescription>{bulletin.content}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default Bulletins;
