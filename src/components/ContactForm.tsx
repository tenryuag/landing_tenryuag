import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { cn } from "./ui/utils";
import { FullWidthSelect } from "./ui/full-width-select";

interface FormData {
  nombre: string;
  email: string;
  tipoSolucion: string;
  claridad: string;
  prioridad: string;
  mensaje: string;
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    tipoSolucion: "",
    claridad: "",
    prioridad: "",
    mensaje: "",
  });

  const totalSteps = 3;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = "El nombre es obligatorio";
      }
      if (!formData.email.trim()) {
        newErrors.email = "El email es obligatorio";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "El email no es válido";
      }
    }

    if (step === 2) {
      if (!formData.tipoSolucion) {
        newErrors.tipoSolucion = "Selecciona una opción";
      }
      if (!formData.claridad) {
        newErrors.claridad = "Selecciona una opción";
      }
    }

    if (step === 3) {
      if (!formData.prioridad) {
        newErrors.prioridad = "Selecciona una opción";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit?.(formData);
      console.log("Form submitted:", formData);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground/70">
            Paso {currentStep} de {totalSteps}
          </span>
          <span className="text-sm font-medium text-foreground/70">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Datos básicos */}
        <div
          className={cn(
            "space-y-6 transition-all duration-500",
            currentStep === 1
              ? "opacity-100 translate-x-0"
              : currentStep > 1
                ? "hidden opacity-0 -translate-x-8"
                : "hidden opacity-0 translate-x-8"
          )}
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Comencemos con lo básico
            </h2>
            <p className="text-muted-foreground">
              Solo necesitamos algunos datos para contactarte
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-semibold">
                Nombre completo
              </Label>
              <Input
                id="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={(e) => updateFormData("nombre", e.target.value)}
                aria-invalid={!!errors.nombre}
                className={cn(
                  "border-2 h-11 text-base bg-background",
                  errors.nombre && "border-destructive"
                )}
              />
              {errors.nombre && (
                <p className="text-sm text-destructive">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                aria-invalid={!!errors.email}
                className={cn(
                  "border-2 h-11 text-base bg-background",
                  errors.email && "border-destructive"
                )}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Te contactaremos a este correo en menos de 24 horas
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Necesidades del cliente */}
        <div
          className={cn(
            "space-y-6 transition-all duration-500",
            currentStep === 2
              ? "opacity-100 translate-x-0"
              : currentStep > 2
                ? "hidden opacity-0 -translate-x-8"
                : "hidden opacity-0 translate-x-8"
          )}
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              ¿Qué estás buscando?
            </h2>
            <p className="text-muted-foreground">
              Cuéntanos un poco sobre tu proyecto
            </p>
          </div>

          <div className="space-y-4">
            <FullWidthSelect
              id="tipoSolucion"
              label="¿Qué tipo de solución buscas?"
              value={formData.tipoSolucion}
              onChange={(value) => updateFormData("tipoSolucion", value)}
              error={errors.tipoSolucion}
              helperText="Esto nos ayuda a asignar al especialista adecuado"
              options={[
                { value: "desarrollo", label: "Desarrollo de App / Web" },
                { value: "automatizacion", label: "Automatización con IA" },
                { value: "sistema", label: "Sistema a medida" },
                { value: "consultoria", label: "Consultoría técnica" },
                { value: "otro", label: "Otro" },
              ]}
            />

            <FullWidthSelect
              id="claridad"
              label="¿Qué tan claro tienes tu problema?"
              value={formData.claridad}
              onChange={(value) => updateFormData("claridad", value)}
              error={errors.claridad}
              helperText="No te preocupes, te ayudaremos a definirlo mejor"
              options={[
                { value: "claro", label: "Tengo claro el problema" },
                { value: "idea", label: "Tengo una idea, pero no sé cómo resolverla" },
                { value: "explorar", label: "No sé exactamente, pero quiero mejorar mis procesos" },
              ]}
            />
          </div>
        </div>

        {/* Step 3: Prioridad y mensaje */}
        <div
          className={cn(
            "space-y-6 transition-all duration-500",
            currentStep === 3
              ? "opacity-100 translate-x-0"
              : "hidden opacity-0 translate-x-8"
          )}
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Últimos detalles
            </h2>
            <p className="text-muted-foreground">
              Esto nos ayudará a personalizar nuestra propuesta
            </p>
          </div>

          <div className="space-y-4">
            <FullWidthSelect
              id="prioridad"
              label="¿Cuál es tu prioridad principal?"
              value={formData.prioridad}
              onChange={(value) => updateFormData("prioridad", value)}
              error={errors.prioridad}
              helperText="Optimizaremos nuestra solución según tu prioridad"
              options={[
                { value: "rapido", label: "Lanzar rápido" },
                { value: "costos", label: "Reducir costos" },
                { value: "automatizar", label: "Automatizar procesos" },
                { value: "experiencia", label: "Mejorar diseño / experiencia" },
                { value: "integrar", label: "Integrar sistemas existentes" },
              ]}
            />

            <div className="space-y-2">
              <Label htmlFor="mensaje" className="text-sm font-semibold">
                Mensaje breve{" "}
                <span className="text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <Textarea
                id="mensaje"
                placeholder="Cuéntanos un poco más sobre tu proyecto o necesidad..."
                value={formData.mensaje}
                onChange={(e) => updateFormData("mensaje", e.target.value)}
                className="border-2 min-h-24 resize-none text-base bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Cualquier detalle adicional nos ayuda a preparar mejor nuestra
                llamada
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="gap-2"
            >
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Anterior
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              className="ml-auto gap-2"
            >
              Siguiente
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          ) : (
            <Button type="submit" className="ml-auto gap-2">
              Enviar mensaje
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Button>
          )}
        </div>
      </form>

      {/* Success Feedback - Optional */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          🔒 Tus datos están protegidos y nunca serán compartidos
        </p>
      </div>
    </div>
  );
}
