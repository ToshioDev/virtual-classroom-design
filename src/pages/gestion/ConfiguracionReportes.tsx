import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Save, Eye, Upload, Palette, Signature } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface ReportConfig {
  id: string;
  name: string;
  type: "compras" | "cursos" | "estudiantes" | "profesores";
  headerTemplate: string;
  footerTemplate: string;
  variables: {
    title: string;
    date: string;
    total: string;
    page: string;
  };
  style: {
    logo?: string;
    signature?: string;
    primaryColor: string;
    secondaryColor: string;
    fontSize: number;
    fontFamily: string;
    showLogo: boolean;
    showSignature: boolean;
    showPageNumbers: boolean;
    companyInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
      website: string;
    };
  };
}

const defaultConfigs: ReportConfig[] = [
  {
    id: "compras",
    name: "Reporte de Compras",
    type: "compras",
    headerTemplate: `# {{title}}
Generado el {{date}}

**Total de registros:** {{total}}

---
`,
    footerTemplate: `---
Página {{page}} de {{totalPages}}
`,
    variables: {
      title: "Reporte de Compras",
      date: "{{date}}",
      total: "{{total}}",
      page: "{{page}}"
    },
    style: {
      primaryColor: "#2980b9",
      secondaryColor: "#34495e",
      fontSize: 12,
      fontFamily: "Arial",
      showLogo: true,
      showSignature: true,
      showPageNumbers: true,
      companyInfo: {
        name: "Nombre de la Empresa",
        address: "Dirección de la Empresa",
        phone: "Teléfono",
        email: "Email",
        website: "Sitio Web"
      }
    }
  }
];

