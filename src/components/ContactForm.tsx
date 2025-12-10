import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
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
        newErrors.nombre = t('contact.form.step1.nameRequired');
      }
      if (!formData.email.trim()) {
        newErrors.email = t('contact.form.step1.emailRequired');
      } else if (!validateEmail(formData.email)) {
        newErrors.email = t('contact.form.step1.emailInvalid');
      }
    }

    if (step === 2) {
      if (!formData.tipoSolucion) {
        newErrors.tipoSolucion = t('contact.form.step2.solutionTypeRequired');
      }
      if (!formData.claridad) {
        newErrors.claridad = t('contact.form.step2.clarityRequired');
      }
    }

    if (step === 3) {
      if (!formData.prioridad) {
        newErrors.prioridad = t('contact.form.step3.priorityRequired');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Preparar datos para Web3Forms
      const web3FormsData = new FormData();
      web3FormsData.append("access_key", "d5e22266-4d21-4d24-9cda-0832a285419f");
      web3FormsData.append("name", formData.nombre);
      web3FormsData.append("email", formData.email);
      web3FormsData.append("subject", `Nueva solicitud de ${formData.nombre} - ${formData.tipoSolucion}`);
      web3FormsData.append("message", `
Tipo de solución: ${formData.tipoSolucion}
Claridad del proyecto: ${formData.claridad}
Prioridad: ${formData.prioridad}

Mensaje adicional:
${formData.mensaje || 'No se proporcionó mensaje adicional'}
      `.trim());

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3FormsData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        onSubmit?.(formData);

        // Resetear formulario después de 3 segundos
        setTimeout(() => {
          setFormData({
            nombre: "",
            email: "",
            tipoSolucion: "",
            claridad: "",
            prioridad: "",
            mensaje: "",
          });
          setCurrentStep(1);
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        console.error("Error:", data.message);
      }

    } catch (error) {
      setSubmitStatus('error');
      console.error("Error al enviar:", error);
    } finally {
      setIsSubmitting(false);
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
            {t('contact.form.step')} {currentStep} {t('contact.form.of')} {totalSteps}
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
              {t('contact.form.step1.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('contact.form.step1.description')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-semibold">
                {t('contact.form.step1.name')}
              </Label>
              <Input
                id="nombre"
                placeholder={t('contact.form.step1.namePlaceholder')}
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
                {t('contact.form.step1.email')}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('contact.form.step1.emailPlaceholder')}
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
                {t('contact.form.step1.emailHelper')}
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
              {t('contact.form.step2.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('contact.form.step2.description')}
            </p>
          </div>

          <div className="space-y-4">
            <FullWidthSelect
              id="tipoSolucion"
              label={t('contact.form.step2.solutionType')}
              value={formData.tipoSolucion}
              onChange={(value) => updateFormData("tipoSolucion", value)}
              error={errors.tipoSolucion}
              helperText={t('contact.form.step2.solutionTypeHelper')}
              options={[
                { value: "desarrollo", label: t('contact.form.step2.solutionTypes.development') },
                { value: "automatizacion", label: t('contact.form.step2.solutionTypes.automation') },
                { value: "sistema", label: t('contact.form.step2.solutionTypes.system') },
                { value: "consultoria", label: t('contact.form.step2.solutionTypes.consulting') },
                { value: "otro", label: t('contact.form.step2.solutionTypes.other') },
              ]}
            />

            <FullWidthSelect
              id="claridad"
              label={t('contact.form.step2.clarity')}
              value={formData.claridad}
              onChange={(value) => updateFormData("claridad", value)}
              error={errors.claridad}
              helperText={t('contact.form.step2.clarityHelper')}
              options={[
                { value: "claro", label: t('contact.form.step2.clarityLevels.clear') },
                { value: "idea", label: t('contact.form.step2.clarityLevels.idea') },
                { value: "explorar", label: t('contact.form.step2.clarityLevels.explore') },
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
              {t('contact.form.step3.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('contact.form.step3.description')}
            </p>
          </div>

          <div className="space-y-4">
            <FullWidthSelect
              id="prioridad"
              label={t('contact.form.step3.priority')}
              value={formData.prioridad}
              onChange={(value) => updateFormData("prioridad", value)}
              error={errors.prioridad}
              helperText={t('contact.form.step3.priorityHelper')}
              options={[
                { value: "rapido", label: t('contact.form.step3.priorities.fast') },
                { value: "costos", label: t('contact.form.step3.priorities.costs') },
                { value: "automatizar", label: t('contact.form.step3.priorities.automate') },
                { value: "experiencia", label: t('contact.form.step3.priorities.experience') },
                { value: "integrar", label: t('contact.form.step3.priorities.integrate') },
              ]}
            />

            <div className="space-y-2">
              <Label htmlFor="mensaje" className="text-sm font-semibold">
                {t('contact.form.step3.message')}{" "}
                <span className="text-muted-foreground font-normal">
                  {t('contact.form.step3.messageOptional')}
                </span>
              </Label>
              <Textarea
                id="mensaje"
                placeholder={t('contact.form.step3.messagePlaceholder')}
                value={formData.mensaje}
                onChange={(e) => updateFormData("mensaje", e.target.value)}
                className="border-2 min-h-24 resize-none text-base bg-background"
              />
              <p className="text-xs text-muted-foreground">
                {t('contact.form.step3.messageHelper')}
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
              {t('contact.form.previous')}
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              className="ml-auto gap-2"
            >
              {t('contact.form.next')}
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
            <Button type="submit" className="ml-auto gap-2" disabled={isSubmitting}>
              {isSubmitting ? t('contact.form.sending') || 'Enviando...' : t('contact.form.submit')}
              {!isSubmitting && (
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
              )}
            </Button>
          )}
        </div>
      </form>

      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-medium">
              {t('contact.form.successMessage') || '¡Mensaje enviado con éxito! Te contactaremos pronto.'}
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="font-medium">
              {t('contact.form.errorMessage') || 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.'}
            </p>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          {t('contact.form.privacy')}
        </p>
      </div>
    </div>
  );
}