export default function ConfiguracionReportes() {
  const [configs, setConfigs] = useState<ReportConfig[]>(defaultConfigs);
  const [selectedConfig, setSelectedConfig] = useState<string>("compras");
  const [previewData, setPreviewData] = useState({
    title: "Reporte de Compras",
    date: new Date().toLocaleDateString("es-ES", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    }),
    total: "150",
    page: "1",
    totalPages: "5",
    header: "",
    footer: ""
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfigs(prev => prev.map(config => 
          config.id === selectedConfig 
            ? { 
                ...config, 
                style: { ...config.style, logo: reader.result as string }
              }
            : config
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfigs(prev => prev.map(config => 
          config.id === selectedConfig 
            ? { 
                ...config, 
                style: { ...config.style, signature: reader.result as string }
              }
            : config
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateStyle = (field: keyof ReportConfig["style"], value: any) => {
    setConfigs(prev => prev.map(config => 
      config.id === selectedConfig 
        ? { 
            ...config, 
            style: { ...config.style, [field]: value }
          }
        : config
    ));
  };

  const handleSave = () => {
    // Aquí implementaríamos la lógica para guardar la configuración
    console.log("Guardando configuración:", configs);
  };

  const handlePreview = () => {
    const config = configs.find(c => c.id === selectedConfig);
    if (!config) return;

    let previewHeader = config.headerTemplate;
    let previewFooter = config.footerTemplate;

    // Reemplazar variables en el header
    Object.entries(previewData).forEach(([key, value]) => {
      previewHeader = previewHeader.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    // Reemplazar variables en el footer
    Object.entries(previewData).forEach(([key, value]) => {
      previewFooter = previewFooter.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    setPreviewData(prev => ({
      ...prev,
      header: previewHeader,
      footer: previewFooter
    }));
  };

  const updateConfig = (field: "headerTemplate" | "footerTemplate", value: string) => {
    setConfigs(prev => prev.map(config => 
      config.id === selectedConfig 
        ? { ...config, [field]: value }
        : config
    ));
  };

  const updateCompanyInfo = (field: keyof ReportConfig["style"]["companyInfo"], value: string) => {
    setConfigs(prev => prev.map(config => 
      config.id === selectedConfig 
        ? { 
            ...config, 
            style: { 
              ...config.style, 
              companyInfo: { 
                ...config.style.companyInfo, 
                [field]: value 
              } 
            }
          }
        : config
    ));
  };

  useEffect(() => {
    handlePreview();
  }, [configs.find(c => c.id === selectedConfig)?.headerTemplate, 
      configs.find(c => c.id === selectedConfig)?.footerTemplate]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configuración de Reportes</h1>
        <div className="flex gap-2">
          <Button onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Vista Previa
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Panel de Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="content">
              <TabsList>
                <TabsTrigger value="content">Contenido</TabsTrigger>
                <TabsTrigger value="style">Estilo</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Reporte</Label>
                  <Select value={selectedConfig} onValueChange={setSelectedConfig}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo de reporte" />
                    </SelectTrigger>
                    <SelectContent>
                      {configs.map(config => (
                        <SelectItem key={config.id} value={config.id}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Plantilla del Encabezado (Markdown)</Label>
                  <Textarea
                    value={configs.find(c => c.id === selectedConfig)?.headerTemplate || ""}
                    onChange={(e) => updateConfig("headerTemplate", e.target.value)}
                    className="font-mono"
                    rows={6}
                    placeholder="Usa markdown para formatear el encabezado"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Plantilla del Pie de Página (Markdown)</Label>
                  <Textarea
                    value={configs.find(c => c.id === selectedConfig)?.footerTemplate || ""}
                    onChange={(e) => updateConfig("footerTemplate", e.target.value)}
                    className="font-mono"
                    rows={4}
                    placeholder="Usa markdown para formatear el pie de página"
                  />
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Información Empresarial</Label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Logo de la Empresa</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Button variant="outline" onClick={() => document.getElementById("logo-upload")?.click()}>
                          <Upload className="mr-2 h-4 w-4" />
                          Cargar Logo
                        </Button>
                        <Switch
                          checked={configs.find(c => c.id === selectedConfig)?.style.showLogo}
                          onCheckedChange={(checked) => updateStyle("showLogo", checked)}
                        />
                        <Label>Mostrar Logo</Label>
                      </div>
                      {configs.find(c => c.id === selectedConfig)?.style.logo && (
                        <img 
                          src={configs.find(c => c.id === selectedConfig)?.style.logo} 
                          alt="Logo" 
                          className="max-h-20 object-contain"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Nombre de la Empresa</Label>
                      <Input
                        value={configs.find(c => c.id === selectedConfig)?.style.companyInfo.name}
                        onChange={(e) => updateCompanyInfo("name", e.target.value)}
                        placeholder="Nombre de la Empresa"
                      />

                      <Label>Dirección</Label>
                      <Input
                        value={configs.find(c => c.id === selectedConfig)?.style.companyInfo.address}
                        onChange={(e) => updateCompanyInfo("address", e.target.value)}
                        placeholder="Dirección de la Empresa"
                      />

                      <Label>Teléfono</Label>
                      <Input
                        value={configs.find(c => c.id === selectedConfig)?.style.companyInfo.phone}
                        onChange={(e) => updateCompanyInfo("phone", e.target.value)}
                        placeholder="Teléfono"
                      />

                      <Label>Email</Label>
                      <Input
                        value={configs.find(c => c.id === selectedConfig)?.style.companyInfo.email}
                        onChange={(e) => updateCompanyInfo("email", e.target.value)}
                        placeholder="Email"
                      />

                      <Label>Sitio Web</Label>
                      <Input
                        value={configs.find(c => c.id === selectedConfig)?.style.companyInfo.website}
                        onChange={(e) => updateCompanyInfo("website", e.target.value)}
                        placeholder="Sitio Web"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Firma Digital</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden"
                      id="signature-upload"
                    />
                    <Button variant="outline" onClick={() => document.getElementById("signature-upload")?.click()}>
                      <Signature className="mr-2 h-4 w-4" />
                      Cargar Firma
                    </Button>
                    <Switch
                      checked={configs.find(c => c.id === selectedConfig)?.style.showSignature}
                      onCheckedChange={(checked) => updateStyle("showSignature", checked)}
                    />
                    <Label>Mostrar Firma</Label>
                  </div>
                  {configs.find(c => c.id === selectedConfig)?.style.signature && (
                    <img 
                      src={configs.find(c => c.id === selectedConfig)?.style.signature} 
                      alt="Firma" 
                      className="max-h-20 object-contain"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Color Primario</Label>
                  <Input
                    type="color"
                    value={configs.find(c => c.id === selectedConfig)?.style.primaryColor}
                    onChange={(e) => updateStyle("primaryColor", e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color Secundario</Label>
                  <Input
                    type="color"
                    value={configs.find(c => c.id === selectedConfig)?.style.secondaryColor}
                    onChange={(e) => updateStyle("secondaryColor", e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tamaño de Fuente</Label>
                  <Slider
                    value={[configs.find(c => c.id === selectedConfig)?.style.fontSize || 12]}
                    onValueChange={(value) => updateStyle("fontSize", value[0])}
                    min={8}
                    max={16}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fuente</Label>
                  <Select
                    value={configs.find(c => c.id === selectedConfig)?.style.fontFamily}
                    onValueChange={(value) => updateStyle("fontFamily", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={configs.find(c => c.id === selectedConfig)?.style.showPageNumbers}
                      onCheckedChange={(checked) => updateStyle("showPageNumbers", checked)}
                    />
                    <Label>Mostrar Números de Página</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label>Variables Disponibles</Label>
              <div className="bg-muted p-4 rounded-md space-y-2">
                {Object.entries(configs.find(c => c.id === selectedConfig)?.variables || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <code className="bg-background px-2 py-1 rounded">{value}</code>
                    <span className="text-sm text-muted-foreground">- {key}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Vista Previa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista Previa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {/* Header con Logo y Info Empresarial */}
              {configs.find(c => c.id === selectedConfig)?.style.showLogo && 
               configs.find(c => c.id === selectedConfig)?.style.logo && (
                <div className="flex justify-between items-start mb-4">
                  <div className="w-1/3">
                    <img 
                      src={configs.find(c => c.id === selectedConfig)?.style.logo} 
                      alt="Logo" 
                      className="max-h-20 object-contain"
                    />
                  </div>
                  <div className="w-2/3 text-right">
                    <h2 className="text-xl font-bold mb-2">
                      {configs.find(c => c.id === selectedConfig)?.style.companyInfo.name}
                    </h2>
                    <p className="text-sm">
                      {configs.find(c => c.id === selectedConfig)?.style.companyInfo.address}
                    </p>
                    <p className="text-sm">
                      Tel: {configs.find(c => c.id === selectedConfig)?.style.companyInfo.phone}
                    </p>
                    <p className="text-sm">
                      Email: {configs.find(c => c.id === selectedConfig)?.style.companyInfo.email}
                    </p>
                    <p className="text-sm">
                      Web: {configs.find(c => c.id === selectedConfig)?.style.companyInfo.website}
                    </p>
                  </div>
                </div>
              )}

              {/* Contenido del Header */}
              <div className="mb-8">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => (
                      <h1 className="text-2xl font-bold mb-4" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="mb-2" {...props} />
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    hr: ({node, ...props}) => (
                      <hr className="my-4 border-t" {...props} />
                    )
                  }}
                >
                  {previewData.header || ""}
                </ReactMarkdown>
              </div>
              
              {/* Contenido de Ejemplo */}
              <div className="my-8 p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">Contenido del reporte...</p>
              </div>

              {/* Contenido del Footer */}
              <div className="mt-8">
                <ReactMarkdown
                  components={{
                    hr: ({node, ...props}) => (
                      <hr className="my-4 border-t" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-sm text-muted-foreground" {...props} />
                    )
                  }}
                >
                  {previewData.footer || ""}
                </ReactMarkdown>
              </div>

              {/* Firma */}
              {configs.find(c => c.id === selectedConfig)?.style.showSignature && 
               configs.find(c => c.id === selectedConfig)?.style.signature && (
                <div className="flex justify-end mt-8">
                  <img 
                    src={configs.find(c => c.id === selectedConfig)?.style.signature} 
                    alt="Firma" 
                    className="max-h-20 object-contain"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 